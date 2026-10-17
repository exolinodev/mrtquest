import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RichText } from '../../components/RichText';
import { seededRandom } from '../../physics/phantom';
import { QUESTION_BANK } from './index';
import { resolveQuestion } from './types';

describe('Challenge-Texte und Formeln', () => {
  it('stellt Formeln auch für Screenreader als MathML bereit', () => {
    const html = renderToStaticMarkup(createElement(RichText, { text: 'Larmor: $f_0 = 42{,}577 B_0$' }));
    expect(html).toContain('katex-mathml');
    expect(html).toContain('<math');
  });
  it('rendert den gesamten Katalog in beiden Sprachen ohne defekte Formeln oder Steuerzeichen', () => {
    for (const bank of Object.values(QUESTION_BANK)) for (const source of bank) {
      for (const lang of ['de', 'ru'] as const) for (const seed of [1, 5, 19]) {
        const q = resolveQuestion(source, seededRandom(seed), lang);
        const texts = [q.prompt, q.explanation, q.hint ?? '', ...(q.kind === 'numeric' ? [q.unit] : q.options)];
        for (const text of texts) {
          const context = `${q.id}/${lang}: ${text}`;
          expect(text, context).not.toMatch(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
          expect((text.match(/\$/g) ?? []).length % 2, context).toBe(0);
          const html = renderToStaticMarkup(createElement(RichText, { text }));
          expect(html, context).not.toContain('katex-error');
          expect(html, context).not.toMatch(/NaN|undefined/);
        }
        if (!('generate' in source)) break;
      }
    }
  });
});
