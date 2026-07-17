// new/_queue_bad_cro.js — load the worst ~N bad CRO/low-value tl URLs into Block Builder's queue
// for MANUAL redo (face card + images). NO generator, NO automation, NO text rewrite here — it just
// pulls each entry's EXISTING question+body from the blob and drops a builder entry so it shows up.
// Republish is inPlace (same URL). Skips anything already queued.
// Usage:  node new/_queue_bad_cro.js [N] --dry | --apply     (N default 2000)
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const ENTRIES = __dirname + '/entries';
const APPLY = process.argv.includes('--apply');
const N = parseInt(process.argv.find(a => /^\d+$/.test(a)) || '2000', 10);
const croRe = /fractional\s*cro|chief\s*revenue\s*officer|\brevops\b|revenue\s*operations|revenue\s*leader/i;

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const already = new Set(fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')) : []);
  let cands = idx.entries.filter(e => e && /^tl\d+$/i.test(e.id) && !e.bb && !already.has(e.id)
    && !/^\s*top\s*\d/i.test(String(e.question || e.title || '')) && (e.quality_score || 0) < 11);
  const hasCro = e => croRe.test(String(e.question || e.title || ''));
  cands.sort((a, b) => (hasCro(b) ? 1 : 0) - (hasCro(a) ? 1 : 0) || ((a.quality_score || 0) - (b.quality_score || 0)) || ((a.ts || 0) - (b.ts || 0)));
  const pick = cands.slice(0, N);
  console.log('bad tl candidates (score<11, not built, not queued):', cands.length, '· CRO-type:', cands.filter(hasCro).length);
  console.log('taking:', pick.length, '(CRO-type first, worst quality first)');
  console.log('sample:', pick.slice(0, 6).map(e => e.id + '(' + (e.quality_score || 0) + ')').join(', '));
  if (!APPLY) { console.log('\n--- DRY RUN — nothing written. Add --apply to queue them. ---'); return; }

  const stamp = new Date(Date.now()).toISOString().replace(/[:.]/g, '-');
  const bak = __dirname + '/entries.bak-badcro-' + stamp; fs.mkdirSync(bak, { recursive: true });
  for (const f of fs.readdirSync(ENTRIES)) { if (f.endsWith('.json')) try { fs.copyFileSync(ENTRIES + '/' + f, bak + '/' + f); } catch (e) {} }

  let created = 0, missing = 0; const CONC = 12; let cur = 0;
  async function worker() {
    while (cur < pick.length) {
      const e = pick[cur++];
      const blob = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
      const question = (blob && blob.question) || e.question || e.title || e.id;
      const body = (blob && blob.answer) || '';
      if (!body) { missing++; continue; }
      fs.writeFileSync(ENTRIES + '/' + e.id + '.json', JSON.stringify({ id: e.id, question, format: 'essay', body, inPlace: true, upgradeId: e.id, useLib: true, status: '3/3', created: new Date(Date.now()).toISOString(), requeued: 'bad-cro-manual' }, null, 1));
      created++;
      if (created % 250 === 0) console.log('  queued', created, '…');
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('\nAPPLIED · queued to Block Builder:', created, '· blob-missing skipped:', missing, '· backup:', 'entries.bak-badcro-' + stamp + '/');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
