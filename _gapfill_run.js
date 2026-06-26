// Gap-fill writer — PARALLEL DeepSeek generation (owner 4444), publish step
// serialized via mutex so concurrent _index.json writes can't clobber. Skips
// titles already present (normalized). Emails owner every 10 published. No deploy.
const fs = require('fs');
const { execSync } = require('child_process');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { generateGradedBody } = require('./_ds_gen_any');
const { stampYear } = require('./_year_law');
const ENFORCE_YEAR = fs.existsSync('C:/Users/koryj/website/_year_law_enforce.flag'); // set at campaign completion
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_gapfill_queue.json', 'utf8'));
const CONC = parseInt((process.argv.find(a => a.startsWith('--conc=')) || '--conc=4').split('=')[1], 10) || 4;
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function email(subject, message) {
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject, message }) }); } catch (e) {}
}
// serialize publish (index read-modify-write) so parallel workers don't clobber _index.json
let pubLock = Promise.resolve();
async function publishLocked(id, title) {
  const prev = pubLock; let release; pubLock = new Promise(r => (release = r)); await prev;
  try { return await publishTextFirst(id, title); } finally { release(); }
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const BASELINE = 19851, TARGET = 8730; // post-dedupe index size; full gap target
  const prog = async () => { try { const i = await store.get('_index.json', { type: 'json' }); const W = Math.max(0, i.entries.length - BASELINE); const P = i.entries.filter(e => e && e.images_pending).length; const imgDone = Math.max(0, W - P); return `✍️ Writing (DeepSeek+Claude): ${W.toLocaleString()} of ${TARGET.toLocaleString()} (${(W / TARGET * 100).toFixed(1)}%) · 🖼️ Images (DuckDuckGo): ~${imgDone.toLocaleString()} done, ${P.toLocaleString()} in queue`; } catch (e) { return ''; } };
  const idx = await store.get('_index.json', { type: 'json' });
  const maxId = {};
  for (const e of idx.entries) { const m = String(e.id).match(/^([a-z]+)(\d+)$/); if (m) { const p = m[1], n = +m[2]; if (!maxId[p] || n > maxId[p]) maxId[p] = n; } }
  const have = new Set(idx.entries.map(e => norm(e.question)));
  const work = QUEUE.filter(it => !have.has(norm(it.title)));
  let qi = 0, done = 0, fail = 0, lastEmail = 0; const log = [];
  const statusEmail = () => { try { execSync('node _campaign_status_email.js', { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 60000 }); } catch (e) {} };
  // CONSOLIDATED EMAIL ONLY (owner 2026-06-25): the single gap-fill status email is
  // the only email — no separate started/lane/done emails.

  async function worker() {
    while (qi < work.length) {
      const item = work[qi++];
      const title = ENFORCE_YEAR ? stampYear(item.title) : item.title;    // year-at-end law (gated by flag)
      const pfx = item.prefix; maxId[pfx] = (maxId[pfx] || 0) + 1;        // sync id reserve — race-safe (single-threaded)
      const id = pfx + String(maxId[pfx]).padStart(4, '0');
      try {
        const { body } = await generateGradedBody(id, title, { kind: item.kind });   // parallel (slow)
        fs.writeFileSync('C:/Users/koryj/' + id + '_answer.md', body);
        const r = await publishLocked(id, title);                         // serialized (fast)
        if (r.ok) { done++; log.push(`OK ${id} (${r.words}w) ${title.slice(0, 50)}`); console.log('OK', id, r.words + 'w'); }
        else { fail++; log.push(`FAIL ${id} grade=${r.score}`); console.log('FAIL', id, r.reason, r.score); }
      } catch (e) { fail++; log.push(`ERR ${id} ${e.message}`); console.log('ERR', id, e.message); }
      // emails handled globally by _email_monitor.js (every 10 across ALL lanes)
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  statusEmail();
  console.log(JSON.stringify({ done, fail }));
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
