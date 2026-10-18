import { useEffect, type ComponentType } from 'react';
import type { SimulatorId } from '../content/modules';
import { useGame } from '../game/GameContext';
import type { Loc } from '../i18n/format';
import { SIM_GUIDES } from '../content/simGuides';
import { useLang } from '../i18n/LanguageContext';
import { RichText } from '../components/RichText';
import { ArtifactLab } from './ArtifactLab';
import { GradientSimulator } from './GradientSimulator';
import { KSpaceSimulator } from './KSpaceSimulator';
import { LarmorSimulator } from './LarmorSimulator';
import { ProtocolConsole } from './ProtocolConsole';
import { RelaxationSimulator } from './RelaxationSimulator';
import { ScannerExplorer } from './ScannerExplorer';
import { SequenceSimulator } from './SequenceSimulator';
import { SignalLab } from './SignalLab';
import { FourierLab } from './FourierLab';
import { ApplicationsLab } from './ApplicationsLab';
import { ModalityLab } from './ModalityLab';
import { EnsembleLab } from './EnsembleLab';

export interface SimulatorMeta {
  id: SimulatorId;
  title: Loc;
  icon: string;
  description: Loc;
  component: ComponentType<{ preset?: string }>;
}

export const SIMULATORS: SimulatorMeta[] = [
  {
    id: 'ensemble', title: { de: 'Spin-Ensemble-Labor', ru: 'Лаборатория ансамбля спинов' }, icon: '🌀',
    description: { de: 'Boltzmann-Überschuss zum Nachzählen, Larmor-Präzession im Labor- und im rotierenden Bezugssystem und auseinanderlaufende Spins (T2*).', ru: 'Избыток Больцмана для подсчёта, ларморова прецессия в лабораторной и вращающейся системе и расфазировка спинов (T2*).' }, component: EnsembleLab,
  },
  {
    id: 'modality', title: { de: 'Modalitäten-Labor', ru: 'Лаборатория методов' }, icon: '🩻',
    description: { de: 'Röntgen, CT, Ultraschall, PET und MRT vergleichen: Was misst welches Verfahren, und welches passt zur klinischen Frage?', ru: 'Сравни рентген, КТ, УЗИ, ПЭТ и МРТ: что измеряет каждый метод и какой подходит к клиническому вопросу?' }, component: ModalityLab,
  },
  {
    id: 'signal', title: { de: 'Bloch- & Spektrum-Labor', ru: 'Лаборатория Блоха и спектров' }, icon: '📡',
    description: { de: 'Numerische Bloch-Dynamik, HF-Puls, komplexer FID und absorptive Linienbreite.', ru: 'Численная динамика Блоха, РЧ-импульс, комплексный FID и ширина линии поглощения.' }, component: SignalLab,
  },
  {
    id: 'fourier', title: { de: 'Fourier-Werkstatt · Lab 3', ru: 'Мастерская Фурье · лабораторная 3' }, icon: '〰️',
    description: { de: 'Signale mischen, DFT-Schritte nachrechnen, Orthogonalität und Faltung erleben.', ru: 'Смешивай сигналы, проверяй шаги ДПФ, исследуй ортогональность и свёртку.' }, component: FourierLab,
  },
  {
    id: 'applications', title: { de: 'Anwendungs-Labor', ru: 'Лаборатория применения' }, icon: '🧬',
    description: { de: 'Fluss und VENC, DTI, Spektroskopie, BOLD, Kontrastmittel und klinische Fallkarten.', ru: 'Поток и VENC, DTI, спектроскопия, BOLD, контрастные средства и клинические случаи.' }, component: ApplicationsLab,
  },
  {
    id: 'larmor',
    title: { de: 'Präzessions-Labor', ru: 'Лаборатория прецессии' },
    icon: '🧲',
    description: { de: 'Präzession, HF-Anregung, Off-Resonanz und Resonanz-Challenge.', ru: 'Прецессия, РЧ-возбуждение, отстройка от резонанса и резонансное задание.' },
    component: LarmorSimulator,
  },
  {
    id: 'relaxation',
    title: { de: 'Relaxations-Simulator', ru: 'Симулятор релаксации' },
    icon: '⏳',
    description: { de: 'T1-, T2- und T2*-Kurven, Spin-Echo-Refokussierung, Kontrast per TR/TE.', ru: 'Кривые T1, T2 и T2*, рефокусировка спин-эха, контраст через TR/TE.' },
    component: RelaxationSimulator,
  },
  {
    id: 'gradient',
    title: { de: 'Gradienten-Werkbank', ru: 'Градиентная мастерская' },
    icon: '📐',
    description: { de: 'Schichtselektion, Frequenz- und Phasenkodierung zum Anfassen.', ru: 'Выбор среза, частотное и фазовое кодирование – наглядно и интерактивно.' },
    component: GradientSimulator,
  },
  {
    id: 'kspace',
    title: { de: 'K-Raum-Studio', ru: 'Студия k-пространства' },
    icon: '🌀',
    description: { de: 'Echte 2D-FFT: Filter, Unterabtastung, Partial Fourier, Spikes, Bewegung.', ru: 'Настоящее 2D-FFT: фильтры, неполная выборка, частичное Фурье, спайки, движение.' },
    component: KSpaceSimulator,
  },
  {
    id: 'sequence',
    title: { de: 'Sequenz-Designer', ru: 'Конструктор последовательностей' },
    icon: '📈',
    description: { de: 'SE, TSE, IR, GRE und EPI mit Pulsdiagramm und Live-Bild.', ru: 'SE, TSE, IR, GRE и EPI с импульсной диаграммой и живым изображением.' },
    component: SequenceSimulator,
  },
  {
    id: 'artifact',
    title: { de: 'Artefakt-Detektiv', ru: 'Детектив артефактов' },
    icon: '🕵️',
    description: { de: 'Artefakte erkennen, Ursache benennen und beheben.', ru: 'Распознавай артефакты, называй причину и устраняй их.' },
    component: ArtifactLab,
  },
  {
    id: 'scanner',
    title: { de: 'Scanner-Explorer', ru: 'Исследователь сканера' },
    icon: '🏥',
    description: { de: 'Interaktiver Querschnitt durch die Gerätetechnik mit Such-Quiz.', ru: 'Интерактивный поперечный разрез аппаратуры с поисковой викториной.' },
    component: ScannerExplorer,
  },
  {
    id: 'protocol',
    title: { de: 'Freie Protokoll-Konsole', ru: 'Свободная консоль протоколов' },
    icon: '🎛️',
    description: { de: 'Alle Parameter frei: SNR, SAR, Messzeit und Artefakte im Gleichgewicht.', ru: 'Все параметры свободны: SNR, SAR, время сканирования и артефакты в балансе.' },
    // Ohne Fall-Szenario: freie Konsole (die Startansicht wird hier nicht genutzt)
    component: () => <ProtocolConsole />,
  },
];

export const SIMULATOR_BY_ID = Object.fromEntries(SIMULATORS.map((s) => [s.id, s])) as Record<SimulatorId, SimulatorMeta>;

/** Rendert einen Simulator und registriert den Besuch (für das Entdecker-Abzeichen). */
export function SimulatorHost({ id, preset }: { id: SimulatorId; preset?: string }) {
  const { dispatch } = useGame();
  useEffect(() => {
    dispatch({ type: 'VISIT_SIMULATOR', simulatorId: id });
  }, [id, dispatch]);
  const Comp = SIMULATOR_BY_ID[id].component;
  return (
    <>
      <SimGuide id={id} />
      <Comp preset={preset} />
      <SimTakeaway id={id} />
    </>
  );
}

/** Einheitliche Anleitung über jedem Simulator: was man sieht und drei geführte Mini-Experimente. */
function SimGuide({ id }: { id: SimulatorId }) {
  const { loc, tr } = useLang();
  const guide = SIM_GUIDES[id];
  if (!guide) return <p className="muted">{loc(SIMULATOR_BY_ID[id].description)}</p>;
  return (
    <section className="sim-guide panel">
      <p className="sim-guide-intro">
        <RichText text={loc(guide.intro)} />
      </p>
      <details className="sim-guide-steps" open={window.matchMedia?.('(min-width: 900px)').matches ?? true}>
        <summary>{tr('🧪 Drei Mini-Experimente', '🧪 Три мини-эксперимента')}</summary>
        <ol>
          {guide.steps.map((step, i) => (
            <li key={i}>
              <RichText text={loc(step)} />
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}

function SimTakeaway({ id }: { id: SimulatorId }) {
  const { loc, tr } = useLang();
  const guide = SIM_GUIDES[id];
  if (!guide) return null;
  return (
    <aside className="mnemonic sim-takeaway">
      <span aria-hidden="true">🎓</span>
      <p>
        <strong>{tr('Das nimmst du für die Prüfung mit: ', 'Что взять на экзамен: ')}</strong>
        <RichText text={loc(guide.takeaway)} />
      </p>
    </aside>
  );
}
