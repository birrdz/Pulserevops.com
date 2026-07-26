#!/usr/bin/env node
// Print next pending Cursor write-queue item as JSON (for Cursor agent drain).
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');

const SITE = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const n = parseInt(process.env.N || '1', 10);

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT });
  const q = (await s.get('_cursor_write_queue.json', { type: 'json' })) || { items: [] };
  const pending = (q.items || []).filter((x) => x && x.status === 'pending');
  const take = pending.slice(0, Math.max(1, n));
  if (!take.length) {
    console.log(JSON.stringify({ pending: 0 }));
    return;
  }
  const out = [];
  for (const it of take) {
    const blob = await s.get('answers/' + it.id + '.json', { type: 'json' });
    out.push({
      id: it.id,
      question: it.question || (blob && blob.question) || it.id,
      issues: it.issues || [],
      hallucinations: it.hallucinations || [],
      content_gaps: it.content_gaps || [],
      sections: it.sections || [],
      answer: blob && blob.answer ? String(blob.answer) : '',
    });
  }
  console.log(JSON.stringify({ pending: pending.length, items: out }));
})().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
