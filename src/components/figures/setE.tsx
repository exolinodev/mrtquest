import type { ComponentType } from 'react';
import { ContrastBarsFigure, DemodulationFigure, FovPixelFigure, KSpaceFillingFigure, ReciprocityFigure, SliceProfileFigure } from './BildFigures';

/** Abbildungen Teil E (Vom Signal zum Bild, Vertiefung); Schlüssel = Figure-ID aus den Kapiteln. */
export const FIGURES_E: Record<string, ComponentType> = {
  demodulation: DemodulationFigure,
  'fov-pixel': FovPixelFigure,
  reciprocity: ReciprocityFigure,
  'kspace-filling': KSpaceFillingFigure,
  'contrast-bars': ContrastBarsFigure,
  'slice-profile': SliceProfileFigure,
};
