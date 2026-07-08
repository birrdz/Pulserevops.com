// One random pillar Q&A → golden template pipeline → publish → email live link.
// Usage: node _random_gold_publish_one.js [--pillar=fs] [--finish-id=ga0136]
'use strict';
const fs = require('fs');
const WD = __dirname;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIP = 'koryjordanwhite@gmail.com';
const SCRUB = 'http://127.0.0.1:8899';
const KEY = '4444';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { pillarUrl } = require('./_ranking_list_rebuild_lib');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditQaGoldTemplate, reshapeQaGoldBody } = require('./_qa_gold_template');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const NAMES = {
  fs: 'Fishing', wl: 'Wellness', es: 'Espresso', pt: 'Pets', cr: 'Crabbing', aq: 'Aquariums',
  gm: 'Gaming', mv: 'Movies', bt: 'Boats', ca: 'Cars', dn: 'Dining', rs: 'Resorts', ga: 'Gatherings',
  hf: 'Home & Family', sw: 'Software', ce: 'Current Events',
};
const SKIP = new Set(['tl', 'vq', 'q', 'dr']);
const QA_PILLARS = new Set(['cg', 'tk', 'pt', 'sw', 'ai', 'aq', 'tl', 'tc', 'ga', 'gm']);

const { prepareEntryForPublish } = require('./_write_lib');
const { needsAqQaFix, rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');

const forcePillar = (process.argv.find((a) => a.startsWith('--pillar=')) || '').split('=')[1] || '';
const finishId = (process.argv.find((a) => a.startsWith('--finish-id=')) || '').split('=')[1] || '';
const skipPillar = (process.argv.find((a) => a.startsWith('--skip-pillar=')) || '').split('=')[1] || '';

async function prepareForGenerate() {
  try {
    fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1');
  } catch (e) {}
  await fetch(SCRUB + '/scrub-auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, action: 'stop' }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
  await fetch(SCRUB + '/gen-reset-stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
}

async function prepareForScrub() {
  try {
    fs.unlinkSync(WD + '/_scrub_auto_off.flag');
  } catch (e) {}
  await fetch(SCRUB + '/scrub-auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
  await fetch(SCRUB + '/gen-reset-stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
}

async function urgentGenerate(pillar, question) {
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prepareForGenerate();
      console.log('urgent attempt', attempt, '…');
      const resp = await fetch(SCRUB + '/urgent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: KEY, pillar, question, essayOnly: true }),
        signal: AbortSignal.timeout(90 * 60 * 1000),
      });
      const data = await resp.json().catch(() => ({}));
      if (!data.ok) throw new Error(data.error || data.msg || 'urgent failed');
      return data;
    } catch (e) {
      lastErr = e;
      console.log('urgent attempt', attempt, 'failed:', e.message);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 8000));
    }
  }
  throw lastErr || new Error('urgent failed');
}

async function resendKey() {
  let k = process.env.RESEND_API_KEY || process.env.resendapikey;
  if (k) return k;
  const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then((r) => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  const j = await r.json();
  const val = (j.values || []).find((v) => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  return val && val.value;
}

async function pickRandomPillar(store) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const counts = {};
  for (const e of idx.entries || []) {
    if (!e || !e.id) continue;
    const m = String(e.id).match(/^([a-z]{2,3})\d+$/i);
    if (!m) continue;
    const p = m[1].toLowerCase();
    if (SKIP.has(p)) continue;
    counts[p] = (counts[p] || 0) + 1;
  }
  const pool = Object.entries(counts).filter(([p, n]) => n >= 20 && QA_PILLARS.has(p)).map(([p]) => p);
  if (!pool.length) throw new Error('no eligible pillars');
  if (forcePillar) {
    if (!pool.includes(forcePillar)) throw new Error('pillar not in pool: ' + forcePillar);
    return forcePillar;
  }
  const filtered = skipPillar ? pool.filter((p) => p !== skipPillar) : pool;
  const pickFrom = filtered.length ? filtered : pool;
  return pickFrom[Math.floor(Math.random() * pickFrom.length)];
}

async function makeQuestion(pillar) {
  const label = NAMES[pillar] || pillar;
  const { content } = await dsChat([
    {
      role: 'system',
      content:
        'Write ONE natural high-intent question for the "' +
        label +
        '" section of PULSE. Essay/Q&A shape only — never a ranked list, never "top 10", never product comparison rankings. Single-topic explanatory essay. Datable product/list topics end with "in 2027". Evergreen how-to/definition topics have NO year. Return only the question, no quotes.',
    },
    { role: 'user', content: 'One new ' + label + ' question nobody has asked before on this site.' },
  ], { temperature: 0.9 });
  let q = String(content || '').trim().replace(/^["']|["']$/g, '');
  if (!/\?$/.test(q)) q += '?';
  return q;
}

async function upsertIndex(store, id, score, entry) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) return;
  const now = Date.now();
  const row = {
    id,
    question: entry.question || id,
    tags: entry.tags || [],
    quality_score: score,
    format_v: entry.format_v || '',
    pending: false,
    ts: now,
    polished_at: now,
    has_answer: true,
    was_indexed_at: new Date().toISOString(),
  };
  const hero = String(entry.answer || '').match(/^!\[[^\]]*\]\(([^)]+)\)/);
  if (hero) row.img = hero[1];
  idx.entries = idx.entries.filter((e) => e && e.id !== id);
  idx.entries.unshift(row);
  idx.entries.sort((a, b) => (Number(b.ts) || 0) - (Number(a.ts) || 0));
  await store.setJSON('_index.json', idx);
}

async function finishViaScrub(id) {
  await prepareForScrub();
  console.log('Running full scrub-one on', id, '…');
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await fetch(SCRUB + '/scrub-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: KEY, id }),
        signal: AbortSignal.timeout(90 * 60 * 1000),
      });
      const data = await resp.json().catch(() => ({}));
      if (data.status === 'certified' && data.id) {
    const blob = await getStore({
      name: 'pulse-machine-library',
      siteID: SITE,
      token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
    }).get('answers/' + data.id + '.json', { type: 'json' });
    const question = (blob && blob.question) || id;
    const pillar = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
    const body = blob && blob.answer ? blob.answer : '';
    const gold = auditQaGoldTemplate(body, question, id);
      return { id: data.id, question, pillar, body, grade: data.score || 13, goldOk: gold.compliant };
      }
      if (data.status === 'ready' && (data.score || 0) >= 13) {
    const cert = await fetch(SCRUB + '/certify-one', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: KEY, id }),
      signal: AbortSignal.timeout(5 * 60 * 1000),
    });
    const cj = await cert.json().catch(() => ({}));
    if (cj.ok) {
      const store = getStore({
        name: 'pulse-machine-library',
        siteID: SITE,
        token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
      });
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      const question = (blob && blob.question) || id;
      const pillar = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
      const body = blob && blob.answer ? blob.answer : '';
      const gold = auditQaGoldTemplate(body, question, id);
      return { id, question, pillar, body, grade: cj.score || 13, goldOk: gold.compliant };
      }
      }
      lastErr = new Error('scrub-one failed: ' + (data.msg || data.status || JSON.stringify(data).slice(0, 200)));
    } catch (e) {
      lastErr = e;
      console.log('scrub-one attempt', attempt, 'failed:', e.message);
      if (attempt < 3) await prepareForScrub();
    }
  }
  throw lastErr || new Error('scrub-one failed');
}

async function finishAndPublish(store, id) {
  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!existing || !existing.answer) throw new Error('missing blob ' + id);
  const question = existing.question || id;
  const pillar = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const validIds = new Set((idx.entries || []).map((e) => e && e.id).filter(Boolean));
  let prepBody = reshapeQaGoldBody(existing.answer);
  const daRe = /(?:^|\n)##\s+Direct\s+Answer[\s\S]*?(?=\n##\s+|$)/gi;
  const daHits = [...prepBody.matchAll(daRe)];
  if (daHits.length > 1) {
    let keep = true;
    prepBody = prepBody.replace(daRe, (m) => {
      if (keep) {
        keep = false;
        return m;
      }
      return '';
    });
    prepBody = reshapeQaGoldBody(prepBody);
  }
  await store.setJSON('answers/' + id + '.json', Object.assign({}, existing, { answer: prepBody, updated_at: new Date().toISOString() }));
  const rebuilt = await rebuildAqQaEntry(id, question, prepBody, {
    store,
    entryMeta: existing,
    siblings: [],
    valid: validIds,
    dsChat,
  });
  const saved = await saveAqQaEntry(store, idx, id, question, rebuilt.body, existing);
  const gold = auditQaGoldTemplate(rebuilt.body, question, id);
  if (saved.grade < 13 || !gold.compliant) {
    throw new Error('finish failed grade=' + saved.grade + ' gold=' + (gold.issues || []).join(','));
  }
  const pub = prepareEntryForPublish(id, question, Object.assign({}, existing, {
    answer: rebuilt.body,
    question,
    quality_score: 13,
    pending: false,
    polished_at: Date.now(),
    was_indexed_at: new Date().toISOString(),
  }));
  await store.setJSON('answers/' + id + '.json', pub);
  await upsertIndex(store, id, 13, pub);
  return { id, question, pillar, body: rebuilt.body, grade: 13, goldOk: gold.compliant };
}

async function emailLink(opts) {
  const key = await resendKey();
  if (!key) throw new Error('no resend key');
  const html =
    '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:640px">' +
    '<p style="font-size:18px;font-weight:800">✅ Random gold Q&amp;A published</p>' +
    '<p><b>' +
    opts.id +
    '</b> · ' +
    opts.pillarLabel +
    ' · ' +
    opts.template +
    '</p>' +
    '<p style="font-weight:700">' +
    opts.title +
    '</p>' +
    '<p><a href="' +
    opts.url +
    '" style="color:#0b57d0;font-weight:700">' +
    opts.url +
    '</a></p>' +
    '<p>Grade: <b>' +
    opts.grade +
    '/13</b> · Gold: ' +
    (opts.goldOk ? 'pass' : 'check') +
    '</p></div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIP],
      subject: '✅ Random gold Q&A · ' + opts.id + ' · ' + opts.pillarLabel,
      html,
    }),
  });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 120));
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  if (finishId) {
    let done;
    try {
      done = await finishViaScrub(finishId.toLowerCase());
    } catch (e) {
      console.log('scrub-one failed, trying gold rebuild:', e.message);
      done = await finishAndPublish(store, finishId.toLowerCase());
    }
    const url = pillarUrl(done.id);
    await emailLink({
      id: done.id,
      title: done.question,
      pillarLabel: NAMES[done.pillar] || done.pillar,
      template: 'Q&A (q11133)',
      url,
      grade: done.grade,
      goldOk: done.goldOk,
    });
    console.log('Published:', url);
    return;
  }

  const pillar = await pickRandomPillar(store);
  const question = await makeQuestion(pillar);
  console.log('Pillar:', pillar, '(' + (NAMES[pillar] || pillar) + ')');
  console.log('Question:', question);
  await prepareForGenerate();
  console.log('Pipeline: generateOne via scrub /urgent …');

  const data = await urgentGenerate(pillar, question);
  const result = data.result || {};
  console.log('Result:', JSON.stringify(result, null, 2));

  let id = result.id;
  let questionFinal = question;
  let grade = result.score;
  let goldOk = false;
  let body = '';

  if (result.status === 'certified' && id) {
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    body = blob && blob.answer ? blob.answer : '';
    const route = pickGoldTemplate(id, body, question);
    const gold = route.template === 'qa' ? auditQaGoldTemplate(body, question, id) : { compliant: true };
    grade = gradeEntry(id, body).score;
    goldOk = gold.compliant;
  } else if (id && (result.score || 0) >= 12) {
    console.log('Generate did not certify — running scrub-one finish on', id);
    let done;
    try {
      done = await finishViaScrub(id);
    } catch (e) {
      console.log('scrub-one failed, trying gold rebuild:', e.message);
      done = await finishAndPublish(store, id);
    }
    id = done.id;
    questionFinal = done.question;
    body = done.body;
    grade = done.grade;
    goldOk = done.goldOk;
  } else {
    throw new Error('not certified: ' + (result.notes || result.status) + ' score=' + result.score);
  }

  const url = pillarUrl(id);
  await emailLink({
    id,
    title: questionFinal,
    pillarLabel: NAMES[pillar] || pillar,
    template: 'Q&A (q11133)',
    url,
    grade,
    goldOk,
  });

  console.log('Published:', url);
  console.log('Email sent to', RECIP);
})().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
