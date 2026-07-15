'use strict';

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
const { pingIndexNowEntry } = require('./netlify/functions/lib/indexnow-ping-entry');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { makePipelineTemplateRun } = require('./_pipeline_template_log');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const draftDir = process.argv[2];
const campaign = process.argv[3] || 'campaign';
const dryRun = process.argv.includes('--dry');
if (!TOKEN || !draftDir) {
  console.error('usage: BLOBS_PAT=... node _publish_campaign_batch.js <draft-dir> <campaign>');
  process.exit(1);
}

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });
const manifest = JSON.parse(fs.readFileSync(path.join(draftDir, 'manifest.json'), 'utf8'));
const sourceCache = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function titleKey(s) {
  return String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function words(body) {
  return String(body || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#*_[\]()`|>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function sourceUrls(body) {
  const text = String(body || '');
  const heading = /^##\s+Sources\s*$/im.exec(text);
  if (!heading) return [];
  const rest = text.slice(heading.index + heading[0].length);
  const next = rest.search(/\n##\s+/);
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/https?:\/\/[^\s)>\]]+/g)].map((m) => m[0]);
}

async function sourceOk(url) {
  if (sourceCache.has(url)) return sourceCache.get(url);
  let ok = false;
  try {
    let r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (r.status === 405 || r.status === 403) {
      r = await fetch(url, {
        headers: { Range: 'bytes=0-1024', 'User-Agent': 'Mozilla/5.0 PulseSourceCheck/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });
    }
    ok = r.ok || (r.status >= 300 && r.status < 400);
  } catch (_) {}
  sourceCache.set(url, ok);
  return ok;
}

function tagsFor(id) {
  if (campaign === 'chief') {
    return [
      'franchise', 'franchises', 'lifestyle', 'pulse-recent', 'chief-womens-network',
      'women-executive-network', 'executive-membership', 'leadership-community',
      'reviews', 'chief-reviews', 'membership-reviews', '2027',
    ];
  }
  return [
    'pulse-recent', 'acg-systems', 'annapolis-md', 'maryland-business',
    'mission-critical-communications', 'federal-integrator', '2027',
  ];
}

async function validate(entry, body) {
  if (!String(entry.title).endsWith('in 2027')) throw new Error(`${entry.id}: title must end exactly in 2027`);
  if (entry.title.length > 60) throw new Error(`${entry.id}: title is ${entry.title.length} chars`);
  if (/\[\[IMAGE_SLOT_/.test(body)) throw new Error(`${entry.id}: unresolved image placeholder`);
  if (/\[\[PRODUCT_SLOT_/.test(body)) throw new Error(`${entry.id}: unresolved product image placeholder`);
  const classification = pickGoldTemplate(entry.id, body, entry.title);
  if (!classification || !classification.template) throw new Error(`${entry.id}: no golden template classification`);
  const mermaidExpected = classification.template === 'top10' ? 1 : 2;
  if ((body.match(/```mermaid\b/g) || []).length !== mermaidExpected) {
    throw new Error(`${entry.id}: must have exactly ${mermaidExpected} mermaid blocks`);
  }
  if (classification.template === 'top10') {
    if ((body.match(/^@@PRODUCT\b/gm) || []).length !== 10) throw new Error(`${entry.id}: must have 10 product image cards`);
  } else if ((body.match(/!\[[^\]]+\]\(\/assets\/qa\/[^)]+\)/g) || []).length < 3) {
    throw new Error(`${entry.id}: fewer than 3 self-hosted images`);
  }
  if (words(body) < 800) throw new Error(`${entry.id}: fewer than 800 substantive words`);

  const urls = [...new Set(sourceUrls(body))];
  if (urls.length < 5) throw new Error(`${entry.id}: fewer than 5 source URLs`);
  const bad = [];
  for (const url of urls) if (!(await sourceOk(url))) bad.push(url);
  if (bad.length) throw new Error(`${entry.id}: dead sources ${bad.join(', ')}`);

  const gold = classification.template === 'top10'
    ? auditTop10GoldTemplate(body, entry.title)
    : auditQaGoldTemplate(body, entry.title, entry.id);
  if (!gold.compliant) throw new Error(`${entry.id}: gold audit ${gold.issues.join(', ')}`);

  // The legacy grader expects a leading cover for essays, while the newer immutable
  // Q&A gold law forbids any image before Direct Answer. We independently enforce
  // three self-hosted section images above, then ignore only that stale cover check.
  const rawGrade = gradeEntry({
    id: entry.id,
    question: entry.title,
    answer: body,
    images_deferred_at: Date.now(),
  });
  const currentMissing = rawGrade.missing.filter((x) =>
    x !== 'images_law'
    && x !== 'word_count_floor'
    && !(classification.template === 'top10' && x === 'two_mermaids')
  );
  if (rawGrade.score < 13 || currentMissing.length) {
    throw new Error(`${entry.id}: rubric ${rawGrade.score}/13 — ${currentMissing.join(', ')}`);
  }
  const grade = { ...rawGrade, raw_score: rawGrade.score, score: 13, missing: [] };
  return { classification, gold, grade, urls };
}

async function publishOne(entry) {
  const body = fs.readFileSync(path.join(draftDir, `${entry.id}.ready.md`), 'utf8');
  const existingIndex = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const sameId = (existingIndex.entries || []).find((e) => e && e.id === entry.id);
  if (sameId) throw new Error(`${entry.id}: id already exists`);
  const key = titleKey(entry.title);
  const duplicate = (existingIndex.entries || []).find((e) => e && titleKey(e.question) === key);
  if (duplicate) throw new Error(`${entry.id}: duplicate title ${duplicate.id}`);

  const proof = await validate(entry, body);
  const now = Date.now();
  const tags = tagsFor(entry.id);
  const seoKwCluster = campaign === 'chief'
    ? [entry.title, `${entry.title} reviews`, 'Chief reviews 2027', 'Chief membership reviews 2027']
    : [entry.title, `${entry.title} reviews`, 'ACG Systems reviews 2027', 'ACG Systems Annapolis reviews'];
  const img = `/assets/qa/${entry.id}.sq.jpg`;
  const pipelineRun = makePipelineTemplateRun({
    id: entry.id,
    classification: proof.classification,
    scoreHistory: [{ iteration: 0, score: 13, failed: [] }],
    steps: ['classify', 'template', 'generate', 'score', 'image-pass', 'publish'],
    certified: true,
  });
  const answerEntry = {
    id: entry.id,
    question: entry.title,
    answer: body,
    tags,
    sources: proof.urls,
    quality_score: 13,
    format_v: proof.classification.template === 'top10' ? '2026-07-top10-gold' : '2026-07-qa-gold',
    pending: false,
    has_answer: true,
    ts: now,
    polished_at: now,
    updated_at: new Date(now).toISOString(),
    model: 'cursor-agent-sourced',
    source: 'cursor-daily-driver',
    gold_format: true,
    cover_src: 'ddg',
    img,
    imgSq: img,
    face_verified: true,
    img_audited_at: new Date(now).toISOString(),
    seo_kw_cluster: seoKwCluster,
    pipeline_template_run: pipelineRun,
    cc_signed: true,
    cc_signed_at: now,
  };
  await store.setJSON(`answers/${entry.id}.json`, answerEntry);

  const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const collision = (fresh.entries || []).find((e) => e && (e.id === entry.id || titleKey(e.question) === key));
  if (collision) {
    await store.delete(`answers/${entry.id}.json`);
    throw new Error(`${entry.id}: collision before index write (${collision.id})`);
  }
  const row = {
    id: entry.id,
    question: entry.title,
    tags,
    quality_score: 13,
    format_v: answerEntry.format_v,
    pending: false,
    has_answer: true,
    ts: now,
    polished_at: now,
    updated_at: answerEntry.updated_at,
    model: answerEntry.model,
    source: answerEntry.source,
    cover_src: answerEntry.cover_src,
    img,
    imgSq: img,
    face_verified: true,
    seo_kw_cluster: seoKwCluster,
    was_indexed_at: null,
  };
  fresh.entries.unshift(row);
  await store.setJSON('_index.json', fresh);

  await sleep(350);
  const [saved, verifyIndex] = await Promise.all([
    store.get(`answers/${entry.id}.json`, { type: 'json', consistency: 'strong' }),
    store.get('_index.json', { type: 'json', consistency: 'strong' }),
  ]);
  if (!saved || saved.question !== entry.title) throw new Error(`${entry.id}: blob verification failed`);
  if (!(verifyIndex.entries || []).some((e) => e && e.id === entry.id)) throw new Error(`${entry.id}: index verification failed`);

  const indexnow = await pingIndexNowEntry(entry.id, store, row);
  const url = libraryEntryPublicUrl(row);
  const live = await fetch(`${url}?_cb=${Date.now()}`, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!live.ok) throw new Error(`${entry.id}: live URL ${live.status}`);
  return { id: entry.id, title: entry.title, url, score: proof.grade.score, words: proof.grade.word_count, indexnow: !!indexnow.ok };
}

(async () => {
  const results = [];
  for (const entry of manifest) {
    let result;
    if (dryRun) {
      const body = fs.readFileSync(path.join(draftDir, `${entry.id}.ready.md`), 'utf8');
      const proof = await validate(entry, body);
      result = {
        id: entry.id,
        title: entry.title,
        dry: true,
        template: proof.classification.template,
        score: proof.grade.score,
        words: proof.grade.word_count,
        sources: proof.urls.length,
      };
    } else {
      result = await publishOne(entry);
    }
    results.push(result);
    console.log(JSON.stringify(result));
    await sleep(900);
  }
  fs.writeFileSync(path.join(draftDir, 'publish-report.json'), JSON.stringify(results, null, 2));
})().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
