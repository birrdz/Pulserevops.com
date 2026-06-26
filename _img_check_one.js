const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { needsCoverImage, leadingImageMatch, isWeakCoverUrl } = require('./netlify/functions/lib/img-cover-lib');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const id = process.argv[2] || 'ra0494';
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
(async () => {
  const e = await s.get(`answers/${id}.json`, { type: 'json' });
  const m = leadingImageMatch(e.answer);
  console.log(JSON.stringify({
    id,
    audit: auditImages(id, e.answer),
    coverUrl: m ? m[2].slice(0, 100) : null,
    weak: m ? isWeakCoverUrl(m[2]) : null,
    needsCover: needsCoverImage(e.answer),
    productImgs: (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length,
    sections: (e.answer.match(/^##\s+\d+\.\s/gm) || []).length,
    head: e.answer.slice(0, 200),
  }, null, 2));
})();
