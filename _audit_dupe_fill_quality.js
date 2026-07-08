// Audit image-duplicator fills: are reused library photos applicable to section + title?
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = new Set(['that', 'this', 'with', 'from', 'your', 'have', 'what', 'when', 'where', 'which', 'their', 'about', 'into', 'over', 'after', 'before', 'under', 'between', 'through', 'during', 'without', 'within', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'also', 'just', 'only', 'very', 'more', 'most', 'some', 'such', 'than', 'then', 'them', 'they', 'will', 'would', 'could', 'should', 'been', 'being', 'does', 'done', 'make', 'made', 'like', 'need', 'best', 'good', 'great', 'top', 'guide', 'ranked', 'ranking', 'pulse', 'answer', 'direct', 'fractional', '2027', '2026']);
function tokens(t) {
  return [...new Set(String(t || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w)))];
}
function overlap(a, b) {
  const tb = new Set(tokens(b));
  return tokens(a).filter(w => tb.has(w)).length;
}
function srcId(url) {
  const m = String(url).match(/\/assets\/qa\/([a-z]{2,3}\d+)/i);
  return m ? m[1].replace(/(-\d+.*)$/i, '') : '';
}
function isFace(url) { return /^\/assets\/qa\/[a-z]{2,3}\d+\.jpg$/i.test(String(url || '').replace(/\?.*$/, '')); }

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const titleMap = {};
  for (const e of idx.entries || []) if (e && e.id) titleMap[e.id] = e.question || '';
  const filled = ['tl21573', 'tl21580', 'tl21590', 'tl21600', 'tl21610', 'tl21620', 'tl11020', 'tl9001'];
  const rows = [];
  for (const id of filled) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { rows.push({ id, err: 'no blob' }); continue; }
    const title = e.question || titleMap[id] || id;
    const imgs = [...String(e.answer).matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map(m => ({ alt: m[1], url: m[2] }));
    for (const im of imgs.slice(0, 8)) {
      if (!/^\/assets\/qa\//.test(im.url)) continue;
      const sid = srcId(im.url);
      const srcTitle = titleMap[sid] || '';
      const sect = String(im.alt).split(' — ').pop() || im.alt;
      const ov = overlap(title + ' ' + sect, srcTitle);
      rows.push({
        id,
        title: title.slice(0, 65),
        section: sect.slice(0, 55),
        image: im.url,
        faceCardReuse: isFace(im.url),
        srcId: sid,
        srcTitle: srcTitle.slice(0, 65),
        tokenOverlap: ov,
        ok: ov >= 2 || (ov >= 1 && !isFace(im.url)),
      });
    }
  }
  const bad = rows.filter(r => r.image && r.ok === false);
  console.log(JSON.stringify({ sampled: rows.length, bad: bad.length, badSamples: bad.slice(0, 15), goodSamples: rows.filter(r => r.ok).slice(0, 5) }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
