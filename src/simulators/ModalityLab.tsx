import { useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { RichText } from '../components/RichText';
import { Callout, Panel, Segmented, Stat } from '../components/ui';
import { useGame } from '../game/GameContext';
import type { Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { TISSUES, type TissueId } from '../physics/constants';
import { fmt } from '../physics/mri';
import { getPhantom, labelAt, renderPhantom, type Label } from '../physics/phantom';
import { DEFAULT_PROTOCOL, tissueSignal, type Protocol } from '../physics/protocol';

type Mode = 'contrast' | 'game';
type MrContrast = 'PD' | 'T1' | 'T2';
type Modality = 'xray' | 'ct' | 'us' | 'pet' | 'mri';

const N = 192;
const FIELD = 1.5;

const MR_PROTOCOL: Record<MrContrast, Protocol> = {
  PD: { ...DEFAULT_PROTOCOL, sequence: 'SE', tr: 3000, te: 15 },
  T1: { ...DEFAULT_PROTOCOL, sequence: 'SE', tr: 550, te: 12 },
  T2: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 100 },
};

/** Schematische CT-Dichten in Hounsfield-Einheiten (gerundete Lehrwerte). */
const HU: Record<Label, number> = {
  air: -1000,
  bone: 1000,
  fat: -100,
  csf: 8,
  wm: 28,
  gm: 38,
  lesion: 20,
  blood: 50,
  muscle: 50,
  liver: 60,
};
/** Weichteilfenster: Zentrum 40 HU, Breite 400 HU */
const WINDOW = { level: 40, width: 400 };
const ctGray = (hu: number) => Math.min(1, Math.max(0, (hu - (WINDOW.level - WINDOW.width / 2)) / WINDOW.width));
const michelson = (a: number, b: number) => (a + b > 0 ? Math.abs(a - b) / (a + b) : 0);

const TABLE_ROWS: Label[] = ['bone', 'fat', 'csf', 'gm', 'wm', 'lesion'];

const MODALITIES: Array<{ id: Modality; label: Loc; principle: Loc }> = [
  { id: 'xray', label: { de: 'Röntgen', ru: 'Рентген' }, principle: { de: 'Röntgenstrahlen, ein Summationsbild', ru: 'Рентгеновские лучи, суммационный снимок' } },
  { id: 'ct', label: { de: 'CT', ru: 'КТ' }, principle: { de: 'Röntgenstrahlen, Schnittbilder der Dichte', ru: 'Рентгеновские лучи, срезы плотности' } },
  { id: 'us', label: { de: 'Ultraschall', ru: 'УЗИ' }, principle: { de: 'Schallwellen und ihre Echos', ru: 'Звуковые волны и их эхо' } },
  { id: 'pet', label: { de: 'PET / PET-CT', ru: 'ПЭТ / ПЭТ-КТ' }, principle: { de: 'Radioaktiver Tracer zeigt Stoffwechsel', ru: 'Радиоактивный индикатор показывает обмен веществ' } },
  { id: 'mri', label: { de: 'MRT', ru: 'МРТ' }, principle: { de: 'Wasserstoffkerne im Magnetfeld, Radiowellen', ru: 'Ядра водорода в магнитном поле, радиоволны' } },
];

interface ClinicalCase {
  id: string;
  prompt: Loc;
  accept: Modality[];
  why: Loc;
}

const CASES: ClinicalCase[] = [
  {
    id: 'fracture',
    prompt: { de: 'Nach einem Sturz auf die Hand tut das Handgelenk weh. Ist der Knochen gebrochen?', ru: 'После падения на руку болит запястье. Есть ли перелом кости?' },
    accept: ['xray', 'ct'],
    why: {
      de: '**Röntgen ist hier meist der erste Schritt.** Knochen enthält viel Kalzium und schwächt Röntgenstrahlen stark, deshalb ist er hell und ein Bruchspalt gut zu sehen. Das geht schnell und ist günstig. Bei komplizierten Brüchen oder unklarem Befund hilft die CT mit Schnittbildern. Im MRT ist kompakter Knochen dunkel, weil er kaum bewegliches Wasser hat.',
      ru: '**Рентген здесь обычно первый шаг.** В кости много кальция, она сильно ослабляет рентгеновские лучи, поэтому выглядит светлой, и линию перелома хорошо видно. Это быстро и недорого. При сложных переломах или неясной картине помогает КТ со срезами. На МРТ компактная кость тёмная, потому что в ней почти нет подвижной воды.',
    },
  },
  {
    id: 'acl',
    prompt: { de: 'Beim Fußball hat sich das Knie verdreht, es ist instabil. Ist das vordere Kreuzband gerissen?', ru: 'Во время футбола колено подвернулось и стало нестабильным. Есть ли разрыв передней крестообразной связки?' },
    accept: ['mri'],
    why: {
      de: '**Die MRT ist hier die Methode der Wahl.** Bänder, Menisken und Knorpel sind Weichteile. Sie unterscheiden sich im Wassergehalt und in den Relaxationszeiten, und genau das macht das MRT sichtbar. Im Röntgenbild und in der CT sehen diese Strukturen fast gleich grau aus. Ultraschall kommt an das Kreuzband in der Tiefe des Gelenks kaum heran.',
      ru: '**Здесь метод выбора МРТ.** Связки, мениски и хрящ это мягкие ткани. Они различаются содержанием воды и временами релаксации, и именно это делает видимым МРТ. На рентгене и КТ эти структуры выглядят почти одинаково серыми. УЗИ почти не достаёт до крестообразной связки в глубине сустава.',
    },
  },
  {
    id: 'tumor',
    prompt: { de: 'Seit Wochen Kopfschmerzen und ein epileptischer Anfall. Gibt es einen Hirntumor, und wie genau sieht er aus?', ru: 'Несколько недель головные боли и эпилептический приступ. Есть ли опухоль мозга и как именно она выглядит?' },
    accept: ['mri'],
    why: {
      de: '**Die MRT zeigt Hirngewebe mit dem besten Weichteilkontrast.** Tumor, Ödem, graue und weiße Substanz unterscheiden sich in T1 und T2 deutlich. Mit Kontrastmittel zeigt sich zusätzlich, wo die Blut-Hirn-Schranke gestört ist. Im Skript siehst du außerdem PET/MRT bei einem Glioblastom: Die PET kann den Stoffwechsel ergänzen, die Anatomie liefert das MRT.',
      ru: '**МРТ показывает ткань мозга с лучшим контрастом мягких тканей.** Опухоль, отёк, серое и белое вещество заметно различаются на T1 и T2. С контрастным веществом дополнительно видно, где нарушен гематоэнцефалический барьер. В конспекте также есть ПЭТ/МРТ при глиобластоме: ПЭТ может добавить сведения об обмене веществ, а анатомию даёт МРТ.',
    },
  },
  {
    id: 'placenta',
    prompt: { de: 'In der Schwangerschaft soll die Lage der Plazenta beurteilt werden.', ru: 'Во время беременности нужно оценить расположение плаценты.' },
    accept: ['us', 'mri'],
    why: {
      de: '**Zuerst Ultraschall, bei besonderen Fragen das MRT.** Beide arbeiten ohne ionisierende Strahlung, das ist in der Schwangerschaft entscheidend. Ultraschall ist schnell, überall verfügbar und zeigt die Plazenta direkt am Bett. Das MRT hilft, wenn die Frage genauer wird, zum Beispiel ob die Plazenta in die Gebärmutterwand einwächst. Im Skript siehst du solche Bilder von Fetus und Plazenta. Röntgen, CT und PET nutzen ionisierende Strahlung und sind hier keine gute Wahl.',
      ru: '**Сначала УЗИ, при особых вопросах МРТ.** Оба метода работают без ионизирующего излучения, а при беременности это решающий момент. УЗИ быстрое, доступно везде и показывает плаценту прямо у кровати. МРТ помогает, когда вопрос становится точнее, например врастает ли плацента в стенку матки. В конспекте есть такие снимки плода и плаценты. Рентген, КТ и ПЭТ используют ионизирующее излучение и здесь не лучший выбор.',
    },
  },
  {
    id: 'stroke',
    prompt: { de: 'Plötzlich ist eine Körperseite gelähmt, die Sprache ist verwaschen. Verdacht auf akuten Schlaganfall.', ru: 'Внезапно парализована одна сторона тела, речь нечёткая. Подозрение на острый инсульт.' },
    accept: ['ct', 'mri'],
    why: {
      de: '**CT und MRT sind beide sinnvoll, je nach Klinik.** Beim Schlaganfall zählt jede Minute. Die CT ist sehr schnell und fast überall verfügbar, sie zeigt vor allem, ob es blutet. Das MRT erkennt mit Diffusionsbildgebung frische Infarkte sehr früh und empfindlich, dauert aber länger. Welche Methode zuerst kommt, legt das Klinikteam fest.',
      ru: '**Подходят и КТ, и МРТ, в зависимости от клиники.** При инсульте важна каждая минута. КТ очень быстрая и доступна почти везде, прежде всего она показывает, есть ли кровоизлияние. МРТ с диффузионной визуализацией распознаёт свежий инфаркт очень рано и чувствительно, но занимает больше времени. Какой метод будет первым, решает команда клиники.',
    },
  },
  {
    id: 'lung',
    prompt: { de: 'Auf einem Röntgenbild der Lunge fällt ein kleiner Rundherd auf. Wie groß ist er genau, und wo liegt er?', ru: 'На рентгеновском снимке лёгких заметен небольшой округлый очаг. Какого он точно размера и где находится?' },
    accept: ['ct'],
    why: {
      de: '**Die CT ist hier das Standardverfahren.** Lunge ist zum großen Teil Luft. Luft und Gewebe unterscheiden sich in der Dichte enorm, deshalb hebt sich ein Herd in der CT sehr scharf ab. Das MRT hat in der Lunge wenig Signal, weil dort kaum Gewebe mit Wasserstoff ist. Ultraschall wird von der Luft fast vollständig reflektiert. Eine PET-CT kann später helfen, wenn man den Stoffwechsel des Herdes beurteilen will.',
      ru: '**Здесь стандартный метод КТ.** Лёгкое в основном состоит из воздуха. Воздух и ткань сильно различаются по плотности, поэтому очаг на КТ выделяется очень чётко. МРТ даёт в лёгком мало сигнала, потому что там мало ткани с водородом. Ультразвук почти полностью отражается от воздуха. ПЭТ-КТ может помочь позже, если нужно оценить обмен веществ в очаге.',
    },
  },
  {
    id: 'gallstones',
    prompt: { de: 'Nach einem fetten Essen krampfartige Schmerzen rechts im Oberbauch. Gibt es Gallensteine?', ru: 'После жирной еды схваткообразная боль справа в верхней части живота. Есть ли камни в желчном пузыре?' },
    accept: ['us'],
    why: {
      de: '**Ultraschall ist hier die erste Wahl.** Er arbeitet ohne Strahlung, ist schnell und günstig. Steine reflektieren den Schall sehr stark: Sie leuchten hell auf und werfen dahinter einen dunklen Schallschatten. Viele Gallensteine enthalten wenig Kalk und sind im Röntgenbild deshalb oft nicht sichtbar.',
      ru: '**Здесь первый выбор УЗИ.** Оно работает без излучения, быстрое и недорогое. Камни очень сильно отражают звук: они ярко светятся, а за ними видна тёмная акустическая тень. Многие желчные камни содержат мало кальция, поэтому на рентгене их часто не видно.',
    },
  },
  {
    id: 'metabolism',
    prompt: { de: 'Bei einer bekannten Krebserkrankung soll man sehen, wo im ganzen Körper Gewebe besonders viel Zucker verbraucht.', ru: 'При известном онкологическом заболевании нужно увидеть, где во всём теле ткань потребляет особенно много сахара.' },
    accept: ['pet'],
    why: {
      de: '**PET bzw. PET-CT misst den Stoffwechsel.** Man spritzt eine schwach radioaktiv markierte Zuckerverbindung (FDG). Gewebe mit hohem Zuckerverbrauch, oft auch Tumorgewebe, reichert sie an und leuchtet im Bild auf. Die CT im selben Gerät liefert die Anatomie dazu. Die MR-Spektroskopie zeigt zwar auch Stoffwechselprodukte, aber nur in einem kleinen Areal und nicht im ganzen Körper.',
      ru: '**ПЭТ или ПЭТ-КТ измеряет обмен веществ.** Вводят слабо радиоактивно меченное соединение сахара (ФДГ). Ткань с высоким потреблением сахара, часто и опухолевая, накапливает его и светится на снимке. КТ в том же аппарате добавляет анатомию. МР-спектроскопия тоже показывает продукты обмена, но только в небольшой зоне, а не во всём теле.',
    },
  },
];

function initialMode(preset?: string): Mode {
  const p = preset ?? window.location.hash.split('/')[3];
  return p === 'game' ? 'game' : 'contrast';
}

/** Modalitäten-Labor: CT- und MRT-Kontrast am selben Phantom vergleichen und Verfahren klinischen Fragen zuordnen. */
export function ModalityLab({ preset }: { preset?: string }) {
  const { tr } = useLang();
  const [mode, setMode] = useState<Mode>(() => initialMode(preset));
  return (
    <div className="sim-grid">
      <Panel title={tr('Experiment wählen', 'Выбор эксперимента')} className="span-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'contrast', label: tr('Kontrast vergleichen', 'Сравнить контраст') },
            { value: 'game', label: tr('Welches Verfahren passt?', 'Какой метод подходит?') },
          ]}
        />
        <p className="small">
          {mode === 'contrast'
            ? tr(
                'Derselbe Kopf, zwei Messprinzipien. Die CT misst, wie stark Gewebe Röntgenstrahlen schwächt. Das MRT misst Wasserstoffkerne und ihre Relaxation.',
                'Одна и та же голова, два принципа измерения. КТ измеряет, насколько сильно ткань ослабляет рентгеновские лучи. МРТ измеряет ядра водорода и их релаксацию.',
              )
            : tr(
                'Acht klinische Fragen. Wähle jeweils das Verfahren, das am besten passt. Manchmal sind zwei Antworten richtig.',
                'Восемь клинических вопросов. Каждый раз выбирай метод, который подходит лучше всего. Иногда верны два ответа.',
              )}
        </p>
      </Panel>
      {mode === 'contrast' ? <ContrastCompare /> : <ModalityGame />}
    </div>
  );
}

function ContrastCompare() {
  const { tr, loc } = useLang();
  const [mr, setMr] = useState<MrContrast>('T2');
  const phantom = useMemo(() => getPhantom('brain', N), []);
  const ctImage = useMemo(() => Float32Array.from(phantom.labels, (l) => ctGray(HU[labelAt(l)])), [phantom]);
  const mrImage = useMemo(() => renderPhantom(phantom, FIELD, (p, t) => tissueSignal(p, t, MR_PROTOCOL[mr])), [phantom, mr]);

  const mrSignal = (label: Label) => {
    if (label === 'air') return 0;
    if (label === 'bone') return 0.02;
    return tissueSignal(TISSUES[label].params[FIELD], label, MR_PROTOCOL[mr]);
  };
  const mrMax = Math.max(...TABLE_ROWS.map(mrSignal));
  const ctContrast = michelson(ctGray(HU.gm), ctGray(HU.wm));
  const mrContrast = michelson(mrSignal('gm'), mrSignal('wm'));
  const tissueName = (l: Label) => (l === 'bone' ? tr('Knochen (Kompakta)', 'Кость (компактная)') : loc(TISSUES[l as TissueId].label));

  return (
    <>
      <Panel title={tr('Gleicher Kopf, zwei Verfahren', 'Одна голова, два метода')} className="span-2">
        <Segmented
          label={tr('MRT-Gewichtung', 'Взвешенность МРТ')}
          value={mr}
          onChange={setMr}
          options={[
            { value: 'PD', label: 'PD' },
            { value: 'T1', label: 'T1' },
            { value: 'T2', label: 'T2' },
          ]}
        />
        <div className="image-pair modlab-pair">
          <figure>
            <MRImage data={ctImage} label={tr('Schematisches CT-Bild des Kopfphantoms', 'Схематическое КТ-изображение фантома головы')} overlay="CT" />
            <figcaption className="small muted">{tr('CT: Knochen hell, Weichteile fast gleich grau', 'КТ: кость светлая, мягкие ткани почти одинаково серые')}</figcaption>
          </figure>
          <figure>
            <MRImage data={mrImage} label={tr(`MRT-Bild, ${mr}-gewichtet`, `МРТ-изображение, ${mr}-взвешенное`)} overlay={tr(`MRT · ${mr}`, `МРТ · ${mr}`)} />
            <figcaption className="small muted">{tr('MRT: Knochen dunkel, Weichteile klar getrennt', 'МРТ: кость тёмная, мягкие ткани чётко различимы')}</figcaption>
          </figure>
        </div>
        <p className="small muted">{tr('Tabelle: CT-Dichte in HU, MRT-Signal relativ zum hellsten Gewebe.', 'Таблица: плотность КТ в HU, сигнал МРТ относительно самой яркой ткани.')}</p>
        <div className="table-wrap modlab-table">
          <table>
            <thead>
              <tr>
                <th>{tr('Gewebe', 'Ткань')}</th>
                <th>{tr('CT', 'КТ')}</th>
                <th>{tr(`MRT ${mr}`, `МРТ ${mr}`)}</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((l) => (
                <tr key={l}>
                  <td>{tissueName(l)}</td>
                  <td>{fmt(HU[l], 0)} HU</td>
                  <td>{fmt((mrSignal(l) / mrMax) * 100, 0)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={tr('Was du siehst', 'Что ты видишь')}>
        <p className="small">
          {tr(
            'Die CT ordnet jedem Gewebe eine Dichte in Hounsfield-Einheiten (HU) zu. Knochen schwächt Röntgenstrahlen stark und ist hell. Graue und weiße Substanz liegen nur rund 10 HU auseinander, im Bild also fast gleich grau.',
            'КТ присваивает каждой ткани плотность в единицах Хаунсфилда (HU). Кость сильно ослабляет рентгеновские лучи и выглядит светлой. Серое и белое вещество различаются всего примерно на 10 HU, поэтому на снимке они почти одинаково серые.',
          )}
        </p>
        <p className="small">
          {tr(
            'Das MRT hört auf Wasserstoffkerne. Kompakter Knochen hat kaum bewegliches Wasser und bleibt dunkel. Weichteile unterscheiden sich in Protonendichte, T1 und T2, deshalb trennt das MRT sie deutlich. Wechsle zwischen PD, T1 und T2: Liquor ist in T1 dunkel und in T2 hell.',
            'МРТ «слушает» ядра водорода. В компактной кости почти нет подвижной воды, и она остаётся тёмной. Мягкие ткани различаются протонной плотностью, T1 и T2, поэтому МРТ чётко их разделяет. Переключай PD, T1 и T2: ликвор на T1 тёмный, а на T2 светлый.',
          )}
        </p>
        <div className="stat-grid two">
          <Stat label={tr('Kontrast Grau/Weiß CT', 'Контраст серое/белое КТ')} value={fmt(ctContrast * 100, 1)} unit="%" tone="warn" />
          <Stat label={tr(`Kontrast Grau/Weiß MRT ${mr}`, `Контраст серое/белое МРТ ${mr}`)} value={fmt(mrContrast * 100, 1)} unit="%" tone="good" />
          <Stat label={tr('Knochen im CT', 'Кость на КТ')} value={tr('hell', 'светлая')} sub={`${fmt(HU.bone, 0)} HU`} />
          <Stat label={tr('Knochen im MRT', 'Кость на МРТ')} value={tr('dunkel', 'тёмная')} sub={tr('kaum Signal', 'почти нет сигнала')} />
        </div>
        <p className="small muted">
          {tr(
            'Kennwert: Michelson-Kontrast |a − b| / (a + b) der Grauwerte von grauer (a) und weißer Substanz (b). CT im Weichteilfenster (Zentrum 40 HU, Breite 400 HU), MRT bei 1,5 T.',
            'Показатель: контраст Майкельсона |a − b| / (a + b) по уровням серого для серого (a) и белого вещества (b). КТ в мягкотканном окне (центр 40 HU, ширина 400 HU), МРТ при 1,5 Тл.',
          )}
        </p>
        <Callout
          variant="achtung"
          title={tr('Didaktisch vereinfacht', 'Упрощённая учебная модель')}
          text={tr(
            'Die HU-Werte sind gerundete Lehrwerte, die Bilder haben weder Rauschen noch Artefakte. Ein enges Hirnfenster in der echten CT zeigt Grau und Weiß etwas besser, der Unterschied bleibt aber klein. Die MRT-Signale stammen aus den Relaxationszeiten des Simulators.',
            'Значения HU это округлённые учебные значения, на изображениях нет ни шума, ни артефактов. Узкое мозговое окно в настоящей КТ показывает серое и белое вещество немного лучше, но разница остаётся небольшой. Сигналы МРТ рассчитаны по временам релаксации симулятора.',
          )}
        />
      </Panel>
    </>
  );
}

function ModalityGame() {
  const { tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<Modality | null>(null);
  const [gainedXp, setGainedXp] = useState(false);
  const [score, setScore] = useState(0);
  const done = index >= CASES.length;
  const current = CASES[Math.min(index, CASES.length - 1)];
  const correct = choice !== null && current.accept.includes(choice);
  const names = (ids: Modality[]) => ids.map((id) => loc(MODALITIES.find((m) => m.id === id)!.label)).join(tr(' oder ', ' или '));

  const answer = (m: Modality) => {
    if (choice !== null) return;
    setChoice(m);
    if (current.accept.includes(m)) {
      setScore((s) => s + 1);
      setGainedXp(!state.flags[`modality-${current.id}`]);
      dispatch({ type: 'FLAG', flag: `modality-${current.id}`, xp: 5 });
    }
  };
  const next = () => {
    setChoice(null);
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setChoice(null);
    setScore(0);
    setIndex(0);
  };

  if (done) {
    const ratio = score / CASES.length;
    return (
      <Panel title={tr('Ergebnis', 'Результат')} className="span-3">
        <div className="stat-grid two">
          <Stat label={tr('Richtig zugeordnet', 'Верно подобрано')} value={`${score} / ${CASES.length}`} tone={ratio >= 0.75 ? 'good' : ratio >= 0.5 ? 'warn' : 'bad'} />
          <Stat label="XP" value={tr('je 5 XP', 'по 5 XP')} sub={tr('einmal pro richtig gelöstem Fall', 'один раз за каждый верно решённый случай')} />
        </div>
        <p>
          {ratio >= 0.75
            ? tr('Stark! Du verbindest die klinische Frage schon sicher mit dem Messprinzip.', 'Отлично! Ты уже уверенно связываешь клинический вопрос с принципом измерения.')
            : tr('Guter Anfang. Frag dich bei jedem Fall: Was muss sichtbar werden, Dichte, Weichteil, Schallecho oder Stoffwechsel?', 'Хорошее начало. В каждом случае спрашивай себя: что должно стать видимым, плотность, мягкая ткань, эхо звука или обмен веществ?')}
        </p>
        <Callout
          variant="klinik"
          title={tr('Lernspiel, keine Leitlinie', 'Учебная игра, а не клиническая рекомендация')}
          text={tr(
            'Die Zuordnungen zeigen typische Stärken der Verfahren. In der Klinik entscheiden die genaue Fragestellung, die Situation der behandelten Person, die Verfügbarkeit und die Leitlinien.',
            'Сопоставления показывают типичные сильные стороны методов. В клинике решают точный вопрос, ситуация человека, которого лечат, доступность и клинические рекомендации.',
          )}
        />
        <div className="row gap">
          <button className="btn primary" type="button" onClick={restart}>
            {tr('Nochmal', 'Ещё раз')}
          </button>
        </div>
      </Panel>
    );
  }

  const optionState = (m: Modality) => {
    if (choice === null) return '';
    if (current.accept.includes(m)) return 'correct';
    if (m === choice) return 'wrong';
    return 'dim';
  };
  const promptId = `modlab-${current.id}`;

  return (
    <Panel
      title={tr(`Fall ${index + 1} von ${CASES.length}`, `Случай ${index + 1} из ${CASES.length}`)}
      className="span-3"
      actions={<span className="small muted">{tr(`Punkte: ${score}`, `Очки: ${score}`)}</span>}
    >
      <p className="question-prompt" id={promptId}>
        {loc(current.prompt)}
      </p>
      <div className="options" role="radiogroup" aria-labelledby={promptId}>
        {MODALITIES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={choice === m.id}
            className={`option ${optionState(m.id)}`}
            disabled={choice !== null}
            onClick={() => answer(m.id)}
          >
            <span className="option-marker" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="option-content">
              <strong>{loc(m.label)}</strong>
              <span className="option-result">{loc(m.principle)}</span>
            </span>
          </button>
        ))}
      </div>
      {choice !== null && (
        <div className={`feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
          <strong>
            {correct ? `✔ ${tr('Passt!', 'Подходит!')}${gainedXp ? ' +5 XP' : ''}` : tr(`Nicht ganz. Passend wäre: ${names(current.accept)}.`, `Не совсем. Подходит: ${names(current.accept)}.`)}
          </strong>
          {correct && current.accept.length > 1 && (
            <p>{tr(`Hier sind mehrere Verfahren sinnvoll: ${names(current.accept)}.`, `Здесь разумны несколько методов: ${names(current.accept)}.`)}</p>
          )}
          <p>
            <RichText text={loc(current.why)} />
          </p>
          <button className="btn primary" type="button" onClick={next}>
            {index + 1 >= CASES.length ? tr('Ergebnis ansehen →', 'Посмотреть результат →') : tr('Nächster Fall →', 'Следующий случай →')}
          </button>
        </div>
      )}
    </Panel>
  );
}
