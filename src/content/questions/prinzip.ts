import { BOLTZMANN, PLANCK } from '../../physics/constants';
import { GAMMA_BAR_H1, larmorMHz, spinExcess, t2StarFromInhomogeneity, zeemanEnergy } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

/** Elementarladung in C, für die Umrechnung J → eV */
const ELEMENTARY_CHARGE = 1.602176634e-19;
/** Protonen pro mm³ Wasser: 1 mg / (18,015 g/mol) · Nₐ · 2 */
const PROTONS_PER_MM3 = (1e-3 / 18.015) * 6.02214076e23 * 2;
/** γ für ¹H in rad/(s·T) */
const GAMMA_H1 = 2 * Math.PI * GAMMA_BAR_H1 * 1e6;

/** Zusätzliche Fragen zum physikalischen Prinzip (Vertiefung). */
export const prinzipQuestions: QuestionSource[] = [
  // ------------------------------------------------------------ Rechnungen
  {
    id: 'pr-boltzmann-bt',
    generate: (rng, lang) => {
      const b0 = pick(rng, [0.5, 1, 1.5, 3, 7, 9.4]);
      const temp = pick(rng, [4, 77, 200, 293, 310, 350]);
      const t = tl(lang);
      const f0 = larmorMHz(b0);
      const dE = zeemanEnergy(b0);
      const kT = BOLTZMANN * temp;
      const ppm = spinExcess(b0, GAMMA_BAR_H1, temp) * 1e6;
      const ref = spinExcess(1.5) * 1e6;
      return {
        kind: 'numeric',
        id: 'pr-boltzmann-bt',
        difficulty: 3,
        prompt: t(
          `Eine Wasserprobe liegt in einem Feld von $B_0 = ${n(b0, 1, lang)}$ T bei einer Temperatur von $T = ${temp}$ K. Wie groß ist der relative Protonenüberschuss $(N_\\uparrow - N_\\downarrow)/N$? Gib ihn in ppm an. Konstanten: $h = 6{,}626\\cdot10^{-34}$ J·s, $k = 1{,}381\\cdot10^{-23}$ J/K, $\\bar\\gamma = 42{,}58$ MHz/T.`,
          `Проба воды находится в поле $B_0 = ${n(b0, 1, lang)}$ Тл при температуре $T = ${temp}$ K. Каков относительный избыток протонов $(N_\\uparrow - N_\\downarrow)/N$? Дай ответ в ppm. Константы: $h = 6{,}626\\cdot10^{-34}$ Дж·с, $k = 1{,}381\\cdot10^{-23}$ Дж/К, $\\bar\\gamma = 42{,}58$ МГц/Тл.`,
        ),
        answer: ppm,
        tolerance: 0.05,
        unit: 'ppm',
        hint: t(
          'Vergleiche die Energielücke $\\Delta E = h f_0$ mit der Wärmeenergie $kT$. Für kleine Verhältnisse gilt $\\Delta N/N \\approx \\Delta E/(2kT)$. 1 ppm ist ein Millionstel.',
          'Сравни энергетическую щель $\\Delta E = h f_0$ с тепловой энергией $kT$. При малых отношениях $\\Delta N/N \\approx \\Delta E/(2kT)$. 1 ppm это одна миллионная.',
        ),
        explanation: t(
          `**Der Überschuss beträgt etwa ${n(ppm, ppm < 10 ? 2 : 1, lang)} ppm.** Die Spins wollen sich parallel zum Feld stellen, die Wärme wirft sie ständig wieder durcheinander. Wer gewinnt, entscheidet das Verhältnis von Energielücke zu Wärmeenergie. Rechenweg: $f_0 = 42{,}58 \\cdot ${n(b0, 1, lang)} = ${n(f0, 1, lang)}$ MHz. $\\Delta E = h f_0 = ${n(dE * 1e26, 2, lang)}\\cdot10^{-26}$ J. $kT = 1{,}381\\cdot10^{-23} \\cdot ${temp} = ${n(kT * 1e21, 3, lang)}\\cdot10^{-21}$ J. $\\Delta N/N \\approx \\Delta E/(2kT) = ${n(ppm, 2, lang)}\\cdot10^{-6}$. Plausibilitätscheck: Bei 1,5 T und 310 K sind es ${n(ref, 2, lang)} ppm. Der Überschuss wächst linear mit B₀ und fällt mit 1/T, hier also um den Faktor ${n(b0 / 1.5, 2, lang)} · ${n(310 / temp, 2, lang)} = ${n(ppm / ref, 2, lang)}.`,
          `**Избыток составляет около ${n(ppm, ppm < 10 ? 2 : 1, lang)} ppm.** Спины стремятся встать параллельно полю, а тепло постоянно их перемешивает. Кто победит, решает отношение энергетической щели к тепловой энергии. Расчёт: $f_0 = 42{,}58 \\cdot ${n(b0, 1, lang)} = ${n(f0, 1, lang)}$ МГц. $\\Delta E = h f_0 = ${n(dE * 1e26, 2, lang)}\\cdot10^{-26}$ Дж. $kT = 1{,}381\\cdot10^{-23} \\cdot ${temp} = ${n(kT * 1e21, 3, lang)}\\cdot10^{-21}$ Дж. $\\Delta N/N \\approx \\Delta E/(2kT) = ${n(ppm, 2, lang)}\\cdot10^{-6}$. Проверка: при 1,5 Тл и 310 K получается ${n(ref, 2, lang)} ppm. Избыток растёт линейно с B₀ и падает как 1/T, здесь в ${n(b0 / 1.5, 2, lang)} · ${n(310 / temp, 2, lang)} = ${n(ppm / ref, 2, lang)} раза.`,
        ),
      };
    },
  },
  {
    id: 'pr-voxel-excess',
    generate: (rng, lang) => {
      const voxel = pick(rng, [
        [1, 1, 3],
        [1, 1, 5],
        [0.5, 0.5, 2],
        [2, 2, 5],
        [1, 1, 1],
      ]);
      const b0 = pick(rng, [1.5, 3]);
      const t = tl(lang);
      const vol = voxel[0] * voxel[1] * voxel[2];
      const protons = PROTONS_PER_MM3 * vol;
      const ex = spinExcess(b0);
      const answer = (protons * ex) / 1e14;
      const dims = voxel.map((d) => n(d, 1, lang)).join(' × ');
      return {
        kind: 'numeric',
        id: 'pr-voxel-excess',
        difficulty: 3,
        prompt: t(
          `Ein Voxel misst ${dims} mm³ und ist mit reinem Wasser gefüllt. Wie viele Protonen bilden darin bei ${n(b0, 1, lang)} T und 310 K den Überschuss? Ein Kubikmillimeter Wasser wiegt 1 mg, die Molmasse ist 18 g/mol, $N_A = 6{,}022\\cdot10^{23}$/mol, und der relative Überschuss ist ${n(ex * 1e6, 2, lang)} ppm. Gib das Ergebnis in Einheiten von $10^{14}$ an.`,
          `Воксель размером ${dims} мм³ заполнен чистой водой. Сколько протонов в нём образуют избыток при ${n(b0, 1, lang)} Тл и 310 K? Кубический миллиметр воды весит 1 мг, молярная масса 18 г/моль, $N_A = 6{,}022\\cdot10^{23}$/моль, а относительный избыток равен ${n(ex * 1e6, 2, lang)} ppm. Дай ответ в единицах $10^{14}$.`,
        ),
        answer,
        tolerance: 0.06,
        unit: t('·10¹⁴ Protonen', '·10¹⁴ протонов'),
        hint: t(
          'Drei Schritte: Volumen in mm³, dann Zahl der Wassermoleküle (Masse durch Molmasse mal $N_A$), dann zwei Protonen pro Molekül. Zum Schluss mal den Überschuss.',
          'Три шага: объём в мм³, затем число молекул воды (масса, делённая на молярную массу, умноженная на $N_A$), затем два протона на молекулу. В конце умножь на избыток.',
        ),
        explanation: t(
          `**Rund ${n(answer, answer < 10 ? 2 : 0, lang)}·10¹⁴ Protonen bilden den Überschuss.** Der Anteil ist winzig, aber die Gesamtzahl ist riesig. Rechenweg: Volumen $V = ${n(vol, 2, lang)}$ mm³, also ${n(vol, 2, lang)} mg Wasser. Moleküle: $${n(vol, 2, lang)}\\cdot10^{-3}\\,\\text{g} / 18\\,\\text{g/mol} \\cdot 6{,}022\\cdot10^{23} \\approx ${n(protons / 2e19, 2, lang)}\\cdot10^{19}$. Protonen: doppelt so viele, also ${n(protons / 1e19, 2, lang)}·10¹⁹. Überschuss: ${n(protons / 1e19, 2, lang)}·10¹⁹ · ${n(ex * 1e6, 2, lang)}·10⁻⁶ ≈ ${n(answer, 2, lang)}·10¹⁴. Plausibilitätscheck: 1 mm³ Wasser hat rund 6,7·10¹⁹ Protonen, bei 1,5 T bilden etwa 5 von einer Million den Überschuss, das sind rund 3·10¹⁴ pro mm³. Deshalb reicht ein so kleiner Anteil für ein messbares Signal.`,
          `**Около ${n(answer, answer < 10 ? 2 : 0, lang)}·10¹⁴ протонов образуют избыток.** Доля крошечная, но общее число огромно. Расчёт: объём $V = ${n(vol, 2, lang)}$ мм³, то есть ${n(vol, 2, lang)} мг воды. Молекулы: $${n(vol, 2, lang)}\\cdot10^{-3}\\,\\text{г} / 18\\,\\text{г/моль} \\cdot 6{,}022\\cdot10^{23} \\approx ${n(protons / 2e19, 2, lang)}\\cdot10^{19}$. Протонов вдвое больше, то есть ${n(protons / 1e19, 2, lang)}·10¹⁹. Избыток: ${n(protons / 1e19, 2, lang)}·10¹⁹ · ${n(ex * 1e6, 2, lang)}·10⁻⁶ ≈ ${n(answer, 2, lang)}·10¹⁴. Проверка: в 1 мм³ воды около 6,7·10¹⁹ протонов, при 1,5 Тл примерно 5 из миллиона образуют избыток, это около 3·10¹⁴ на мм³. Поэтому такой маленькой доли хватает для измеримого сигнала.`,
        ),
      };
    },
  },
  {
    id: 'pr-photon-ev',
    generate: (rng, lang) => {
      const b0 = pick(rng, [0.55, 1.5, 3, 7]);
      const t = tl(lang);
      const f0 = larmorMHz(b0);
      const joule = PLANCK * f0 * 1e6;
      const uev = (joule / ELEMENTARY_CHARGE) * 1e6;
      return {
        kind: 'numeric',
        id: 'pr-photon-ev',
        difficulty: 2,
        prompt: t(
          `Welche Energie trägt ein HF-Photon, das Protonen bei $B_0 = ${n(b0, 2, lang)}$ T anregt? Gib das Ergebnis in Mikroelektronenvolt (µeV) an. $h = 6{,}626\\cdot10^{-34}$ J·s, $1\\,\\text{eV} = 1{,}602\\cdot10^{-19}$ J.`,
          `Какую энергию несёт РЧ-фотон, который возбуждает протоны при $B_0 = ${n(b0, 2, lang)}$ Тл? Дай ответ в микроэлектронвольтах (мкэВ). $h = 6{,}626\\cdot10^{-34}$ Дж·с, $1\\,\\text{эВ} = 1{,}602\\cdot10^{-19}$ Дж.`,
        ),
        answer: uev,
        tolerance: 0.03,
        unit: t('µeV', 'мкэВ'),
        hint: t(
          'Das Photon muss genau in die Energielücke passen: $\\Delta E = h \\cdot f_0$ mit $f_0 = \\bar\\gamma B_0$. Dann von Joule in eV umrechnen und mit $10^6$ in µeV.',
          'Фотон должен точно подходить к энергетической щели: $\\Delta E = h \\cdot f_0$, где $f_0 = \\bar\\gamma B_0$. Затем переведи джоули в эВ и умножь на $10^6$, чтобы получить мкэВ.',
        ),
        explanation: t(
          `**Ein Photon trägt nur etwa ${n(uev, 3, lang)} µeV.** Rechenweg: $f_0 = 42{,}58 \\cdot ${n(b0, 2, lang)} = ${n(f0, 1, lang)}$ MHz. $\\Delta E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot ${n(f0, 1, lang)}\\cdot10^{6} = ${n(joule * 1e26, 2, lang)}\\cdot10^{-26}$ J. Geteilt durch $1{,}602\\cdot10^{-19}$ J/eV ergibt das ${n(uev * 10, 2, lang)}·10⁻⁷ eV = ${n(uev, 3, lang)} µeV. Plausibilitätscheck: Bei 1,5 T sind es rund 0,26 µeV, und der Wert wächst linear mit B₀. Zum Vergleich: Die Wärmeenergie kT bei 37 °C ist rund 27 meV, also etwa hunderttausendmal mehr. Um ein Molekül zu ionisieren, braucht es rund 10 eV, das ist etwa das Zehnmillionenfache.`,
          `**Один фотон несёт всего около ${n(uev, 3, lang)} мкэВ.** Расчёт: $f_0 = 42{,}58 \\cdot ${n(b0, 2, lang)} = ${n(f0, 1, lang)}$ МГц. $\\Delta E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot ${n(f0, 1, lang)}\\cdot10^{6} = ${n(joule * 1e26, 2, lang)}\\cdot10^{-26}$ Дж. Делим на $1{,}602\\cdot10^{-19}$ Дж/эВ и получаем ${n(uev * 10, 2, lang)}·10⁻⁷ эВ = ${n(uev, 3, lang)} мкэВ. Проверка: при 1,5 Тл это около 0,26 мкэВ, и значение растёт линейно с B₀. Для сравнения: тепловая энергия kT при 37 °C около 27 мэВ, то есть примерно в сто тысяч раз больше. Чтобы ионизировать молекулу, нужно около 10 эВ, это примерно в десять миллионов раз больше.`,
        ),
      };
    },
  },
  {
    id: 'pr-t2star-inhomogeneity',
    generate: (rng, lang) => {
      const t2 = pick(rng, [40, 60, 80, 100, 150]);
      const b0 = pick(rng, [1.5, 3]);
      const ppm = pick(rng, [0.05, 0.1, 0.2]);
      const t = tl(lang);
      const dBuT = ppm * b0;
      const r2p = GAMMA_H1 * dBuT * 1e-6; // 1/s
      const t2p = 1000 / r2p; // ms
      const t2s = t2StarFromInhomogeneity(t2, dBuT);
      return {
        kind: 'numeric',
        id: 'pr-t2star-inhomogeneity',
        difficulty: 3,
        prompt: t(
          `Ein Gewebe hat $T_2 = ${t2}$ ms. Das Feld $B_0 = ${n(b0, 1, lang)}$ T schwankt im Voxel um $\\Delta B_0 = ${n(ppm, 2, lang)}$ ppm. Berechne zuerst $T_2' = 1/(\\gamma\\,\\Delta B_0)$ mit $\\gamma = 2{,}675\\cdot10^{8}$ rad/(s·T) und dann $T_2^*$. Gib $T_2^*$ in ms an.`,
          `У ткани $T_2 = ${t2}$ мс. Поле $B_0 = ${n(b0, 1, lang)}$ Тл колеблется внутри вокселя на $\\Delta B_0 = ${n(ppm, 2, lang)}$ ppm. Сначала рассчитай $T_2' = 1/(\\gamma\\,\\Delta B_0)$ при $\\gamma = 2{,}675\\cdot10^{8}$ рад/(с·Тл), затем $T_2^*$. Дай $T_2^*$ в мс.`,
        ),
        answer: t2s,
        tolerance: 0.03,
        unit: t('ms', 'мс'),
        hint: t(
          "ppm heißt Millionstel von B₀, rechne ΔB₀ also zuerst in Tesla um. Danach addierst du die Raten: $1/T_2^* = 1/T_2 + 1/T_2'$.",
          "ppm означает миллионные доли B₀, поэтому сначала переведи ΔB₀ в теслы. Затем сложи скорости: $1/T_2^* = 1/T_2 + 1/T_2'$.",
        ),
        explanation: t(
          `**T2* beträgt etwa ${n(t2s, 1, lang)} ms.** Zwei Dinge lassen die Spins auseinanderlaufen: echte Spin-Spin-Wechselwirkungen (T2) und das ungleichmäßige Feld (T2′). Ihre Raten addieren sich. Rechenweg: $\\Delta B_0 = ${n(ppm, 2, lang)}\\cdot10^{-6} \\cdot ${n(b0, 1, lang)}\\,\\text{T} = ${n(dBuT, 3, lang)}$ µT. $1/T_2' = 2{,}675\\cdot10^{8} \\cdot ${n(dBuT, 3, lang)}\\cdot10^{-6} = ${n(r2p, 1, lang)}$ 1/s, also $T_2' = ${n(t2p, 1, lang)}$ ms. $T_2^* = (1/${t2} + 1/${n(t2p, 1, lang)})^{-1} = ${n(t2s, 1, lang)}$ ms. Plausibilitätscheck: T2* muss kürzer sein als T2 und als T2′. Doppeltes Feld bei gleichem ppm-Wert heißt doppeltes ΔB₀ in Tesla, deshalb ist T2* bei 3 T kürzer. Den T2′-Anteil kann ein Spin-Echo zurückholen.`,
          `**T2* составляет около ${n(t2s, 1, lang)} мс.** Две причины заставляют спины расходиться: настоящие спин-спиновые взаимодействия (T2) и неоднородное поле (T2′). Их скорости складываются. Расчёт: $\\Delta B_0 = ${n(ppm, 2, lang)}\\cdot10^{-6} \\cdot ${n(b0, 1, lang)}\\,\\text{Тл} = ${n(dBuT, 3, lang)}$ мкТл. $1/T_2' = 2{,}675\\cdot10^{8} \\cdot ${n(dBuT, 3, lang)}\\cdot10^{-6} = ${n(r2p, 1, lang)}$ 1/с, то есть $T_2' = ${n(t2p, 1, lang)}$ мс. $T_2^* = (1/${t2} + 1/${n(t2p, 1, lang)})^{-1} = ${n(t2s, 1, lang)}$ мс. Проверка: T2* должно быть короче и T2, и T2′. Двойное поле при том же значении в ppm означает двойное ΔB₀ в теслах, поэтому при 3 Тл T2* короче. Вклад T2′ может вернуть спиновое эхо.`,
        ),
      };
    },
  },
  {
    id: 'pr-flip-gamma',
    generate: (rng, lang) => {
      const b1 = pick(rng, [3, 5, 8, 10, 12]);
      const tau = pick(rng, [0.25, 0.4, 0.5, 0.8]);
      const t = tl(lang);
      const w1 = GAMMA_H1 * b1 * 1e-6; // rad/s
      const rad = w1 * tau * 1e-3;
      const deg = (rad * 180) / Math.PI;
      return {
        kind: 'numeric',
        id: 'pr-flip-gamma',
        difficulty: 2,
        prompt: t(
          `Im rotierenden Bezugssystem dreht ein HF-Puls die Magnetisierung um $\\alpha = \\gamma B_1 \\tau$. Der Puls hat $B_1 = ${b1}$ µT und dauert $\\tau = ${n(tau, 2, lang)}$ ms. Mit $\\gamma = 2{,}675\\cdot10^{8}$ rad/(s·T): Wie groß ist der Flipwinkel in Grad?`,
          `Во вращающейся системе отсчёта РЧ-импульс поворачивает намагниченность на $\\alpha = \\gamma B_1 \\tau$. У импульса $B_1 = ${b1}$ мкТл, длительность $\\tau = ${n(tau, 2, lang)}$ мс. При $\\gamma = 2{,}675\\cdot10^{8}$ рад/(с·Тл): каков угол отклонения в градусах?`,
        ),
        answer: deg,
        tolerance: 0.02,
        unit: '°',
        hint: t(
          'Achte auf die Einheiten: µT und ms in T und s umrechnen. Die Formel liefert Radiant, ein Radiant sind $180°/\\pi \\approx 57{,}3°$.',
          'Следи за единицами: переведи мкТл и мс в Тл и с. Формула даёт радианы, один радиан равен $180°/\\pi \\approx 57{,}3°$.',
        ),
        explanation: t(
          `**Der Flipwinkel beträgt etwa ${n(deg, 1, lang)}°.** Im rotierenden System steht B₁ still, und M dreht sich um B₁ mit der Nutationsfrequenz $\\omega_1 = \\gamma B_1$. Winkel ist Drehgeschwindigkeit mal Zeit. Rechenweg: $\\omega_1 = 2{,}675\\cdot10^{8} \\cdot ${b1}\\cdot10^{-6} = ${n(w1, 0, lang)}$ rad/s. $\\alpha = ${n(w1, 0, lang)} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3} = ${n(rad, 3, lang)}$ rad $= ${n(deg, 1, lang)}°$. Plausibilitätscheck: Für 90° in 0,5 ms braucht man rund 11,7 µT. Doppeltes B₁ oder doppelte Dauer gibt den doppelten Winkel. B₁ ist dabei rund hunderttausendmal schwächer als B₀.`,
          `**Угол отклонения около ${n(deg, 1, lang)}°.** Во вращающейся системе B₁ неподвижно, и M поворачивается вокруг B₁ с частотой нутации $\\omega_1 = \\gamma B_1$. Угол равен скорости поворота, умноженной на время. Расчёт: $\\omega_1 = 2{,}675\\cdot10^{8} \\cdot ${b1}\\cdot10^{-6} = ${n(w1, 0, lang)}$ рад/с. $\\alpha = ${n(w1, 0, lang)} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3} = ${n(rad, 3, lang)}$ рад $= ${n(deg, 1, lang)}°$. Проверка: для 90° за 0,5 мс нужно около 11,7 мкТл. Двойное B₁ или двойная длительность дают двойной угол. При этом B₁ примерно в сто тысяч раз слабее B₀.`,
        ),
      };
    },
  },
  {
    id: 'pr-turns-per-pulse',
    kind: 'numeric',
    difficulty: 2,
    prompt: {
      de: 'Ein 90°-Puls dauert 0,5 ms, das Feld ist 3 T. Wie viele Umläufe um die z-Achse macht die Magnetisierung im Laborsystem während dieses Pulses?',
      ru: '90°-импульс длится 0,5 мс, поле 3 Тл. Сколько оборотов вокруг оси z делает намагниченность в лабораторной системе за время этого импульса?',
    },
    answer: larmorMHz(3) * 1e6 * 0.5e-3,
    tolerance: 0.02,
    unit: { de: 'Umläufe', ru: 'оборотов' },
    hint: {
      de: 'Die Larmor-Frequenz sagt dir, wie viele Umläufe pro Sekunde es sind. Multipliziere mit der Pulsdauer.',
      ru: 'Ларморова частота говорит, сколько оборотов в секунду. Умножь её на длительность импульса.',
    },
    explanation: {
      de: `**Rund ${n(larmorMHz(3) * 0.5e3, 0, 'de')} Umläufe.** Rechenweg: $f_0 = 42{,}58 \\cdot 3 = 127{,}7$ MHz. Umläufe $= f_0 \\cdot \\tau = 127{,}7\\cdot10^{6}\\,\\text{1/s} \\cdot 0{,}5\\cdot10^{-3}\\,\\text{s} \\approx 63\\,900$. Während dieser Zeit kippt M nur um eine Viertelumdrehung. Larmor-Präzession und Kippbewegung (Nutation) unterscheiden sich also um den Faktor 4 · 63 900 ≈ 255 000. Genau deshalb rechnet man im rotierenden Bezugssystem: Dort fällt die schnelle Präzession weg, und nur die langsame Kippbewegung bleibt übrig. Plausibilitätscheck: Bei 1,5 T wäre es halb so viel, rund 32 000.`,
      ru: `**Около ${n(larmorMHz(3) * 0.5e3, 0, 'ru')} оборотов.** Расчёт: $f_0 = 42{,}58 \\cdot 3 = 127{,}7$ МГц. Обороты $= f_0 \\cdot \\tau = 127{,}7\\cdot10^{6}\\,\\text{1/с} \\cdot 0{,}5\\cdot10^{-3}\\,\\text{с} \\approx 63\\,900$. За это время M отклоняется лишь на четверть оборота. Значит, ларморова прецессия и отклонение (нутация) различаются в 4 · 63 900 ≈ 255 000 раз. Именно поэтому считают во вращающейся системе отсчёта: там быстрая прецессия исчезает, и остаётся только медленное отклонение. Проверка: при 1,5 Тл было бы вдвое меньше, около 32 000.`,
    },
  },

  // ------------------------------------------------------------ Verständnis
  {
    id: 'pr-rotating-frame',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was ist das rotierende Bezugssystem, und warum benutzt man es?',
      ru: 'Что такое вращающаяся система отсчёта и зачем её используют?',
    },
    options: [
      {
        de: 'Ein Koordinatensystem, das sich mit der Larmor-Frequenz um z dreht. Darin verschwindet die Präzession um B₀, B₁ steht still, und der HF-Puls wird zu einer einfachen Drehung um x′.',
        ru: 'Система координат, которая вращается вокруг z с ларморовой частотой. В ней прецессия вокруг B₀ исчезает, B₁ неподвижно, а РЧ-импульс становится простым поворотом вокруг x′.',
      },
      {
        de: 'Ein Koordinatensystem, das sich mit dem Patiententisch bewegt, damit Bewegungsartefakte verschwinden.',
        ru: 'Система координат, которая движется вместе со столом пациента, чтобы исчезли артефакты движения.',
      },
      {
        de: 'Ein Koordinatensystem, in dem die Relaxation ausgeschaltet ist, damit M ewig erhalten bleibt.',
        ru: 'Система координат, в которой релаксация выключена, чтобы M сохранялась вечно.',
      },
      {
        de: 'Ein Koordinatensystem, das sich mit der Frequenz von B₁ um x dreht, sodass B₀ verschwindet.',
        ru: 'Система координат, которая вращается вокруг x с частотой B₁, так что B₀ исчезает.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Stell dir vor, du sitzt auf einem Karussell, das genauso schnell dreht wie die Spins. Was siehst du dann?',
      ru: 'Представь, что ты сидишь на карусели, которая вращается так же быстро, как спины. Что ты тогда видишь?',
    },
    explanation: {
      de: '**Im rotierenden System dreht sich der Beobachter mit den Spins mit.** Das ist wie auf einem Karussell: Wer mitfährt, sieht die anderen Mitfahrenden ruhig sitzen. Im Laborsystem kreist M mit 64 MHz (bei 1,5 T) um z und kippt nebenbei langsam, die Bahn ist eine Spirale. Dreht sich das Koordinatensystem mit ω₀ = γB₀ mit, ist die Präzession weg. Auch das HF-Feld B₁, das ja mit ω₀ umläuft, steht dann still, zum Beispiel auf x′. M dreht sich nur noch um x′, beim 90°-Puls auf einem Viertelkreis von z nach y′. Die Physik bleibt dieselbe, nur die Beschreibung wird einfach. Relaxation gibt es in beiden Systemen.',
      ru: '**Во вращающейся системе наблюдатель вращается вместе со спинами.** Это как на карусели: кто едет вместе с ней, видит других пассажиров сидящими спокойно. В лабораторной системе M вращается вокруг z с частотой 64 МГц (при 1,5 Тл) и попутно медленно отклоняется, путь это спираль. Если система координат вращается вместе с ω₀ = γB₀, прецессии больше нет. РЧ-поле B₁, которое тоже вращается с ω₀, тогда стоит на месте, например на x′. M поворачивается только вокруг x′, при 90°-импульсе по четверти окружности от z к y′. Физика остаётся той же, только описание становится простым. Релаксация есть в обеих системах.',
    },
  },
  {
    id: 'pr-b1-cos',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Im Skript steht der HF-Puls in der Bloch-Gleichung als $B_x = B_1\\cos(\\omega_0 t)$. Was beschreibt dieser Term?',
      ru: 'В конспекте РЧ-импульс записан в уравнении Блоха как $B_x = B_1\\cos(\\omega_0 t)$. Что описывает этот член?',
    },
    options: [
      {
        de: 'Ein schwaches Feld entlang x, das mit der Larmor-Frequenz hin und her schwingt. Man kann es in zwei gegenläufig kreisende Anteile zerlegen. Der mit den Spins mitlaufende Anteil steht im rotierenden System still und kippt M, der andere mittelt sich weg.',
        ru: 'Слабое поле вдоль x, которое колеблется туда и обратно с ларморовой частотой. Его можно разложить на две составляющие, вращающиеся в противоположные стороны. Составляющая, которая вращается вместе со спинами, во вращающейся системе неподвижна и отклоняет M, а другая усредняется.',
      },
      {
        de: 'Ein statisches Zusatzfeld, das B₀ in x-Richtung verstärkt und so die Larmor-Frequenz erhöht.',
        ru: 'Статическое дополнительное поле, которое усиливает B₀ в направлении x и тем самым повышает ларморову частоту.',
      },
      {
        de: 'Den Gradienten, der das Feld entlang x ortsabhängig macht.',
        ru: 'Градиент, который делает поле вдоль x зависящим от положения.',
      },
      {
        de: 'Das gemessene Signal in der Empfangsspule, das mit T2 zerfällt.',
        ru: 'Измеряемый сигнал в приёмной катушке, который затухает с T2.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Ein Feld, das auf einer Linie hin und her schwingt, ist dasselbe wie zwei Zeiger, die gegenläufig im Kreis laufen.',
      ru: 'Поле, которое колеблется туда и обратно вдоль линии, это то же самое, что две стрелки, бегущие по кругу в противоположные стороны.',
    },
    explanation: {
      de: '**B₁cos(ω₀t) ist das HF-Feld des Pulses, linear entlang x und im Takt der Larmor-Frequenz.** Mathematisch gilt $\\cos(\\omega_0 t)\\,\\hat x = \\tfrac12[\\cos\\omega_0 t\\,\\hat x + \\sin\\omega_0 t\\,\\hat y] + \\tfrac12[\\cos\\omega_0 t\\,\\hat x - \\sin\\omega_0 t\\,\\hat y]$. Das sind zwei Zeiger der Länge B₁/2, die gegenläufig kreisen. Einer läuft genau mit den Spins mit. Im rotierenden System steht er still, und M dreht sich um ihn, wie eine Schaukel, die immer im richtigen Moment Schwung bekommt. Der andere dreht sich dort mit 2ω₀ und mittelt sich weg. Deshalb wirkt nur die Hälfte von B₁. Eine zirkular polarisierte Sendespule erzeugt gleich nur den nützlichen Anteil und braucht weniger Leistung. B₁ liegt im Mikrotesla-Bereich und verändert B₀ praktisch nicht.',
      ru: '**B₁cos(ω₀t) это РЧ-поле импульса, линейное вдоль x и в такт ларморовой частоте.** Математически $\\cos(\\omega_0 t)\\,\\hat x = \\tfrac12[\\cos\\omega_0 t\\,\\hat x + \\sin\\omega_0 t\\,\\hat y] + \\tfrac12[\\cos\\omega_0 t\\,\\hat x - \\sin\\omega_0 t\\,\\hat y]$. Это две стрелки длиной B₁/2, которые вращаются в противоположные стороны. Одна идёт точно вместе со спинами. Во вращающейся системе она неподвижна, и M поворачивается вокруг неё, как качели, которые всегда получают толчок в нужный момент. Другая там вращается с 2ω₀ и усредняется. Поэтому действует только половина B₁. Передающая катушка с круговой поляризацией сразу создаёт только полезную составляющую и требует меньше мощности. B₁ лежит в диапазоне микротесла и практически не меняет B₀.',
    },
  },
  {
    id: 'pr-phase-spiral',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Im Skript siehst du ein Phasendiagramm aus der Bloch-Simulation: My über Mx im Laborsystem. Während der Anregung läuft die Kurve spiralförmig nach außen, danach spiralförmig nach innen. Warum?',
      ru: 'В конспекте есть фазовая диаграмма из моделирования Блоха: My в зависимости от Mx в лабораторной системе. Во время возбуждения кривая идёт по спирали наружу, а потом по спирали внутрь. Почему?',
    },
    options: [
      {
        de: 'Während des Pulses kippt M aus z heraus, und die Quermagnetisierung wächst, während M weiter präzediert. Danach präzediert M weiter, aber die Quermagnetisierung zerfällt mit T2 (bzw. T2*).',
        ru: 'Во время импульса M отклоняется от z, и поперечная намагниченность растёт, пока M продолжает прецессировать. Затем M прецессирует дальше, но поперечная намагниченность затухает с T2 (или T2*).',
      },
      {
        de: 'Nach außen läuft die Kurve, weil T1 wirkt, und nach innen, weil der Puls die Längsmagnetisierung aufbaut.',
        ru: 'Наружу кривая идёт из-за действия T1, а внутрь потому, что импульс создаёт продольную намагниченность.',
      },
      {
        de: 'Die Spirale entsteht nur durch Rechenfehler der numerischen Integration.',
        ru: 'Спираль возникает только из-за ошибок численного интегрирования.',
      },
      {
        de: 'Nach außen läuft sie, weil die Larmor-Frequenz während des Pulses steigt, nach innen, weil sie danach sinkt.',
        ru: 'Наружу она идёт потому, что ларморова частота во время импульса растёт, а внутрь потому, что потом падает.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Der Abstand vom Mittelpunkt ist |Mxy|. Was macht |Mxy| während des Pulses und was danach? Und wofür steht das Kreisen?',
      ru: 'Расстояние от центра равно |Mxy|. Что делает |Mxy| во время импульса и после него? И что означает вращение по кругу?',
    },
    explanation: {
      de: '**Das Kreisen ist die Präzession, der Abstand zur Mitte ist |Mxy|.** Während des Pulses wird M Stück für Stück aus der z-Richtung gekippt. Dabei präzediert M ständig weiter. In der xy-Projektion wird der Kreis also immer größer: eine Spirale nach außen. Nach dem Puls präzediert M weiter, aber die Quermagnetisierung zerfällt mit T2, und Mz baut sich mit T1 wieder auf. Der Kreis wird immer kleiner: eine Spirale nach innen. Das Signal in der Spule ist genau diese kreisende, schrumpfende Quermagnetisierung, der FID. Die Larmor-Frequenz bleibt dabei konstant, sie hängt nur von B₀ ab.',
      ru: '**Вращение по кругу это прецессия, расстояние до центра это |Mxy|.** Во время импульса M постепенно отклоняется от направления z. При этом M всё время продолжает прецессировать. В проекции на xy круг становится всё больше: спираль наружу. После импульса M прецессирует дальше, но поперечная намагниченность затухает с T2, а Mz восстанавливается с T1. Круг становится всё меньше: спираль внутрь. Сигнал в катушке это как раз эта вращающаяся и уменьшающаяся поперечная намагниченность, FID. Ларморова частота при этом постоянна, она зависит только от B₀.',
    },
  },
  {
    id: 'pr-no-ionisation',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Warum ist die HF-Strahlung der MRT nicht ionisierend? Welche Aussagen stimmen? (Mehrfachauswahl)',
      ru: 'Почему РЧ-излучение МРТ не ионизирующее? Какие утверждения верны? (Несколько ответов)',
    },
    options: [
      {
        de: 'Ein HF-Photon hat bei 1,5 T nur rund 0,26 µeV, zum Ionisieren braucht es rund 10 eV.',
        ru: 'РЧ-фотон при 1,5 Тл несёт всего около 0,26 мкэВ, а для ионизации нужно около 10 эВ.',
      },
      {
        de: 'Ob ionisiert wird, hängt von der Energie pro Photon ab, nicht von der Zahl der Photonen.',
        ru: 'Произойдёт ли ионизация, зависит от энергии одного фотона, а не от числа фотонов.',
      },
      {
        de: 'Die HF-Leistung kann das Gewebe trotzdem erwärmen. Deshalb gibt es SAR-Grenzwerte.',
        ru: 'Мощность РЧ всё же может нагревать ткань. Поэтому существуют пределы SAR.',
      },
      {
        de: 'Das starke B₀ schirmt die Photonen ab, bevor sie Moleküle erreichen.',
        ru: 'Сильное поле B₀ экранирует фотоны до того, как они достигнут молекул.',
      },
      {
        de: 'HF ist nur deshalb harmlos, weil pro Messung sehr wenige Photonen gesendet werden.',
        ru: 'РЧ безвредно только потому, что за измерение посылается очень мало фотонов.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Denk an einen Getränkeautomaten, der nur 2-Euro-Münzen annimmt. Hilft dir ein Eimer voller Cent-Münzen?',
      ru: 'Представь автомат с напитками, который принимает только монеты по 2 евро. Поможет ли ведро монет по одному центу?',
    },
    explanation: {
      de: '**Jedes Photon ist viel zu schwach, um ein Elektron herauszuschlagen.** Ionisieren ist ein Ein-Photon-Prozess. Ein Photon muss die Bindungsenergie allein aufbringen, wie eine einzelne Münze im Automaten. Ein Eimer voller Cent-Münzen hilft nicht. Rechnung: $E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot 63{,}9\\cdot10^{6} \\approx 4{,}2\\cdot10^{-26}$ J, das sind rund 0,26 µeV. Bis zu den rund 10 eV fehlt etwa der Faktor 10⁸. Viele Photonen zusammen geben aber Energie als Wärme ab. Deshalb begrenzt man die spezifische Absorptionsrate (SAR). B₀ schirmt nichts ab, und die Zahl der Photonen ist riesig, sie ist für die Ionisation nur nicht entscheidend.',
      ru: '**Каждый фотон слишком слаб, чтобы выбить электрон.** Ионизация это однофотонный процесс. Один фотон должен сам обеспечить энергию связи, как одна монета в автомате. Ведро монет по центу не поможет. Расчёт: $E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot 63{,}9\\cdot10^{6} \\approx 4{,}2\\cdot10^{-26}$ Дж, это около 0,26 мкэВ. До примерно 10 эВ не хватает множителя около 10⁸. Но множество фотонов вместе отдают энергию в виде тепла. Поэтому ограничивают удельный коэффициент поглощения (SAR). B₀ ничего не экранирует, а число фотонов огромно, просто для ионизации оно не решает.',
    },
  },
  {
    id: 'pr-resonance-conditions',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Was gehört zur Resonanzbedingung der MRT? (Mehrfachauswahl)',
      ru: 'Что входит в условие резонанса в МРТ? (Несколько ответов)',
    },
    options: [
      {
        de: 'Die Sendefrequenz entspricht der Larmor-Frequenz: $f_{\\text{HF}} = \\bar\\gamma B_0$.',
        ru: 'Частота передатчика равна ларморовой частоте: $f_{\\text{РЧ}} = \\bar\\gamma B_0$.',
      },
      {
        de: 'Die Photonenenergie passt genau zur Energielücke der Spinzustände: $h f_{\\text{HF}} = \\Delta E = \\gamma\\hbar B_0$.',
        ru: 'Энергия фотона точно соответствует щели между спиновыми состояниями: $h f_{\\text{РЧ}} = \\Delta E = \\gamma\\hbar B_0$.',
      },
      {
        de: 'Das HF-Feld muss ungefähr so stark sein wie B₀.',
        ru: 'РЧ-поле должно быть примерно таким же сильным, как B₀.',
      },
      {
        de: 'Die Sendefrequenz muss doppelt so hoch sein wie die Larmor-Frequenz.',
        ru: 'Частота передатчика должна быть вдвое выше ларморовой частоты.',
      },
    ],
    answers: [0, 1],
    hint: {
      de: 'Zwei Blickwinkel, ein Ergebnis: das klassische Bild mit der Frequenz und das Quantenbild mit der Energie.',
      ru: 'Две точки зрения, один результат: классическая картина с частотой и квантовая с энергией.',
    },
    explanation: {
      de: '**Resonanz heißt: Die Frequenz stimmt.** Klassisch musst du die Spins im Takt ihrer Präzession anschubsen, also mit $f_0 = \\bar\\gamma B_0$, wie einen Radiosender, den du genau einstellst. Quantenmechanisch muss ein Photon genau in die Lücke zwischen den beiden Spinzuständen passen: $h f = \\Delta E = \\gamma\\hbar B_0$. Teilt man durch h, kommt wieder dieselbe Larmor-Frequenz heraus, denn $\\gamma\\hbar/h = \\gamma/2\\pi = \\bar\\gamma$. Beide Bilder sagen also dasselbe. Die Stärke von B₁ ist dafür nicht entscheidend. B₁ liegt bei einigen Mikrotesla, B₀ bei Tesla. Ein schwaches Feld reicht, wenn es im richtigen Takt wirkt. Eine doppelte Frequenz wäre außer Takt und würde nichts kippen.',
      ru: '**Резонанс значит: частота совпадает.** Классически нужно толкать спины в такт их прецессии, то есть с $f_0 = \\bar\\gamma B_0$, как точно настроенную радиостанцию. В квантовой картине фотон должен точно подходить к щели между двумя спиновыми состояниями: $h f = \\Delta E = \\gamma\\hbar B_0$. Если разделить на h, снова получается та же ларморова частота, ведь $\\gamma\\hbar/h = \\gamma/2\\pi = \\bar\\gamma$. Обе картины говорят одно и то же. Сила B₁ здесь не решает. B₁ порядка нескольких микротесла, B₀ порядка тесла. Слабого поля достаточно, если оно действует в нужном такте. Двойная частота была бы не в такт и ничего бы не отклонила.',
    },
  },
  {
    id: 'pr-t1-minimum',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Wie hängt T1 mit der Bewegung der Moleküle zusammen?',
      ru: 'Как T1 связано с движением молекул?',
    },
    options: [
      {
        de: 'T1 ist am kürzesten, wenn die Moleküle sich ungefähr mit der Larmor-Frequenz bewegen. Freies Wasser ist zu schnell, feste Stoffe sind zu langsam, beide haben ein langes T1.',
        ru: 'T1 самое короткое, когда молекулы движутся примерно с ларморовой частотой. Свободная вода слишком быстрая, твёрдые вещества слишком медленные, у обоих длинное T1.',
      },
      {
        de: 'Je schneller sich die Moleküle bewegen, desto kürzer ist T1, ohne Grenze.',
        ru: 'Чем быстрее движутся молекулы, тем короче T1, без всякого предела.',
      },
      {
        de: 'T1 hängt nicht von der Molekülbewegung ab, nur von der Protonendichte.',
        ru: 'T1 не зависит от движения молекул, только от протонной плотности.',
      },
      {
        de: 'T1 ist am kürzesten, wenn sich die Moleküle gar nicht bewegen.',
        ru: 'T1 самое короткое, когда молекулы совсем не движутся.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Damit ein Spin Energie an die Umgebung (das „Gitter“) abgeben kann, muss die Umgebung mit der passenden Frequenz wackeln.',
      ru: 'Чтобы спин мог отдать энергию окружению («решётке»), окружение должно колебаться с подходящей частотой.',
    },
    explanation: {
      de: '**T1 ist ein Resonanzeffekt mit der Umgebung.** Ein angeregter Spin gibt seine Energie nur ab, wenn das Magnetfeld seiner Nachbarn im Takt der Larmor-Frequenz schwankt. Diese Schwankungen kommen von der Molekülbewegung. Kleine Wassermoleküle taumeln sehr schnell, viel schneller als 64 MHz. Nur ein kleiner Teil ihrer Bewegung liegt bei der Larmor-Frequenz, also ist T1 lang (Liquor rund 4 s). In festen Stoffen ist die Bewegung viel zu langsam, auch dort ist T1 lang. Mittelgroße Moleküle wie Fett bewegen sich ungefähr im passenden Tempo, deshalb hat Fett ein kurzes T1. Trägt man T1 über der Korrelationszeit $\\tau_c$ auf, gibt es ein Minimum bei $\\omega_0 \\tau_c \\approx 1$. Weil ω₀ mit B₀ wächst, werden die meisten Gewebe-T1 bei höherem Feld länger.',
      ru: '**T1 это резонансный эффект с окружением.** Возбуждённый спин отдаёт энергию, только если магнитное поле соседей колеблется в такт ларморовой частоте. Эти колебания возникают из-за движения молекул. Маленькие молекулы воды кувыркаются очень быстро, гораздо быстрее 64 МГц. Лишь малая часть их движения приходится на ларморову частоту, поэтому T1 длинное (ликвор около 4 с). В твёрдых веществах движение слишком медленное, и там T1 тоже длинное. Молекулы среднего размера, как жир, движутся примерно в подходящем темпе, поэтому у жира T1 короткое. Если построить T1 в зависимости от времени корреляции $\\tau_c$, будет минимум при $\\omega_0 \\tau_c \\approx 1$. Поскольку ω₀ растёт с B₀, у большинства тканей T1 при более высоком поле удлиняется.',
    },
  },
  {
    id: 'pr-csf-long-t2',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum hat Liquor ein sehr langes T2 (rund 2 s), viel länger als Hirngewebe?',
      ru: 'Почему у ликвора очень длинное T2 (около 2 с), гораздо длиннее, чем у ткани мозга?',
    },
    options: [
      {
        de: 'Die Wassermoleküle bewegen sich schnell und frei. Die Störfelder der Nachbarn schwanken so rasch, dass sie sich im Mittel aufheben, und die Spins bleiben lange in Phase.',
        ru: 'Молекулы воды движутся быстро и свободно. Мешающие поля соседей колеблются так быстро, что в среднем компенсируются, и спины долго остаются в фазе.',
      },
      {
        de: 'Liquor enthält viel mehr Protonen als Gewebe, deshalb dauert ihr Zerfall länger.',
        ru: 'В ликворе гораздо больше протонов, чем в ткани, поэтому их распад длится дольше.',
      },
      {
        de: 'In den Ventrikeln ist das Feld B₀ stärker als im übrigen Gehirn.',
        ru: 'В желудочках поле B₀ сильнее, чем в остальном мозге.',
      },
      {
        de: 'Liquor ist wärmer als Hirngewebe, und Wärme verlängert T2.',
        ru: 'Ликвор теплее, чем ткань мозга, а тепло удлиняет T2.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Wie stark stören sich Spins gegenseitig, wenn ihre Nachbarn ständig wechseln?',
      ru: 'Насколько сильно спины мешают друг другу, если их соседи постоянно меняются?',
    },
    explanation: {
      de: '**Schnelle Bewegung mittelt die Störungen weg.** Jeder Protonen-Spin spürt die kleinen Magnetfelder seiner Nachbarn. Bleiben diese Felder länger gleich, läuft der Spin etwas schneller oder langsamer als die anderen und verliert seine Phase. Im freien Wasser des Liquors wechseln die Nachbarn aber ständig. Mal ist das Störfeld positiv, mal negativ, und im Mittel bleibt fast nichts übrig. Wie ein Chor, in dem kleine Fehler einzelner Stimmen sofort von anderen ausgeglichen werden. In Gewebe hängen viele Wassermoleküle an Proteinen und Membranen, bewegen sich langsamer, und die Störungen mitteln sich schlechter. Darum ist T2 dort kürzer. In T2-gewichteten Bildern ist Liquor deshalb hell.',
      ru: '**Быстрое движение усредняет помехи.** Каждый протонный спин чувствует маленькие магнитные поля соседей. Если эти поля долго не меняются, спин бежит чуть быстрее или медленнее других и теряет фазу. В свободной воде ликвора соседи постоянно меняются. Мешающее поле то положительное, то отрицательное, и в среднем почти ничего не остаётся. Как хор, в котором небольшие ошибки отдельных голосов сразу выравниваются другими. В ткани многие молекулы воды связаны с белками и мембранами, движутся медленнее, и помехи усредняются хуже. Поэтому там T2 короче. На T2-взвешенных изображениях ликвор поэтому яркий.',
    },
  },
  {
    id: 'pr-bone-short-t2',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum erscheint fester (kortikaler) Knochen in normalen MRT-Bildern fast schwarz?',
      ru: 'Почему плотная (кортикальная) кость на обычных МРТ-изображениях выглядит почти чёрной?',
    },
    options: [
      {
        de: 'Seine wenigen Protonen sitzen fest in einer starren Matrix. Die Störfelder der Nachbarn mitteln sich nicht weg, T2 ist kürzer als eine Millisekunde, und das Signal ist weg, bevor gemessen wird.',
        ru: 'Его немногочисленные протоны прочно сидят в жёсткой матрице. Мешающие поля соседей не усредняются, T2 короче миллисекунды, и сигнал исчезает до измерения.',
      },
      {
        de: 'Knochen enthält überhaupt keinen Wasserstoff.',
        ru: 'В кости вообще нет водорода.',
      },
      {
        de: 'Das Kalzium im Knochen wird von der HF ionisiert und löscht das Signal.',
        ru: 'Кальций в кости ионизируется РЧ и гасит сигнал.',
      },
      {
        de: 'Knochen hat ein extrem kurzes T1 und ist deshalb immer gesättigt.',
        ru: 'У кости чрезвычайно короткое T1, поэтому она всегда насыщена.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Denk an das Gegenteil von Liquor: Was passiert mit den Störfeldern, wenn sich nichts bewegt?',
      ru: 'Подумай о противоположности ликвору: что происходит с мешающими полями, если ничего не движется?',
    },
    explanation: {
      de: '**Im Festkörper bleiben die Störfelder stehen.** Ohne Bewegung spürt jeder Spin dauerhaft dasselbe Nachbarfeld. Die Spins laufen deshalb extrem schnell auseinander. Kortikaler Knochen hat ein T2 deutlich unter einer Millisekunde. Klinische Sequenzen messen erst nach einigen Millisekunden (TE), dann ist die Quermagnetisierung schon verschwunden. Dazu kommt: Knochen hat wenig freies Wasser, also auch wenig Protonen. Ganz ohne Wasserstoff ist er aber nicht. Mit speziellen UTE-Sequenzen mit sehr kurzem TE kann man ihn sichtbar machen. Ionisiert wird nichts, die HF-Photonen sind dafür viel zu schwach.',
      ru: '**В твёрдом теле мешающие поля не меняются.** Без движения каждый спин постоянно чувствует одно и то же поле соседей. Поэтому спины расходятся чрезвычайно быстро. У кортикальной кости T2 заметно меньше миллисекунды. Клинические последовательности измеряют только через несколько миллисекунд (TE), а к этому времени поперечная намагниченность уже исчезла. Кроме того, в кости мало свободной воды, а значит, и мало протонов. Но совсем без водорода она не бывает. Со специальными последовательностями UTE с очень коротким TE её можно сделать видимой. Ничего не ионизируется, РЧ-фотоны для этого слишком слабы.',
    },
  },
  {
    id: 'pr-echo-limits',
    kind: 'multi',
    difficulty: 3,
    prompt: {
      de: 'Ein 90°-Puls, nach τ ein 180°-Puls, Echo bei 2τ. Welche Aussagen über dieses Spin-Echo stimmen? (Mehrfachauswahl)',
      ru: '90°-импульс, через τ 180°-импульс, эхо в момент 2τ. Какие утверждения об этом спиновом эхе верны? (Несколько ответов)',
    },
    options: [
      {
        de: 'Es holt die Dephasierung durch statische Feldunterschiede zurück, also den T2′-Anteil.',
        ru: 'Оно возвращает расфазировку из-за статических различий поля, то есть вклад T2′.',
      },
      {
        de: 'Die Echohöhe folgt $e^{-2\\tau/T_2}$ und nicht $e^{-2\\tau/T_2^*}$.',
        ru: 'Высота эха следует $e^{-2\\tau/T_2}$, а не $e^{-2\\tau/T_2^*}$.',
      },
      {
        de: 'Nach dem Echo laufen die Spins wieder auseinander, das Signal fällt erneut mit T2*.',
        ru: 'После эха спины снова расходятся, и сигнал снова падает с T2*.',
      },
      {
        de: 'Das Echo holt auch den T2-Anteil zurück, deshalb erreicht es wieder 100 %.',
        ru: 'Эхо возвращает и вклад T2, поэтому снова достигает 100 %.',
      },
      {
        de: 'Ein 180°-Puls macht die Spin-Spin-Wechselwirkungen rückgängig.',
        ru: '180°-импульс отменяет спин-спиновые взаимодействия.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Läufer im Stadion: Umdrehen hilft nur, wenn jeder sein Tempo behält. Was ist, wenn jemand zufällig stolpert?',
      ru: 'Бегуны на стадионе: разворот помогает, только если каждый сохраняет свой темп. А если кто-то случайно спотыкается?',
    },
    explanation: {
      de: '**Das Echo repariert nur, was sich nicht verändert.** Statische Feldunterschiede geben jedem Spin ein festes Tempo. Der 180°-Puls spiegelt die Phasen, die Schnellen liegen hinten und holen bis 2τ genau auf. Damit ist der T2′-Anteil zurück. Die Spin-Spin-Wechselwirkungen sind dagegen zufällig und ändern sich ständig, wie Läufer, die zufällig stolpern. Dieser Verlust bleibt. Deshalb erreicht das Echo höchstens $e^{-2\\tau/T_2}$, niemals 100 %. Nach dem Echo laufen die Spins wieder mit ihrem festen Tempo auseinander, und das Signal fällt erneut mit T2*. Mit weiteren 180°-Pulsen kann man weitere Echos erzeugen, deren Höhen der T2-Kurve folgen.',
      ru: '**Эхо исправляет только то, что не меняется.** Статические различия поля дают каждому спину постоянный темп. 180°-импульс зеркально отражает фазы, быстрые оказываются позади и точно догоняют к 2τ. Так возвращается вклад T2′. Спин-спиновые взаимодействия, напротив, случайны и всё время меняются, как бегуны, которые случайно спотыкаются. Эта потеря остаётся. Поэтому эхо достигает не больше $e^{-2\\tau/T_2}$ и никогда 100 %. После эха спины снова расходятся со своим постоянным темпом, и сигнал опять падает с T2*. Дополнительными 180°-импульсами можно получить новые эхо, высоты которых следуют кривой T2.',
    },
  },
];
