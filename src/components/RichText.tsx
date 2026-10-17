import katex from 'katex';
import { Fragment, memo, useMemo } from 'react';

function renderTex(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { displayMode, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
}

export const TeX = memo(function TeX({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => renderTex(tex, block), [tex, block]);
  return block ? <div className="tex-block" dangerouslySetInnerHTML={{ __html: html }} /> : <span className="tex-inline" dangerouslySetInnerHTML={{ __html: html }} />;
});

/** Zerlegt Text in Abschnitte mit $Formel$ und **Fettdruck**. */
function tokenize(text: string): Array<{ kind: 'text' | 'math' | 'bold'; value: string }> {
  const out: Array<{ kind: 'text' | 'math' | 'bold'; value: string }> = [];
  const re = /\$([^$]+)\$|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ kind: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: 'math', value: m[1] });
    else out.push({ kind: 'bold', value: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out;
}

export const RichText = memo(function RichText({ text }: { text: string }) {
  const tokens = useMemo(() => tokenize(text), [text]);
  return (
    <>
      {tokens.map((t, i) => (
        <Fragment key={i}>
          {t.kind === 'text' && t.value}
          {t.kind === 'math' && <TeX tex={t.value} />}
          {t.kind === 'bold' && (
            <strong>
              <RichText text={t.value} />
            </strong>
          )}
        </Fragment>
      ))}
    </>
  );
});
