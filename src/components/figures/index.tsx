import { RichText } from '../RichText';
import { FIGURES_A } from './setA';
import { FIGURES_B } from './setB';
import { FIGURES_C } from './setC';
import { FIGURES_D } from './setD';
import { FIGURES_E } from './setE';

export const FIGURES = { ...FIGURES_A, ...FIGURES_B, ...FIGURES_C, ...FIGURES_D, ...FIGURES_E };

/** Rendert eine Kapitel-Abbildung mit Bildunterschrift. */
export function Figure({ id, caption }: { id: string; caption: string }) {
  const Comp = FIGURES[id];
  if (!Comp) return null;
  return (
    <figure className="theory-figure">
      <Comp />
      <figcaption>
        <RichText text={caption} />
      </figcaption>
    </figure>
  );
}
