import type { Loc } from '../../i18n/format';
import type { ObjectiveId } from '../../content/examPrep';
import type { ModuleId } from '../../content/modules';

/** Ein Lernkonzept: die Einheit, in der Stärken und Lücken gemessen werden. */
export interface Concept {
  id: string;
  title: Loc;
  module: ModuleId;
  /** Lernziel des Skripts; null bei Bonus-Stoff */
  objective: ObjectiveId | null;
  /** Abschnitt im zusammengesetzten Kapitel (Anker sec-<modul>-<index>) */
  section: number;
  /** Pfad unter /labor für „Im Labor üben“ */
  lab?: string;
  /** Lern-Items dieses Konzepts: Fragen-IDs, `card:<id>` (Karteikarten), `recap:<id>` (Kontrollfragen) */
  items: string[];
}

const L = (de: string, ru: string): Loc => ({ de, ru });

export const CONCEPTS: Concept[] = [
  // Einführung
  { id: 'indikationen', title: L('Indikationen & Stärken', 'Показания и сильные стороны'), module: 'einfuehrung', objective: 'anwendung', section: 1, lab: 'applications/cases',
    items: ['ei-indications', 'ei-functional', 'ei-strengths', 'mbr-indikation', 'card:indikationen-weichteil-knochen'] },
  { id: 'modalitaeten', title: L('MRT im Vergleich', 'МРТ в сравнении'), module: 'einfuehrung', objective: 'anwendung', section: 2, lab: 'modality',
    items: ['ei-methods-overview', 'ei-modality-principles', 'ei-no-ionizing'] },
  { id: 'weichteilkontrast', title: L('Weichteile & Knochen', 'Мягкие ткани и кость'), module: 'einfuehrung', objective: 'prinzip', section: 3, lab: 'modality',
    items: ['ei-bone-dark', 'ei-water-contrast', 'ei-hydrogen-count'] },
  { id: 'uebersicht', title: L('Vom Proton zum Bild', 'От протона к изображению'), module: 'einfuehrung', objective: 'bild', section: 4, lab: 'scanner',
    items: ['ei-learning-goals', 'ei-five-steps', 'ei-input-output'] },
  { id: 'sicherheit', title: L('Sicherheit & Grenzen', 'Безопасность и ограничения'), module: 'einfuehrung', objective: 'technik', section: 5, lab: 'scanner',
    items: ['ei-projectile', 'ei-safety'] },

  // Physikalisches Prinzip
  { id: 'protonen', title: L('Warum Protonen', 'Почему протоны'), module: 'prinzip', objective: 'prinzip', section: 0, lab: 'larmor',
    items: ['ks-why-h', 'recap:recap-protonen'] },
  { id: 'spin', title: L('Spin & Energieniveaus', 'Спин и уровни энергии'), module: 'prinzip', objective: 'prinzip', section: 1, lab: 'ensemble',
    items: ['ks-energy', 'mbr-spin', 'pr-photon-ev', 'pr-no-ionisation', 'card:spin-energieniveaus'] },
  { id: 'boltzmann', title: L('Boltzmann & Nettomagnetisierung', 'Больцман и намагниченность'), module: 'prinzip', objective: 'prinzip', section: 2, lab: 'ensemble',
    items: ['ks-excess', 'ks-boltzmann-temp', 'pr-boltzmann-bt', 'pr-voxel-excess', 'card:boltzmann-nettomagnetisierung'] },
  { id: 'larmor', title: L('Larmor-Frequenz', 'Частота Лармора'), module: 'prinzip', objective: 'prinzip', section: 4, lab: 'larmor',
    items: ['ks-larmor-h', 'ks-larmor-x', 'ks-field-from-f', 'ks-double', 'ks-gamma-def', 'ks-multi-precession', 'mbr-larmor', 'ei-larmor-intro', 'card:larmor-rechnung'] },
  { id: 'resonanz', title: L('Resonanz & rotierendes System', 'Резонанс и вращающаяся система'), module: 'prinzip', objective: 'prinzip', section: 6, lab: 'ensemble',
    items: ['ks-resonance', 'pr-rotating-frame', 'pr-b1-cos', 'pr-resonance-conditions', 'pr-turns-per-pulse'] },
  { id: 'bloch', title: L('Bloch-Gleichung', 'Уравнение Блоха'), module: 'prinzip', objective: 'prinzip', section: 7, lab: 'signal',
    items: ['rx-bloch', 'mbr-bloch', 'pr-phase-spiral', 'card:bloch-terme'] },
  { id: 'hfpuls', title: L('HF-Puls, Flipwinkel & FID', 'РЧ-импульс, угол и FID'), module: 'prinzip', objective: 'prinzip', section: 8, lab: 'signal',
    items: ['ks-flip', 'ks-90pulse', 'pr-flip-gamma', 'mbr-pulse', 'card:hf-puls-fid'] },
  { id: 't1', title: L('T1-Relaxation', 'T1-релаксация'), module: 'prinzip', objective: 'prinzip', section: 11, lab: 'relaxation',
    items: ['rx-mz', 'rx-t1-def', 'rx-time-to', 'rx-field'] },
  { id: 't2', title: L('T2 & T2*', 'T2 и T2*'), module: 'prinzip', objective: 'prinzip', section: 12, lab: 'ensemble',
    items: ['rx-mxy', 'rx-t2star', 'rx-order', 'pr-t2star-inhomogeneity', 'mbr-relaxation', 'card:t1-t2-t2stern'] },
  { id: 'molekular', title: L('Molekulare Bewegung', 'Движение молекул'), module: 'prinzip', objective: 'prinzip', section: 13, lab: 'relaxation',
    items: ['pr-t1-minimum', 'pr-csf-long-t2', 'pr-bone-short-t2'] },
  { id: 'spinecho', title: L('Spin-Echo', 'Спиновое эхо'), module: 'prinzip', objective: 'prinzip', section: 14, lab: 'ensemble',
    items: ['rx-spin-echo', 'pr-echo-limits'] },

  // Vom Signal zum Bild
  { id: 'signaldetektion', title: L('Signaldetektion & komplexes Signal', 'Регистрация и комплексный сигнал'), module: 'bild', objective: 'technik', section: 0, lab: 'signal/spectrum',
    items: ['hw-faraday', 'hw-lambda', 'mbr-receiver', 'card:em-welle-komplexes-signal'] },
  { id: 'geraet', title: L('Gerät & Komponenten', 'Аппарат и компоненты'), module: 'bild', objective: 'technik', section: 2, lab: 'scanner',
    items: ['hw-gauss', 'hw-superconductor', 'hw-quench', 'hw-shim', 'hw-coils', 'hw-burns', 'hw-active-shield', 'hw-noise', 'mbr-hardware', 'mbr-recap',
      'recap:recap-komponenten', 'card:magnetbauformen', 'card:spulen-als-antennen', 'card:signalkette', 'card:feldstaerke-signal'] },
  { id: 'gradienten', title: L('Gradienten & Frequenz am Ort', 'Градиенты и частота по месту'), module: 'bild', objective: 'bild', section: 5, lab: 'gradient',
    items: ['ok-gradient', 'ok-delta-f', 'ok-offset', 'hw-rise', 'hw-gradient-coils', 'mbr-gradients', 'recap:recap-gradient-steigung', 'card:drei-gradientenrollen', 'card:gradientenspulen-funktion'] },
  { id: 'schichtwahl', title: L('Schichtselektion', 'Выбор среза'), module: 'bild', objective: 'bild', section: 7, lab: 'gradient',
    items: ['ok-slice', 'ok-shift-slice', 'ok-thin', 'ok-sinc', 'ok-rephase'] },
  { id: 'phasenkodierung', title: L('Phasenkodierung', 'Фазовое кодирование'), module: 'bild', objective: 'bild', section: 8, lab: 'gradient',
    items: ['ok-phase-repeat'] },
  { id: 'frequenzkodierung', title: L('Frequenzkodierung & Spin-Summe', 'Частотное кодирование и сумма спинов'), module: 'bild', objective: 'bild', section: 9, lab: 'fourier',
    items: ['ok-fov', 'ok-pixel', 'ok-readout-dephase', 'mbr-sum', 'card:frequenzkodierung', 'card:signal-als-integral'] },
  { id: 'kraum', title: L('k-Raum', 'k-пространство'), module: 'bild', objective: 'bild', section: 11, lab: 'kspace',
    items: ['kr-deltak', 'kr-kmax', 'kr-kpos', 'kr-center', 'kr-point', 'kr-hermitian', 'kr-trajectories', 'kr-tse-order', 'mbr-kspace', 'card:kraum-inverse-ft'] },
  { id: 'rekonstruktion', title: L('Rekonstruktion, Zentrum & Rand', 'Реконструкция, центр и край'), module: 'bild', objective: 'bild', section: 13, lab: 'kspace',
    items: ['kr-partial', 'kr-skip', 'kr-gibbs', 'kr-spike', 'mbr-filters', 'mbr-phase', 'recap:recap-kanten-kraum', 'card:kraum-zentrum-rand'] },
  { id: 'linienbreite', title: L('T2 im Spektrum', 'T2 в спектре'), module: 'bild', objective: 'bild', section: 14, lab: 'signal/spectrum',
    items: ['mbr-linewidth', 'recap:recap-t2-merkmal', 'card:fwhm-t2'] },
  { id: 'gewichtung', title: L('Gewichtung mit TR & TE', 'Взвешивание через TR и TE'), module: 'bild', objective: 'bild', section: 15, lab: 'relaxation',
    items: ['rx-t2w', 'rx-t1w-appearance', 'rx-multi-contrast', 'mbr-weighting', 'card:gewichtung-tr-te'] },

  // Klinische Anwendungen
  { id: 'klinikbilder', title: L('Klinische Bilder', 'Клинические снимки'), module: 'anwendungen', objective: 'anwendung', section: 0, lab: 'applications/cases',
    items: ['an-weighting-knee', 'an-pelvis-pregnancy', 'mbr-brain', 'mbr-knee', 'mbr-pelvis', 'mbr-pregnancy'] },
  { id: 'kontrastmittel', title: L('Kontrastmittel', 'Контрастное вещество'), module: 'anwendungen', objective: 'anwendung', section: 1, lab: 'applications/contrast',
    items: ['an-gadolinium', 'mbr-gadolinium', 'card:gadolinium'] },
  { id: 'funktion', title: L('PET/MRT & fMRI', 'ПЭТ/МРТ и фМРТ'), module: 'anwendungen', objective: 'anwendung', section: 2, lab: 'applications/bold',
    items: ['an-pet-mri', 'mbr-hybrid', 'mbr-bold', 'card:pet-mri'] },
  { id: 'fluss', title: L('Flussmessung', 'Измерение потока'), module: 'anwendungen', objective: 'anwendung', section: 3, lab: 'applications/flow',
    items: ['an-venc-phase', 'mbr-flow', 'card:fluss-phase'] },
  { id: 'spektroskopie', title: L('Spektroskopie', 'Спектроскопия'), module: 'anwendungen', objective: 'anwendung', section: 3, lab: 'applications/mrs',
    items: ['an-ppm-hz', 'mbr-mrs', 'card:spektroskopie'] },
  { id: 'diffusion', title: L('Diffusion & DTI', 'Диффузия и DTI'), module: 'anwendungen', objective: 'anwendung', section: 4, lab: 'applications/dti',
    items: ['an-dti', 'mbr-dti', 'card:dti'] },

  // Fourier-Transformation kompakt
  { id: 'fourierreihe', title: L('Fourier-Reihe', 'Ряд Фурье'), module: 'fourier', objective: 'bild', section: 0, lab: 'fourier',
    items: ['fo-saw-amp', 'fo-series', 'mbr-harmonics'] },
  { id: 'orthogonalitaet', title: L('Testfunktion & Koeffizienten', 'Тестовая функция и коэффициенты'), module: 'fourier', objective: 'bild', section: 1, lab: 'fourier',
    items: ['fo-ortho-int', 'fo-test-function', 'fo-bn-formula', 'card:fourier-reihe-an-bn'] },
  { id: 'dft', title: L('DFT, Linearität & Faltung', 'ДПФ, линейность и свёртка'), module: 'fourier', objective: 'bild', section: 2, lab: 'fourier',
    items: ['fo-dft-bin', 'fo-dft-sum', 'fo-properties', 'mbr-dft', 'mbr-fourier2d', 'mbr-convolution', 'card:fourier-linearitaet-faltung', 'card:dft-signalmodifikation'] },

  // Bonus
  { id: 'sequenzen', title: L('Pulssequenzen', 'Импульсные последовательности'), module: 'sequenzen', objective: null, section: 0, lab: 'sequence',
    items: ['sq-ta', 'sq-stir', 'sq-flair', 'sq-ernst', 'sq-opposed', 'sq-180', 'sq-tse-cons', 'sq-epi', 'sq-flair-use', 'sq-tieff', 'sq-dwi', 'sq-psd'] },
  { id: 'snr', title: L('SNR & Messzeit', 'SNR и время'), module: 'qualitaet', objective: null, section: 1, lab: 'protocol',
    items: ['q-nex', 'q-voxel', 'q-bw', 'q-snr-field'] },
  { id: 'sar', title: L('SAR & Stimulation', 'SAR и стимуляция'), module: 'qualitaet', objective: null, section: 3, lab: 'protocol',
    items: ['q-sar', 'q-sar-limit', 'q-pns'] },
  { id: 'artefakte', title: L('Artefakte', 'Артефакты'), module: 'qualitaet', objective: null, section: 4, lab: 'artifact',
    items: ['q-cs', 'q-aliasing', 'q-motion-direction', 'q-suscept', 'q-zipper', 'q-cs-direction'] },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c])) as Record<string, Concept>;

const ITEM_CONCEPT = new Map(CONCEPTS.flatMap((c) => c.items.map((item) => [item, c.id] as const)));

/** Konzept eines Lern-Items (Frage-ID, `card:<id>`, `recap:<id>`); undefined, wenn nicht zugeordnet. */
export function conceptOf(itemId: string): string | undefined {
  return ITEM_CONCEPT.get(itemId);
}
