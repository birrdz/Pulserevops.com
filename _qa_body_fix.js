// _qa_body_fix.js — DEPLOY-FREE fix for "all Q&A pages look messed up".
//
// Root cause: renderMd() (in pulse-machine-entry.js) supports ## / ### headings
// but NOT a single-# H1 and has NO markdown-image support. The cover-image lane +
// writers recently began prepending a leading `![question](url)` image line and a
// `# question` H1 to every answer body. renderMd turns `![alt](url)` into a broken
// `!`+text-link and `# x` into a literal `<p># x</p>` — so the top of every answer
// shows raw markdown. (Confirmed identical on the 6/26 AND current deploys, so this
// is content, not a renderer regression — a rollback does NOT fix it.)
//
// Fix (deploy-free, reversible): for each answer blob, BACK UP the original body to
// blob `qabodybak/<id>.json`, then strip a LEADING markdown-image line and a LEADING
// single-# H1 line so the body renders cleanly starting at `## Direct Answer`.
// Does NOT touch _index.json (clobber-safe). Idempotent: clean bodies are skipped.
//
// Usage:
//   node -r ./_loadenv.js _qa_body_fix.js --ids tl9477,tl9418   (specific ids)
//   node -r ./_loadenv.js _qa_body_fix.js --limit 5             (newest 5 needing fix)
//   node -r ./_loadenv.js _qa_body_fix.js                       (ALL, newest-first)

const fs = require('fs');
for (const f of ['.env.local', '.env']) { try { for (const ln of fs.readFileSync(f,'utf8').split(/\r?\n/)){const m=ln.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');} } catch(e){} }
const { getStore } = require('@netlify/blobs');

const argv = process.argv.slice(2);
const getArg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i+1] : null; };
const onlyIds = (getArg('--ids') || '').split(',').map(s=>s.trim()).filter(Boolean);
const limit = parseInt(getArg('--limit') || '0', 10);
const DRY = argv.includes('--dry');

const IMG_LINE = /^!\[.*\]\(.*\)\s*$/;       // a whole-line markdown image
const H1_LINE  = /^#\s+\S/;                    // single-# heading (## won't match: 2nd char is #)

function fixBody(answer) {
  let lines = String(answer || '').replace(/\r\n/g, '\n').split('\n');
  const dropLeadBlank = () => { while (lines.length && !lines[0].trim()) lines.shift(); };
  let changed = false;
  dropLeadBlank();
  if (lines.length && IMG_LINE.test(lines[0].trim())) { lines.shift(); changed = true; dropLeadBlank(); }
  if (lines.length && H1_LINE.test(lines[0].trim())) { lines.shift(); changed = true; dropLeadBlank(); }
  return { changed, body: lines.join('\n').trim() };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ents = idx.entries.filter(e => e && e.id);
  if (onlyIds.length) ents = onlyIds.map(id => ents.find(e => e.id === id)).filter(Boolean);
  else ents = ents.sort((a, b) => (b.ts || 0) - (a.ts || 0));

  let scanned = 0, fixed = 0, skipped = 0, errors = 0;
  for (const e of ents) {
    if (limit && fixed >= limit) break;
    scanned++;
    let a;
    try { a = await store.get('answers/' + e.id + '.json', { type: 'json' }); } catch (err) { errors++; continue; }
    if (!a || !a.answer) { skipped++; continue; }
    if (a.body_fix_at === 'qa-leading-md-strip') { skipped++; continue; } // already fixed
    const r = fixBody(a.answer);
    if (!r.changed) { skipped++; continue; }
    if (DRY) { fixed++; console.log('[dry] would fix', e.id); continue; }
    // Back up original BEFORE modifying (changed===true means body is still the
    // original here, so this always captures the pre-fix content). Reversible.
    await store.setJSON('qabodybak/' + e.id + '.json', { id: e.id, answer: a.answer, backed_up_at: e.ts || null });
    a.answer = r.body;
    a.body_fix_at = 'qa-leading-md-strip';
    await store.setJSON('answers/' + e.id + '.json', a);
    fixed++;
    console.log('fixed', e.id);
  }
  console.log(`\nDONE. scanned=${scanned} fixed=${fixed} skipped(clean)=${skipped} errors=${errors}`);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
