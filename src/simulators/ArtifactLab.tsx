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
    name: { de: 'Einfaltung (Aliasing / Wrap-around)', ru: 'Артефакт наложения (aliasing / wrap-around)' },
    anatomy: 'brain',
    broken: brain({ fovPhase: 150 }),
    fixed: brain({ fovPhase: 150, phaseOversampling: 60 }),
    remedy: {
      de: 'Phasen-Oversampling aktivieren bzw. FOV in Phasenrichtung vergrößern',
      ru: 'Включить фазовую передискретизацию (oversampling) или увеличить FOV в фазовом направлении',
    },
    explanation: {
      de: 'Das Objekt (220 mm) ist größer als das Phasen-FOV (150 mm). Gewebe außerhalb erhält Phasen, die sich nicht von Phasen innerhalb unterscheiden (2π-Periodizität) und wird auf die Gegenseite gefaltet.',
      ru: 'Объект (220 мм) больше фазового FOV (150 мм). Ткань за его пределами получает фазы, неотличимые от фаз внутри (2π-периодичность), и заворачивается на противоположную сторону.',
    },
  },
  {
    id: 'chemshift',
    name: { de: 'Chemische Verschiebung (1. Art)', ru: 'Химический сдвиг (1-го рода)' },
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 60 },
    fixed: { ...DEFAULT_PROTOCOL, field: 3, sequence: 'TSE', tr: 3000, te: 30, fovRead: 180, fovPhase: 180, bandwidthPerPixel: 450 },
    remedy: {
      de: 'Empfangsbandbreite pro Pixel erhöhen (oder Fettsättigung)',
      ru: 'Увеличить полосу приёма на пиксель (или жироподавление)',
    },
    explanation: {
      de: 'Bei 3 T präzediert Fett ≈ 447 Hz langsamer als Wasser. Bei nur 60 Hz/Pixel wird das Fettsignal um ≈ 7 Pixel in Ausleserichtung verschoben – helle und dunkle Säume an Fett-Wasser-Grenzen (Knochenmark/Kortikalis).',
      ru: 'При 3 Тл жир прецессирует на ≈ 447 Гц медленнее воды. При всего 60 Гц/пиксель сигнал жира смещается на ≈ 7 пикселей в направлении считывания – светлые и тёмные каймы на границах жир–вода (костный мозг/кортикальный слой).',
    },
  },
  {
    id: 'motion',
    name: { de: 'Bewegungsartefakt (Atmung, Geisterbilder)', ru: 'Артефакт движения (дыхание, фантомные изображения)' },
    anatomy: 'abdomen',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 256, slices: 18 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 200, te: 4.6, flip: 70, fovRead: 400, fovPhase: 400, matrixPhase: 160, slices: 18, acceleration: 2 },
    remedy: {
      de: 'Messzeit auf einen Atemanhalt verkürzen (parallele Bildgebung, weniger Phasenzeilen) bzw. Triggerung',
      ru: 'Сократить время сканирования до одной задержки дыхания (параллельная визуализация, меньше фазовых строк) или синхронизация (триггеринг)',
    },
    explanation: {
      de: 'Die Messung dauert länger als ein Atemanhalt. Die Leber verschiebt sich zwischen den Phasenkodierschritten – inkonsistente Phasen erzeugen Geister in Phasenrichtung (vertikal).',
      ru: 'Измерение длится дольше одной задержки дыхания. Печень смещается между шагами фазового кодирования – несогласованные фазы создают фантомы в фазовом направлении (вертикально).',
    },
  },
  {
    id: 'gibbs',
    name: { de: 'Gibbs-/Trunkationsartefakt', ru: 'Артефакт Гиббса / усечения' },
    anatomy: 'brain',
    broken: brain({ matrixRead: 64, matrixPhase: 64 }),
    fixed: brain({ matrixRead: 256, matrixPhase: 256 }),
    remedy: {
      de: 'Matrix erhöhen (k-Raum weiter abtasten) bzw. Apodisationsfilter',
      ru: 'Увеличить матрицу (шире выбирать k-пространство) или аподизирующий фильтр',
    },
    explanation: {
      de: 'Der k-Raum endet abrupt bei kleinem k_max. Die Rekonstruktion entspricht einer Faltung mit einem sinc → Überschwinger parallel zu scharfen Kanten (Liquor/Kortex) und Unschärfe.',
      ru: 'K-пространство резко обрывается при малом k_max. Реконструкция соответствует свёртке с функцией sinc → осцилляции параллельно резким границам (ликвор/кора) и размытие.',
    },
  },
  {
    id: 'epi',
    name: { de: 'EPI-Suszeptibilitätsverzerrung', ru: 'Искажения EPI из-за магнитной восприимчивости' },
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 800, acceleration: 1, fatSat: true },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 70, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1800, acceleration: 3, fatSat: true },
    remedy: {
      de: 'Parallele Bildgebung (kürzerer Echozug) und höhere Bandbreite einsetzen',
      ru: 'Применить параллельную визуализацию (более короткий эхо-поезд) и более широкую полосу пропускания',
    },
    explanation: {
      de: 'An der Grenze Nasennebenhöhlen–Frontalhirn ändert sich die Suszeptibilität. Bei der winzigen Phasenbandbreite der EPI wird das Gewebe dort um viele Pixel in Phasenrichtung gestaucht oder gedehnt.',
      ru: 'На границе придаточные пазухи носа–лобная доля меняется магнитная восприимчивость. При ничтожно малой фазовой полосе EPI ткань там сжимается или растягивается на много пикселей в фазовом направлении.',
    },
  },
  {
    id: 'spike',
    name: { de: 'Spike / Fischgrätmuster', ru: 'Спайк / узор «ёлочка»' },
    anatomy: 'brain',
    broken: brain({}),
    fixed: brain({}),
    post: addSpike,
    remedy: {
      de: 'Ursache der Entladung beseitigen (Service: lose Kontakte, Statik), Spike-Korrektur in den Rohdaten',
      ru: 'Устранить причину разряда (сервис: незакреплённые контакты, статика), коррекция спайков в сырых данных',
    },
    explanation: {
      de: 'Ein einzelner fehlerhafter Rohdatenpunkt (z. B. elektrostatische Entladung) ist im Bild eine ebene Welle → gleichmäßiges Streifenmuster über das gesamte Bild.',
      ru: 'Одна ошибочная точка сырых данных (напр. электростатический разряд) в изображении является плоской волной → равномерный полосатый узор по всему изображению.',
    },
  },
  {
    id: 'zipper',
    name: { de: 'Zipper-Artefakt (HF-Einstreuung)', ru: 'Zipper-артефакт (РЧ-наводка)' },
    anatomy: 'knee',
    broken: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    fixed: { ...DEFAULT_PROTOCOL, fovRead: 180, fovPhase: 180 },
    post: addZipper,
    remedy: {
      de: 'Kabinentür schließen, elektronische Störquellen aus dem Raum entfernen',
      ru: 'Закрыть дверь кабины, убрать из помещения электронные источники помех',
    },
    explanation: {
      de: 'Eine externe Störfrequenz wird an genau einer Frequenzposition (Ausleseort) in jeder Phasenzeile mitgemessen → punktierte Linie in Phasenrichtung.',
      ru: 'Внешняя частота помехи регистрируется в одной частотной позиции (месте считывания) в каждой фазовой строке → пунктирная линия в фазовом направлении.',
    },
  },
  {
    id: 'noise',
    name: { de: 'Zu geringes SNR (Rauschen)', ru: 'Слишком низкое SNR (шум)' },
    anatomy: 'brain',
    broken: brain({ matrixRead: 512, matrixPhase: 512, sliceThickness: 1.5, bandwidthPerPixel: 600, etl: 24, te: 100 }),
    fixed: brain({ matrixRead: 320, matrixPhase: 320, sliceThickness: 4, bandwidthPerPixel: 180, nex: 2, etl: 24, te: 100 }),
    remedy: {
      de: 'Voxel vergrößern, Bandbreite senken oder NEX erhöhen',
      ru: 'Увеличить воксель, сузить полосу пропускания или увеличить NEX',
    },
    explanation: {
      de: 'Kleine Voxel (0,45 × 0,45 × 1,5 mm) bei hoher Bandbreite: Das Signal pro Voxel ist winzig, das Rauschen dominiert. SNR ∝ V·√(N_y·NEX/BW).',
      ru: 'Малые воксели (0,45 × 0,45 × 1,5 мм) при широкой полосе: сигнал на воксель ничтожно мал, доминирует шум. SNR ∝ V·√(N_y·NEX/BW).',
    },
  },
  {
    id: 'metal',
    name: { de: 'Suszeptibilitätsartefakt durch Metall', ru: 'Артефакт магнитной восприимчивости от металла' },
    anatomy: 'brain',
    broken: { ...DEFAULT_PROTOCOL, sequence: 'GRE', tr: 500, te: 20, flip: 20 },
    fixed: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 90, bandwidthPerPixel: 500 },
    post: addMetal,
    remedy: {
      de: 'TSE statt GRE, hohe Bandbreite, kurzes TE (ggf. Metall-Artefakt-Reduktionssequenz)',
      ru: 'TSE вместо GRE, широкая полоса, короткое TE (при необходимости последовательность подавления металлических артефактов)',
    },
    explanation: {
      de: 'Ein ferromagnetischer Fremdkörper (z. B. Clip) erzeugt eine starke lokale Feldstörung: Signalauslöschung durch Dephasierung (T2*) und geometrische Verzerrung mit hellem Saum (Signalaufstau).',
      ru: 'Ферромагнитное инородное тело (напр. клипса) создаёт сильное локальное возмущение поля: потерю сигнала из-за дефазировки (T2*) и геометрическое искажение со светлой каймой (накопление сигнала).',
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

  const anatomyLabel = c.anatomy === 'brain' ? tr('Kopf', 'Голова') : c.anatomy === 'knee' ? tr('Knie', 'Колено') : tr('Abdomen', 'Живот');

  return (
    <div className="sim-grid">
      <Panel
        title={tr('🕵️ Fall: Was stimmt mit diesem Bild nicht?', '🕵️ Случай: что не так с этим изображением?')}
        className="span-2"
        actions={
          <span className="small muted">
            {tr('Gelöst', 'Решено')}: {score.solved}/{score.total}
          </span>
        }
      >
        <div className="image-pair">
          <MRImage data={broken.img} label={tr('Bild mit Artefakt', 'Изображение с артефактом')} overlay={tr('Befund', 'Находка')} />
          {checked ? (
            <MRImage data={fixed.img} label={tr('Korrigiertes Bild', 'Исправленное изображение')} overlay={tr('nach Korrektur', 'после коррекции')} />
          ) : (
            <div className="image-placeholder">{tr('Korrektur wird nach der Diagnose angezeigt', 'Коррекция будет показана после диагноза')}</div>
          )}
        </div>
        <p className="small muted">{tr('Phasenrichtung vertikal, Ausleserichtung horizontal.', 'Фазовое направление вертикальное, направление считывания горизонтальное.')}</p>
      </Panel>
      <Panel title={tr('Protokolldaten', 'Данные протокола')}>
        <div className="stat-grid two">
          <Stat label={tr('Sequenz', 'Последовательность')} value={c.broken.sequence} />
          <Stat label={tr('Feld', 'Поле')} value={`${fmt(c.broken.field)} ${tr('T', 'Тл')}`} />
          <Stat label={tr('FOV R×P', 'FOV С×Ф')} value={`${c.broken.fovRead}×${c.broken.fovPhase}`} unit={tr('mm', 'мм')} />
          <Stat label={tr('Matrix', 'Матрица')} value={`${c.broken.matrixRead}×${c.broken.matrixPhase}`} />
          <Stat label="BW" value={c.broken.bandwidthPerPixel} unit={tr('Hz/px', 'Гц/пикс.')} />
          <Stat label={tr('Messzeit', 'Время сканирования')} value={fmtDuration(broken.metrics.scanTimeS)} />
          <Stat label="SNR" value={fmt(broken.metrics.snr, 1)} />
          <Stat label={tr('Anatomie', 'Анатомия')} value={anatomyLabel} />
        </div>
      </Panel>
      <Panel title={tr('1. Diagnose', '1. Диагноз')}>
        <div className="options compact">
          {round.diagnosisOptions.map((id) => (
            <button key={id} type="button" className={optClass(id, diag)} onClick={() => !checked && setDiag(id)} aria-pressed={diag === id}>
              {loc(CASE_BY_ID[id].name)}
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={tr('2. Gegenmaßnahme', '2. Мера устранения')} className="span-2">
        <div className="options compact">
          {round.remedyOptions.map((id) => (
            <button key={id} type="button" className={optClass(id, remedy)} onClick={() => !checked && setRemedy(id)} aria-pressed={remedy === id}>
              {loc(CASE_BY_ID[id].remedy)}
            </button>
          ))}
        </div>
        {!checked ? (
          <button className="btn primary" type="button" disabled={!diag || !remedy} onClick={check}>
            {tr('Befund abgeben', 'Отправить заключение')}
          </button>
        ) : (
          <div className={`feedback ${diagOk && remedyOk ? 'is-correct' : 'is-wrong'}`}>
            <strong>
              {diagOk && remedyOk
                ? tr('✔ Fall gelöst! +20 XP', '✔ Случай решён! +20 XP')
                : diagOk
                  ? tr('◐ Diagnose richtig, Maßnahme falsch.', '◐ Диагноз верный, мера неверна.')
                  : remedyOk
                    ? tr('◐ Maßnahme richtig, Diagnose falsch.', '◐ Мера верна, диагноз неверен.')
                    : tr('✘ Leider daneben.', '✘ К сожалению, мимо.')}
            </strong>
            <p>
              <strong>{loc(c.name)}:</strong> {loc(c.explanation)}
            </p>
            <button className="btn primary" type="button" onClick={next}>
              {tr('Nächster Fall →', 'Следующий случай →')}
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
