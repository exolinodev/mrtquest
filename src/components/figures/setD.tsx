import type { ComponentType } from 'react';
import { BlochPhaseFigure, BoltzmannExcessFigure, MolecularMotionFigure, RotatingFrameFigure, ZeemanPhotonFigure } from './PrinzipFigures';

/** Abbildungen Teil D (Physikalisches Prinzip, Vertiefung); Schlüssel = Figure-ID aus den Kapiteln. */
export const FIGURES_D: Record<string, ComponentType> = {
  'boltzmann-excess': BoltzmannExcessFigure,
  'rotating-frame': RotatingFrameFigure,
  'bloch-phase': BlochPhaseFigure,
  'zeeman-photon': ZeemanPhotonFigure,
  'molecular-motion': MolecularMotionFigure,
};
