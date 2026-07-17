// new/upgrade_tl.js — pick the LOWEST-value Pulse Tools (tl) entry not yet upgraded, and rebuild its
// inner content HIGH-VALUE in place (same id/URL). The owner then adds images in the builder → publish
// overwrites the same URL (editorial refresh — no delete, no 404). One at a time.
// Usage:  node new/upgrade_tl.js --dry        (show what it would pick)
//         node new/upgrade_tl.js [tlID]       (rebuild that one, or the worst if omitted)
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
const forceId = args.find(a => /^tl\d+$/i.test(a));

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const inProgress = new Set(fs.existsSync(ENTRIES) ? fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')) : []);
  let pick;
  if (forceId) {
    pick = idx.entries.find(e => e && e.id.toLowerCase() === forceId.toLowerCase());
  } else {
    const cands = idx.entries.filter(e => e && /^tl\d+$/i.test(e.id) && !e.bb && !inProgress.has(e.id) && !/^\s*top\s*\d/i.test(String(e.question || e.title || '')));  // essays only, skip any Top-10
    // CRO type first (matches the CRO image library), worst quality within that.
    const croRe = /fractional\s*cro|chief\s*revenue\s*officer|\brevops\b|revenue\s*operations|revenue\s*leader/i;
    const hasCro = e => croRe.test(String(e.question || e.title || ''));
    cands.sort((a, b) => (hasCro(b) ? 1 : 0) - (hasCro(a) ? 1 : 0)
      || ((a.quality_score || 0) - (b.quality_score || 0))
      || (String(a.format_v || '').localeCompare(String(b.format_v || '')))
      || ((a.ts || 0) - (b.ts || 0)));
    pick = cands[0];
    console.log('tl candidates:', cands.length, '· CRO-type:', cands.filter(hasCro).length, '· picking:', pick && pick.id, pick && pick.quality_score);
  }
  if (!pick) { console.log('no tl entry to upgrade'); process.exit(1); }
  const blob = await store.get('answers/' + pick.id + '.json', { type: 'json' }).catch(() => null);
  const question = (blob && blob.question) || pick.question || pick.title || pick.id;
  const words = blob && blob.answer ? String(blob.answer).split(/\s+/).length : 0;
  console.log('\n▶ WORST tl entry to upgrade:');
  console.log('  id:', pick.id, '· quality_score:', pick.quality_score, '· format_v:', pick.format_v, '· current words:', words);
  console.log('  question:', question);
  if (dry) { console.log('\n(dry run — nothing changed)'); return; }

  console.log('\n① regenerating HIGH-VALUE content in place (Claude Max)…');
  const r = spawnSync(process.execPath, [WD + '/new/generate.js', question], { cwd: WD, encoding: 'utf8', timeout: 600000, env: Object.assign({}, process.env, { GEN_FORCE_ID: pick.id, GEN_INPLACE: '1', GEN_FORCE_FORMAT: 'essay' }) });
  const out = (r.stdout || '') + (r.stderr || '');
  const ok = /TEXT DONE|text not at 3\/3/.test(out);
  const sc = (out.match(/score (\d+)/) || [])[1];
  console.log(out.split('\n').slice(-4).join('\n'));
  console.log(ok ? '\n✅ rebuilt → new/entries/' + pick.id + '.json (loads in builder; publish overwrites ' + pick.id + ' in place)' : '\n⚠️ generation issue');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
