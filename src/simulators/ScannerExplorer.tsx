import { useState, type KeyboardEvent } from 'react';
import { Panel } from '../components/ui';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';

type ComponentId = 'cage' | 'cryostat' | 'coils' | 'coldhead' | 'quench' | 'shim' | 'gradient' | 'body' | 'surface' | 'table' | 'patient';

interface ComponentInfo {
  title: string;
  facts: string[];
}

const INFO: Record<ComponentId, ComponentInfo> = {
  cage: {
    title: 'HF-Kabine (Faradaykäfig)',
    facts: [
      'Kupfer-/Aluminiumverkleidung von Wänden, Decke, Boden und Tür.',
      'Schirmt UKW, Funk und Mobilfunk ab – das MR-Signal liegt im µV-Bereich bei 64–128 MHz.',
      'Kabel werden über eine Filterplatte bzw. Wellenleiter hindurchgeführt. Offene Tür → Zipper-Artefakte.',
    ],
  },
  cryostat: {
    title: 'Kryostat (Vakuumbehälter)',
    facts: [
      'Mehrlagige Isolation: Vakuum, Strahlungsschilde, Heliumbad.',
      'Hält die supraleitenden Spulen bei 4,2 K bei Raumtemperatur außen.',
      'Wirbelströme in der Kryostatwand werden durch abgeschirmte Gradienten minimiert.',
    ],
  },
  coils: {
    title: 'Supraleitende Hauptfeldspulen',
    facts: [
      'NbTi-Filamente in Kupfermatrix, supraleitend unter ≈ 9 K.',
      'Persistent Mode: einige hundert Ampere fließen verlustfrei, das Feld ist permanent aktiv.',
      'Aktive Abschirmspulen (außen, gegensinnig) reduzieren das Streufeld.',
      'Homogenität: wenige ppm über 40–50 cm DSV.',
    ],
  },
  coldhead: {
    title: 'Kaltkopf (Cryocooler)',
    facts: [
      'Gifford-McMahon- oder Pulsrohrkühler mit Heliumkompressor.',
      'Rekondensiert verdampfendes Helium → „Zero Boil-Off“.',
      'Typisches Klopfgeräusch auch ohne Messung; Ausfall führt langsam zu Heliumverlust.',
    ],
  },
  quench: {
    title: 'Quenchrohr',
    facts: [
      'Leitet bei einem Quench das schlagartig verdampfende Helium (≈ 700 L Gas pro L flüssig) ins Freie.',
      'Gefahr bei Fehlfunktion: Sauerstoffverdrängung und Kälteverbrennungen im Raum.',
      'Raum-Sauerstoffsensoren und Notabluft gehören zur Sicherheitsausstattung.',
    ],
  },
  shim: {
    title: 'Shimsystem',
    facts: [
      'Passiv: Eisenplättchen bei Installation.',
      'Aktiv: Shimspulen 2./3. Ordnung + Gradienten-Offsets (1. Ordnung), vor jeder Messung patientenspezifisch.',
      'Entscheidend für Fettsättigung, EPI, Spektroskopie.',
    ],
  },
  gradient: {
    title: 'Gradientenspulen (x, y, z)',
    facts: [
      'Erzeugen ortsabhängige Zusatzfelder ∂Bz/∂x, ∂Bz/∂y, ∂Bz/∂z – Basis der Ortskodierung.',
      'Typisch 40–80 mT/m, Slew-Rate bis 200 T/m/s, wassergekühlt.',
      'Lorentzkräfte → Lärm > 110 dB(A); dB/dt kann Nerven stimulieren (PNS).',
    ],
  },
  body: {
    title: 'HF-Körperspule (Birdcage)',
    facts: [
      'Sendet ein homogenes, zirkular polarisiertes B₁-Feld.',
      'Leistungsverstärker 15–35 kW; die SAR-Überwachung begrenzt die Sendeleistung.',
      'Ab 3 T: dielektrische Effekte, Abhilfe durch Mehrkanal-Senden (pTx, B₁-Shimming).',
    ],
  },
  surface: {
    title: 'Lokale Empfangsspule (Phased Array)',
    facts: [
      'Viele kleine Elemente nah an der Anatomie → hohes SNR.',
      'Unterschiedliche Sensitivitätsprofile ermöglichen parallele Bildgebung (SENSE/GRAPPA).',
      'Wird beim Senden verstimmt (Detuning) – Kabel nie in Schlaufen legen!',
    ],
  },
  table: {
    title: 'Patiententisch',
    facts: ['Fährt die Untersuchungsregion ins Isozentrum (beste Homogenität und Gradientenlinearität).', 'Spulenanschlüsse sind im Tisch integriert.', 'Bei großen Untersuchungsbereichen: Move-during-scan bzw. mehrere Stationen.'],
  },
  patient: {
    title: 'Patient:in im Isozentrum',
    facts: [
      'Ist selbst Hauptrauschquelle (leitfähiges Gewebe) und verändert durch Suszeptibilität das Feld.',
      'Gehörschutz, Notrufball und Kommunikation sind Pflicht.',
      'Hautkontakt-Schleifen vermeiden (Verbrennungsgefahr durch induzierte Ströme).',
    ],
  },
};

const QUIZ: Array<{ question: string; answer: ComponentId }> = [
  { question: 'Welche Komponente erzeugt die linear ortsabhängigen Felder zur Ortskodierung?', answer: 'gradient' },
  { question: 'Wo entweicht das Helium bei einem Quench?', answer: 'quench' },
  { question: 'Was verhindert, dass Radiosender das MR-Signal stören?', answer: 'cage' },
  { question: 'Welche Komponente sendet typischerweise den homogenen HF-Puls?', answer: 'body' },
  { question: 'Womit wird B₀ patientenspezifisch homogenisiert?', answer: 'shim' },
  { question: 'Welche Komponente liefert das höchste SNR beim Empfang?', answer: 'surface' },
  { question: 'Was rekondensiert verdampfendes Helium?', answer: 'coldhead' },
  { question: 'Wo fließt der Strom im Persistent Mode?', answer: 'coils' },
];

export function ScannerExplorer() {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const click = (id: ComponentId) => {
    setSelected(id);
    if (!quizMode) return;
    const q = QUIZ[qIdx];
    const ok = id === q.answer;
    const xp = ok ? answerXp(1, state.stats.streak + 1, false, false) : 0;
    dispatch({ type: 'ANSWER', correct: ok, xp, hintUsed: false });
    setFeedback(ok ? `✔ Richtig: ${INFO[id].title} (+${xp} XP)` : `✘ Das ist ${INFO[id].title}. Gesucht: ${INFO[q.answer].title}.`);
    setQIdx((i) => (i + 1) % QUIZ.length);
  };

  const cls = (id: ComponentId) => `sx-part${selected === id ? ' active' : ''}`;
  const part = (id: ComponentId) => ({
    className: cls(id),
    onClick: () => click(id),
    role: 'button',
    tabIndex: 0,
    'aria-label': INFO[id].title,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        click(id);
      }
    },
  });

  return (
    <div className="sim-grid">
      <Panel
        title="Querschnitt eines 1,5/3-T-Scanners (Blick in den Tunnel)"
        className="span-2"
        actions={
          <button className={`btn small${quizMode ? ' primary' : ''}`} type="button" onClick={() => {
              setQuizMode((q) => !q);
              setFeedback(null);
            }}>
            {quizMode ? 'Quiz beenden' : '🎯 Such-Quiz starten'}
          </button>
        }
      >
        {quizMode && <p className="quiz-prompt">🔎 {QUIZ[qIdx].question}</p>}
        {feedback && <p className={feedback.startsWith('✔') ? 'ok-text' : 'bad-text'}>{feedback}</p>}
        <svg viewBox="0 0 600 470" className="scanner-svg">
          <rect x="8" y="8" width="584" height="454" rx="10" {...part('cage')} />
          <text x="20" y="30" className="sx-label">HF-Kabine</text>
          <rect x="285" y="8" width="30" height="62" {...part('quench')} />
          <rect x="250" y="40" width="44" height="40" rx="6" {...part('coldhead')} />
          <circle cx="300" cy="260" r="180" {...part('cryostat')} />
          <circle cx="300" cy="260" r="160" className="sx-gap" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
            return <rect key={i} x={300 + Math.cos(a) * 168 - 9} y={260 + Math.sin(a) * 168 - 9} width="18" height="18" rx="3" {...part('coils')} />;
          })}
          <circle cx="300" cy="260" r="148" {...part('shim')} />
          <circle cx="300" cy="260" r="138" {...part('gradient')} />
          <circle cx="300" cy="260" r="112" {...part('body')} />
          <circle cx="300" cy="260" r="100" className="sx-bore" />
          <rect x="215" y="318" width="170" height="16" rx="4" {...part('table')} />
          <ellipse cx="300" cy="282" rx="70" ry="36" {...part('patient')} />
          <path d="M235 258 Q300 220 365 258" fill="none" strokeWidth="10" strokeLinecap="round" {...part('surface')} />
        </svg>
        <p className="small muted">Klicke auf eine Komponente (Tastatur: Tab + Enter). Von außen nach innen: Kabine → Kryostat mit Spulen → Shim → Gradienten → HF-Körperspule → Tunnel.</p>
      </Panel>
      <Panel title={selected ? INFO[selected].title : 'Komponente wählen'}>
        {selected ? (
          <ul className="fact-list">
            {INFO[selected].facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Wähle im Querschnitt eine Komponente aus, um ihre Funktion, typische Kennzahlen und Sicherheitsaspekte zu sehen.</p>
        )}
      </Panel>
    </div>
  );
}
