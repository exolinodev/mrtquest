import type { ModuleId } from '../modules';
import { anwendungen } from './anwendungen';
import { hardware } from './hardware';
import { kernspin } from './kernspin';
import { kraum } from './kraum';
import { ortskodierung } from './ortskodierung';
import { qualitaet } from './qualitaet';
import { relaxation } from './relaxation';
import { sequenzen } from './sequenzen';
import type { Chapter } from './types';

/** Kapitel im Erklärformat, je Modul in Deutsch und Russisch. */
export const CHAPTERS: Record<ModuleId, Chapter> = { kernspin, relaxation, ortskodierung, kraum, hardware, anwendungen, sequenzen, qualitaet };
