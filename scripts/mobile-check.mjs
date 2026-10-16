#!/usr/bin/env node
/**
 * Mobiler Regressionstest: öffnet jede Seite der App in beiden Sprachen und in
 * mehreren Viewports, prüft horizontales Überlaufen, aus dem Bild ragende
 * Elemente, zu kleine Touch-Ziele und Konsolenfehler und speichert ganzseitige
 * Screenshots nach mobile-report/ zur visuellen Durchsicht.
 *
 * Voraussetzungen: `npm run build` und ein lokal installiertes Chrome/Chromium
 * (Pfad über CHROME_PATH überschreibbar). Exit-Code 1 bei Befunden.
 *
 *   npm run test:mobile                 # alle Viewports, beide Sprachen
 *   VIEWPORTS=360 LANGS=ru npm run test:mobile
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const PORT = Number(process.env.PORT ?? 4179);
const BASE = `http://localhost:${PORT}/`;
const OUT = 'mobile-report';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const ALL_VIEWPORTS = {
  360: { width: 360, height: 740 }, // kleines Android
  390: { width: 390, height: 844 }, // iPhone 13/14
  768: { width: 768, height: 1024 }, // Tablet hochkant
};

const MODULES = ['kernspin', 'relaxation', 'ortskodierung', 'kraum', 'sequenzen', 'qualitaet', 'hardware'];
const SCENARIOS = ['ms-flair', 'claustro-brain', 'knee-stir-3t', 'liver-breathhold', 'stroke-dwi', 'implant-spine'];
const SIMULATORS = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol'];

/** Seiten inkl. optionaler Interaktion, damit auch Zustände nach Klicks geprüft werden. */
const PAGES = [
  { name: 'uebersicht', path: '/' },
  ...MODULES.flatMap((m) => [
    { name: `modul-${m}-theorie`, path: `/modul/${m}/theorie` },
    { name: `modul-${m}-simulator`, path: `/modul/${m}/simulator` },
    { name: `modul-${m}-challenge`, path: `/modul/${m}/challenge`, click: '.challenge-intro .btn.primary' },
  ]),
  { name: 'klinik', path: '/klinik' },
  ...SCENARIOS.map((s) => ({ name: `klinik-${s}`, path: `/klinik/${s}` })),
  { name: 'labor', path: '/labor' },
  ...SIMULATORS.map((s) => ({ name: `labor-${s}`, path: `/labor/${s}` })),
  { name: 'pruefung', path: '/pruefung' },
  { name: 'profil', path: '/profil' },
  { name: 'navigation-offen', path: '/', click: '.menu-btn', mobileOnly: true },
];

const viewports = (process.env.VIEWPORTS ?? Object.keys(ALL_VIEWPORTS).join(','))
  .split(',')
  .map((v) => [v.trim(), ALL_VIEWPORTS[v.trim()]])
  .filter(([, v]) => v);
const langs = (process.env.LANGS ?? 'de,ru').split(',').map((l) => l.trim());

/**
 * Im Browser ausgewertet: Überlauf, herausragende Elemente, kleine Touch-Ziele.
 * vw ist die konfigurierte Gerätebreite – nicht window.innerWidth, denn bei mobiler
 * Emulation wächst der Layout-Viewport mit überlaufendem Inhalt mit.
 */
function inspectPage(vw) {
  const doc = document.documentElement;
  const describe = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
    const text = (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${cls}${text ? ` „${text}“` : ''}`;
  };
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
    }
    return false;
  };
  const visible = (el, r) => r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';

  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!visible(el, r) || el.closest('.sidebar') || el.closest('.toast-stack')) continue;
    if ((r.right > vw + 1 || r.left < -1) && !clipped(el)) offenders.push(`${describe(el)} [${Math.round(r.left)}…${Math.round(r.right)}px]`);
  }
  // Nur die äußersten Verursacher melden (Kinder überlaufender Elemente sind Folgefehler)
  const uniqueOffenders = [...new Set(offenders)].slice(0, 8);

  const smallTargets = [];
  for (const el of document.querySelectorAll('button, a[href], input, [role="button"], [role="radio"]')) {
    const r = el.getBoundingClientRect();
    if (!visible(el, r) || el.closest('.sidebar') || el.closest('svg')) continue;
    if (el.matches('input[type="range"], input[type="checkbox"]')) continue;
    if (r.width < 24 || r.height < 24) smallTargets.push(`${describe(el)} (${Math.round(r.width)}×${Math.round(r.height)})`);
  }

  return {
    scrollWidth: doc.scrollWidth,
    deviceWidth: vw,
    horizontalOverflow: doc.scrollWidth > vw + 1,
    offenders: uniqueOffenders,
    smallTargets: [...new Set(smallTargets)].slice(0, 8),
  };
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Server startet noch
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Vorschau-Server unter ${url} nicht erreichbar`);
}

async function main() {
  const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!executablePath) throw new Error('Kein Chrome/Chromium gefunden – CHROME_PATH setzen.');
  if (!existsSync('dist/index.html')) throw new Error('dist/ fehlt – zuerst `npm run build` ausführen.');

  rmSync(OUT, { recursive: true, force: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  const results = [];
  let browser;
  try {
    await waitForServer(BASE);
    browser = await chromium.launch({ executablePath, headless: true });

    for (const lang of langs) {
      for (const [vpName, vp] of viewports) {
        const mobile = vp.width < 768;
        const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
        await context.addInitScript((l) => localStorage.setItem('mrt-quest:lang', l), lang);
        const dir = join(OUT, lang, String(vpName));
        mkdirSync(dir, { recursive: true });

        for (const pg of PAGES) {
          if (pg.mobileOnly && !mobile) continue;
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
          page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
          await page.goto(`${BASE}#${pg.path}`, { waitUntil: 'load' });
          await page.waitForTimeout(350);
          if (pg.click) {
            await page.click(pg.click, { timeout: 3000 }).catch((e) => errors.push(`Klick ${pg.click}: ${e.message.split('\n')[0]}`));
            await page.waitForTimeout(350);
          }
          const report = await page.evaluate(inspectPage, vp.width);
          await page.screenshot({ path: join(dir, `${pg.name}.png`), fullPage: true });
          results.push({ lang, viewport: vpName, page: pg.name, ...report, errors });
          await page.close();
        }
        await context.close();
      }
    }
  } finally {
    await browser?.close();
    server.kill();
  }

  writeFileSync(join(OUT, 'report.json'), JSON.stringify(results, null, 2));
  const failures = results.filter((r) => r.horizontalOverflow || r.offenders.length || r.errors.length);
  const small = results.filter((r) => r.smallTargets.length);
  for (const r of failures) {
    console.log(`✘ ${r.lang}/${r.viewport}/${r.page}: scrollWidth ${r.scrollWidth}px bei ${r.viewport}px`);
    for (const o of r.offenders) console.log(`    ↳ ragt heraus: ${o}`);
    for (const e of r.errors) console.log(`    ↳ ${e}`);
  }
  for (const r of small) console.log(`△ ${r.lang}/${r.viewport}/${r.page}: kleine Touch-Ziele: ${r.smallTargets.join('; ')}`);
  console.log(`\n${results.length} Seitenansichten geprüft · ${failures.length} mit Fehlern · ${small.length} mit kleinen Touch-Zielen · Screenshots in ${OUT}/`);
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
