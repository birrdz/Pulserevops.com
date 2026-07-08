// Probe: keyless Wikipedia poster fetch. Resolve title → article → lead image (the poster).
'use strict';
let sharp; try { sharp = require('sharp'); } catch (e) {}
const UA = 'PulseRevOps/1.0 (koryjordanwhite@gmail.com) poster-library';
const tests = [
  ['Mad Max: Fury Road', '2015'],
  ['The Exorcist', '1973'],
  ['2001: A Space Odyssey', '1968'],
  ['Get Out', '2017'],
  ['Parasite', '2019'],
  ['Roma', '2018'],
];
async function jget(u) {
  const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
  return r.ok ? r.json() : null;
}
async function resolveTitle(title, year) {
  // opensearch to find the best film article
  const q = title + ' ' + year + ' film';
  const os = await jget('https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&format=json&search=' + encodeURIComponent(q));
  if (os && os[1] && os[1].length) {
    const filmish = os[1].find((t) => /\(.*film\)/i.test(t)) || os[1][0];
    return filmish;
  }
  return title;
}
async function posterFor(title, year) {
  const article = await resolveTitle(title, year);
  const sum = await jget('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(article.replace(/ /g, '_')));
  const src = sum && (sum.originalimage && sum.originalimage.source || sum.thumbnail && sum.thumbnail.source);
  return { article, src };
}
(async () => {
  console.log('Wikipedia poster probe:');
  for (const [t, y] of tests) {
    try {
      const { article, src } = await posterFor(t, y);
      if (!src) { console.log('  ' + t + ' → article "' + article + '" · NO IMAGE'); continue; }
      const ir = await fetch(src, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
      const buf = Buffer.from(await ir.arrayBuffer());
      let dim = '?';
      if (sharp) { try { const m = await sharp(buf).metadata(); dim = m.width + 'x' + m.height + ' ar ' + (m.width / m.height).toFixed(2); } catch (e) { dim = 'decode-fail'; } }
      console.log('  ' + t + ' → "' + article + '" · ' + buf.length + 'b · ' + dim);
    } catch (e) { console.log('  ' + t + ' → ERR ' + e.message); }
    await new Promise((r) => setTimeout(r, 400));
  }
})();
