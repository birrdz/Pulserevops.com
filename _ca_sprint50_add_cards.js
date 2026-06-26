// Add @@PRODUCT name= lines under each ## N. header, then DDG img backfill.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
const IDS = [];
for (let i = 924; i <= 973; i++) IDS.push('ca' + String(i).padStart(4, '0'));
const clean = x => x.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ').replace(/\bBEST OVERALL\b/gi, '').replace(/\bBEST VALUE\b/gi, '').replace(/\s{2,}/g, ' ').trim();

(async () => {
  let n = 0;
  for (const id of IDS) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) continue;
    const lines = e.answer.split(/\r?\n/);
    const out = [];
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
      out.push(lines[i]);
      const m = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
      if (!m) continue;
      const next = lines[i + 1] || '';
      if (/^@@PRODUCT/.test(next)) continue;
      const name = clean(m[2]);
      out.push(`@@PRODUCT name="${name.replace(/"/g, '')}"`);
      changed = true;
    }
    if (changed) {
      e.answer = out.join('\n');
      e.ts = Date.now();
      await s.setJSON('answers/' + id + '.json', e);
      n++;
      console.log('lines', id);
    }
  }
  console.log('added product lines to', n, 'entries');
})();
