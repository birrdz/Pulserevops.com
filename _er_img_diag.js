const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { pickCoverImage } = require('./netlify/functions/lib/img-cover-lib');
const { geminiCoverFor, geminiProductFor } = require('./netlify/functions/lib/gemini-image-lib');
const { ensureImages } = require('./netlify/functions/lib/ensure-entry-images');
const { buildBody } = require('./_er_sprint300_bodies');

(async () => {
  console.log('GEMINI', !!process.env.GEMINI_API_KEY);
  console.log('BLOBS', !!process.env.BLOBS_PAT);
  const title = 'Top 10 iPhone Cases in 2027 — Best Overall + Best Value';
  const body = buildBody(title);
  console.log('pickCover...');
  const pick = await pickCoverImage(title, 'er0577');
  console.log('pickCover', pick);
  console.log('geminiCover...');
  const gc = await geminiCoverFor(title, 'er0577');
  console.log('geminiCover', gc ? gc.slice(0, 80) : null);
  console.log('geminiProduct...');
  const gp = await geminiProductFor('Sony Pro 100', 'er0577');
  console.log('geminiProduct', gp ? gp.slice(0, 80) : null);
  console.log('ensureImages...');
  const r = await ensureImages('er0577', title, body);
  console.log('audit', r.audit);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
