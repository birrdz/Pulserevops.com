// 🔒 4444. _img_audit.js — FREE site-wide audit: how many entries are MISSING a top image (the new
// 12/13 law). No API tokens — just checks each blob for a leading image. Writes _img_audit_result.json.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const hasTopImg = b => /!\[[^\]]*\]\([^)]+\)/.test(String(b || '').slice(0, 1000)) || /<img[^>]+src=/i.test(String(b || '').slice(0, 1500));
const CONC = 16;

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
  console.log(`[img-audit] checking ${ids.length} entries for a top image (no API)…`);
  const missing = []; const byPillar = {}; let done = 0, noBlob = 0, qi = 0;
  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++];
      try { const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); if (!e || !e.answer) { noBlob++; continue; } if (!hasTopImg(e.answer)) { missing.push(id); byPillar[pillarOf(id)] = (byPillar[pillarOf(id)] || 0) + 1; } } catch (x) {}
      if (++done % 5000 === 0) console.log(`[img-audit] ${done}/${ids.length} · missing=${missing.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  const out = { total: ids.length, noBlob, missingTopImage: missing.length, byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])), ids: missing };
  fs.writeFileSync(WD + '/_img_audit_result.json', JSON.stringify(out));
  console.log(`[img-audit] DONE — ${missing.length}/${ids.length} MISSING a top image`);
  console.log(`[img-audit] byPillar=${JSON.stringify(out.byPillar)}`);
})().catch(e => { console.log('[img-audit] FATAL', e && e.message); process.exit(1); });
