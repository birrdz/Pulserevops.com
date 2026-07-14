// Visible Fix-It-All button clicker — headed Playwright, not silent API-only.
'use strict';
const fs = require('fs');
const http = require('http');

const WD = 'C:/Users/koryj/website';
const STOP_F = WD + '/_sim_autorun_stop.flag';
const PORT = parseInt(process.env.SIM_PORT || '8904', 10);
const START_PILLAR = (process.argv[2] || 'ca').toLowerCase();
const POLL_MS = 4000;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const stopped = () => fs.existsSync(STOP_F);

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function pillarOrder() {
  const d = await fetchJSON('/api/scope');
  const pillars = (d.pillars || []).slice().sort((a, b) => a.n - b.n).map(p => p.p);
  const idx = pillars.indexOf(START_PILLAR);
  if (idx < 0) throw new Error(`start pillar "${START_PILLAR}" not in registry`);
  return pillars.slice(idx).concat(pillars.slice(0, idx));
}

async function waitIdle(maxMs) {
  const deadline = Date.now() + (maxMs || 120000);
  while (Date.now() < deadline) {
    if (stopped()) return false;
    const d = await fetchJSON('/api/status');
    if (!d.running) return true;
    await sleep(POLL_MS);
  }
  return false;
}

async function waitForStage(targets, maxMs, expectScope) {
  const want = new Set(targets);
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (stopped()) return { ok: false, reason: 'stop-flag' };
    const d = await fetchJSON('/api/status');
    const st = d.status || {};
    if (expectScope && st.scope && st.scope !== expectScope && st.stage !== 'idle') {
      console.log(`[visible-click] scope drift ${st.scope} (want ${expectScope}) — waiting`);
      await sleep(POLL_MS);
      continue;
    }
    if (want.has(st.stage) && (!expectScope || st.scope === expectScope || st.scope == null)) {
      return { ok: true, status: st, running: d.running };
    }
    if (st.stage === 'error' && (!expectScope || st.scope === expectScope)) {
      return { ok: false, reason: 'error', status: st };
    }
    await sleep(POLL_MS);
  }
  return { ok: false, reason: 'timeout' };
}

async function highlightClick(page, selector, label) {
  const el = page.locator(selector);
  await el.scrollIntoViewIfNeeded();
  await el.evaluate(node => {
    node.style.outline = '4px solid #ff00ff';
    node.style.transform = 'scale(1.05)';
    node.style.transition = 'all 0.2s';
  });
  await sleep(400);
  console.log(`[visible-click] ${label}`);
  await el.click({ delay: 120 });
  await sleep(600);
}

(async () => {
  const { chromium } = require('playwright');
  const order = await pillarOrder();
  console.log(`[visible-click] pillar order (${order.length}): ${order.join(' → ')}`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 80,
    args: ['--start-maximized'],
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#scopes .chip[data-s]');

  for (let i = 0; i < order.length; i++) {
    const pillar = order[i];
    if (stopped()) {
      console.log('[visible-click] stop flag — halting');
      break;
    }

    console.log(`[visible-click] === pillar ${i + 1}/${order.length}: ${pillar} ===`);

    if (!(await waitIdle(180000))) {
      console.log('[visible-click] server never went idle — aborting pillar');
      break;
    }

    await highlightClick(page, `.chip[data-s="${pillar}"]`, `scope → ${pillar}`);
    await highlightClick(page, '#go', `① RUN REPORT (${pillar})`);

    const scanWait = await waitForStage(['scan-done', 'done'], 45 * 60 * 1000, pillar);
    if (!scanWait.ok) {
      console.log(`[visible-click] scan wait failed: ${scanWait.reason}`, scanWait.status || '');
      break;
    }

    const piles = scanWait.status.piles || {};
    const bad = (piles.NEAR_DUP || 0) + (piles.STUB || 0) + (piles.SUB13 || 0);
    console.log(`[visible-click] scan done · bad=${bad} piles=${JSON.stringify(piles)}`);

    if (bad === 0) {
      console.log(`[visible-click] ${pillar} clean — skip fix`);
      continue;
    }

    await page.waitForSelector('#fix', { state: 'visible', timeout: 15000 }).catch(() => {});
    await highlightClick(page, '#fix', `② GO ▸ FIX IT (${pillar})`);

    const fixWait = await waitForStage(['done', 'scan-done'], 3 * 60 * 60 * 1000, pillar);
    if (!fixWait.ok) {
      console.log(`[visible-click] fix wait failed: ${fixWait.reason}`, fixWait.status || '');
      break;
    }
    console.log(`[visible-click] ${pillar} complete · stage=${fixWait.status.stage}`);
  }

  console.log('[visible-click] cycle finished — browser stays open for viewing');
})().catch(e => { console.error('[visible-click] FATAL', e); process.exit(1); });
