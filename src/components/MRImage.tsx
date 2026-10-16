import { useEffect, useRef } from 'react';
import { drawGrayscale } from '../physics/protocol';

/** Zeichnet ein synthetisches MR-Bild (Grauwerte) mit Perzentil-Fensterung. */
export function MRImage({ data, label, overlay }: { data: ArrayLike<number>; label: string; overlay?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = Math.round(Math.sqrt(data.length));
  useEffect(() => {
    if (ref.current) drawGrayscale(ref.current, data, size);
  }, [data, size]);
  return (
    <div className="mr-image">
      <canvas ref={ref} className="pixel-canvas" role="img" aria-label={label} />
      {overlay && <span className="mr-overlay">{overlay}</span>}
    </div>
  );
}
