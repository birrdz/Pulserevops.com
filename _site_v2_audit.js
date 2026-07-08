// _site_v2_audit.js — WHOLE-SITE quality sweep + LIVE SEO-spider stats producer.
// Owner: "sweep the entire site / bring everything to V2" + "show missing mermaid (star) and
// missing V2 as stats, and as things are fixed remove them from the SEO spider stats in real time."
// Scans EVERY library entry (all pillars) and flags sub-V2 entries; ALSO writes the live
// whole-site counts to blob `seo-monitor/content.json` (read by the /seo dashboard via
// pulse-seo-monitor) so each count drops toward 0 as fixes land. Re-run / let the forever
// wrapper run it every 30 min to keep counts current. Detection floors:
//   - thin: prose < MINW (1200) ; missing-v2: no ```answer card ; missing-faq: no ## FAQ
//   - no-image: no displaying image ; missing-mermaid: < 2 mermaid diagrams (gold law) ;
//   - mermaid-error: stray '<'/'>' in a mermaid label (render-breaking).
// Outputs: _site_v2_queue.json (flagged list), _site_v2_rollup.json (per-pillar),
//   _seo_audit/content.json + blob seo-monitor/content.json (live dashboard stats).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const MINW = parseInt(process.env.V2_MINW || '1200', 10);
const CONC = parseInt(process.env.V2_CONC || '12', 10);
const ONLY = (process.env.V2_PILLAR || '').trim();
const ARROWS = [/<-\.->/g,/<-->/g,/<==>/g,/<--/g,/<==/g,/-\.->/g,/-->/g,/==>/g,/---/g,/-\.-/g,/===/g];
function proseWords(body) {
  const stripped = String(body).replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<img[^>]*>/gi, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  return (stripped.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []).length;
}
function mermaidStats(body){
  const blocks = [...body.matchAll(/```mermaid\s*([\s\S]*?)```/g)].map(m=>m[1]);
  let err = false;
  for (const blk of blocks) for (let line of blk.split('\n')){ let s=line; ARROWS.forEach(rx=>s=s.replace(rx,' ')); if(/[<>]/.test(s)){err=true;break;} }
  return { count: blocks.length, err };
}
const pillarOf = id => (String(id).match(/^([a-z]{1,4})\d/) || [, 'other'])[1];
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let entries = (idx.entries || []).filter(e => e && /^[a-z]{1,4}\d+$/.test(e.id || ''));
  if (ONLY) entries = entries.filter(e => pillarOf(e.id) === ONLY);
  const flagged = []; let scanned = 0, thin = 0, noV2 = 0, noFaq = 0, noImg = 0, mermMiss = 0, mermErr = 0;
  const roll = {}; let cur = 0;
  async function worker() {
    while (cur < entries.length) {
      const e = entries[cur++]; const p = pillarOf(e.id); roll[p] = roll[p] || { total: 0, flagged: 0 };
      const b = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
      if (!b || !b.answer) continue; scanned++; roll[p].total++;
      const body = b.answer;
      const w = proseWords(body);
      const hasV2 = /```answer/.test(body);
      const hasFaq = /##\s*FAQ\b/i.test(body) || /\bFrequently Asked Questions\b/i.test(body);
      const hasImg = /!\[[^\]]*\]\([^)]*\)/.test(body) || /<img[\s>]/i.test(body);
      const merm = mermaidStats(body);
      const isThin = w < MINW;
      const reasons = [];
      if (isThin) { reasons.push('thin'); thin++; }
      if (!hasV2) { reasons.push('no-v2'); noV2++; }
      if (!hasFaq) { reasons.push('no-faq'); noFaq++; }
      if (!hasImg) { reasons.push('no-img'); noImg++; }
      if (merm.count < 1) { reasons.push('missing-mermaid'); mermMiss++; }  // REAL problem = 0 mermaids (a page with >=1 isn't "missing" one — stops false-positive refill)
      if (merm.err) { reasons.push('mermaid-error'); mermErr++; }
      if (reasons.length) { flagged.push({ id: e.id, pillar: p, title: e.question, words: w, mermaids: merm.count, reasons }); roll[p].flagged++; }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  flagged.sort((a, b) => a.pillar.localeCompare(b.pillar) || (a.words - b.words));
  fs.writeFileSync('C:/Users/koryj/website/_site_v2_queue.json', JSON.stringify(flagged, null, 1));
  const rollSorted = Object.entries(roll).map(([p, v]) => ({ pillar: p, total: v.total, flagged: v.flagged, pct: v.total ? Math.round(v.flagged / v.total * 100) : 0 })).sort((a, b) => b.flagged - a.flagged);
  fs.writeFileSync('C:/Users/koryj/website/_site_v2_rollup.json', JSON.stringify(rollSorted, null, 1));
  // LIVE dashboard stats (each count drops as fixes land) — merge ledger so approved/catalogTotal never wipe
  const { enrichContent } = require('./_seo_monitor_sync_lib');
  const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null);
  const content = enrichContent(cur, {
    total: scanned,
    auditedAt: new Date().toISOString(),
    counts: {
      thin_content: thin, missing_v2: noV2, missing_faq: noFaq, no_image: noImg, missing_mermaid: mermMiss, mermaid_errors: mermErr,
    },
  }, idx);
  try { if (!fs.existsSync('C:/Users/koryj/website/_seo_audit')) fs.mkdirSync('C:/Users/koryj/website/_seo_audit', { recursive: true }); } catch (e) {}
  try { fs.writeFileSync('C:/Users/koryj/website/_seo_audit/content.json', JSON.stringify(content, null, 1)); } catch (e) {}
  try { await store.setJSON('seo-monitor/content.json', content); } catch (e) { console.error('blob write err', e.message); }
  console.log('SCANNED', scanned, '| FLAGGED', flagged.length, '| thin', thin, 'no-v2', noV2, 'no-faq', noFaq, 'no-img', noImg, 'missing-mermaid', mermMiss, 'mermaid-err', mermErr);
  console.log('content.json published to seo-monitor/content.json (live /seo stats).');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
