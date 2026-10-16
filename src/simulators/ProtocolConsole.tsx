import { useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { Panel, Segmented, Slider, Stars, Stat, Toggle } from '../components/ui';
import { evaluateScenario, type ParamKey, type Scenario } from '../content/scenarios';
import { useGame } from '../game/GameContext';
import type { Lang, Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import type { FieldStrength } from '../physics/constants';
import { fmt, fmtDuration } from '../physics/mri';
import type { PhantomId } from '../physics/phantom';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, SEQUENCE_LABELS, synthesizeImage, type Protocol, type SequenceType } from '../physics/protocol';

type NumericKey = Exclude<ParamKey, 'sequence' | 'field' | 'fatSat'>;

interface ParamSpec {
  label: Loc;
  min: number;
  max: number;
  step: number;
  unit?: Loc;
  appliesTo?: SequenceType[];
}

const same = (s: string): Loc => ({ de: s, ru: s });
const MS: Loc = { de: 'ms', ru: 'мс' };
const MM: Loc = { de: 'mm', ru: 'мм' };
const DEG = same('°');

function specFor(key: NumericKey, seq: SequenceType): ParamSpec {
  switch (key) {
    case 'tr':
      return seq === 'GRE' ? { label: same('TR'), min: 5, max: 1000, step: 5, unit: MS } : { label: same('TR'), min: 200, max: 12000, step: 50, unit: MS };
    case 'te':
      return seq === 'GRE'
        ? { label: same('TE'), min: 1, max: 40, step: 0.1, unit: MS }
        : { label: seq === 'TSE' || seq === 'IR' ? { de: 'TE (effektiv)', ru: 'TE (эффективное)' } : same('TE'), min: 5, max: 250, step: 1, unit: MS };
    case 'ti':
      return { label: { de: 'Inversionszeit TI', ru: 'Время инверсии TI' }, min: 50, max: 3500, step: 5, unit: MS, appliesTo: ['IR'] };
    case 'flip':
      return { label: { de: 'Flipwinkel α', ru: 'Угол отклонения α' }, min: 5, max: 90, step: 1, unit: DEG, appliesTo: ['GRE'] };
    case 'refocusFlip':
      return { label: { de: 'Refokussierungswinkel', ru: 'Угол рефокусировки' }, min: 90, max: 180, step: 5, unit: DEG, appliesTo: ['SE', 'TSE', 'IR', 'EPI'] };
    case 'etl':
      return { label: { de: 'Echozuglänge ETL', ru: 'Длина эхо-цепочки ETL' }, min: 2, max: 64, step: 1, appliesTo: ['TSE', 'IR'] };
    case 'fovRead':
      return { label: { de: 'FOV Auslese', ru: 'FOV считывания' }, min: 100, max: 450, step: 10, unit: MM };
    case 'fovPhase':
      return { label: { de: 'FOV Phase', ru: 'FOV фазовое' }, min: 100, max: 450, step: 10, unit: MM };
    case 'matrixRead':
      return { label: { de: 'Matrix Auslese', ru: 'Матрица считывания' }, min: 64, max: 512, step: 32 };
    case 'matrixPhase':
      return { label: { de: 'Matrix Phase', ru: 'Матрица фазовая' }, min: 64, max: 512, step: 16 };
    case 'sliceThickness':
      return { label: { de: 'Schichtdicke', ru: 'Толщина среза' }, min: 1, max: 10, step: 0.5, unit: MM };
    case 'slices':
      return { label: { de: 'Schichtanzahl', ru: 'Число срезов' }, min: 1, max: 60, step: 1 };
    case 'nex':
      return { label: { de: 'Mittelungen NEX', ru: 'Усреднения NEX' }, min: 1, max: 8, step: 1 };
    case 'bandwidthPerPixel':
      return { label: { de: 'Bandbreite', ru: 'Полоса пропускания' }, min: 50, max: 2500, step: 10, unit: { de: 'Hz/px', ru: 'Гц/пикс.' } };
    case 'acceleration':
      return { label: { de: 'Parallele Bildgebung R', ru: 'Параллельная визуализация R' }, min: 1, max: 4, step: 1 };
    case 'phaseOversampling':
      return { label: { de: 'Phasen-Oversampling', ru: 'Фазовая передискретизация' }, min: 0, max: 100, step: 10, unit: same('%') };
  }
}

const ALL_KEYS: ParamKey[] = ['sequence', 'field', 'tr', 'te', 'ti', 'flip', 'refocusFlip', 'etl', 'fovRead', 'fovPhase', 'matrixRead', 'matrixPhase', 'sliceThickness', 'slices', 'nex', 'bandwidthPerPixel', 'acceleration', 'phaseOversampling', 'fatSat'];

/** Vernünftige Startwerte beim Sequenzwechsel innerhalb der Konsole. */
const SEQ_DEFAULTS: Record<SequenceType, Partial<Protocol>> = {
  SE: { tr: 550, te: 15, etl: 1 },
  TSE: { tr: 4000, te: 100, etl: 16 },
  IR: { tr: 9000, te: 100, ti: 2200, etl: 16 },
  GRE: { tr: 200, te: 4.6, flip: 70, etl: 1 },
  EPI: { tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1500 },
};

interface Props {
  scenario?: Scenario;
}

function sarModeLabel(mode: 'normal' | 'first-level' | 'unzulässig', lang: Lang): string {
  if (mode === 'normal') return lang === 'ru' ? 'Нормальный режим' : 'Normal Mode';
  if (mode === 'first-level') return lang === 'ru' ? 'Режим First Level' : 'First Level';
  return lang === 'ru' ? 'недопустимо' : 'unzulässig';
}

export function ProtocolConsole({ scenario }: Props) {
  const { state, dispatch } = useGame();
  const { tr, loc, lang } = useLang();
  const [protocol, setProtocol] = useState<Protocol>(scenario?.start ?? DEFAULT_PROTOCOL);
  const [freeAnatomy, setFreeAnatomy] = useState<PhantomId>('brain');
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);
  const anatomy = ANATOMY[scenario?.anatomy ?? freeAnatomy];
  const editable = scenario?.editable ?? ALL_KEYS;
  const allowedSeq = scenario?.allowedSequences ?? (Object.keys(SEQUENCE_LABELS) as SequenceType[]);

  const metrics = useMemo(() => computeMetrics(protocol, anatomy), [protocol, anatomy]);
  const image = useMemo(() => synthesizeImage(protocol, anatomy, metrics, { seed: 11 }), [protocol, anatomy, metrics]);
  const evaluation = scenario ? evaluateScenario(scenario, protocol, metrics) : null;

  const set = <K extends keyof Protocol>(key: K, value: Protocol[K]) => {
    setResult(null);
    setProtocol((p) => ({ ...p, [key]: value }));
  };

  const numericKeys = editable.filter((k): k is NumericKey => k !== 'sequence' && k !== 'field' && k !== 'fatSat');

  const submit = () => {
    if (!scenario || !evaluation) return;
    const prevStars = state.scenarios[scenario.id]?.stars ?? 0;
    const stars = evaluation.stars;
    const xp = stars > prevStars ? Math.round((scenario.xp * (stars - prevStars)) / 3) : 0;
    dispatch({ type: 'SCENARIO_RESULT', scenarioId: scenario.id, stars, xp });
    if (stars > 0 && protocol.field === 3 && metrics.sar <= 2) dispatch({ type: 'FLAG', flag: 'sar-safe-3t' });
    setResult({ stars, xp });
  };

  const tone = (ok: boolean) => (ok ? 'good' : 'bad');
  const ms = tr('ms', 'мс');
  const px = tr('px', 'пикс.');

  return (
    <div className="console">
      <Panel title={tr('Protokoll', 'Протокол')} className="console-controls">
        {editable.includes('sequence') && (
          <Segmented<SequenceType>
            label={tr('Sequenz', 'Последовательность')}
            value={protocol.sequence}
            options={allowedSeq.map((s) => ({ value: s, label: s }))}
            onChange={(seq) => {
              setResult(null);
              setProtocol((p) => ({ ...p, sequence: seq, ...SEQ_DEFAULTS[seq] }));
            }}
          />
        )}
        {!editable.includes('sequence') && (
          <p className="small">
            {tr('Sequenz', 'Последовательность')}: <strong>{loc(SEQUENCE_LABELS[protocol.sequence])}</strong>
          </p>
        )}
        {editable.includes('field') ? (
          <Segmented<FieldStrength>
            label={tr('Feldstärke', 'Индукция поля')}
            value={protocol.field}
            options={[
              { value: 1.5, label: tr('1,5 T', '1,5 Тл') },
              { value: 3, label: tr('3 T', '3 Тл') },
            ]}
            onChange={(v) => set('field', v)}
          />
        ) : (
          <p className="small">
            {tr('Feldstärke', 'Индукция поля')}:{' '}
            <strong>
              {fmt(protocol.field)} {tr('T', 'Тл')}
            </strong>
          </p>
        )}
        {!scenario && (
          <Segmented<PhantomId>
            label={tr('Anatomie', 'Анатомия')}
            value={freeAnatomy}
            options={[
              { value: 'brain', label: tr('Kopf', 'Голова') },
              { value: 'knee', label: tr('Knie', 'Колено') },
              { value: 'abdomen', label: tr('Abdomen', 'Живот') },
            ]}
            onChange={setFreeAnatomy}
          />
        )}
        {numericKeys.map((key) => {
          const spec = specFor(key, protocol.sequence);
          if (spec.appliesTo && !spec.appliesTo.includes(protocol.sequence)) return null;
          return (
            <Slider
              key={key}
              label={loc(spec.label)}
              value={protocol[key]}
              min={spec.min}
              max={spec.max}
              step={spec.step}
              unit={spec.unit ? loc(spec.unit) : undefined}
              onChange={(v) => set(key, v)}
              format={(v) => fmt(v, 1)}
            />
          );
        })}
        {editable.includes('fatSat') && <Toggle label={tr('Spektrale Fettsättigung', 'Спектральное жироподавление')} checked={protocol.fatSat} onChange={(v) => set('fatSat', v)} />}
        {scenario && (
          <button
            className="btn ghost small"
            type="button"
            onClick={() => {
              setProtocol(scenario.start);
              setResult(null);
            }}
          >
            {tr('Protokoll zurücksetzen', 'Сбросить протокол')}
          </button>
        )}
      </Panel>

      <div className="console-center">
        <Panel title={tr('Vorschau', 'Предпросмотр')}>
          <MRImage data={image} label={tr('Simulierte Aufnahme', 'Смоделированное изображение')} overlay={loc(metrics.weighting)} />
        </Panel>
        <Panel title={tr('Kennzahlen', 'Показатели')}>
          <div className="stat-grid">
            <Stat
              label={tr('Messzeit', 'Время сканирования')}
              value={fmtDuration(metrics.scanTimeS)}
              sub={metrics.timing.concatenations > 1 ? tr(`${metrics.timing.concatenations} Konkatenationen`, `${metrics.timing.concatenations} конкатенации`) : undefined}
            />
            <Stat label={tr('SNR (rel.)', 'SNR (отн.)')} value={fmt(metrics.snr, 1)} tone={metrics.snr >= 15 ? 'good' : metrics.snr >= 8 ? 'warn' : 'bad'} />
            <Stat
              label="SAR"
              value={fmt(metrics.sar, 2)}
              unit={tr('W/kg', 'Вт/кг')}
              tone={metrics.sar <= 2 ? 'good' : metrics.sar <= 4 ? 'warn' : 'bad'}
              sub={sarModeLabel(metrics.sarMode, lang)}
            />
            <Stat label={tr('Voxel', 'Воксель')} value={`${fmt(metrics.pixelRead, 2)}×${fmt(metrics.pixelPhase, 2)}×${fmt(protocol.sliceThickness, 1)}`} unit={tr('mm', 'мм')} />
            <Stat
              label={tr('Chem. Verschiebung', 'Хим. сдвиг')}
              value={fmt(metrics.chemicalShiftPx, 2)}
              unit={px}
              tone={metrics.chemicalShiftPx <= 1.5 ? 'good' : metrics.chemicalShiftPx <= 3 ? 'warn' : 'bad'}
            />
            {protocol.sequence === 'EPI' && (
              <Stat label={tr('EPI-Verzerrung', 'EPI-искажение')} value={fmt(metrics.epiDistortionPx, 1)} unit={px} tone={metrics.epiDistortionPx <= 3 ? 'good' : 'bad'} />
            )}
            <Stat label={tr('min. TE / TR', 'мин. TE / TR')} value={`${fmt(metrics.timing.minTE, 1)} / ${fmt(metrics.timing.minTR, 0)}`} unit={ms} />
            <Stat label={tr('Schichten pro TR', 'Срезов за TR')} value={metrics.timing.maxSlicesPerTR} />
          </div>
          {metrics.issues.length > 0 && (
            <ul className="issues">
              {metrics.issues.map((i, idx) => (
                <li key={idx} className={`issue-${i.severity}`}>
                  {loc(i.text)}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {scenario && evaluation && (
        <Panel title={tr('Anforderungen', 'Требования')} className="console-reqs">
          <ul className="req-list">
            {evaluation.results.map(({ req, ok }) => (
              <li key={req.id} className={ok ? 'ok' : 'nok'}>
                <span className="req-icon" aria-hidden="true">
                  {ok ? '✔' : req.hard ? '✘' : '☆'}
                </span>
                <span>
                  {loc(req.label)}
                  {!req.hard && <em className="soft-tag"> {tr('Bonus', 'Бонус')}</em>}
                  {req.value && <span className={`req-value tone-${tone(ok)}`}> · {req.value(protocol, metrics, lang)}</span>}
                </span>
              </li>
            ))}
          </ul>
          <div className="req-summary">
            {evaluation.passed ? (
              <>
                <span>{tr('Aktuelle Bewertung:', 'Текущая оценка:')}</span> <Stars count={evaluation.stars} />
              </>
            ) : (
              <span className="bad-text">{tr('Pflichtkriterien noch nicht erfüllt.', 'Обязательные критерии ещё не выполнены.')}</span>
            )}
          </div>
          <button className="btn primary block" type="button" disabled={!evaluation.passed} onClick={submit}>
            {tr('Protokoll an MTR übergeben', 'Передать протокол рентгенолаборанту')}
          </button>
          {result && (
            <div className="feedback is-correct">
              <strong>
                {tr('Messung durchgeführt:', 'Сканирование выполнено:')} <Stars count={result.stars} />{' '}
                {result.xp > 0 ? `+${result.xp} XP` : tr('(keine Verbesserung – keine neuen XP)', '(без улучшения – новых XP нет)')}
              </strong>
              <p>{loc(scenario.debrief)}</p>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
