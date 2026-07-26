#!/usr/bin/env node
/**
 * Boot CRO finish drip: build/save fail queue once, status email, prove 3 finishes, then continuous drip.
 */
process.env.GOLD_SKIP_IMG_GATE = '1';
const fs = require('fs');
const { spawn } = require('child_process');

try {
  for (const line of fs.readFileSync('/tmp/aq-drip.env', 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch (_e) {}

const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { gradeEntry } = require('/workspace/netlify/functions/lib/grade-entry');
const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token });
const QUEUE_F = '/tmp/tl-finish-queue.json';
const STATE_F = '/tmp/tl-finish-drip-state.json';
const LOG = '/tmp/tl-finish-boot.log';

function log(s) {
  const l = `[${new Date().toISOString()}] ${s}`;
  console.log(l);
  fs.appendFileSync(LOG, l + '\n');
}

async function email(subject, html) {
  const key = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to = process.env.ALERT_TO || 'koryjordanwhite@gmail.com';
  const from = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text: subject }),
  });
  const t = await r.text();
  log('EMAIL ' + r.status + ' ' + t.slice(0, 140));
  return r.ok;
}

function runOnce() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['/workspace/_tl_finish_drip.js'], {
      env: Object.assign({}, process.env, { ONCE: '1', GOLD_SKIP_IMG_GATE: '1', INTERVAL_MS: '1000' }),
      stdio: 'inherit',
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('once exit ' + code))));
  });
}

(async () => {
  let ids = [];
  if (fs.existsSync(QUEUE_F)) {
    try {
      ids = JSON.parse(fs.readFileSync(QUEUE_F, 'utf8')).ids || [];
    } catch (_e) {}
  }
  if (!ids.length) {
    log('Building fail queue (fast)…');
    const idx = await store.get('_index.json', { type: 'json' });
    const tl = (idx.entries || [])
      .filter((e) => e && /^tl\d+$/i.test(e.id))
      .sort((a, b) => +a.id.slice(2) - +b.id.slice(2));
    const fails = [];
    const CONC = 40;
    for (let i = 0; i < tl.length; i += CONC) {
      const chunk = tl.slice(i, i + CONC);
      await Promise.all(
        chunk.map(async (row) => {
          const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
          if (!e || !e.answer) return;
          const g = gradeEntry(row.id, e.answer, { imagesDeferred: true, title: e.question });
          if ((g.score || 0) < 13) fails.push(row.id);
        })
      );
      if (i % 800 === 0 || i + CONC >= tl.length) {
        log(`audit ${Math.min(i + CONC, tl.length)}/${tl.length} fails=${fails.length}`);
      }
    }
    ids = fails;
    fs.writeFileSync(QUEUE_F, JSON.stringify({ at: new Date().toISOString(), total: tl.length, ids }, null, 2));
    log('Queue saved ' + ids.length);
  } else {
    log('Loaded saved queue ' + ids.length);
  }

  fs.writeFileSync(
    STATE_F,
    JSON.stringify(
      {
        pillar: 'tl',
        created_at: Date.now(),
        cursor: 0,
        queue: ids,
        total: ids.length,
        done: [],
        finished: [],
        skipped_pass: [],
        emailed: [],
        errors: [],
        status: 'dripping',
      },
      null,
      2
    )
  );

  await email(
    '🔴 RED LIGHT — CRO finish drip LIVE (per-answer emails on)',
    `<div style="font-family:Arial,sans-serif">
      <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-weight:700;font-size:20px">🔴 RED LIGHT — Answer finish drip is live</div>
      <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
        <p>The pricing-image emails were a <b>one-time bulk strip</b>. Those are done — you will not get more of those.</p>
        <p>You should now get a separate email for <b>each corrected answer page</b>:</p>
        <p style="font-weight:700">Subject: 🔴 RED LIGHT — tl#### finished 13/13</p>
        <ul>
          <li>Queue: <b>${ids.length}</b> CRO Pulse Tools pages still under 13/13</li>
          <li>Pace: 1 finished page / ~60 seconds</li>
          <li>Already-13/13 pages are skipped (no email)</li>
          <li>Check Spam/Promotions for <code>onboarding@resend.dev</code></li>
        </ul>
        <p>Next emails = individual finished pages with the live /tools/ link.</p>
        <p style="color:#666;font-size:12px">${new Date().toISOString()}</p>
      </div>
    </div>`
  );

  for (let i = 0; i < 3; i++) {
    log('Prove unit ' + (i + 1) + '/3');
    await runOnce();
  }

  log('Launching continuous drip INTERVAL=60s');
  const out = fs.openSync('/tmp/tl-finish-drip.console.log', 'a');
  const child = spawn('node', ['/workspace/_tl_finish_drip.js'], {
    env: Object.assign({}, process.env, { GOLD_SKIP_IMG_GATE: '1', INTERVAL_MS: '60000', ONCE: '' }),
    detached: true,
    stdio: ['ignore', out, out],
  });
  fs.writeFileSync('/tmp/tl-finish-drip.pid', String(child.pid));
  child.unref();
  log('STARTED pid=' + child.pid);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
