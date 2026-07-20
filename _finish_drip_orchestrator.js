#!/usr/bin/env node
/**
 * Finish drip orchestrator — pillar → pillar until all under-13 queues are done.
 *
 * 1) Always finish CRO Pulse Tools (tl) first
 * 2) Then remaining pillars by under-13 count (desc)
 * 3) When tl completes → email ✅✅ + write /tmp/tl-finish-COMPLETE.flag
 * 4) Background index reconciler keeps scores sticking against scrubber overwrites
 *
 *   INTERVAL_MS=10000 node _finish_drip_orchestrator.js
 */
const fs = require('fs');
const { spawn } = require('child_process');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { stampIndexFromAnswers } = require('/workspace/_finish_index_stamp_lib');

try {
  const envPath = process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const ORCH_STATE = '/tmp/finish-drip-orchestrator.json';
const ORCH_LOG = '/tmp/finish-drip-orchestrator.log';
const TL_DONE_FLAG = '/tmp/tl-finish-COMPLETE.flag';
const INTERVAL_MS = process.env.INTERVAL_MS || '10000';
const RECIPIENT = process.env.ALERT_TO || process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
const RESEND_FROM = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(line) {
  const s = `[${new Date().toISOString()}] ${line}`;
  console.log(s);
  fs.appendFileSync(ORCH_LOG, s + '\n');
}

function loadOrch() {
  try {
    return JSON.parse(fs.readFileSync(ORCH_STATE, 'utf8'));
  } catch {
    return { created_at: Date.now(), completed: [], current: null, status: 'init' };
  }
}

function saveOrch(st) {
  st.updated_at = Date.now();
  fs.writeFileSync(ORCH_STATE, JSON.stringify(st, null, 2));
}

async function pillarOrder() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const map = {};
  for (const e of idx.entries || []) {
    const id = String(e.id || '');
    const m = id.match(/^([a-z]+)\d+$/i);
    if (!m) continue;
    const p = m[1].toLowerCase();
    map[p] = map[p] || { total: 0, under: 0 };
    map[p].total++;
    if ((Number(e.quality_score) || 0) < 13) map[p].under++;
  }
  const rest = Object.entries(map)
    .filter(([p, v]) => p !== 'tl' && v.under > 0)
    .sort((a, b) => b[1].under - a[1].under)
    .map(([p]) => p);
  const order = [];
  if (map.tl && (map.tl.under > 0 || !fs.existsSync(TL_DONE_FLAG))) order.push('tl');
  order.push(...rest);
  return { order, map };
}

function runPillar(pillar) {
  return new Promise((resolve) => {
    log(`▶ start pillar=${pillar}`);
    const child = spawn(
      process.execPath,
      ['/workspace/_tl_finish_drip.js'],
      {
        env: Object.assign({}, process.env, {
          PILLAR: pillar,
          INTERVAL_MS,
          GOLD_SKIP_IMG_GATE: '1',
          EMAIL_ON_PASS: process.env.EMAIL_ON_PASS || '1',
          EMAIL_REQUIRE_IMAGES: process.env.EMAIL_REQUIRE_IMAGES || '0',
          INDEX_STAMP_EVERY: process.env.INDEX_STAMP_EVERY || '3',
        }),
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    const outLog = `/tmp/${pillar}-finish-drip.console.log`;
    const out = fs.createWriteStream(outLog, { flags: 'a' });
    child.stdout.pipe(out);
    child.stderr.pipe(out);
    child.on('exit', (code) => {
      log(`⏹ pillar=${pillar} exit=${code}`);
      resolve(code || 0);
    });
  });
}

async function emailTlDone(st) {
  if (!RESEND_KEY) return;
  const finished = (st && st.finished) || [];
  const html = `<div style="font-family:Arial,sans-serif">
    <div style="background:#15803d;color:#fff;padding:14px 18px;font-weight:700;font-size:22px">✅✅ CRO Pulse Tools finish drip COMPLETE</div>
    <div style="padding:16px;border:3px solid #15803d;background:#F0FDF4">
      <p style="font-size:18px;font-weight:700;margin:0 0 8px">Double green check — <code>tl</code> text finishes done.</p>
      <p style="margin:0 0 8px">Finished this run: <b>${finished.length}</b></p>
      <p style="margin:0;color:#666;font-size:12px">Orchestrator advancing to next pillar · ${new Date().toISOString()}</p>
    </div>
  </div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [RECIPIENT],
        subject: '✅✅ CRO Pulse Tools (tl) finish drip COMPLETE',
        html,
        text: 'DOUBLE GREEN CHECK — tl finish drip complete',
      }),
    });
    log('EMAIL tl-complete ' + r.status + ' ' + (await r.text()).slice(0, 120));
  } catch (e) {
    log('EMAIL tl-complete err ' + e.message);
  }
}

async function reconcileLoop(stopRef) {
  while (!stopRef.stop) {
    try {
      const files = fs.readdirSync('/tmp').filter((f) => f.endsWith('-finish-drip-state.json'));
      const ids = [];
      for (const f of files) {
        try {
          const st = JSON.parse(fs.readFileSync('/tmp/' + f, 'utf8'));
          for (const id of st.finished || []) ids.push(id);
        } catch (_e) {}
      }
      if (ids.length) {
        const r = await stampIndexFromAnswers(store, ids, { log });
        log('RECONCILE ' + JSON.stringify({ ids: ids.length, ...r }));
      }
    } catch (e) {
      log('RECONCILE err ' + (e.message || e));
    }
    await new Promise((r) => setTimeout(r, 45000));
  }
}

async function main() {
  const orch = loadOrch();
  orch.status = 'running';
  saveOrch(orch);
  const stopRef = { stop: false };
  reconcileLoop(stopRef);

  // initial repair of any finished so far
  try {
    const tlSt = JSON.parse(fs.readFileSync('/tmp/tl-finish-drip-state.json', 'utf8'));
    const r = await stampIndexFromAnswers(store, tlSt.finished || [], { log });
    log('BOOT stamp tl finished ' + JSON.stringify(r));
  } catch (_e) {}

  for (;;) {
    const { order, map } = await pillarOrder();
    log('ORDER ' + JSON.stringify(order) + ' under=' + JSON.stringify(Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.under]))));
    if (!order.length) {
      orch.status = 'all_complete';
      saveOrch(orch);
      log('ALL PILLARS COMPLETE');
      stopRef.stop = true;
      return;
    }
    for (const pillar of order) {
      if ((orch.completed || []).includes(pillar) && pillar !== 'tl') continue;
      // tl: skip only if complete flag + state complete
      if (pillar === 'tl' && fs.existsSync(TL_DONE_FLAG)) {
        const stPath = '/tmp/tl-finish-drip-state.json';
        let done = false;
        try {
          const st = JSON.parse(fs.readFileSync(stPath, 'utf8'));
          const qlen = Array.isArray(st.queue) ? st.queue.length : 0;
          done = st.status === 'complete' || (qlen > 0 && (st.cursor || 0) >= qlen);
        } catch (_e) {}
        if (done) {
          if (!(orch.completed || []).includes('tl')) {
            orch.completed = orch.completed || [];
            orch.completed.push('tl');
            saveOrch(orch);
          }
          continue;
        }
      }

      // stay on this pillar until truly complete (do not skip ahead on crash)
      for (;;) {
        orch.current = pillar;
        orch.status = 'dripping:' + pillar;
        saveOrch(orch);
        const code = await runPillar(pillar);
        const stPath = `/tmp/${pillar}-finish-drip-state.json`;
        let st = null;
        try {
          st = JSON.parse(fs.readFileSync(stPath, 'utf8'));
        } catch (_e) {
          st = null;
        }
        const qlen = st && Array.isArray(st.queue) ? st.queue.length : -1;
        const complete =
          !!st &&
          ((st.status === 'complete' && qlen >= 0) || (qlen > 0 && (st.cursor || 0) >= qlen));
        if (complete) {
          orch.completed = Array.from(new Set([...(orch.completed || []), pillar]));
          orch.current = null;
          saveOrch(orch);
          if (pillar === 'tl') {
            fs.writeFileSync(
              TL_DONE_FLAG,
              JSON.stringify({ at: new Date().toISOString(), finished: (st.finished || []).length }, null, 2)
            );
            await emailTlDone(st);
            log('✅✅ TL COMPLETE — advancing to next pillar');
          } else {
            log(`✅ pillar ${pillar} complete — next`);
          }
          break;
        }
        log(`pillar ${pillar} exited incomplete code=${code} — retry same pillar`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
