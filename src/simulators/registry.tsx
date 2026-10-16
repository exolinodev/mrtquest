import { useEffect, type ComponentType } from 'react';
import type { SimulatorId } from '../content/modules';
import { useGame } from '../game/GameContext';
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
  title: string;
  icon: string;
  description: string;
  component: ComponentType;
}

export const SIMULATORS: SimulatorMeta[] = [
  { id: 'larmor', title: 'Präzessions-Labor', icon: '🧲', description: 'Präzession, HF-Anregung, Off-Resonanz und Resonanz-Challenge.', component: LarmorSimulator },
  { id: 'relaxation', title: 'Relaxations-Simulator', icon: '⏳', description: 'T1-, T2- und T2*-Kurven, Spin-Echo-Refokussierung, Kontrast per TR/TE.', component: RelaxationSimulator },
  { id: 'gradient', title: 'Gradienten-Werkbank', icon: '📐', description: 'Schichtselektion, Frequenz- und Phasenkodierung zum Anfassen.', component: GradientSimulator },
  { id: 'kspace', title: 'K-Raum-Studio', icon: '🌀', description: 'Echte 2D-FFT: Filter, Unterabtastung, Partial Fourier, Spikes, Bewegung.', component: KSpaceSimulator },
  { id: 'sequence', title: 'Sequenz-Designer', icon: '📈', description: 'SE, TSE, IR, GRE und EPI mit Pulsdiagramm und Live-Bild.', component: SequenceSimulator },
  { id: 'artifact', title: 'Artefakt-Detektiv', icon: '🕵️', description: 'Artefakte erkennen, Ursache benennen und beheben.', component: ArtifactLab },
  { id: 'scanner', title: 'Scanner-Explorer', icon: '🏥', description: 'Interaktiver Querschnitt durch die Gerätetechnik mit Such-Quiz.', component: ScannerExplorer },
  { id: 'protocol', title: 'Freie Protokoll-Konsole', icon: '🎛️', description: 'Alle Parameter frei: SNR, SAR, Messzeit und Artefakte im Gleichgewicht.', component: ProtocolConsole },
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
