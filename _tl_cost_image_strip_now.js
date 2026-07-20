#!/usr/bin/env node
/**
 * Rescan ALL tl blobs and strip remaining cost/money graph images.
 * Previous bulk reported 0 fixes — this rescans live and writes.
 */
'use strict';
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const {
  stripCostImages,
  coverNeedsCostStrip,
  SAFE_COVER,
} = require('/workspace/_tl_cost_image_strip_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = '/tmp/tl-cost-strip-now.log';
const REPORT = '/tmp/tl-cost-strip-now-report.json';

try {
  for (const line of fs.readFileSync('/tmp/aq-drip.env', 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch (_e) {}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(s) {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

async function emailDone(stats) {
  const key = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to = process.env.ALERT_TO || 'koryjordanwhite@gmail.com';
  const from = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
  if (!key) return;
  const html = `<div style="font-family:Arial,sans-serif">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-weight:700;font-size:20px">🔴 RED LIGHT — CRO cost images stripped</div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <p>Removed remaining cost/money graph images from <code>tl</code> (no LLM).</p>
      <ul>
        <li>Scanned: ${stats.scanned}</li>
        <li>Fixed: ${stats.fixed}</li>
        <li>Already clean: ${stats.skipped}</li>
        <li>Cover cleared: ${stats.coverCleared}</li>
        <li>Errors: ${stats.errors}</li>
      </ul>
      <pre style="font-size:12px">${JSON.stringify(stats.removedWhy, null, 2)}</pre>
    </div>
  </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `🔴 RED LIGHT — CRO cost images stripped (${stats.fixed})`,
      html,
      text: `cost images stripped ${stats.fixed}/${stats.scanned}`,
    }),
  });
  log('EMAIL ' + r.status + ' ' + (await r.text()).slice(0, 120));
}

async function main() {
  log('START rescan+strip cost images on all tl');
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || [])
    .filter((e) => e && /^tl\d+$/i.test(e.id))
    .map((e) => e.id)
    .sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0, coverCleared: 0, removedWhy: {} };
  const CONC = 25;

  for (let i = 0; i < ids.length; i += CONC) {
    const chunk = ids.slice(i, i + CONC);
    await Promise.all(
      chunk.map(async (id) => {
        try {
          const entry = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
          stats.scanned++;
          if (!entry || !entry.answer) {
            stats.skipped++;
            return;
          }
          const { next, removed } = stripCostImages(entry.answer);
          const badCover = coverNeedsCostStrip(entry);
          if (!removed.length && !Object.keys(badCover).length) {
            stats.skipped++;
            return;
          }
          const patch = {
            ...entry,
            answer: next,
            tl_cost_images_stripped_at: Date.now(),
            tl_cost_images_stripped: removed,
          };
          for (const f of Object.keys(badCover)) {
            patch[f] = SAFE_COVER;
            stats.coverCleared++;
          }
          if (Object.keys(badCover).length) patch.cover_src = 'cro-cover-safe';
          await store.setJSON('answers/' + id + '.json', patch);
          for (const w of removed) stats.removedWhy[w] = (stats.removedWhy[w] || 0) + 1;
          stats.fixed++;
        } catch (e) {
          stats.errors++;
          log('ERR ' + id + ' ' + e.message);
        }
      })
    );
    if (i % 500 === 0 || i + CONC >= ids.length) {
      log(`progress ${Math.min(i + CONC, ids.length)}/${ids.length} fixed=${stats.fixed} skipped=${stats.skipped}`);
    }
  }

  fs.writeFileSync(REPORT, JSON.stringify({ ...stats, at: new Date().toISOString() }, null, 2));
  log('DONE ' + JSON.stringify(stats));
  await emailDone(stats);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
