// Audit aq sprint entries: grader + 11 images.
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
const qpath = process.argv[2] || 'C:/Users/koryj/_aq_sprint150.json';
const q = JSON.parse(fs.readFileSync(qpath, 'utf8'));
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const fails = [];
  let ok12 = 0, needImg = 0, needCover = 0;
  for (const row of q) {
    const e = await s.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e || !e.answer) { fails.push({ id: row.id, err: 'no body' }); continue; }
    const g = gradeEntry(row.id, e.answer);
    const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
    const cover = /^﻿?\s*!\[/.test(e.answer);
    if (g.score >= 12) ok12++; else fails.push({ id: row.id, score: g.score, missing: g.missing });
    if (imgs < 10) { needImg++; fails.push({ id: row.id, imgs, cover, title: row.title?.slice(0, 40) }); }
    if (!cover) { needCover++; fails.push({ id: row.id, cover: false }); }
  }
  console.log(JSON.stringify({ total: q.length, ok12, needImg, needCover, failCount: fails.length, fails: fails.slice(0, 20) }, null, 1));
})();
