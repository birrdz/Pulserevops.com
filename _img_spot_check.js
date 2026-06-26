const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { needsCoverImage, leadingImageMatch } = require('./netlify/functions/lib/img-cover-lib');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const ids = (process.argv[2] || 'ra0357,aq0001,q0001').split(',');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  for (const id of ids) {
    const e = await s.get(`answers/${id}.json`, { type: 'json' });
    if (!e) {
      console.log(id, 'NO BLOB');
      continue;
    }
    const m = leadingImageMatch(e.answer);
    console.log(id, 'needsCover', needsCoverImage(e.answer), 'lead', m ? m[2].slice(0, 80) : 'none');
  }
})();
