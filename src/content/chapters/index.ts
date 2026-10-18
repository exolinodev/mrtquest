import type { Lang, Loc } from '../../i18n/format';
import type { ModuleId } from '../modules';
import type { TheorySection } from '../theory';
import { anwendungen } from './anwendungen';
import { hardware } from './hardware';
import { ANWENDUNGEN_HOOK, BILD_HOOK, einfuehrungIntro } from './intro';
import { kernspin } from './kernspin';
import { kraum } from './kraum';
import { bildPlus } from './bildPlus';
import { ortskodierung } from './ortskodierung';
import { prinzipPlus } from './prinzipPlus';
import { qualitaet } from './qualitaet';
import { relaxation } from './relaxation';
import { sequenzen } from './sequenzen';
import type { Chapter } from './types';

/** Ein Abschnitt aus einer Themendatei, z. B. [hardware, 3]. */
type Part = [Chapter, number];

/**
 * Setzt ein Kapitel aus Abschnitten der Themendateien zusammen, in der Reihenfolge des Skripts.
 * Nur der erste Abschnitt behält seinen Einstieg (hook); spätere Einstiege werden normaler Text.
 * Optional ersetzt `hook` den Einstieg des ersten Abschnitts.
 */
function compose(parts: Part[], hook?: Loc): Chapter {
  const build = (lang: Lang): TheorySection[] =>
    parts.map(([chapter, index], i) => {
      const section = chapter[lang][index];
      const blocks = section.blocks.map((b) => (b.type === 'hook' && i > 0 ? { type: 'p' as const, text: b.text } : b));
      if (i === 0 && hook) return { ...section, blocks: [{ type: 'hook' as const, text: hook[lang] }, ...blocks.filter((b) => b.type !== 'hook')] };
      return { ...section, blocks };
    });
  return { de: build('de'), ru: build('ru') };
}

const range = (chapter: Chapter, from: number, to: number): Part[] => Array.from({ length: to - from + 1 }, (_, i) => [chapter, from + i]);

/** Kapitel je Modul; die Prüfungsmodule folgen der Gliederung des Vorlesungsskripts. */
export const CHAPTERS: Record<ModuleId, Chapter> = {
  einfuehrung: compose([[einfuehrungIntro, 0], [anwendungen, 0], [einfuehrungIntro, 1], [einfuehrungIntro, 2], [einfuehrungIntro, 3], [einfuehrungIntro, 4]]),
  prinzip: compose([
    [kernspin, 0], // Warum Protonen?
    [kernspin, 1], // Spin
    [kernspin, 2], // Boltzmann
    [prinzipPlus, 0], // Boltzmann nachgerechnet
    [kernspin, 3], // Präzession, Larmor
    [prinzipPlus, 3], // ΔE = h·f₀
    [prinzipPlus, 1], // rotierendes Bezugssystem
    [kernspin, 4], // Bloch-Gleichung
    [kernspin, 5], // HF-Puls, FID
    [prinzipPlus, 2], // Bloch-Simulation lesen
    [relaxation, 0], // Relaxation
    [relaxation, 1], // T1
    [relaxation, 2], // T2, T2*
    [prinzipPlus, 4], // molekulare Bewegung
    [relaxation, 3], // Spin-Echo
  ]),
  bild: compose(
    [
      [hardware, 3], // Signaldetektion: EM-Welle, Antenne, komplexes Signal
      [bildPlus, 0], // Demodulation ins Basisband
      [ortskodierung, 0], // Grundidee: Gradient → ortsabhängige Frequenz
      [hardware, 0], // Magnetbauformen
      [hardware, 2], // HF-System und Spulen als Antennen
      [hardware, 4], // Komponenten und Signalkette
      [ortskodierung, 1], // drei Gradienten, dω/dz
      [hardware, 1], // Shim und Gradientenspulen
      [ortskodierung, 2], // Schichtselektion
      [bildPlus, 5], // Schichtprofil und sinc-Puls
      [ortskodierung, 4], // Phasenkodierung
      [ortskodierung, 3], // Frequenzkodierung: die Spule hört die Summe
      [bildPlus, 1], // FOV, Pixelgröße, Bandbreite nachgerechnet
      [ortskodierung, 5], // Pulsdiagramm und Weg in den k-Raum
      [bildPlus, 3], // Zeile für Zeile: k-Raum füllen
      [kraum, 3], // k-Raum
      [kraum, 4], // inverse Transformation, Betrag und Phase
      [bildPlus, 2], // Kehrwert-Prinzip
      [kraum, 5], // Zentrum und Rand
      [relaxation, 4], // T2 im Spektrum
      [relaxation, 5], // Gewichtung PD/T1/T2
      [bildPlus, 4], // Signalgleichung nachgerechnet
      [hardware, 5], // Recap: essentielle Komponenten
    ],
    BILD_HOOK,
  ),
  anwendungen: compose(range(anwendungen, 1, 5), ANWENDUNGEN_HOOK),
  fourier: compose(range(kraum, 0, 2)),
  sequenzen,
  qualitaet,
};
