// Quick audit: tl pillar images — hotlinks, bad URLs, still-empty slots, cross-page dupes.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { isFillableImageUrl } = require('./_ddg_facecard_lib');
const BAD = /pollinations|lightbulb|pulse-logo|kory-white|placeholder|unsplash\.com\/photo|pravatar|growleads|cro-cover/i;

function extractImages(body) {
  const all = [];
  for (const m of String(body || '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)) all.push({ alt: m[1], url: m[2] });
  for (const m of String(body || '').matchAll(/@@PRODUCT[^\n]* img="([^"]+)"/g)) all.push({ alt: 'product', url: m[1] });
  return all;
}

async function auditId(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, status: 'no-blob' };
  const all = extractImages(e.answer);
  const issues = [];
  for (const im of all) {
    if (BAD.test(im.url)) issues.push({ type: 'bad-url', url: im.url.slice(0, 90), alt: String(im.alt).slice(0, 70) });
    if (/^https?:\/\//i.test(im.url) && !/pulserevops\.com/i.test(im.url)) issues.push({ type: 'hotlink', url: im.url.slice(0, 90), alt: String(im.alt).slice(0, 70) });
    if (isFillableImageUrl(im.url)) issues.push({ type: 'still-fillable', url: im.url.slice(0, 90), alt: String(im.alt).slice(0, 70) });
  }
  const urls = [...new Set(all.map(x => x.url))];
  if (all.length > urls.length) issues.push({ type: 'dupes-on-page', count: all.length - urls.length });
  return { id, title: String(e.question || '').slice(0, 80), images: all.length, issues };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = (idx.entries || []).filter(e => e && e.id && /^tl\d/i.test(e.id));
  tl.sort((a, b) => (parseInt(b.id.slice(2), 10) || 0) - (parseInt(a.id.slice(2), 10) || 0));
  const pick = new Set();
  tl.slice(0, 120).forEach(e => pick.add(e.id));
  tl.filter(e => (parseInt(e.id.slice(2), 10) || 0) < 12000).slice(0, 80).forEach(e => pick.add(e.id));
  const stats = { checked: 0, noBlob: 0, withIssues: 0, hotlink: 0, badUrl: 0, fillable: 0, dupes: 0 };
  const samples = [];
  const urlUse = {};
  for (const id of pick) {
    const r = await auditId(id);
    stats.checked++;
    if (r.status === 'no-blob') { stats.noBlob++; continue; }
    if (r.issues.length) stats.withIssues++;
    for (const iss of r.issues) {
      if (iss.type === 'hotlink') stats.hotlink++;
      if (iss.type === 'bad-url') stats.badUrl++;
      if (iss.type === 'still-fillable') stats.fillable++;
      if (iss.type === 'dupes-on-page') stats.dupes++;
      if (samples.length < 20) samples.push({ id: r.id, title: r.title, issue: iss });
    }
    for (const m of extractImages((await store.get('answers/' + id + '.json', { type: 'json' })).answer)) {
      if (!/^\/assets\/qa\//.test(m.url)) continue;
      urlUse[m.url] = urlUse[m.url] || [];
      urlUse[m.url].push(id);
    }
  }
  const overused = Object.entries(urlUse).filter(([, ids]) => ids.length >= 8).sort((a, b) => b[1].length - a[1].length).slice(0, 12)
    .map(([url, ids]) => ({ url, count: ids.length, sampleIds: ids.slice(0, 5) }));
  console.log(JSON.stringify({ stats, overusedLibraryImages: overused, samples }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
