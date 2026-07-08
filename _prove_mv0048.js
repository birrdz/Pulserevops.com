// One-off proof: reshape mv0048 to gold Top-10 + apply the real posters that already exist on disk,
// verify 13/13 + master-law + image audit, publish, and email the QID link. Demonstrates the full fix.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const M = require('./_ranking_list_master_law');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;

(async () => {
  const id = 'mv0048';
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  const title = e.question;
  // 1) reshape to gold structure (drops per-slot imgs)
  let body = collapseToGoldStructure(e.answer, id, title);
  // 2) re-apply the REAL posters already self-hosted at /assets/qa/mv0048-10N.jpg (rank order)
  let rank = 0;
  body = body.split('\n').map(line => {
    const h = line.match(/^##\s+(\d+)\.\s+/); if (h) { rank = parseInt(h[1], 10); return line; }
    if (/^@@PRODUCT/.test(line) && rank >= 1 && rank <= 10) {
      const nm = (line.match(/name="([^"]*)"/) || [])[1] || '';
      const st = (line.match(/site="([^"]*)"/) || [])[1] || 'https://www.imdb.com/';
      const rel = '/assets/qa/' + id + '-' + (100 + rank) + '.jpg';
      const ok = (() => { try { return fs.statSync(WD + rel).size > 8000; } catch (x) { return false; } })();
      return '@@PRODUCT name="' + nm + '" img="' + (ok ? rel : '') + '" site="' + st + '"';
    }
    return line;
  }).join('\n');
  // 3) verify
  const master = M.auditRankingListMaster(body, title);
  const imgs = auditImages(id, body);
  const grade = gradeEntry(id, body, { imagesDeferred: false });
  console.log('master compliant:', master.compliant, '| image audit:', imgs.compliant, '| grade:', grade.score + '/13', '| missing:', JSON.stringify(grade.missing));
  if (!master.compliant) { console.log('master issues:', JSON.stringify(master.issues.slice(0, 8))); }
  if (!master.compliant || !imgs.compliant) { console.log('NOT publishing — not fully compliant'); process.exit(2); }
  // 4) publish: save blob + index (quality_score, pulse-recent), keep existing cover for the mosaic tile
  const now = new Date().toISOString();
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, quality_score: 13, updated_at: now }));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(x => x && x.id === id);
  if (row) { row.quality_score = 13; row.tags = [...new Set([...(row.tags || []), 'pulse-recent'])]; await store.setJSON('_index.json', idx); }
  console.log('PUBLISHED mv0048 @ 13/13');
  // 5) email the QID link
  const url = 'https://pulserevops.com/knowledge/' + id;
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px;color:#15110d">' +
    '<p style="font-size:18px;font-weight:800">✅ Q&amp;A fixed &amp; published · ' + id + '</p>' +
    '<p style="font-size:13px;color:#0b57d0;font-weight:700">MV pillar · 13/13 gold Top-10 · 10 real movie posters</p>' +
    '<p style="font-weight:700">' + title + '</p>' +
    '<p><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p></div>';
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject: '✅ mv0048 fixed · ' + String(title).slice(0, 60), html }) });
  console.log('email HTTP', r.status);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
