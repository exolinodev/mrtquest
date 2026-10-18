import type { ComponentType } from 'react';
import { ModalityCompareFigure, ProtonToImageFigure, ScannerIoFigure, TissueWaterFigure } from './IntroFigures';

/** Abbildungen Teil C (Einführung); Schlüssel = Figure-ID aus den Kapiteln. */
export const FIGURES_C: Record<string, ComponentType> = {
  'modality-compare': ModalityCompareFigure,
  'tissue-water': TissueWaterFigure,
  'proton-to-image': ProtonToImageFigure,
  'scanner-io': ScannerIoFigure,
};
