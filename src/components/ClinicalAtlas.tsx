import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import type { Loc } from '../i18n/format';
import { Panel, Segmented } from './ui';

const L=(de:string,ru:string):Loc=>({de,ru});
const REGIONS: Record<string,{title:Loc;regions:{label:Loc;text:Loc}[]}>={
  brain:{title:L('Axial: Wasser wird sichtbar','Аксиально: вода становится видимой'),regions:[
    {label:L('Liquor','Ликвор'),text:L('Wasserreiche Ventrikel: bei konventioneller T₂-Gewichtung typischerweise hell. FLAIR unterdrückt diesen Anteil gezielt.','Желудочки с ликвором обычно яркие при стандартном T₂-взвешивании. FLAIR специально подавляет этот компонент.')},
    {label:L('Hirngewebe','Ткань мозга'),text:L('Die Differenzierung von Geweben hängt von PD, T₁, T₂ und den Sequenzparametern ab.','Различение тканей зависит от PD, T₁, T₂ и параметров последовательности.')},
    {label:L('Knochenrand','Костный контур'),text:L('Kortikaler Knochen hat wenig konventionell messbares Signal und erscheint hier als dunkler Rand.','Кортикальная кость даёт мало сигнала при обычных последовательностях и показана тёмным контуром.')},
  ]},
  knee:{title:L('Sagittal: Blick von der Seite','Сагиттально: вид сбоку'),regions:[
    {label:L('Knochenenden','Концы костей'),text:L('Femur und Tibia begrenzen den Gelenkspalt. Knochenmark und kortikale Schale besitzen unterschiedliche MR-Eigenschaften.','Бедренная и большеберцовая кости ограничивают суставную щель. Костный мозг и кортикальная оболочка имеют разные МР-свойства.')},
    {label:L('Meniskus','Мениск'),text:L('Der schematische Keil liegt zwischen den Gelenkflächen. Die Beurteilung braucht mehrere Schnitte und passende Sequenzen.','Схематический клин находится между суставными поверхностями. Для оценки нужны несколько срезов и подходящие последовательности.')},
    {label:L('Bandstruktur','Связочная структура'),text:L('Bänder lassen sich über Verlauf und Gewebekontrast orientieren. Das Schema zeigt keine Verletzung und ersetzt kein anatomisches Atlasbild.','Связки различают по ходу и контрасту ткани. Схема не показывает повреждение и не заменяет анатомический атлас.')},
  ]},
  pelvis:{title:L('Becken: Lagebeziehungen verstehen','Таз: понять взаимное положение'),regions:[
    {label:L('Uterus','Матка'),text:L('Die nach hinten gerichtete Lage ist als Retroversion beschrieben. Die Lage allein begründet keine Erkrankung.','Наклон назад называется ретроверсией. Само положение не доказывает заболевание.')},
    {label:L('Harnblase','Мочевой пузырь'),text:L('Die Harnblase liegt vor dem Uterus und hilft bei der Orientierung im sagittalen Bild.','Мочевой пузырь расположен спереди от матки и помогает ориентироваться на сагиттальном изображении.')},
    {label:L('Wirbelsäule','Позвоночник'),text:L('Die Wirbelsäule markiert die hintere Körperseite; sagittal zeigt die Lage in der vorn-hinten-Richtung.','Позвоночник обозначает заднюю сторону тела; сагиттальный срез показывает переднезадние отношения.')},
  ]},
  pregnancy:{title:L('Schwangerschaft: getrennte Fragestellungen','Беременность: разные задачи'),regions:[
    {label:L('Fetus','Плод'),text:L('Strukturaufnahmen können die fetale Anatomie darstellen. Dieses vereinfachte Schema dient nur der räumlichen Orientierung.','Структурная МРТ может показывать анатомию плода. Эта упрощённая схема служит только для ориентации.')},
    {label:L('Plazenta','Плацента'),text:L('Plazentalage und mögliche Invasionszeichen sind strukturelle Fragen. Eine Diagnose benötigt vollständige klinische Untersuchung.','Положение плаценты и возможные признаки инвазии — структурные вопросы. Диагноз требует полного клинического обследования.')},
    {label:L('Kompartimente','Компартменты'),text:L('Die Farben unterscheiden schematisch Gewebe, Gefäße und intervillösen Raum. Funktionelle Karten benötigen ein validiertes Messmodell.','Цвета схематически различают ткань, сосуды и межворсинчатое пространство. Функциональные карты требуют валидированной измерительной модели.')},
  ]},
  hybrid:{title:L('Gleiche Geometrie. Andere Information.','Та же геометрия. Другая информация.'),regions:[
    {label:L('PET','ПЭТ'),text:L('Die farbige Region steht hier symbolisch für Traceraufnahme. PET misst keine MR-Relaxationszeiten.','Цветная область символизирует накопление трейсера. ПЭТ не измеряет времена МР-релаксации.')},
    {label:L('MRT','МРТ'),text:L('Die Grauwertstruktur steht für anatomischen Weichteilkontrast. Es handelt sich um ein künstliches Schema.','Серая структура обозначает анатомический мягкотканный контраст. Это искусственная схема.')},
    {label:L('Fusion','Совмещение'),text:L('Die Überlagerung verbindet funktionelle und anatomische Information. Korrekte Registrierung ist dafür entscheidend.','Совмещение объединяет функциональную и анатомическую информацию. Важна правильная регистрация.')},
  ]},
};

export function ClinicalAtlas({id}:{id:string}){
  const {tr,loc}=useLang();
  const [region,setRegion]=useState(0);
  const model=REGIONS[id];
  if(!model)return null;
  const fill=(i:number)=>region===i?'#38bdf8':'#53657e';
  return <Panel className="lecture-stage" title={loc(model.title)}>
    <svg viewBox="0 0 500 330" role="img" aria-label={tr('Schematische anatomische Orientierung, keine diagnostische Aufnahme','Схематическая анатомическая ориентация, не диагностический снимок')}>
      {(id==='brain'||id==='hybrid')&&<>
        <ellipse cx="250" cy="160" rx="150" ry="145" fill={id==='brain'&&region===2?'#38bdf8':'#121a29'} stroke="#8292a5" strokeWidth="4" />
        <ellipse cx="250" cy="160" rx="137" ry="132" fill={id==='brain'?fill(1):region===0?'#14243c':'#738297'} />
        <path d="M245 42 V275 M167 65 Q225 100 158 135 T174 246 M330 62 Q280 100 342 137 T325 250" fill="none" stroke="#26354c" strokeWidth="9" />
        <path d="M240 125 Q210 93 201 140 Q201 174 236 186 L244 163 H256 L264 186 Q299 174 299 140 Q290 93 260 125 L250 145Z" fill={id==='brain'?fill(0):'#b9c9da'} />
        {id==='hybrid'&&region!==1&&<><circle cx="315" cy="106" r="33" fill="#fbbf24" opacity=".8"/><circle cx="315" cy="106" r="19" fill="#fb7185"/><circle cx="315" cy="106" r="8" fill="#fff5cc"/></>}
      </>}
      {id==='knee'&&<>
        <path d="M185 15 H300 L318 120 Q335 173 288 177 H206 Q158 173 174 130Z" fill={fill(0)} stroke="#b7c7d9" strokeWidth="4" />
        <path d="M178 208 Q245 193 322 208 L306 320 H191Z" fill={fill(0)} stroke="#b7c7d9" strokeWidth="4" />
        <path d="M169 195 L206 179 L216 199Z M288 199 L299 180 L329 196Z" fill={fill(1)} stroke="#a78bfa" strokeWidth="3" />
        <path d="M218 155 L279 232 M291 159 L218 233" stroke={fill(2)} strokeWidth="10" />
      </>}
      {(id==='pelvis'||id==='pregnancy')&&<>
        <path d="M115 30 Q40 150 112 300 H370 Q410 190 365 50 Q260 0 115 30Z" fill="#1d2b42" stroke="#62728a" strokeWidth="3" />
        {[60,105,150,195,240].map(y=><rect key={y} x="330" y={y} width="34" height="33" rx="6" fill={id==='pelvis'?fill(2):'#54637a'} />)}
        <ellipse cx="150" cy="245" rx="44" ry="30" fill={id==='pelvis'?fill(1):'#53657e'} />
        {id==='pelvis'?<path d="M230 223 Q201 195 216 160 Q236 137 285 124 Q317 140 288 167 L255 195 L246 236Z" fill={fill(0)} stroke="#c5cee0" strokeWidth="3" />:<>
          <ellipse cx="226" cy="152" rx="83" ry="106" fill="#394967" stroke="#8c9caf" strokeWidth="3" />
          <path d="M236 89 Q283 95 265 130 Q243 145 220 127 Q204 110 220 94 M218 137 Q184 152 205 199 Q230 224 255 191 M206 158 L240 171 M211 194 L246 208" fill={region===0?'#38bdf8':'#8996ab'} stroke={region===0?'#38bdf8':'#8996ab'} strokeWidth="11" strokeLinecap="round" />
          <path d="M286 97 Q332 168 277 239 L260 222 Q300 164 273 110Z" fill={region===1?'#38bdf8':'#a78bfa'} />
          {region===2&&[130,155,180,205].map((y,i)=><circle key={y} cx={290-(i-1)**2*3} cy={y} r="10" fill={['#fb7185','#34d399','#38bdf8','#fb7185'][i]} />)}
        </>}
      </>}
    </svg>
    <Segmented label={tr('Antippen und verstehen','Нажми и узнай')} value={region} onChange={setRegion} options={model.regions.map((r,i)=>({value:i,label:loc(r.label)}))} />
    <p aria-live="polite">{loc(model.regions[region].text)}</p>
    <p className="small muted">{tr('Neu gezeichnetes Lehrschema · bewusst vereinfacht · kein Originalbild der Folien','Новая учебная схема · намеренно упрощено · не исходный снимок со слайда')}</p>
  </Panel>;
}
