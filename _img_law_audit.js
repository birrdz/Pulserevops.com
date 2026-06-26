// Scan library for Image LAW violations. Exit 1 if any found (CI/manual).
//   node _img_law_audit.js
//   node _img_law_audit.js aq ca ra   (prefix filter)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const ONLY = process.argv.slice(2).map((x) => x.toLowerCase()).filter(Boolean);
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: TOK,
});

const prefixOf = (id) => (String(id).match(/^([a-z]+)\d+$/i) || [])[1] || '(other)';

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  let entries = idx.entries || [];
  if (ONLY.length) entries = entries.filter((e) => e && ONLY.includes(prefixOf(e.id)));

  const stat = {};
  const violations = [];
  const CONC = 12;
  let cur = 0;

  async function worker() {
    while (cur < entries.length) {
      const e0 = entries[cur++];
      const id = e0.id;
      const pre = prefixOf(id);
      const st = stat[pre] || (stat[pre] = { total: 0, ok: 0, fail: 0 });
      st.total++;
      const e = await s.get(`answers/${id}.json`, { type: 'json' }).catch(() => null);
      if (!e || !e.answer) continue;
      const a = auditImages(id, e.answer);
      if (a.compliant) {
        st.ok++;
      } else {
        st.fail++;
        violations.push({ id, prefix: pre, needs: a.needs, top10: a.top10, productImgs: a.productImgs, coverOk: a.coverOk });
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, worker));

  const rows = Object.entries(stat).sort((a, b) => b[1].fail - a[1].fail);
  console.log('prefix | total | ok | violations');
  let totalFail = 0;
  for (const [p, v] of rows) {
    if (v.fail) console.log(`${p.padEnd(8)} | ${String(v.total).padStart(5)} | ${String(v.ok).padStart(3)} | ${String(v.fail).padStart(11)}`);
    totalFail += v.fail;
  }
  console.log(`\nTOTAL violations: ${totalFail} / ${entries.length}`);
  if (violations.length) {
    console.log('\nSample (up to 20):');
    for (const v of violations.slice(0, 20)) {
      console.log(`  ${v.id}  top10=${v.top10}  cover=${v.coverOk}  productImgs=${v.productImgs}  needs=${v.needs.join(',')}`);
    }
  }

  fs.writeFileSync(
    'C:/Users/koryj/website/_img_law_audit.json',
    JSON.stringify({ generated: new Date().toISOString(), total: entries.length, violations: violations.length, byPrefix: stat, sample: violations.slice(0, 100) }, null, 1)
  );
  console.log('\nwrote _img_law_audit.json');

  if (totalFail > 0) process.exit(1);
})().catch((e) => {
  console.error('FATAL', e && e.stack);
  process.exit(1);
});
