// _seo_content_audit.js — FREE full-site SEO content audit. Reads ALL ~30k library
// entries straight from the index + answer blobs (NO http, NO Netlify function calls,
// so it's free and covers 100% of the site). Checks content-level SEO issues and writes
// a live 0→100% progress bar that the dashboards read. Cheap enough to run every cycle.
//
// Output: _seo_audit/content_audit.json (+ blob seo-monitor/content.json) and live
// _seo_audit/progress.json (+ blob seo-monitor/progress.json) "audited X / TOTAL (pct%)".
//
//   node _seo_content_audit.js
const fs = require('fs'), path = require('path');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const OUT = 'C:/Users/koryj/website/_seo_audit';
const CONC = parseInt(process.env.AUDIT_CONC || '20', 10);
const THIN = parseInt(process.env.THIN_WORDS || '300', 10);
const collapse = s => (s || '').replace(/\s+/g, ' ').trim();

function writeProgress(o) { try { if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'progress.json'), JSON.stringify(o)); } catch (e) {} try { store.setJSON('seo-monitor/progress.json', o).catch(() => {}); } catch (e) {} }

(async () => {
  const startedAt = new Date().toISOString();
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id);
  const total = entries.length;
  console.log('[content-audit] auditing', total, 'entries, conc', CONC);
  writeProgress({ phase: 'audit', running: true, crawled: 0, target: total, startedAt });

  const issues = { missing_title: [], thin_content: [], no_image: [], missing_faq: [], no_answer: [] };
  const byPillar = {};
  let done = 0, withAnswer = 0;
  let cur = 0;
  async function worker() {
    while (cur < total) {
      const e = entries[cur++];
      const pid = (String(e.id).match(/^([a-z]+)/i) || [])[1] || '?';
      byPillar[pid] = byPillar[pid] || { pillar: pid, entries: 0, thin: 0, noImage: 0, noCard: 0 };
      byPillar[pid].entries++;
      try {
        const b = await store.get('answers/' + e.id + '.json', { type: 'json' });
        if (!e.question) issues.missing_title.push(e.id);
        if (!b || !b.answer) { issues.no_answer.push(e.id); }
        else {
          withAnswer++;
          const body = b.answer;
          const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#>*_`|-]/g, ' ');
          const words = collapse(prose).split(/\s+/).filter(Boolean).length;
          const imgs = (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length + (body.match(/@@PRODUCT[^\n]* img=/g) || []).length;
          const hasFAQ = /(^|\n)##?\s*(FAQ|Frequently Asked)/i.test(body);
          if (words < THIN) { issues.thin_content.push(e.id); byPillar[pid].thin++; }
          if (imgs === 0) { issues.no_image.push(e.id); byPillar[pid].noImage++; }
          if (!hasFAQ) issues.missing_faq.push(e.id);
          // NOTE: CRO card is injected at RENDER time (pulse-machine-entry insertCroAd) on
          // every answer page, so its absence in the blob is NOT a real issue — not flagged.
        }
      } catch (err) { issues.no_answer.push(e.id); }
      done++;
      if (done % 250 === 0) { console.log('[content-audit]', done + '/' + total); writeProgress({ phase: 'audit', running: true, crawled: done, target: total, startedAt }); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  const counts = {}; for (const k of Object.keys(issues)) counts[k] = issues[k].length;
  const result = { auditedAt: new Date().toISOString(), total, withAnswer, counts, byPillar: Object.values(byPillar).sort((a, b) => b.entries - a.entries),
    samples: Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.slice(0, 200)])) };
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'content_audit.json'), JSON.stringify(result, null, 1));
  try {
    const { enrichContent } = require('./_seo_monitor_sync_lib');
    const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null);
    await store.setJSON('seo-monitor/content.json', enrichContent(cur, result, idx));
  } catch (e) {}
  writeProgress({ phase: 'audit-done', running: false, crawled: total, target: total, startedAt, finishedAt: new Date().toISOString() });
  console.log('[content-audit] DONE', total, 'audited |', JSON.stringify(counts));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
