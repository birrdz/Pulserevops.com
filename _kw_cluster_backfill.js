// _kw_cluster_backfill.js — add the per-URL SEO keyword cluster to EVERY entry.
// For each answer blob: (1) store seo_kw_cluster (the tight variant list, for the
// alternateName render), and (2) append a deploy-free "People also search for:"
// line at the end of the body WHEN it reads cleanly (rankings / CRO / clean
// how-tos). Idempotent (kw_line_at guard + body marker), clobber-safe (answer
// blobs only, never _index.json), resumable, newest-first.
//   node _kw_cluster_backfill.js [--dry] [--limit=N] [--prefix=xx]
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { clusterFor } = require('./_kw_cluster');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const DRY = process.argv.includes('--dry');
const LIMIT = +(((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1]) || 0);
const ONLY = ((process.argv.find(a => a.startsWith('--prefix=')) || '').split('=')[1] || '').toLowerCase();
const STOP = 'C:/Users/koryj/website/_kw_stop.flag';
const LOG = 'C:/Users/koryj/website/_kw_cluster.log';
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const num = id => { const m = String(id).match(/\d+/); return m ? +m[0] : 0; };
const MARK = 'People also search for';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter(e => e && e.id && /^[a-z]+\d+$/i.test(e.id));
  if (ONLY) rows = rows.filter(e => e.id.toLowerCase().startsWith(ONLY));
  rows.sort((a, b) => (b.ts || num(b.id)) - (a.ts || num(a.id))); // newest-first
  if (LIMIT) rows = rows.slice(0, LIMIT);
  log(`kw-cluster backfill: ${rows.length} entries${ONLY ? ' (prefix=' + ONLY + ')' : ''}${DRY ? ' [DRY]' : ''}`);

  let done = 0, lineAdded = 0, stored = 0, skip = 0, fail = 0;
  for (const row of rows) {
    if (fs.existsSync(STOP)) { log('stop flag — exiting'); break; }
    try {
      const a = await store.get('answers/' + row.id + '.json', { type: 'json' });
      if (!a || !a.answer) { skip++; continue; }
      if (a.kw_line_at) { skip++; continue; } // already processed
      const prefix = (row.id.match(/^([a-z]+)/i) || [])[1];
      const c = clusterFor(a.question || row.question, prefix);
      let body = a.answer;
      let addedLine = false;
      if (c.line && !new RegExp(MARK, 'i').test(body)) {
        body = body.replace(/\s+$/, '') + '\n\n' + c.line + '\n';
        addedLine = true;
      }
      if (DRY) {
        if (done < 25) log(`  ${row.id} [${c.mode}] ${addedLine ? 'LINE' : 'store'} :: ${(c.variants || []).slice(0, 4).join(' · ')}`);
        done++; continue;
      }
      a.answer = body;
      a.seo_kw_cluster = c.variants || [];
      a.kw_line_at = Date.now();
      await store.setJSON('answers/' + row.id + '.json', a);
      done++; stored++; if (addedLine) lineAdded++;
      if (done % 200 === 0) log(`  …${done}/${rows.length} (lines +${lineAdded}, stored ${stored})`);
    } catch (e) { fail++; if (fail < 10) log(`  FAIL ${row.id}: ${e.message}`); }
  }
  log(`DONE. processed=${done} visible-lines=${lineAdded} clusters-stored=${stored} skipped=${skip} fail=${fail}`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
