import type { ComponentType } from 'react';
import { EmWave } from './EmWave';
import { FourierSum } from './FourierSum';
import { GradientBody } from './GradientBody';
import { KSpaceMasks } from './KSpaceMasks';
import { SequenceDiagram } from './SequenceDiagram';
import { SignalChain } from './SignalChain';
import { SpinSum } from './SpinSum';

/** Abbildungen Teil B; Schlüssel = Figure-ID aus den Kapiteln. */
export const FIGURES_B: Record<string, ComponentType> = {
  'gradient-body': GradientBody,
  'spin-sum': SpinSum,
  'sequence-diagram': SequenceDiagram,
  'fourier-sum': FourierSum,
  'kspace-masks': KSpaceMasks,
  'signal-chain': SignalChain,
  'em-wave': EmWave,
};
