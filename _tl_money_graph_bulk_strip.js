#!/usr/bin/env node
/**
 * Bulk strip CRO Pulse Tools money / frac-vs-FT cost graphs from tl blobs.
 * No LLM. No image API. Blob writes only.
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const SAFE_COVER = 'https://pulserevops.com/assets/cro-cover-8.jpg';
const LOG = '/tmp/tl-money-graph-bulk.log';
const REPORT = '/tmp/tl-money-graph-bulk-report.json';
const QUEUE = '/tmp/tl-money-graph-targets.json';

try {
  const envPath = '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
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

function safeDecode(s) {
  try {
    return decodeURIComponent(String(s).replace(/\+/g, ' '));
  } catch {
    return String(s).replace(/%20/g, ' ').replace(/\+/g, ' ');
  }
}

function classifyImg(img) {
  const u = (img.match(/\(([^)]+)\)/) || [])[1] || '';
  const alt = (img.match(/!\[([^\]]*)\]/) || [])[1] || '';
  const blob = safeDecode(alt + ' ' + u);
  if (/cro-cover-4\.(jpg|png|webp)/i.test(u)) return 'cro-cover-4';
  if (/cro-cover-5\.(jpg|png|webp)/i.test(u)) return 'cro-cover-5';
  if (/fractional-cro-roi-comparison/i.test(u)) return 'roi-comparison-asset';
  if (
    /pollinations\.ai\/prompt\//i.test(u) &&
    /(real\s*cost|cost\s*breakdown|cost\s*of\s*a\s*frac|fractional\s*vs\.?\s*full|full[- ]?time\s*vs\.?\s*frac|compare:\s*fractional|what\s*you\s*(actually\s*)?get\s*for)/i.test(
      blob
    )
  ) {
    return 'cost-prompt';
  }
  if (/pollinations\.ai\/prompt\//i.test(u) && /fractional\s*cro\s*vs\.?\s*full/i.test(blob)) {
    return 'frac-vs-ft-prompt';
  }
  return null;
}

function stripBody(answer) {
  const removed = [];
  let next = String(answer || '').replace(/!\[[^\]]*\]\([^)]+\)/g, (img) => {
    const why = classifyImg(img);
    if (!why) return img;
    removed.push(why);
    return '';
  });
  next = next.replace(/([^\n])\n{3,}/g, '$1\n\n').replace(/\n{3,}/g, '\n\n');
  return { next, removed };
}

function coverNeedsStrip(entry) {
  const hit = {};
  for (const f of ['img', 'cover', 'face_path']) {
    const v = String(entry[f] || '');
    if (/cro-cover-4/i.test(v) || /cro-cover-5/i.test(v)) hit[f] = v;
  }
  return hit;
}

async function main() {
  const cached = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const ids = cached.hits.map((h) => h.id);
  log(`BULK strip start — ${ids.length} target entries`);
  const stats = { fixed: 0, skipped: 0, errors: 0, removedWhy: {}, coverCleared: 0 };
  const CONC = 20;

  for (let i = 0; i < ids.length; i += CONC) {
    const chunk = ids.slice(i, i + CONC);
    await Promise.all(
      chunk.map(async (id) => {
        try {
          const entry = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
          if (!entry) {
            stats.errors++;
            return;
          }
          const { next, removed } = stripBody(entry.answer);
          const badCover = coverNeedsStrip(entry);
          if (!removed.length && !Object.keys(badCover).length) {
            stats.skipped++;
            return;
          }
          const patch = {
            ...entry,
            answer: next,
            tl_money_graph_stripped_at: Date.now(),
            tl_money_graph_stripped: removed,
          };
          for (const f of Object.keys(badCover)) {
            patch[f] = SAFE_COVER;
            stats.coverCleared++;
          }
          if (Object.keys(badCover).length) patch.cover_src = 'cro-cover-safe';
          await store.setJSON('answers/' + id + '.json', patch);
          stats.fixed++;
          for (const w of removed) stats.removedWhy[w] = (stats.removedWhy[w] || 0) + 1;
        } catch (e) {
          stats.errors++;
          log('ERR ' + id + ' ' + e.message);
        }
      })
    );
    if (i % 200 === 0 || i + CONC >= ids.length) {
      log(
        `progress ${Math.min(i + CONC, ids.length)}/${ids.length} fixed=${stats.fixed} skip=${stats.skipped} err=${stats.errors}`
      );
    }
  }

  const report = { ok: true, total: ids.length, ...stats, at: new Date().toISOString() };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log('DONE ' + JSON.stringify(stats));

  const key = process.env.RESEND_API_KEY || process.env.resendapikey || '';
  const to = process.env.ALERT_TO || 'koryjordanwhite@gmail.com';
  const from = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
  if (key) {
    const html = `<div style="font-family:Arial,sans-serif">
      <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-weight:700;font-size:20px">🔴 RED LIGHT — CRO money graphs stripped (bulk)</div>
      <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
        <p>Removed fractional-CRO money / cost-comparison images from CRO Pulse Tools (<code>tl</code>).</p>
        <ul>
          <li>Targets: ${ids.length}</li>
          <li>Stripped: ${stats.fixed}</li>
          <li>Already clean: ${stats.skipped}</li>
          <li>Errors: ${stats.errors}</li>
          <li>Cover fields cleared: ${stats.coverCleared}</li>
          <li>Breakdown: ${JSON.stringify(stats.removedWhy)}</li>
        </ul>
        <p><b>No LLM / image API usage</b> — blob writes only. Prose + SEO/IndexNow untouched.</p>
        <p style="color:#666;font-size:12px">${new Date().toISOString()}</p>
      </div></div>`;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🔴 RED LIGHT — CRO money graphs stripped (${stats.fixed})`,
        html,
        text: `RED LIGHT CRO money graphs stripped ${stats.fixed}/${ids.length}`,
      }),
    });
    log('EMAIL ' + r.status + ' ' + (await r.text()).slice(0, 160));
  } else {
    log('EMAIL skip — no key');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
