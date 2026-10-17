import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { fmt } from '../physics/mri';
import { dft, gaussianConvolution, inverseDft } from '../physics/lecture';

/** Diskrete Fourier-Transformation zum Nachrechnen: Signal mischen, Basisfunktionen testen, Faltung beobachten. */
export function FourierLab() {
  const { tr } = useLang();
  const [shape, setShape] = useState<'mix' | 'saw'>('mix');
  const [frequency, setFrequency] = useState(3);
  const [amplitude, setAmplitude] = useState(0.5);
  const [phase, setPhase] = useState(0);
  const [harmonics, setHarmonics] = useState(5);
  const [bin, setBin] = useState(3);
  const [sigma, setSigma] = useState(0);
  const N = 64;
  const phi = (phase * Math.PI) / 180;
  const signal = (t: number) =>
    shape === 'mix'
      ? Math.sin(2 * Math.PI * frequency * t + phi) + amplitude * Math.cos(2 * Math.PI * 7 * t)
      : Array.from({ length: harmonics }, (_, j) => Math.sin(2 * Math.PI * (j + 1) * t + phi) / (j + 1)).reduce((s, v) => s + v, 0);
  const samples = useMemo(
    () =>
      Array.from({ length: N }, (_, n) =>
        shape === 'mix'
          ? Math.sin((2 * Math.PI * frequency * n) / N + phi) + amplitude * Math.cos((2 * Math.PI * 7 * n) / N)
          : Array.from({ length: harmonics }, (_, j) => Math.sin((2 * Math.PI * (j + 1) * n) / N + phi) / (j + 1)).reduce((s, v) => s + v, 0),
      ),
    [shape, frequency, amplitude, phi, harmonics],
  );
  const filtered = useMemo(() => gaussianConvolution(samples, sigma), [samples, sigma]);
  const spectrum = useMemo(() => dft(filtered), [filtered]);
  const originalSpectrum = useMemo(() => dft(samples), [samples]);
  const reconstructed = inverseDft(spectrum);
  const error = Math.max(...filtered.map((v, i) => Math.abs(v - reconstructed[i])));
  const selected = spectrum[bin];
  const rows = filtered.map((value, n) => {
    const a = (2 * Math.PI * bin * n) / N;
    return { n, value, cos: Math.cos(a), sin: -Math.sin(a) };
  });
  const damping = originalSpectrum[bin].magnitude > 1e-8 ? selected.magnitude / originalSpectrum[bin].magnitude : null;
  const timeAxis = tr('Zeit [Perioden]', 'Время [периоды]');
  // Rundungsreste wie −0,0003 nicht als „−0“ anzeigen
  const coef = (v: number) => fmt(Math.abs(v) < 5e-4 ? 0 : v, 3);

  return (
    <div className="sim-grid">
      <Panel title={tr('Aufgabe', 'Задание')} className="span-3">
        <p className="small">
          {tr(
            'Mische Frequenzen, ändere Phase und Amplitude, teste Orthogonalität und beobachte Faltung. Alle Samples werden mit einer echten DFT transformiert und mit inverser DFT rekonstruiert. Die Kurven sind keine vorbereiteten Bilder. Für räumliche 2D-Muster nutze zusätzlich das K-Raum-Studio.',
            'Смешивай частоты, меняй фазу и амплитуду, проверяй ортогональность и наблюдай свёртку. Все отсчёты преобразуются настоящим ДПФ и восстанавливаются обратным ДПФ. Графики не являются готовыми картинками. Для 2D-пространственных узоров используй также студию k-пространства.',
          )}
        </p>
        <TeX block tex="X_k = \sum_{n=0}^{N-1} x_n \left[\cos(2\pi kn/N) - i\sin(2\pi kn/N)\right]" />
      </Panel>

      <Panel title={tr('Signal und Rekonstruktion', 'Сигнал и реконструкция')} className="span-2">
        <LineChart
          ariaLabel={tr('Mischsignal, gefiltertes Signal und inverse DFT', 'Смесь, отфильтрованный сигнал и обратное ДПФ')}
          series={[
            { id: 'source', label: tr('Eingang', 'Вход'), color: '#a78bfa', points: sampleCurve(signal, [0, 1], 512) },
            {
              id: 'reconstructed',
              label: sigma > 0 ? tr('Gauß-Faltung → inverse DFT', 'Свёртка Гаусса → обратное ДПФ') : tr('Inverse DFT', 'Обратное ДПФ'),
              color: '#34d399',
              dashed: true,
              points: reconstructed.map((v, i) => [i / N, v]),
            },
          ]}
          xDomain={[0, 1]}
          yDomain={[-2, 2]}
          xLabel={timeAxis}
          zeroLine
        />
      </Panel>

      <Panel title={tr('Signal zusammenstellen', 'Составить сигнал')}>
        <Segmented
          label={tr('Signalform', 'Форма сигнала')}
          value={shape}
          onChange={setShape}
          options={[
            { value: 'mix', label: tr('Zwei Komponenten', 'Две компоненты') },
            { value: 'saw', label: tr('Sägezahn-Reihe', 'Пилообразный ряд') },
          ]}
        />
        {shape === 'mix' ? (
          <>
            <Slider label={tr('Sinus: Perioden im Messfenster', 'Синус: периоды в окне')} value={frequency} min={1} max={12} step={0.25} onChange={setFrequency} />
            <Slider
              label={tr('Amplitude der Kosinus-Komponente (Bin 7)', 'Амплитуда косинусной компоненты (бин 7)')}
              value={amplitude}
              min={0}
              max={1}
              step={0.05}
              onChange={setAmplitude}
            />
          </>
        ) : (
          <Slider label={tr('Harmonische im Sägezahn', 'Гармоники пилы')} value={harmonics} min={1} max={20} onChange={setHarmonics} />
        )}
        <Slider label={tr('Sinus-Phase', 'Фаза синуса')} value={phase} min={-180} max={180} step={15} unit="°" onChange={setPhase} />
        <Slider
          label={tr('Gauß-Faltung σ (0 = aus)', 'Свёртка Гаусса σ (0 = выкл.)')}
          value={sigma}
          min={0}
          max={5}
          step={0.25}
          unit={tr('Samples', 'отсчётов')}
          onChange={setSigma}
          hint={tr(
            'Nicht-ganzzahlige Periodenzahlen erzeugen Leakage: Energie verteilt sich über mehrere Bins. Die Faltung ist zirkulär über 64 Samples.',
            'Нецелое число периодов вызывает утечку: энергия распределяется между бинами. Свёртка циклическая на 64 отсчётах.',
          )}
        />
      </Panel>

      <Panel title={tr('Amplitudenspektrum (DFT)', 'Амплитудный спектр (ДПФ)')} className="span-2">
        <div className="dft-spectrum" role="img" aria-label={tr('Einseitiges Amplitudenspektrum mit 33 Frequenz-Bins', 'Односторонний амплитудный спектр с 33 частотными бинами')}>
          {spectrum.slice(0, N / 2 + 1).map((s, k) => {
            const a = s.magnitude * (k === 0 || k === N / 2 ? 1 : 2);
            return (
              <div key={k} className={`dft-bin${bin === k ? ' selected' : ''}`} title={`${k}: ${fmt(a, 3)}`}>
                <div className="dft-bar" style={{ height: `${Math.min(100, (a / 1.1) * 100)}%` }} />
                <span>{k % 4 === 0 ? k : ''}</span>
              </div>
            );
          })}
        </div>
        <p className="muted small">
          {tr(
            'x: Frequenz-Bin k · y: einseitige Amplitude (0–1,1). Reelle Signale besitzen zusätzlich spiegelbildliche negative Frequenzen. Grün: aktuell getesteter Bin.',
            'x: частотный бин k · y: односторонняя амплитуда (0–1,1). Вещественные сигналы также имеют зеркальные отрицательные частоты. Зелёный: проверяемый бин.',
          )}
        </p>
      </Panel>

      <Panel title={tr('Basisfunktion testen', 'Проверка базисной функции')}>
        <Slider label={tr('Testfrequenz / DFT-Bin k', 'Тестовая частота / бин ДПФ k')} value={bin} min={0} max={32} onChange={setBin} />
        <div className="stat-grid two">
          <Stat label="Re(Xₖ) / N" value={coef(selected.re / N)} />
          <Stat label="Im(Xₖ) / N" value={coef(selected.im / N)} />
          <Stat label={tr('Fehler der IDFT', 'Ошибка ОДПФ')} value={error.toExponential(1)} />
          {sigma > 0 && <Stat label={tr('Dämpfung im Bin', 'Подавление бина')} value={damping === null ? '–' : fmt(damping, 3)} />}
        </div>
      </Panel>

      <Panel title={tr('Signal × Testfunktion', 'Сигнал × тестовая функция')} className="span-2">
        <LineChart
          ariaLabel={tr('Signal, Kosinus-Testfunktion und Produkt', 'Сигнал, тестовый косинус и произведение')}
          series={[
            { id: 's', label: tr('Signal', 'Сигнал'), color: '#38bdf8', points: rows.map((r) => [r.n / N, r.value]) },
            { id: 'g', label: tr('Test-Kosinus', 'Тестовый косинус'), color: '#fbbf24', dashed: true, points: rows.map((r) => [r.n / N, r.cos]) },
            { id: 'product', label: tr('Produkt', 'Произведение'), color: '#f472b6', points: rows.map((r) => [r.n / N, r.value * r.cos]) },
          ]}
          xDomain={[0, 1]}
          yDomain={[-2, 2]}
          xLabel={timeAxis}
          zeroLine
        />
      </Panel>

      <Panel title={tr('Rechenweg', 'Ход вычисления')}>
        <p className="small">
          {tr(
            'Der Koeffizient Xₖ ist die Summe aller Produkte aus Signal und Testfunktion. Passt die Testfrequenz zum Signal, addieren sich die Produkte; sonst heben sie sich auf (Orthogonalität).',
            'Коэффициент Xₖ — это сумма всех произведений сигнала и тестовой функции. Если частоты совпадают, произведения складываются; иначе взаимно гасятся (ортогональность).',
          )}
        </p>
        <details className="fourier-steps">
          <summary>{tr('Alle 64 Rechenschritte anzeigen', 'Показать все 64 шага вычисления')}</summary>
          <div className="table-wrap">
            <table>
              <caption>{tr('DFT wie im Tabellenblatt: Re- und Im-Anteil aufsummieren.', 'ДПФ как в таблице: суммируй вещественные и мнимые вклады.')}</caption>
              <thead>
                <tr>
                  {['n', 'xₙ', 'cos', '−sin', 'xₙ·cos', 'xₙ·(−sin)'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n}>
                    {[r.n, r.value, r.cos, r.sin, r.value * r.cos, r.value * r.sin].map((v, i) => (
                      <td key={i}>{i === 0 ? v : fmt(v, 3)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Σ</th>
                  <td>{fmt(selected.re, 3)}</td>
                  <td>{fmt(selected.im, 3)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </Panel>
    </div>
  );
}
