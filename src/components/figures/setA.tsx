import type { ComponentType } from 'react';
import { FlowPhaseFigure } from './FlowPhase';
import { FidSpectrumFigure, T1T2CurvesFigure, WeightingMapFigure } from './RelaxFigures';
import { PrecessionFigure, RfPulseFigure, SpinsFieldFigure } from './SpinFigures';

/** Abbildungen Teil A; Schlüssel = Figure-ID aus den Kapiteln. */
export const FIGURES_A: Record<string, ComponentType> = {
  'spins-field': SpinsFieldFigure,
  precession: PrecessionFigure,
  'rf-pulse': RfPulseFigure,
  't1-t2-curves': T1T2CurvesFigure,
  'fid-spectrum': FidSpectrumFigure,
  'weighting-map': WeightingMapFigure,
  'flow-phase': FlowPhaseFigure,
};
