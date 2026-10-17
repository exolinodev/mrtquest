import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Callout, Panel, Segmented, Slider, Stat } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { blochTrajectory, linewidthHz, lorentzAbsorption } from '../physics/lecture';

export function SignalLab() {
  const { tr } = useLang();
  const [mode, setMode] = useState<'bloch' | 'spectrum'>(()=>window.location.hash.endsWith('/spectrum')?'spectrum':'bloch');
  const [flip, setFlip] = useState(90), [offset, setOffset] = useState(0);
  const [t1, setT1] = useState(600), [t2, setT2] = useState(80);
  const [time, setTime] = useState(2), [phase, setPhase] = useState(0), [freq, setFreq] = useState(20);
  const trajectory = useMemo(() => blochTrajectory(flip, offset, t1, t2), [flip, offset, t1, t2]);
  const current = trajectory.reduce((best, p) => Math.abs(p.t - time) < Math.abs(best.t - time) ? p : best).m;
  const [mx, my, mz] = current;
  const project = (v: number[]) => [200 + v[0] * 110 + v[1] * 65, 185 + v[1] * 30 - v[2] * 110];
  const tip = project(current);
  const phi = phase * Math.PI / 180;
  return <div className="lecture-lab">
    <Segmented label={tr('Experiment', 'Эксперимент')} value={mode} onChange={setMode} options={[{ value: 'bloch', label: tr('Bloch-Dynamik', 'Динамика Блоха') }, { value: 'spectrum', label: tr('FID → Spektrum', 'FID → спектр') }]} />
    {mode === 'bloch' ? <>
      <Panel title={tr('Ein Puls. Drei Komponenten.', 'Один импульс. Три компоненты.')} className="lecture-stage">
        <svg viewBox="0 0 400 340" role="img" aria-label={tr('Magnetisierungsvektor im rotierenden Bezugssystem', 'Вектор намагниченности во вращающейся системе')}>
          <ellipse cx="200" cy="185" rx="140" ry="46" fill="#38bdf80a" stroke="#38bdf855" />
          {[[1.4,0,0,'x′'],[0,1.6,0,'y′'],[0,0,1.4,'z']].map(([x,y,z,label]) => { const p = project([+x,+y,+z]); return <g key={label}><line x1="200" y1="185" x2={p[0]} y2={p[1]} stroke="#657490" /><text x={p[0]} y={p[1]-8} fill="#bbc8df">{label}</text></g>; })}
          <polyline fill="none" stroke="#a78bfa66" strokeWidth="1.6" points={trajectory.filter(p => p.t <= time).map(p => project(p.m).join(',')).join(' ')} />
          <line x1="200" y1="185" x2={tip[0]} y2={tip[1]} stroke="#34d399" strokeWidth="6" strokeLinecap="round" /><circle cx={tip[0]} cy={tip[1]} r="7" fill="#34d399" />
          <text x="20" y="325" fill="#99aecb">{tr('Rotierendes Bezugssystem · M₀ = 1', 'Вращающаяся система · M₀ = 1')}</text>
        </svg>
        <Slider label={tr('Zeit nach Pulsbeginn', 'Время от начала импульса')} value={time} min={0} max={400} step={0.5} unit="ms" onChange={setTime} />
        <div className="stats-grid"><Stat label="Mx" value={mx.toFixed(3)} /><Stat label="My" value={my.toFixed(3)} /><Stat label="Mz" value={mz.toFixed(3)} /></div>
      </Panel>
      <Panel title={tr('Experiment steuern', 'Управление экспериментом')}>
        <Segmented label={tr('HF-Puls (2 ms)', 'РЧ-импульс (2 мс)')} value={flip} onChange={setFlip} options={[30,90,180].map(v=>({value:v,label:`${v}°`}))} />
        <Slider label={tr('Off-Resonanz', 'Отстройка от резонанса')} value={offset} min={-200} max={200} step={5} unit="Hz" onChange={setOffset} />
        <Slider label="T₁" value={t1} min={100} max={2000} step={50} unit="ms" onChange={setT1} /><Slider label="T₂" value={t2} min={10} max={100} step={5} unit="ms" onChange={setT2} />
      </Panel>
      <Panel title={tr('Numerisch integrierte Bloch-Gleichungen', 'Численное интегрирование уравнений Блоха')}>
        <LineChart ariaLabel={tr('Zeitverlauf von Mx, My und Mz', 'Mx, My и Mz во времени')} series={['Mx','My','Mz'].map((label,i)=>({id:label,label,color:['#38bdf8','#a78bfa','#34d399'][i],points:trajectory.map(p=>[p.t,p.m[i]])}))} xDomain={[0,400]} yDomain={[-1.05,1.05]} xLabel="t / ms" yLabel="M / M₀" markers={[{x:time,label:'t'}]} />
        <p className="muted small">{tr('RK4-Integration im rotierenden System. Rechteckpuls, konstantes M₀, ein isochromates Spinensemble; keine Diffusion und keine Verteilung von Feldinhomogenitäten.', 'RK4 во вращающейся системе. Прямоугольный импульс, постоянное M₀, изохроматический ансамбль; без диффузии и распределения неоднородностей поля.')}</p>
      </Panel>
    </> : <>
      <Panel title={tr('Kurzer FID. Breite Linie.', 'Короткий FID. Широкая линия.')} className="lecture-stage">
        <LineChart ariaLabel={tr('Komplexer FID mit I- und Q-Kanal', 'Комплексный FID с каналами I и Q')} series={[
          {id:'I',label:'I',color:'#38bdf8',points:sampleCurve(t=>Math.exp(-t/t2)*Math.cos(2*Math.PI*freq*t/1000+phi),[0,300],400)},
          {id:'Q',label:'Q',color:'#a78bfa',points:sampleCurve(t=>Math.exp(-t/t2)*Math.sin(2*Math.PI*freq*t/1000+phi),[0,300],400)},
          {id:'env',label:tr('Hüllkurve','Огибающая'),color:'#34d399',dashed:true,points:sampleCurve(t=>Math.exp(-t/t2),[0,300])},
        ]} xDomain={[0,300]} yDomain={[-1.05,1.05]} xLabel="t / ms" />
        <LineChart ariaLabel={tr('Phasenkorrigierte absorptive Lorentz-Linie', 'Фазокорректированная лоренцева линия поглощения')} series={[{id:'lorentz',label:tr('Absorption (phasenkorrigiert)','Поглощение (фазокоррекция)'),color:'#f472b6',points:sampleCurve(f=>lorentzAbsorption(f,freq,t2),[-80,80],500)}]} xDomain={[-80,80]} yDomain={[0,1.05]} xLabel={tr('Frequenzoffset / Hz', 'Частотная отстройка / Гц')} markers={[{x:freq-linewidthHz(t2)/2,label:'½'},{x:freq+linewidthHz(t2)/2,label:'½'}]} />
        <div className="stats-grid"><Stat label="T₂*" value={t2} unit="ms" /><Stat label="FWHM" value={linewidthHz(t2).toFixed(2)} unit="Hz" /></div>
      </Panel>
      <Panel title={tr('Signal verändern', 'Изменение сигнала')}><Slider label={tr('FID-Zerfallszeit T₂*', 'Время затухания FID T₂*')} value={t2} min={10} max={100} unit="ms" onChange={setT2} /><Slider label={tr('Frequenzoffset', 'Частотная отстройка')} value={freq} min={-40} max={40} unit="Hz" onChange={setFreq} /><Slider label={tr('Anfangsphase', 'Начальная фаза')} value={phase} min={-180} max={180} unit="°" onChange={setPhase} /></Panel>
      <TeX tex="\\Delta f=1/(\\pi T_2^*)" block />
      <Callout variant="achtung" title={tr('Welche Linienbreite?', 'Какая ширина линии?')} text={tr('Gezeigt ist die analytische Fourier-Transformation eines unendlich beobachteten exponentiellen FID, phasenkorrigiert als Absorptionslinie. Der Zeitplot zeigt nur die ersten 300 ms. Inhomogenitäten und andere Verbreiterungen sind in T₂* zusammengefasst. Nur im ideal homogenen Grenzfall gilt T₂*=T₂. Das Betragsspektrum hat eine andere FWHM.', 'Показано аналитическое преобразование бесконечного экспоненциального FID с фазокоррекцией как линия поглощения. Временной график ограничен первыми 300 мс. Неоднородности и другое уширение объединены в T₂*. Только в идеально однородном пределе T₂*=T₂. FWHM спектра модуля отличается.')} />
    </>}
  </div>;
}
