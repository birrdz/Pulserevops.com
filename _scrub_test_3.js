// Run scrub-one on 3 queue entries and report 13/13 outcomes.
const fs = require('fs');
const path = require('path');
const http = require('http');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const KEY = '4444';
const BASE = 'http://127.0.0.1:8899';
const TARGETS = process.argv.slice(2);
const QUEUE = WD + '/_scrub_button_queue.json';

async function inspect(id) {
  const r = await fetch(BASE + '/inspect-entry?key=' + KEY + '&id=' + encodeURIComponent(id));
  return r.json();
}

function heroIssues(body, id) {
  const s = String(body || '');
  const heroes = [];
  let m; const re = /^\s*!\[[^\]]*\]\(([^)\s]+)\)\s*$/gm;
  while ((m = re.exec(s)) && heroes.length < 8) heroes.push(m[1]);
  const topHero = (s.slice(0, 2000).match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1] || '';
  const facePath = '/assets/qa/' + id + '.jpg';
  const dupIntro = (s.match(/<!--HERO-->/g) || []).length;
  const koryInBlob = (s.match(/kory-white\.jpg/g) || []).length;
  return { topHero, facePath, heroMatchesFace: topHero === facePath, dupIntro, koryInBlob, heroCountEarly: heroes.length };
}

async function pickThree(q) {
  if (TARGETS.length >= 3) return TARGETS.slice(0, 3);
  const out = [];
  for (const id of q) {
    if (out.length >= 3) break;
    const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!blob || !blob.answer) continue;
    out.push(id);
  }
  return out;
}

function postJson(pathname, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8899,
      path: pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: timeoutMs || 0,
    }, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data || '{}')); }
        catch (e) { reject(new Error('bad JSON from ' + pathname + ': ' + String(data).slice(0, 120))); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('request timeout after ' + timeoutMs + 'ms')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function scrubOne(id) {
  // Node fetch aborts at ~5m (undici headersTimeout); full Pollinator scrub can take 20–40m.
  const payload = { key: KEY };
  if (id) payload.id = id;
  return postJson('/scrub-one', payload, 45 * 60 * 1000);
}

(async () => {
  const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const ids = await pickThree(q);
  console.log('TEST IDS:', ids.join(', '));
  const results = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const before = await inspect(id);
    console.log('\n=== [' + (i + 1) + '/3] BEFORE ' + id + ' score=' + (before.score || '?') + ' rubricPass=' + before.rubricPass + ' failed=' + JSON.stringify(before.failed || []) + ' ===');
    const rest = q.filter(x => x !== id);
    fs.writeFileSync(QUEUE, JSON.stringify([id, ...rest]));
    const t0 = Date.now();
    console.log('scrub-one starting for ' + id + ' ...');
    const out = await scrubOne(id);
    const after = await inspect(id);
    const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    const hi = heroIssues(blob && blob.answer, id);
    const elapsed = Math.round((Date.now() - t0) / 1000);
    const row = {
      id,
      elapsedSec: elapsed,
      beforeScore: before.score,
      afterScore: after.score,
      rubricPass: after.rubricPass,
      status: out.status,
      score: out.score,
      msg: out.msg,
      steps: out.steps,
      failedCriteria: out.failedCriteria,
      failed: after.failed,
      pending: after.pending,
      hero: hi,
    };
    results.push(row);
    console.log('SCRUB RESULT', JSON.stringify({ status: out.status, score: out.score, before: out.before, msg: out.msg, steps: out.steps, failedCriteria: out.failedCriteria, elapsedSec: elapsed }, null, 2));
    console.log('AFTER', JSON.stringify({ score: after.score, rubricPass: after.rubricPass, failed: after.failed, pending: after.pending, coverKb: after.coverKb, hero: hi }, null, 2));
  }
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
  const hit13 = results.filter(r => r.rubricPass || r.status === 'certified' || (r.score != null && r.score >= 13)).length;
  console.log('13/13 rubric pass or certified:', hit13 + '/3');
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
