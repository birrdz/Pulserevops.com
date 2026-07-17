// new/upgrade_top10.js — pick the WORST-quality existing TOP-10 entry (any pillar) and rebuild it
// high-value in place (same id/URL). Owner then adds the 10 item images in the builder → publish
// overwrites the same URL. For drilling the top-10 image-per-item flow.
// Usage:  node new/upgrade_top10.js --dry   |   node new/upgrade_top10.js [id]
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const ENTRIES = WD + '/new/entries';
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const forceId = args.find(a => /^[a-z]{1,3}\d+$/i.test(a));
const IS_TOP10 = e => /^\s*top\s*10\b/i.test(String(e.question || e.title || ''));

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const inProgress = new Set(fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')) : []);
  let pick;
  if (forceId) { pick = idx.entries.find(e => e && e.id.toLowerCase() === forceId.toLowerCase()); }
  else {
    const cands = idx.entries.filter(e => e && IS_TOP10(e) && !e.bb && !inProgress.has(e.id));
    cands.sort((a, b) => ((a.quality_score || 0) - (b.quality_score || 0))
      || (String(a.format_v || '').localeCompare(String(b.format_v || '')))
      || ((a.ts || 0) - (b.ts || 0)));
    pick = cands[0];
    console.log('bad Top-10 candidates:', cands.length, '· worst quality_score:', pick && pick.quality_score);
  }
  if (!pick) { console.log('no Top-10 entry to upgrade'); process.exit(1); }
  const blob = await store.get('answers/' + pick.id + '.json', { type: 'json' }).catch(() => null);
  const question = (blob && blob.question) || pick.question || pick.title || pick.id;
  const words = blob && blob.answer ? String(blob.answer).split(/\s+/).length : 0;
  console.log('\n▶ WORST Top-10 to upgrade:');
  console.log('  id:', pick.id, '· quality_score:', pick.quality_score, '· format_v:', pick.format_v, '· words:', words);
  console.log('  question:', question);
  if (dry) { console.log('\n(dry run)'); return; }

  console.log('\n① regenerating HIGH-VALUE Top-10 in place (Claude Max)…');
  const r = spawnSync(process.execPath, [WD + '/new/generate.js', question], { cwd: WD, encoding: 'utf8', timeout: 600000, env: Object.assign({}, process.env, { GEN_FORCE_ID: pick.id, GEN_INPLACE: '1' }) });
  const out = (r.stdout || '') + (r.stderr || '');
  console.log(out.split('\n').filter(Boolean).slice(-3).join('\n'));
  console.log(/TEXT DONE|text not at 3\/3/.test(out) ? '\n✅ rebuilt → new/entries/' + pick.id + '.json' : '\n⚠️ generation issue');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
