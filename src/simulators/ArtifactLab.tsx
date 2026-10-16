import { useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { Panel, Stat } from '../components/ui';
import { shuffle } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { imageToKSpace, kSpaceToImage, magnitude } from '../physics/fft';
import { fmt, fmtDuration } from '../physics/mri';
import { seededRandom, type PhantomId } from '../physics/phantom';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, synthesizeImage, type Protocol } from '../physics/protocol';

type PostProcess = (img: Float32Array, seed: number) => Float32Array;

interface ArtifactCase {
  id: string;
  name: string;
  anatomy: PhantomId;
  broken: Protocol;
  fixed: Protocol;
  post?: PostProcess;
  remedy: string;
  explanation: string;
}

/** Kantenlänge eines quadratischen Bildes aus seiner Pixelanzahl. */
const sideOf = (img: Float32Array) => Math.round(Math.sqrt(img.length));

const addSpike: PostProcess = (img) => {
  const N = sideOf(img);
  const k = imageToKSpace(img, N);
  const c = (N / 2) * N + N / 2;
  const peak = Math.hypot(k.re[c], k.im[c]);
  k.re[(N / 2 - 19) * N + N / 2 + 27] += peak * 0.22;
  return Float32Array.from(magnitude(kSpaceToImage(k)));
};

const addZipper: PostProcess = (img, seed) => {
  const N = sideOf(img);
  const rand = seededRandom(seed);
  const out = Float32Array.from(img);
  let max = 0;
  for (const v of img) max = Math.max(max, v);
  const col = Math.round(N * 0.69);
  for (let y = 0; y < N; y++) {
    const v = rand() > 0.45 ? max * (0.55 + rand() * 0.4) : 0;
    out[y * N + col] += v;
    out[y * N + col + 1] += v * 0.4;
  }
  return out;
};

const addMetal: PostProcess = (img) => {
  const N = sideOf(img);
  const s = N / 128;
  const out = new Float32Array(img.length);
  const cx = 78 * s;
  const cy = 52 * s;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const d = Math.hypot(x - cx, y - cy);
      // Feldstörung eines Dipols → Verschiebung in Ausleserichtung, Auslöschung im Kern
      const shift = d > 2 * s ? (90 * s * s * (x - cx)) / (d * d) : 0;
      const nx = Math.round(x + shift);
      const v = img[y * N + x] * (d < 9 * s ? 0.03 : 1);
      if (nx >= 0 && nx < N) out[y * N + nx] += v;
    }
  }
  return out;
};

const brain = (p: Partial<Protocol>): Protocol => ({ ...DEFAULT_PROTOCOL, ...p });

export const ARTIFACT_CASES: ArtifactCase[] = [
  {
    id: 'alias',
    name: 'Einfaltung (Aliasing / Wrap-around)',
    anatomy: 'brain',
    broken: brain({ fovPhase: 150 }),
    fixed: brain({ fovPhase: 150, phaseOversampling: 60 }),
    remedy: 'Phasen-Oversampling aktivieren bzw. FOV in Phasenrichtung vergrößern',
    explanation:
      'Das Objekt (220 mm) ist größer als das Phasen-FOV (150 mm). Gewebe außerhalb erhält Phasen, die sich nicht von Phasen innerhalb unterscheiden (2π-Periodizität) und wird auf die Gegenseite gefaltet.',
  },
  {
    id: 'chemshift',
    name: 'Chemische Verschiebung (1. Art)',
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 60 },
    fixed: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 450 },
    remedy: 'Empfangsbandbreite pro Pixel erhöhen (oder Fettsättigung)',
    explanation:
      'Bei 3 T präzediert Fett ≈ 447 Hz langsamer als Wasser. Bei nur 60 Hz/Pixel wird das Fettsignal um ≈ 7 Pixel in Ausleserichtung verschoben – helle und dunkle Säume an Fett-Wasser-Grenzen (Knochenmark/Kortikalis).',
  },
  {
    id: 'motion',
    name: 'Bewegungsartefakt (Atmung, Geisterbilder)',
    anatomy: 'abdomen',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 256, slices: 18 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 160, slices: 18, acceleration: 2 },
    remedy: 'Messzeit auf einen Atemanhalt verkürzen (parallele Bildgebung, weniger Phasenzeilen) bzw. Triggerung',
    explanation:
      'Die Messung dauert länger als ein Atemanhalt. Die Leber verschiebt sich zwischen den Phasenkodierschritten – inkonsistente Phasen erzeugen Geister in Phasenrichtung (vertikal).',
  },
  {
    id: 'gibbs',
    name: 'Gibbs-/Trunkationsartefakt',
    anatomy: 'brain',
    broken: brain({ matrixRead: 64, matrixPhase: 64 }),
    fixed: brain({ matrixRead: 256, matrixPhase: 256 }),
    remedy: 'Matrix erhöhen (k-Raum weiter abtasten) bzw. Apodisationsfilter',
    explanation:
      'Der k-Raum endet abrupt bei kleinem k_max. Die Rekonstruktion entspricht einer Faltung mit einem sinc → Überschwinger parallel zu scharfen Kanten (Liquor/Kortex) und Unschärfe.',
  },
  {
    id: 'epi',
    name: 'EPI-Suszeptibilitätsverzerrung',
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 800, acceleration: 1, fatSat: true },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 70, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1800, acceleration: 3, fatSat: true },
    remedy: 'Parallele Bildgebung (kürzerer Echozug) und höhere Bandbreite einsetzen',
    explanation:
      'An der Grenze Nasennebenhöhlen–Frontalhirn ändert sich die Suszeptibilität. Bei der winzigen Phasenbandbreite der EPI wird das Gewebe dort um viele Pixel in Phasenrichtung gestaucht oder gedehnt.',
  },
  {
    id: 'spike',
    name: 'Spike / Fischgrätmuster',
    anatomy: 'brain',
    broken: brain({}),
    fixed: brain({}),
    post: addSpike,
    remedy: 'Ursache der Entladung beseitigen (Service: lose Kontakte, Statik), Spike-Korrektur in den Rohdaten',
    explanation:
      'Ein einzelner fehlerhafter Rohdatenpunkt (z. B. elektrostatische Entladung) ist im Bild eine ebene Welle → gleichmäßiges Streifenmuster über das gesamte Bild.',
  },
  {
    id: 'zipper',
    name: 'Zipper-Artefakt (HF-Einstreuung)',
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    fixed: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    post: addZipper,
    remedy: 'Kabinentür schließen, elektronische Störquellen aus dem Raum entfernen',
    explanation:
      'Eine externe Störfrequenz wird an genau einer Frequenzposition (Ausleseort) in jeder Phasenzeile mitgemessen → punktierte Linie in Phasenrichtung.',
  },
  {
    id: 'noise',
    name: 'Zu geringes SNR (Rauschen)',
    anatomy: 'brain',
    broken: brain({ matrixRead: 512, matrixPhase: 512, sliceThickness: 1.5, bandwidthPerPixel: 600, etl: 24, te: 100 }),
    fixed: brain({ matrixRead: 320, matrixPhase: 320, sliceThickness: 4, bandwidthPerPixel: 180, nex: 2, etl: 24, te: 100 }),
    remedy: 'Voxel vergrößern, Bandbreite senken oder NEX erhöhen',
    explanation:
      'Kleine Voxel (0,45 × 0,45 × 1,5 mm) bei hoher Bandbreite: Das Signal pro Voxel ist winzig, das Rauschen dominiert. SNR ∝ V·√(N_y·NEX/BW).',
  },
  {
    id: 'metal',
    name: 'Suszeptibilitätsartefakt durch Metall',
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 500, te: 20, flip: 20 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 90, bandwidthPerPixel: 500 },
    post: addMetal,
    remedy: 'TSE statt GRE, hohe Bandbreite, kurzes TE (ggf. Metall-Artefakt-Reduktionssequenz)',
    explanation:
      'Ein ferromagnetischer Fremdkörper (z. B. Clip) erzeugt eine starke lokale Feldstörung: Signalauslöschung durch Dephasierung (T2*) und geometrische Verzerrung mit hellem Saum (Signalaufstau).',
  },
];

function render(c: ArtifactCase, protocol: Protocol, seed: number, applyPost: boolean) {
  const anatomy = ANATOMY[c.anatomy];
  const metrics = computeMetrics(protocol, anatomy);
  let img = synthesizeImage(protocol, anatomy, metrics, { seed });
  if (applyPost && c.post) img = c.post(img, seed);
  return { img, metrics };
}

interface Round {
  caseIdx: number;
  seed: number;
  diagnosisOptions: string[];
  remedyOptions: string[];
}

function newRound(prev?: number): Round {
  const rand = seededRandom(Date.now() & 0xffffffff);
  let caseIdx = Math.floor(rand() * ARTIFACT_CASES.length);
  if (caseIdx === prev) caseIdx = (caseIdx + 1) % ARTIFACT_CASES.length;
  const c = ARTIFACT_CASES[caseIdx];
  const others = shuffle(
    rand,
    ARTIFACT_CASES.filter((x) => x.id !== c.id),
  );
  return {
    caseIdx,
    seed: Math.floor(rand() * 1000),
    diagnosisOptions: shuffle(rand, [c.name, ...others.slice(0, 3).map((o) => o.name)]),
    remedyOptions: shuffle(rand, [c.remedy, ...others.slice(3, 6).map((o) => o.remedy)]),
  };
}

export function ArtifactLab() {
  const { dispatch } = useGame();
  const [round, setRound] = useState<Round>(() => newRound());
  const [diag, setDiag] = useState<string | null>(null);
  const [remedy, setRemedy] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ solved: 0, total: 0 });
  const c = ARTIFACT_CASES[round.caseIdx];

  const broken = useMemo(() => render(c, c.broken, round.seed, true), [c, round.seed]);
  const fixed = useMemo(() => render(c, c.fixed, round.seed, false), [c, round.seed]);

  const diagOk = diag === c.name;
  const remedyOk = remedy === c.remedy;

  const check = () => {
    if (!diag || !remedy || checked) return;
    setChecked(true);
    const both = diagOk && remedyOk;
    setScore((s) => ({ solved: s.solved + (both ? 1 : 0), total: s.total + 1 }));
    if (both) dispatch({ type: 'ARTIFACT_DIAGNOSED', xp: 20 });
    else dispatch({ type: 'ANSWER', correct: false, xp: 0, hintUsed: false });
  };

  const next = () => {
    setRound(newRound(round.caseIdx));
    setDiag(null);
    setRemedy(null);
    setChecked(false);
  };

  const optClass = (opt: string, chosen: string | null, correct: string) => {
    if (!checked) return opt === chosen ? 'option selected' : 'option';
    if (opt === correct) return 'option correct';
    if (opt === chosen) return 'option wrong';
    return 'option dim';
  };

  return (
    <div className="sim-grid">
      <Panel title="🕵️ Fall: Was stimmt mit diesem Bild nicht?" className="span-2" actions={<span className="small muted">Gelöst: {score.solved}/{score.total}</span>}>
        <div className="image-pair">
          <MRImage data={broken.img} label="Bild mit Artefakt" overlay="Befund" />
          {checked ? <MRImage data={fixed.img} label="Korrigiertes Bild" overlay="nach Korrektur" /> : <div className="image-placeholder">Korrektur wird nach der Diagnose angezeigt</div>}
        </div>
        <p className="small muted">Phasenrichtung vertikal, Ausleserichtung horizontal.</p>
      </Panel>
      <Panel title="Protokolldaten">
        <div className="stat-grid two">
          <Stat label="Sequenz" value={c.broken.sequence} />
          <Stat label="Feld" value={`${fmt(c.broken.field)} T`} />
          <Stat label="FOV R×P" value={`${c.broken.fovRead}×${c.broken.fovPhase}`} unit="mm" />
          <Stat label="Matrix" value={`${c.broken.matrixRead}×${c.broken.matrixPhase}`} />
          <Stat label="BW" value={c.broken.bandwidthPerPixel} unit="Hz/px" />
          <Stat label="Messzeit" value={fmtDuration(broken.metrics.scanTimeS)} />
          <Stat label="SNR" value={fmt(broken.metrics.snr, 1)} />
          <Stat label="Anatomie" value={c.anatomy === 'brain' ? 'Kopf' : c.anatomy === 'knee' ? 'Knie' : 'Abdomen'} />
        </div>
      </Panel>
      <Panel title="1. Diagnose">
        <div className="options compact">
          {round.diagnosisOptions.map((o) => (
            <button key={o} type="button" className={optClass(o, diag, c.name)} onClick={() => !checked && setDiag(o)} aria-pressed={diag === o}>
              {o}
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="2. Gegenmaßnahme" className="span-2">
        <div className="options compact">
          {round.remedyOptions.map((o) => (
            <button key={o} type="button" className={optClass(o, remedy, c.remedy)} onClick={() => !checked && setRemedy(o)} aria-pressed={remedy === o}>
              {o}
            </button>
          ))}
        </div>
        {!checked ? (
          <button className="btn primary" type="button" disabled={!diag || !remedy} onClick={check}>
            Befund abgeben
          </button>
        ) : (
          <div className={`feedback ${diagOk && remedyOk ? 'is-correct' : 'is-wrong'}`}>
            <strong>{diagOk && remedyOk ? '✔ Fall gelöst! +20 XP' : diagOk ? '◐ Diagnose richtig, Maßnahme falsch.' : remedyOk ? '◐ Maßnahme richtig, Diagnose falsch.' : '✘ Leider daneben.'}</strong>
            <p>
              <strong>{c.name}:</strong> {c.explanation}
            </p>
            <button className="btn primary" type="button" onClick={next}>
              Nächster Fall →
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
