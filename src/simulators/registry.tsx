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
    title: { de: 'Präzessions-Labor', uk: 'Лабораторія прецесії' },
    icon: '🧲',
    description: { de: 'Präzession, HF-Anregung, Off-Resonanz und Resonanz-Challenge.', uk: 'Прецесія, РЧ-збудження, розстроювання та резонансний виклик.' },
    component: LarmorSimulator,
  },
  {
    id: 'relaxation',
    title: { de: 'Relaxations-Simulator', uk: 'Симулятор релаксації' },
    icon: '⏳',
    description: { de: 'T1-, T2- und T2*-Kurven, Spin-Echo-Refokussierung, Kontrast per TR/TE.', uk: 'Криві T1, T2 і T2*, рефокусування спін-ехо, контраст через TR/TE.' },
    component: RelaxationSimulator,
  },
  {
    id: 'gradient',
    title: { de: 'Gradienten-Werkbank', uk: 'Градієнтна майстерня' },
    icon: '📐',
    description: { de: 'Schichtselektion, Frequenz- und Phasenkodierung zum Anfassen.', uk: 'Вибір зрізу, частотне та фазове кодування – наочно й інтерактивно.' },
    component: GradientSimulator,
  },
  {
    id: 'kspace',
    title: { de: 'K-Raum-Studio', uk: 'Студія k-простору' },
    icon: '🌀',
    description: { de: 'Echte 2D-FFT: Filter, Unterabtastung, Partial Fourier, Spikes, Bewegung.', uk: 'Справжнє 2D-FFT: фільтри, недодискретизація, Partial Fourier, спайки, рух.' },
    component: KSpaceSimulator,
  },
  {
    id: 'sequence',
    title: { de: 'Sequenz-Designer', uk: 'Конструктор послідовностей' },
    icon: '📈',
    description: { de: 'SE, TSE, IR, GRE und EPI mit Pulsdiagramm und Live-Bild.', uk: 'SE, TSE, IR, GRE та EPI з діаграмою імпульсів і живим зображенням.' },
    component: SequenceSimulator,
  },
  {
    id: 'artifact',
    title: { de: 'Artefakt-Detektiv', uk: 'Детектив артефактів' },
    icon: '🕵️',
    description: { de: 'Artefakte erkennen, Ursache benennen und beheben.', uk: 'Розпізнавайте артефакти, називайте причину та усувайте їх.' },
    component: ArtifactLab,
  },
  {
    id: 'scanner',
    title: { de: 'Scanner-Explorer', uk: 'Дослідник сканера' },
    icon: '🏥',
    description: { de: 'Interaktiver Querschnitt durch die Gerätetechnik mit Such-Quiz.', uk: 'Інтерактивний поперечний переріз апаратури з пошуковою вікториною.' },
    component: ScannerExplorer,
  },
  {
    id: 'protocol',
    title: { de: 'Freie Protokoll-Konsole', uk: 'Вільна консоль протоколів' },
    icon: '🎛️',
    description: { de: 'Alle Parameter frei: SNR, SAR, Messzeit und Artefakte im Gleichgewicht.', uk: 'Усі параметри вільні: SNR, SAR, час сканування та артефакти в балансі.' },
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
