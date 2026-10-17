import { useMemo, useState } from 'react';
import { Link } from '../components/router';
import { ClinicalAtlas } from '../components/ClinicalAtlas';
import { RichText, TeX } from '../components/RichText';
import { Callout, Panel, ProgressBar } from '../components/ui';
import { lectureExperimentPath, LECTURE_CONTEXT_PAGES, LECTURE_LESSONS, LECTURE_SOURCE, type LectureLesson } from '../content/lecture';
import { ALL_SIMULATORS, MODULE_BY_ID } from '../content/modules';
import { materialize } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { useLang } from '../i18n/LanguageContext';
import { SIMULATOR_BY_ID } from '../simulators/registry';

function Lesson({ lesson }: { lesson: LectureLesson }) {
  const { lang, tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const seed = [...lesson.id].reduce((s,c)=>s*31+c.charCodeAt(0),1)>>>0;
  const q = useMemo(()=>materialize({source:lesson.question,seed,shuffleSeed:seed},lang),[lesson,seed,lang]);
  const correct = q.kind==='mc' && choice===q.answer;
  const done = !!state.flags[`lecture-${lesson.id}`];
  const index = LECTURE_LESSONS.indexOf(lesson), next = LECTURE_LESSONS[index+1];
  return <>
    <header className="lecture-heading"><p className="eyebrow">MBR · {index+1}/{LECTURE_LESSONS.length} · PDF {lesson.pages.join(', ')}</p><h1>{loc(lesson.title)}</h1><p className="lead">{loc(lesson.text)}</p></header>
    {lesson.formula&&<div className="formula"><TeX tex={lesson.formula} block /></div>}
    <ClinicalAtlas key={lesson.id} id={lesson.id} />
    <Panel title={tr('Dein Experiment', 'Твой эксперимент')} className="lecture-mission"><p>{loc(lesson.experiment)}</p><Link className="btn primary" to={lectureExperimentPath(lesson)}>{loc(SIMULATOR_BY_ID[lesson.simulator].title)} →</Link><p className="small muted">{tr('Kehre danach zu dieser Mission zurück. Dein Wissenscheck bleibt als Abschluss gespeichert.', 'Затем вернись к миссии. Успешная проверка знаний сохранится как завершение.')}</p></Panel>
    <Panel title={tr('Wissen anwenden', 'Применить знания')}>
      <h2><RichText text={q.prompt} /></h2>
      {q.kind==='mc'&&<div className="lecture-answers" role="group" aria-label={tr('Antwort wählen','Выбор ответа')}>{q.options.map((option,i)=><button className={`btn${choice===i?' primary':''}`} type="button" key={i} aria-pressed={choice===i} disabled={checked} onClick={()=>setChoice(i)}><RichText text={option} /></button>)}</div>}
      {!checked?<button type="button" className="btn primary" disabled={choice===null} onClick={()=>{setChecked(true); if(correct)dispatch({type:'FLAG',flag:`lecture-${lesson.id}`,xp:15});}}>{tr('Antwort prüfen','Проверить ответ')}{!done?' · +15 XP':''}</button>:<><Callout variant={correct?'merke':'achtung'} title={correct?tr('Richtig – Mission geschafft!','Верно — миссия выполнена!'):tr('Noch nicht. Schau dir die Begründung an.','Пока нет. Прочитай объяснение.')} text={q.explanation} />{!correct&&<button className="btn" type="button" onClick={()=>{setChoice(null);setChecked(false);}}>{tr('Erneut versuchen','Попробовать снова')}</button>}</>}
      {done&&<p className="ok-text">✓ {tr('Wissenscheck gespeichert. Wiederholen ist jederzeit möglich.', 'Проверка знаний сохранена. Можно повторять в любое время.')}</p>}
    </Panel>
    <div className="lecture-links"><Link className="btn" to={`/modul/${lesson.module}/theorie`}>{loc(MODULE_BY_ID[lesson.module].title)} · {tr('Vertiefung','Подробнее')}</Link>{next&&<Link className="btn primary" to={`/vorlesung/${next.id}`}>{tr('Nächste Mission','Следующая миссия')} →</Link>}</div>
  </>;
}

export function LecturePage({ lessonId }: { lessonId?: string }) {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const lesson = LECTURE_LESSONS.find(l=>l.id===lessonId);
  const completed = LECTURE_LESSONS.filter(l=>state.flags[`lecture-${l.id}`]).length;
  const next = LECTURE_LESSONS.find(l=>!state.flags[`lecture-${l.id}`]);
  return <div className="page lecture-page">
    {lessonId&&<Link to="/vorlesung" className="back-link">← {tr('Zum Vorlesungs-Lernpfad','К учебному пути лекции')}</Link>}
    {lesson?<Lesson key={lesson.id} lesson={lesson} />:<>
      <header className="lecture-hero"><p className="eyebrow">MBR · MRI · ZHAW</p><h1>{tr('Die Vorlesung. Jetzt spielbar.', 'Лекция. Теперь в игре.')}</h1><p className="lead">{tr('Vom einzelnen Spin bis zur Traktografie: Alle fachlichen Themen deiner 72-seitigen Vorlage sind als Lernmissionen mit Quellenbezug, Experiment und Wissenscheck aufbereitet.', 'От отдельного спина до трактографии: все учебные темы 72-страничной лекции представлены миссиями с источниками, экспериментом и проверкой знаний.')}</p><div className="stats-grid"><div><strong>{LECTURE_LESSONS.length}</strong><span>{tr('Missionen','миссий')}</span></div><div><strong>{ALL_SIMULATORS.length}</strong><span>{tr('Simulatoren','симуляторов')}</span></div><div><strong>{completed}/{LECTURE_LESSONS.length}</strong><span>{tr('Wissenschecks geschafft','проверок пройдено')}</span></div></div><ProgressBar value={completed/LECTURE_LESSONS.length} label={tr('Vorlesungsfortschritt','Прогресс лекции')} />{next&&<Link className="btn primary" to={`/vorlesung/${next.id}`}>{tr('Nächste Mission','Следующая миссия')}: {loc(next.title)} →</Link>}</header>
      <div className="lecture-path">{LECTURE_LESSONS.map((l,i)=><Link key={l.id} to={`/vorlesung/${l.id}`} className={`lecture-card${state.flags[`lecture-${l.id}`]?' completed':''}`}><span className="lecture-number">{state.flags[`lecture-${l.id}`]?'✓':String(i+1).padStart(2,'0')}</span><div><p className="eyebrow">PDF {l.pages.join(', ')}</p><h2>{loc(l.title)}</h2><p>{loc(l.experiment)}</p><span className="small muted">{loc(SIMULATOR_BY_ID[l.simulator].title)}</span></div><span aria-hidden="true">→</span></Link>)}</div>
      {lessonId&&<p role="status">{tr('Diese Mission wurde nicht gefunden. Wähle eine Mission aus der Liste.', 'Миссия не найдена. Выбери миссию из списка.')}</p>}
      <Panel title={tr('Quelle und vollständiger Seitenabgleich','Источник и полный указатель страниц')}>
        <p><strong>{LECTURE_SOURCE.filename}</strong> · {LECTURE_SOURCE.title}<br/>{LECTURE_SOURCE.author}</p>
        <p>{tr(`Die PDF-Seiten ${LECTURE_CONTEXT_PAGES.join(', ')} enthalten Titel, Kontakt, Inhaltsübersicht, Lernziele, Literatur und eine Fragen-Trennseite. Alle anderen Seiten sind oben mindestens einer fachlichen Mission zugeordnet. Wiederholte Folien werden zusammengeführt.`, `Страницы PDF ${LECTURE_CONTEXT_PAGES.join(', ')} содержат титул, контакты, содержание, цели, литературу и разделитель вопросов. Все остальные страницы связаны с одной или несколькими миссиями выше. Повторяющиеся слайды объединены.`)}</p>
        <p>{tr('Die Lehrtexte, Diagramme und Simulationen sind neu aufbereitet. Originale Patientendarstellungen und Abbildungen Dritter werden nicht als Diagnosebilder nachgebaut. Die Fallkarten erklären die Fragestellungen der Folien.', 'Тексты, диаграммы и симуляции подготовлены заново. Исходные изображения пациентов и сторонние иллюстрации не воспроизводятся как диагностические снимки. Карточки объясняют задачи со слайдов.')}</p>
        <ul>{LECTURE_SOURCE.bibliography.map(b=><li key={b.title}>{'url' in b?<a href={b.url} target="_blank" rel="noreferrer">{b.title}</a>:<>{b.title} · ISBN {b.isbn}</>}</li>)}</ul>
        <Callout variant="info" title={tr('Bewusst präzisiert','Уточнения')} text={tr('Frequenz f und Kreisfrequenz ω werden getrennt. Im 2D-Exponent steht kₓx+kᵧy. Linienbreite bezieht sich auf das absorptive Spektrum und normalerweise T₂*. Fourier-Normierungen werden konsistent verwendet. Einzelne klinische Beispiele begründen keine allgemeinen Diagnosen oder Dosisempfehlungen.', 'Частота f и угловая частота ω разделены. В 2D-показателе стоит kₓx+kᵧy. Ширина относится к спектру поглощения и обычно T₂*. Нормировки Фурье согласованы. Отдельные клинические примеры не задают общие диагнозы и рекомендации доз.')} />
      </Panel>
    </>}
  </div>;
}
