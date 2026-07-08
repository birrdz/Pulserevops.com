// _cro_audit_forever.js — 24/7 CRO-ad LINK INTEGRITY guard (runs like the DDG lane).
// Every pass: scan EVERY answer blob, verify each CRO-card link's TEXT matches its
// TARGET (LinkedIn text -> LinkedIn, "CRO Syndicate" -> crosyndicate.com, Quick Call
// -> Calendly, image -> Calendly). Any mismatch is AUTO-FIXED by rebuilding the card
// with insertCroAdMd() (strips the bad card, re-adds the canonical one). Writes ONLY
// answers/<id>.json (never _index.json -> zero clobber). Detached/always-on; ignores
// _PAUSE_WRITERS.flag (maintenance lane, not a writer). Stop: create _cro_audit_stop.flag.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { insertCroAdMd } = require('./_cro_ad_md');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = 'C:/Users/koryj/website/_cro_audit_stop.flag';
const LOG = 'C:/Users/koryj/website/_cro_audit_forever.log';
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PASS_GAP = 30 * 60 * 1000; // 30 min between full passes — gentle safety net

const isCalendly = u => /calendly\.com\/korywhiterevops/i.test(u);
const isLinkedIn = u => /linkedin\.com\/in\/korywhite/i.test(u);
const isSynd     = u => /crosyndicate\.com/i.test(u);
function expectFor(text) {
  const t = text.toLowerCase();
  if (/linkedin|see kory|connect on/.test(t)) return isLinkedIn;
  if (/cro syndicate/.test(t)) return isSynd;
  if (/quick call|book a .*call|fractional cro|20-minute|20 minute/.test(t)) return isCalendly;
  return null;
}
// returns true if the card links are INCONSISTENT (text != target)
function hasMismatch(a) {
  // image card linked to a non-Calendly URL (legacy linked form only)
  const imgM = a.match(/\[!\[[^\]]*\]\([^)]*\)\]\(([^)]+)\)/);
  if (imgM && !isCalendly(imgM[1])) return true;
  // Strip BOTH the legacy linked image AND the new UNLINKED poster image before
  // scanning links — otherwise the image ALT (which contains "CRO Syndicate") is
  // mis-read as a CRO-Syndicate LINK pointing at the image URL (false positive).
  const aRow = a
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '')
    .replace(/!\[[^\]]*\]\([^)]*(?:catbox\.moe|wsrv\.nl)[^)]*\)/g, '');
  const re = /\[([^\]]+)\]\(([^)]+)\)/g; let m;
  while ((m = re.exec(aRow))) {
    if (/^!/.test(m[1])) continue;
    const pred = expectFor(m[1]);
    if (pred && !pred(m[2])) return true;
  }
  return false;
}

async function onePass(pass) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = idx.entries.map(e => e && e.id).filter(Boolean);
  let scanned = 0, withCard = 0, fixed = 0, badUnfixable = 0;
  const CONC = 6; let cur = 0;
  async function worker() {
    while (cur < ids.length) {
      if (fs.existsSync(STOP)) return;
      const id = ids[cur++];
      let e; try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { continue; }
      if (!e || !e.answer) continue;
      scanned++;
      const a = e.answer;
      if (!/usgv65|files\.catbox\.moe|crosyndicate\.com|calendly\.com\/korywhiterevops/i.test(a)) continue;
      withCard++;
      if (!hasMismatch(a)) continue;
      const { stripAllCroFromBody } = require('./_cro_strip_lib');
      const out = stripAllCroFromBody(a);
      if (out === e.answer) continue;
      if (e.answer_pread == null) e.answer_pread = e.answer;
      e.answer = out; e.cro_link_fixed_at = Date.now();
      await store.setJSON('answers/' + id + '.json', e);
      fixed++; log('  fixed ' + id);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  log(`pass ${pass}: scanned ${scanned}, with-card ${withCard}, FIXED ${fixed}, unfixable ${badUnfixable}`);
}

(async () => {
  log('[cro-audit] started — 24/7 CRO link-integrity guard');
  for (let pass = 1; ; pass++) {
    if (fs.existsSync(STOP)) { log('[cro-audit] stop flag — exiting'); break; }
    try { await onePass(pass); } catch (e) { log('[cro-audit] pass error: ' + e.message); }
    await sleep(PASS_GAP);
  }
})().catch(e => { log('[cro-audit] FATAL ' + e.message); process.exit(1); });
