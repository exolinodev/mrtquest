import { useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { Panel, Stat } from '../components/ui';
import { shuffle } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import type { Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { imageToKSpace, kSpaceToImage, magnitude } from '../physics/fft';
import { fmt, fmtDuration } from '../physics/mri';
import { seededRandom, type PhantomId } from '../physics/phantom';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, synthesizeImage, type Protocol } from '../physics/protocol';

type PostProcess = (img: Float32Array, seed: number) => Float32Array;

interface ArtifactCase {
  id: string;
  name: Loc;
  anatomy: PhantomId;
  broken: Protocol;
  fixed: Protocol;
  post?: PostProcess;
  remedy: Loc;
  explanation: Loc;
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
    name: { de: 'Einfaltung (Aliasing / Wrap-around)', uk: 'Загортання (аліасинг / wrap-around)' },
    anatomy: 'brain',
    broken: brain({ fovPhase: 150 }),
    fixed: brain({ fovPhase: 150, phaseOversampling: 60 }),
    remedy: {
      de: 'Phasen-Oversampling aktivieren bzw. FOV in Phasenrichtung vergrößern',
      uk: 'Увімкнути фазовий оверсемплінг або збільшити FOV у фазовому напрямку',
    },
    explanation: {
      de: 'Das Objekt (220 mm) ist größer als das Phasen-FOV (150 mm). Gewebe außerhalb erhält Phasen, die sich nicht von Phasen innerhalb unterscheiden (2π-Periodizität) und wird auf die Gegenseite gefaltet.',
      uk: 'Об’єкт (220 мм) більший за фазове FOV (150 мм). Тканина поза ним отримує фази, які не відрізняються від фаз усередині (2π-періодичність), і загортається на протилежний бік.',
    },
  },
  {
    id: 'chemshift',
    name: { de: 'Chemische Verschiebung (1. Art)', uk: 'Хімічний зсув (1-го роду)' },
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 60 },
    fixed: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 450 },
    remedy: {
      de: 'Empfangsbandbreite pro Pixel erhöhen (oder Fettsättigung)',
      uk: 'Збільшити смугу приймання на піксель (або жиропригнічення)',
    },
    explanation: {
      de: 'Bei 3 T präzediert Fett ≈ 447 Hz langsamer als Wasser. Bei nur 60 Hz/Pixel wird das Fettsignal um ≈ 7 Pixel in Ausleserichtung verschoben – helle und dunkle Säume an Fett-Wasser-Grenzen (Knochenmark/Kortikalis).',
      uk: 'При 3 Тл жир прецесує на ≈ 447 Гц повільніше за воду. За лише 60 Гц/піксель сигнал жиру зсувається на ≈ 7 пікселів у напрямку зчитування – світлі й темні облямівки на межах жир–вода (кістковий мозок/кортикальний шар).',
    },
  },
  {
    id: 'motion',
    name: { de: 'Bewegungsartefakt (Atmung, Geisterbilder)', uk: 'Артефакт руху (дихання, фантомні зображення)' },
    anatomy: 'abdomen',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 256, slices: 18 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 160, slices: 18, acceleration: 2 },
    remedy: {
      de: 'Messzeit auf einen Atemanhalt verkürzen (parallele Bildgebung, weniger Phasenzeilen) bzw. Triggerung',
      uk: 'Скоротити час сканування до однієї затримки дихання (паралельна візуалізація, менше фазових рядків) або синхронізація (тригерування)',
    },
    explanation: {
      de: 'Die Messung dauert länger als ein Atemanhalt. Die Leber verschiebt sich zwischen den Phasenkodierschritten – inkonsistente Phasen erzeugen Geister in Phasenrichtung (vertikal).',
      uk: 'Вимірювання триває довше за одну затримку дихання. Печінка зміщується між кроками фазового кодування – неузгоджені фази створюють фантоми у фазовому напрямку (вертикально).',
    },
  },
  {
    id: 'gibbs',
    name: { de: 'Gibbs-/Trunkationsartefakt', uk: 'Артефакт Гіббса / обрізання' },
    anatomy: 'brain',
    broken: brain({ matrixRead: 64, matrixPhase: 64 }),
    fixed: brain({ matrixRead: 256, matrixPhase: 256 }),
    remedy: {
      de: 'Matrix erhöhen (k-Raum weiter abtasten) bzw. Apodisationsfilter',
      uk: 'Збільшити матрицю (ширше вибирати k-простір) або аподизаційний фільтр',
    },
    explanation: {
      de: 'Der k-Raum endet abrupt bei kleinem k_max. Die Rekonstruktion entspricht einer Faltung mit einem sinc → Überschwinger parallel zu scharfen Kanten (Liquor/Kortex) und Unschärfe.',
      uk: 'K-простір різко обривається при малому k_max. Реконструкція відповідає згортці з функцією sinc → осциляції паралельно до різких меж (ліквор/кора) та розмиття.',
    },
  },
  {
    id: 'epi',
    name: { de: 'EPI-Suszeptibilitätsverzerrung', uk: 'Спотворення EPI через магнітну сприйнятливість' },
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 800, acceleration: 1, fatSat: true },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 70, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1800, acceleration: 3, fatSat: true },
    remedy: {
      de: 'Parallele Bildgebung (kürzerer Echozug) und höhere Bandbreite einsetzen',
      uk: 'Застосувати паралельну візуалізацію (коротша ехо-послідовність) та ширшу смугу пропускання',
    },
    explanation: {
      de: 'An der Grenze Nasennebenhöhlen–Frontalhirn ändert sich die Suszeptibilität. Bei der winzigen Phasenbandbreite der EPI wird das Gewebe dort um viele Pixel in Phasenrichtung gestaucht oder gedehnt.',
      uk: 'На межі приносові пазухи–лобова частка змінюється магнітна сприйнятливість. За мізерної фазової смуги EPI тканина там стискається або розтягується на багато пікселів у фазовому напрямку.',
    },
  },
  {
    id: 'spike',
    name: { de: 'Spike / Fischgrätmuster', uk: 'Спайк / візерунок «ялинка»' },
    anatomy: 'brain',
    broken: brain({}),
    fixed: brain({}),
    post: addSpike,
    remedy: {
      de: 'Ursache der Entladung beseitigen (Service: lose Kontakte, Statik), Spike-Korrektur in den Rohdaten',
      uk: 'Усунути причину розряду (сервіс: незакріплені контакти, статика), корекція спайків у сирих даних',
    },
    explanation: {
      de: 'Ein einzelner fehlerhafter Rohdatenpunkt (z. B. elektrostatische Entladung) ist im Bild eine ebene Welle → gleichmäßiges Streifenmuster über das gesamte Bild.',
      uk: 'Одна хибна точка сирих даних (напр. електростатичний розряд) у зображенні є плоскою хвилею → рівномірний смугастий візерунок на все зображення.',
    },
  },
  {
    id: 'zipper',
    name: { de: 'Zipper-Artefakt (HF-Einstreuung)', uk: 'Артефакт «блискавка» (РЧ-наведення)' },
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    fixed: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    post: addZipper,
    remedy: {
      de: 'Kabinentür schließen, elektronische Störquellen aus dem Raum entfernen',
      uk: 'Зачинити двері кабіни, прибрати з кімнати електронні джерела завад',
    },
    explanation: {
      de: 'Eine externe Störfrequenz wird an genau einer Frequenzposition (Ausleseort) in jeder Phasenzeile mitgemessen → punktierte Linie in Phasenrichtung.',
      uk: 'Зовнішня частота завади реєструється в одній частотній позиції (місці зчитування) у кожному фазовому рядку → пунктирна лінія у фазовому напрямку.',
    },
  },
  {
    id: 'noise',
    name: { de: 'Zu geringes SNR (Rauschen)', uk: 'Замале SNR (шум)' },
    anatomy: 'brain',
    broken: brain({ matrixRead: 512, matrixPhase: 512, sliceThickness: 1.5, bandwidthPerPixel: 600, etl: 24, te: 100 }),
    fixed: brain({ matrixRead: 320, matrixPhase: 320, sliceThickness: 4, bandwidthPerPixel: 180, nex: 2, etl: 24, te: 100 }),
    remedy: {
      de: 'Voxel vergrößern, Bandbreite senken oder NEX erhöhen',
      uk: 'Збільшити воксель, звузити смугу пропускання або збільшити NEX',
    },
    explanation: {
      de: 'Kleine Voxel (0,45 × 0,45 × 1,5 mm) bei hoher Bandbreite: Das Signal pro Voxel ist winzig, das Rauschen dominiert. SNR ∝ V·√(N_y·NEX/BW).',
      uk: 'Малі вокселі (0,45 × 0,45 × 1,5 мм) за широкої смуги: сигнал на воксель мізерний, домінує шум. SNR ∝ V·√(N_y·NEX/BW).',
    },
  },
  {
    id: 'metal',
    name: { de: 'Suszeptibilitätsartefakt durch Metall', uk: 'Артефакт магнітної сприйнятливості від металу' },
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 500, te: 20, flip: 20 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 90, bandwidthPerPixel: 500 },
    post: addMetal,
    remedy: {
      de: 'TSE statt GRE, hohe Bandbreite, kurzes TE (ggf. Metall-Artefakt-Reduktionssequenz)',
      uk: 'TSE замість GRE, широка смуга, короткий TE (за потреби послідовність зменшення металевих артефактів)',
    },
    explanation: {
      de: 'Ein ferromagnetischer Fremdkörper (z. B. Clip) erzeugt eine starke lokale Feldstörung: Signalauslöschung durch Dephasierung (T2*) und geometrische Verzerrung mit hellem Saum (Signalaufstau).',
      uk: 'Феромагнітне стороннє тіло (напр. кліпса) створює сильне локальне збурення поля: втрату сигналу через дефазування (T2*) та геометричне спотворення зі світлою облямівкою (накопичення сигналу).',
    },
  },
];

const CASE_BY_ID = Object.fromEntries(ARTIFACT_CASES.map((c) => [c.id, c])) as Record<string, ArtifactCase>;

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
  /** Fall-IDs der Diagnose-Optionen */
  diagnosisOptions: string[];
  /** Fall-IDs, deren Gegenmaßnahme als Option angezeigt wird */
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
    diagnosisOptions: shuffle(rand, [c.id, ...others.slice(0, 3).map((o) => o.id)]),
    remedyOptions: shuffle(rand, [c.id, ...others.slice(3, 6).map((o) => o.id)]),
  };
}

export function ArtifactLab() {
  const { dispatch } = useGame();
  const { tr, loc } = useLang();
  const [round, setRound] = useState<Round>(() => newRound());
  const [diag, setDiag] = useState<string | null>(null);
  const [remedy, setRemedy] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ solved: 0, total: 0 });
  const c = ARTIFACT_CASES[round.caseIdx];

  const broken = useMemo(() => render(c, c.broken, round.seed, true), [c, round.seed]);
  const fixed = useMemo(() => render(c, c.fixed, round.seed, false), [c, round.seed]);

  const diagOk = diag === c.id;
  const remedyOk = remedy === c.id;

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

  const optClass = (id: string, chosen: string | null) => {
    if (!checked) return id === chosen ? 'option selected' : 'option';
    if (id === c.id) return 'option correct';
    if (id === chosen) return 'option wrong';
    return 'option dim';
  };

  const anatomyLabel = c.anatomy === 'brain' ? tr('Kopf', 'Голова') : c.anatomy === 'knee' ? tr('Knie', 'Коліно') : tr('Abdomen', 'Живіт');

  return (
    <div className="sim-grid">
      <Panel
        title={tr('🕵️ Fall: Was stimmt mit diesem Bild nicht?', '🕵️ Випадок: що не так із цим зображенням?')}
        className="span-2"
        actions={
          <span className="small muted">
            {tr('Gelöst', 'Розв’язано')}: {score.solved}/{score.total}
          </span>
        }
      >
        <div className="image-pair">
          <MRImage data={broken.img} label={tr('Bild mit Artefakt', 'Зображення з артефактом')} overlay={tr('Befund', 'Знахідка')} />
          {checked ? (
            <MRImage data={fixed.img} label={tr('Korrigiertes Bild', 'Виправлене зображення')} overlay={tr('nach Korrektur', 'після корекції')} />
          ) : (
            <div className="image-placeholder">{tr('Korrektur wird nach der Diagnose angezeigt', 'Корекцію буде показано після діагнозу')}</div>
          )}
        </div>
        <p className="small muted">{tr('Phasenrichtung vertikal, Ausleserichtung horizontal.', 'Фазовий напрямок вертикальний, напрямок зчитування горизонтальний.')}</p>
      </Panel>
      <Panel title={tr('Protokolldaten', 'Дані протоколу')}>
        <div className="stat-grid two">
          <Stat label={tr('Sequenz', 'Послідовність')} value={c.broken.sequence} />
          <Stat label={tr('Feld', 'Поле')} value={`${fmt(c.broken.field)} ${tr('T', 'Тл')}`} />
          <Stat label={tr('FOV R×P', 'FOV З×Ф')} value={`${c.broken.fovRead}×${c.broken.fovPhase}`} unit={tr('mm', 'мм')} />
          <Stat label={tr('Matrix', 'Матриця')} value={`${c.broken.matrixRead}×${c.broken.matrixPhase}`} />
          <Stat label="BW" value={c.broken.bandwidthPerPixel} unit={tr('Hz/px', 'Гц/пікс.')} />
          <Stat label={tr('Messzeit', 'Час сканування')} value={fmtDuration(broken.metrics.scanTimeS)} />
          <Stat label="SNR" value={fmt(broken.metrics.snr, 1)} />
          <Stat label={tr('Anatomie', 'Анатомія')} value={anatomyLabel} />
        </div>
      </Panel>
      <Panel title={tr('1. Diagnose', '1. Діагноз')}>
        <div className="options compact">
          {round.diagnosisOptions.map((id) => (
            <button key={id} type="button" className={optClass(id, diag)} onClick={() => !checked && setDiag(id)} aria-pressed={diag === id}>
              {loc(CASE_BY_ID[id].name)}
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={tr('2. Gegenmaßnahme', '2. Захід усунення')} className="span-2">
        <div className="options compact">
          {round.remedyOptions.map((id) => (
            <button key={id} type="button" className={optClass(id, remedy)} onClick={() => !checked && setRemedy(id)} aria-pressed={remedy === id}>
              {loc(CASE_BY_ID[id].remedy)}
            </button>
          ))}
        </div>
        {!checked ? (
          <button className="btn primary" type="button" disabled={!diag || !remedy} onClick={check}>
            {tr('Befund abgeben', 'Надіслати висновок')}
          </button>
        ) : (
          <div className={`feedback ${diagOk && remedyOk ? 'is-correct' : 'is-wrong'}`}>
            <strong>
              {diagOk && remedyOk
                ? tr('✔ Fall gelöst! +20 XP', '✔ Випадок розв’язано! +20 XP')
                : diagOk
                  ? tr('◐ Diagnose richtig, Maßnahme falsch.', '◐ Діагноз правильний, захід хибний.')
                  : remedyOk
                    ? tr('◐ Maßnahme richtig, Diagnose falsch.', '◐ Захід правильний, діагноз хибний.')
                    : tr('✘ Leider daneben.', '✘ На жаль, мимо.')}
            </strong>
            <p>
              <strong>{loc(c.name)}:</strong> {loc(c.explanation)}
            </p>
            <button className="btn primary" type="button" onClick={next}>
              {tr('Nächster Fall →', 'Наступний випадок →')}
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
