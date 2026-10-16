import { useEffect, type ComponentType } from 'react';
import type { SimulatorId } from '../content/modules';
import { useGame } from '../game/GameContext';
import type { Loc } from '../i18n/format';
import { ArtifactLab } from './ArtifactLab';
import { GradientSimulator } from './GradientSimulator';
import { KSpaceSimulator } from './KSpaceSimulator';
import { LarmorSimulator } from './LarmorSimulator';
import { ProtocolConsole } from './ProtocolConsole';
import { RelaxationSimulator } from './RelaxationSimulator';
import { ScannerExplorer } from './ScannerExplorer';
import { SequenceSimulator } from './SequenceSimulator';

export interface SimulatorMeta {
  id: SimulatorId;
  title: Loc;
  icon: string;
  description: Loc;
  component: ComponentType;
}

export const SIMULATORS: SimulatorMeta[] = [
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
    component: ProtocolConsole,
  },
];

export const SIMULATOR_BY_ID = Object.fromEntries(SIMULATORS.map((s) => [s.id, s])) as Record<SimulatorId, SimulatorMeta>;

/** Rendert einen Simulator und registriert den Besuch (für das Entdecker-Abzeichen). */
export function SimulatorHost({ id }: { id: SimulatorId }) {
  const { dispatch } = useGame();
  useEffect(() => {
    dispatch({ type: 'VISIT_SIMULATOR', simulatorId: id });
  }, [id, dispatch]);
  const Comp = SIMULATOR_BY_ID[id].component;
  return <Comp />;
}
