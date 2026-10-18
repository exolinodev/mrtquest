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
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

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
  320: { width: 320, height: 740 }, // schmales iPhone
  360: { width: 360, height: 740 }, // kleines Android
  390: { width: 390, height: 844 }, // iPhone 13/14
  430: { width: 430, height: 932 }, // großes Smartphone
  768: { width: 768, height: 1024 }, // Tablet hochkant
  844: { width: 844, height: 390 }, // Smartphone quer
  901: { width: 901, height: 700 }, // direkt oberhalb des Sidebar-Breakpoints
  1024: { width: 1024, height: 768 }, // Tablet quer
  1280: { width: 1280, height: 900 }, // Desktop-Kontrolle
};

const MODULES = ['einfuehrung', 'prinzip', 'bild', 'anwendungen', 'fourier', 'sequenzen', 'qualitaet'];
const SCENARIOS = ['ms-flair', 'claustro-brain', 'knee-stir-3t', 'liver-breathhold', 'stroke-dwi', 'implant-spine'];
const SIMULATORS = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol', 'signal', 'fourier', 'applications', 'modality'];

/** Seiten inkl. optionaler Interaktion, damit auch Zustände nach Klicks geprüft werden. */
const PAGES = [
  { name: 'uebersicht', path: '/' },
  { name: 'vorlesung', path: '/vorlesung' },
  ...['kontrollfragen','karteikarten','spickzettel','lab3'].map(tab=>({name:`vorlesung-${tab}`,path:`/vorlesung/${tab}`})),
  {
    name: 'vorlesung-kontrollfrage-offen', path: '/vorlesung/kontrollfragen',
    interact: async page=>{
      for (const btn of await page.locator('.recap-lesson .btn.primary').all()) await btn.click();
      assert.ok(await page.locator('.recap-answer').first().isVisible());
    },
  },
  {
    name: 'vorlesung-karteikarte', path: '/vorlesung/karteikarten',
    interact: async page=>{
      await page.locator('.flashcard .btn.primary').click();
      assert.ok(await page.locator('.flashcard .recap-answer').isVisible());
    },
  },
  {
    name: 'vorlesung-alter-link', path: '/vorlesung/dft',
    interact: async page=>{
      await page.waitForFunction(()=>location.hash==='#/modul/fourier');
      assert.ok(await page.locator('.theory').isVisible());
    },
  },
  {
    name: 'theorie-pruefungsfrage', path: '/modul/prinzip/theorie',
    interact: async page=>{
      for (const summary of await page.locator('.exam-block summary').all()) await summary.click();
    },
  },
  ...MODULES.flatMap((m) => [
    { name: `modul-${m}-theorie`, path: `/modul/${m}/theorie` },
    { name: `modul-${m}-simulator`, path: `/modul/${m}/simulator` },
    { name: `modul-${m}-intro`, path: `/modul/${m}/challenge` },
    { name: `modul-${m}-challenge`, path: `/modul/${m}/challenge`, click: '.challenge-intro .btn.primary' },
  ]),
  { name: 'klinik', path: '/klinik' },
  ...SCENARIOS.map((s) => ({ name: `klinik-${s}`, path: `/klinik/${s}` })),
  { name: 'labor', path: '/labor' },
  ...SIMULATORS.map((s) => ({ name: `labor-${s}`, path: `/labor/${s}` })),
  { name: 'pruefung', path: '/pruefung' },
  { name: 'pruefung-offen', path: '/pruefung', unlockedExam: true },
  { name: 'pruefung-frage', path: '/pruefung', unlockedExam: true, click: '.challenge-intro .btn.primary' },
  { name: 'profil', path: '/profil' },
  { name: 'navigation-offen', path: '/', click: '.menu-btn', mobileOnly: true },
  {
    name: 'challenge-regeln', path: '/modul/bild/challenge',
    interact: async (page) => {
      await page.locator('.challenge-rules summary').click();
      assert.match(await page.locator('.challenge-overview').innerText(), /7/);
    },
  },
  {
    name: 'challenge-auswertung', path: '/modul/prinzip/challenge',
    interact: async (page) => {
      await page.locator('.challenge-start').click();
      for (let i = 0; i < 8; i++) {
        const input = page.locator('.numeric-input input');
        if (await input.count()) await input.fill('0');
        else await page.locator('.option').first().click();
        await page.locator('.question button[type="submit"]').press('Enter');
        await page.locator('.feedback').waitFor({ state: 'visible' });
        await page.locator('.feedback .btn').click();
        await page.locator('.feedback').waitFor({ state: 'hidden' });
      }
      assert.equal(await page.locator('.challenge-review-item').count(), 8);
      await page.locator('.challenge-review-item summary').first().click();
    },
  },
  {
    name: 'gradient-offset-max', path: '/labor/gradient',
    interact: async (page) => page.getByRole('slider').nth(2).press('End'),
  },
  ...[1, 2].map((index) => ({
    name: `gradient-modus-${index + 1}`, path: '/labor/gradient',
    interact: async (page) => page.getByRole('radiogroup').first().getByRole('radio').nth(index).click(),
  })),
  ...[0, 2, 3, 4].map((index) => ({
    name: `sequenz-modus-${index}`, path: '/labor/sequence',
    interact: async (page) => page.getByRole('radiogroup').first().getByRole('radio').nth(index).click(),
  })),
  {
    name: 'kraum-basiswelle', path: '/labor/kspace',
    interact: async (page) => page.locator('canvas.clickable').click(),
  },
  {
    name: 'scanner-auswahl', path: '/modul/bild/simulator/scanner',
    interact: async (page) => {
      await page.locator('.scanner-index summary').click();
      await page.locator('.scanner-component[data-component="surface"]').click();
      assert.equal(await page.locator('.scanner-svg').getAttribute('data-focus'), 'surface');
      assert.ok(await page.locator('.scanner-map').isVisible(), 'Scanner muss bei der Bauteil-Erklärung sichtbar bleiben');
      assert.ok(await page.locator('.scanner-info').isVisible(), 'Erklärung muss zusammen mit dem Scanner sichtbar sein');
      assert.equal(await page.locator('.sx-focus-layer').count(), 1);
      await page.locator('.scanner-detail-nav button').last().click();
      assert.equal(await page.locator('.scanner-svg').getAttribute('data-focus'), 'table');
    },
  },
  {
    name: 'scanner-zoom', path: '/labor/scanner',
    interact: async (page) => {
      const enlarge = page.getByRole('button', { name: /^(Vergrößern|Увеличить)$/ });
      await enlarge.click();
      await enlarge.click();
    },
  },
  {
    name: 'scanner-quiz-feedback', path: '/labor/scanner',
    interact: async (page) => {
      await page.locator('.scanner-map .panel-head button').click();
      await page.locator('.scanner-component[data-component="gradient"]').click();
      assert.equal(await page.locator('.scanner-svg').getAttribute('data-focus'), 'gradient');
      assert.ok(await page.locator('.scanner-quiz-feedback.is-correct').isVisible());
      assert.equal(await page.locator('.scanner-svg [data-part="gradient"]').getAttribute('aria-disabled'), 'true');
    },
  },
  {
    name: 'artefakt-auswertung', path: '/labor/artifact',
    interact: async (page) => {
      await page.locator('.options.compact').nth(0).getByRole('button').first().click();
      await page.locator('.options.compact').nth(1).getByRole('button').first().click();
      await page.locator('.sim-grid > .panel').last().locator('.btn.primary').click();
    },
  },
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
  for (const el of document.querySelectorAll('button, a[href], input, select, .toggle, [role="button"], [role="radio"]')) {
    const r = el.getBoundingClientRect();
    if (!visible(el, r) || el.closest('[inert], [aria-hidden="true"]') || el.closest('svg')) continue;
    // SVG parts also have full-sized component buttons; hidden toggles use their label.
    if (el.matches('.toggle input')) continue;
    if (r.width < 43.5 || r.height < 43.5) smallTargets.push(`${describe(el)} (${Math.round(r.width)}×${Math.round(r.height)})`);
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
        const mobile = vp.width <= 900;
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
          if (pg.unlockedExam) {
            // Separate page fixture: also cover the exam after all modules are played.
            await page.addInitScript((ids) => localStorage.setItem('mrt-quest:v1', JSON.stringify({
              version: 1,
              modules: Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 0, perfect: false, theoryRead: false, xpEarned: 0 }])),
            })), MODULES);
          } else {
            await page.addInitScript(() => localStorage.removeItem('mrt-quest:v1'));
          }
          await page.goto(`${BASE}#${pg.path}`, { waitUntil: 'load' });
          await page.locator('main h1').waitFor();
          await page.evaluate(() => document.fonts.ready);
          if (pg.click) {
            await page.click(pg.click, { timeout: 3000 }).catch((e) => errors.push(`Klick ${pg.click}: ${e.message.split('\n')[0]}`));
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          }
          if (pg.interact) {
            await pg.interact(page).catch((e) => errors.push(`Interaktion: ${e.message.split('\n')[0]}`));
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
  const failures = results.filter((r) => r.horizontalOverflow || r.offenders.length || r.smallTargets.length || r.errors.length);
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
