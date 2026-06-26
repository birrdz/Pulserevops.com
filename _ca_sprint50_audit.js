// Audit ca0924–ca0973: grader score, words, images.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const q = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const fails = [];
  let low = 0, ok12 = 0, needImg = 0, needCover = 0;
  for (const row of q) {
    const e = await s.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e || !e.answer) { fails.push({ id: row.id, err: 'no body' }); continue; }
    const g = gradeEntry(row.id, e.answer);
    const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
    const cover = /^﻿?\s*!\[/.test(e.answer);
    if (g.score < 12) low++;
    else ok12++;
    if (imgs < 10) needImg++;
    if (!cover) needCover++;
    if (g.score < 12 || imgs < 10) {
      fails.push({ id: row.id, score: g.score, words: g.word_count, missing: g.missing, imgs, cover, title: row.title.slice(0, 50) });
    }
  }
  console.log(JSON.stringify({ total: q.length, ok12, below12: low, needImg, needCover, fails }, null, 1));
  fs.writeFileSync('C:/Users/koryj/_ca_sprint50_audit.json', JSON.stringify(fails, null, 1));
})();
