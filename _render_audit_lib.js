// Shared render-audit utilities for Agent A (layout/DA) and Agent B (images).
const fs = require('fs');
const path = require('path');

const WD = 'C:/Users/koryj/website';
const STATUS_F = WD + '/_render_audit_status.json';
const LOG_F = WD + '/_render_audit.log';
const CROSSOVER_F = WD + '/_CROSSOVER.md';

const SAMPLE_ENTRIES = [
  { id: 'aq1160', url: 'https://pulserevops.com/aquariums/aq1160', template: 'top10' },
  { id: 'aq1158', url: 'https://pulserevops.com/aquariums/aq1158', template: 'top10', gold: true },
  { id: 'q11133', url: 'https://pulserevops.com/knowledge/q11133', template: 'qa', gold: true },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hasDeepSeekKey() {
  return !!(process.env.DEEPSEEK_API_KEY || process.env.ds1);
}

function log(msg, agent) {
  const line = new Date().toISOString() + (agent ? ' [' + agent + ']' : '') + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function logCrossover(msg) {
  const line = '- **' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' ET:** ' + msg;
  try { fs.appendFileSync(CROSSOVER_F, line + '\n'); } catch (e) {}
}

function defaultStatus() {
  return {
    updatedAt: new Date().toISOString(),
    deployBlocked: false,
    speedupBlocked: false,
    templateBlocked: false,
    reason: '',
    issues: [],
    agentA: { pass: true, issues: [], lastRun: null, entries: [] },
    agentB: { pass: true, issues: [], lastRun: null, entries: [] },
    agentC: { pass: true, issues: [], lastRun: null, entries: [], mode: 'cursor-rules' },
  };
}

function readStatus() {
  try {
    return Object.assign(defaultStatus(), JSON.parse(fs.readFileSync(STATUS_F, 'utf8')));
  } catch (e) {
    return defaultStatus();
  }
}

function recomputeGlobal(st) {
  const aIssues = (st.agentA && st.agentA.issues) || [];
  const bIssues = (st.agentB && st.agentB.issues) || [];
  const cIssues = (st.agentC && st.agentC.issues) || [];
  const aPass = !!(st.agentA && st.agentA.pass);
  const bPass = !!(st.agentB && st.agentB.pass);
  const cPass = !!(st.agentC && st.agentC.pass);
  st.issues = [...aIssues, ...bIssues, ...cIssues];
  st.templateBlocked = !cPass;
  st.deployBlocked = !aPass || !bPass;
  st.speedupBlocked = st.deployBlocked || st.templateBlocked || bIssues.some((i) => /broken|pollinations|black|missing/i.test(i));
  const parts = [];
  if (!aPass || !bPass) parts.push('live render');
  if (!cPass) parts.push('blob gold template');
  st.reason = (st.deployBlocked || st.templateBlocked)
    ? 'Render audit failing — ' + parts.join(' + ') + ' — ' + st.issues.slice(0, 5).join('; ')
    : '';
  st.updatedAt = new Date().toISOString();
  return st;
}

function writeStatus(st) {
  recomputeGlobal(st);
  const tmp = STATUS_F + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(st, null, 2));
  fs.renameSync(tmp, STATUS_F);
  return st;
}

function updateAgentLane(agentKey, lanePatch) {
  const st = readStatus();
  st[agentKey] = Object.assign({}, st[agentKey] || {}, lanePatch);
  return writeStatus(st);
}

async function fetchLiveHtml(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html', 'Cache-Control': 'no-cache' },
    redirect: 'follow',
    signal: AbortSignal.timeout(35000),
  });
  return { ok: r.ok, status: r.status, html: await r.text(), url };
}

function extractImgSrcs(html, limit) {
  limit = limit || 40;
  const srcs = [];
  const re = /<img[^>]+src="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) && srcs.length < limit) srcs.push(m[1]);
  return srcs;
}

function extractDirectAnswerProse(html) {
  const startRe = /<div class="direct-answer-box"/i;
  const start = html.search(startRe);
  if (start < 0) return { hasGoldBox: false, proseLen: 0, prose: '' };

  let pos = html.indexOf('>', start) + 1;
  let depth = 1;
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        const inner = html.slice(html.indexOf('>', start) + 1, nextClose);
        const textOnly = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const prose = textOnly.replace(/Direct Answer/i, '').trim();
        return { hasGoldBox: true, proseLen: prose.length, prose };
      }
      pos = nextClose + 6;
    }
  }
  return { hasGoldBox: true, proseLen: 0, prose: '' };
}

/** Heuristic Direct Answer + layout audit on live HTML. */
function heuristicLayoutAudit(html, entry) {
  const issues = [];
  const da = extractDirectAnswerProse(html);
  if (!da.hasGoldBox) issues.push(entry.id + ': missing direct-answer-box on live page');
  else if (da.proseLen < 140) issues.push(entry.id + ': direct answer prose too short (' + da.proseLen + ' chars)');
  if (da.proseLen < 50) issues.push(entry.id + ': direct answer appears blank');

  if (entry.template === 'top10') {
    if (/class="entry-cover"/i.test(html)) {
      issues.push(entry.id + ': entry-cover hero present (Top 10 should not have top hero)');
    }
    const cards = (html.match(/class="product-card"/gi) || []).length;
    if (cards < 5) issues.push(entry.id + ': too few product-card elements (' + cards + ')');
  }

  if (/pollinations\.ai/i.test(html)) {
    issues.push(entry.id + ': live pollinations.ai URL in rendered HTML');
  }

  return { issues, metrics: { hasGoldBox: da.hasGoldBox, proseLen: da.proseLen, productCards: (html.match(/class="product-card"/gi) || []).length } };
}

async function checkImgLoads(url) {
  try {
    if (!url || url.startsWith('data:')) return { url, ok: false, reason: 'empty_or_data' };
    const abs = url.startsWith('http') ? url : 'https://pulserevops.com' + (url.startsWith('/') ? url : '/' + url);
    const r = await fetch(abs, {
      method: 'GET',
      headers: { Range: 'bytes=0-8192', 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    const ct = r.headers.get('content-type') || '';
    const ok = r.ok && /image\//i.test(ct);
    return { url: abs, ok, status: r.status, ct, reason: ok ? 'ok' : 'not_image' };
  } catch (e) {
    return { url, ok: false, reason: String(e.message || e) };
  }
}

/** Heuristic image audit on live HTML. */
async function heuristicImageAudit(html, entry) {
  const issues = [];
  const srcs = extractImgSrcs(html);
  if (!srcs.length) issues.push(entry.id + ': no img tags on live page');

  for (const u of srcs) {
    if (/pollinations\.ai/i.test(u)) issues.push(entry.id + ': pollinations URL in img src: ' + u.slice(0, 80));
  }

  const toCheck = srcs.filter((u) => /^https?:\/\//i.test(u) || u.startsWith('/')).slice(0, 12);
  let broken = 0;
  const details = [];
  for (const u of toCheck) {
    const c = await checkImgLoads(u);
    details.push(c);
    if (!c.ok) {
      broken++;
      issues.push(entry.id + ': broken/missing image ' + (c.url || u).slice(0, 90));
    }
  }

  return { issues, metrics: { imgCount: srcs.length, checked: toCheck.length, broken, details } };
}

async function dsEvaluateLayout(htmlSnippet, entry, heuristic) {
  if (!hasDeepSeekKey()) return null;
  try {
    const { dsChat } = require('./_ds_lib');
    const prompt = [
      'You are a live page rendering auditor for Pulse RevOps.',
      'Entry: ' + entry.id + ' (' + entry.template + ')' + (entry.gold ? ' GOLD REF' : ''),
      'Rules: Direct Answer must be in gold box (direct-answer-box), dense 3-5 sentences, >=140 chars.',
      'Top 10: product-card per rank, NO entry-cover hero, NO pollinations.ai in HTML.',
      'Q&A: hero image OK, Direct Answer gold box required.',
      'Heuristic pre-check issues: ' + (heuristic.issues.join('; ') || 'none'),
      '',
      'HTML snippet (truncated):',
      htmlSnippet.slice(0, 12000),
      '',
      'Reply JSON only: {"pass":true/false,"issues":["..."],"notes":"..."}',
    ].join('\n');
    const { content: raw } = await dsChat([{ role: 'user', content: prompt }], { temperature: 0.2, max_tokens: 800 });
    const m = String(raw || '').match(/\{[\s\S]*\}/);
    if (!m) return null;
    return JSON.parse(m[0]);
  } catch (e) {
    log('DeepSeek layout eval skipped: ' + e.message, 'lib');
    return null;
  }
}

async function dsEvaluateImages(entry, heuristic, imgDetails) {
  if (!hasDeepSeekKey()) return null;
  try {
    const { dsChat } = require('./_ds_lib');
    const prompt = [
      'You are an image rendering auditor for Pulse RevOps live pages.',
      'Entry: ' + entry.id + ' (' + entry.url + ')',
      'Rules: all images must load; NO pollinations.ai in live HTML; prefer self-hosted /assets/ paths.',
      'Broken/black/missing images = FAIL.',
      'Heuristic issues: ' + (heuristic.issues.join('; ') || 'none'),
      'Image check sample: ' + JSON.stringify((imgDetails || []).slice(0, 8)),
      '',
      'Reply JSON only: {"pass":true/false,"issues":["..."],"notes":"..."}',
    ].join('\n');
    const { content: raw } = await dsChat([{ role: 'user', content: prompt }], { temperature: 0.2, max_tokens: 600 });
    const m = String(raw || '').match(/\{[\s\S]*\}/);
    if (!m) return null;
    return JSON.parse(m[0]);
  } catch (e) {
    log('DeepSeek image eval skipped: ' + e.message, 'lib');
    return null;
  }
}

/** Agent C (Cursor) — deterministic blob gold-template + visual-lock audit (no DeepSeek). */
function cursorBlobGoldAudit(id, body, title) {
  const issues = [];
  const { pickGoldTemplate } = require('./_pulse_gold_template_router');
  const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
  const {
    auditQaGoldTemplate,
    auditGoldReferenceQa,
    QA_GOLD_ID,
    qaHasStackedImages,
    qaHasImageBeforeDirectAnswer,
  } = require('./_qa_gold_template');
  const { auditLivePollinationsInBody } = require('./_image_provider_alternate');
  const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

  const route = pickGoldTemplate(id, body, title);
  let gold;
  if (id === QA_GOLD_ID) {
    gold = auditGoldReferenceQa(body, title);
  } else if (route.template === 'top10') {
    gold = auditTop10GoldTemplate(body, title, id);
  } else {
    gold = auditQaGoldTemplate(body, title, id);
  }

  if (gold.applies !== false && !gold.compliant) {
    issues.push(id + ': gold ' + (gold.issues || []).join(','));
  }

  if (route.template === 'qa' || id === QA_GOLD_ID) {
    if (qaHasImageBeforeDirectAnswer(body)) issues.push(id + ': image_before_direct_answer (blob)');
    if (qaHasStackedImages(body)) issues.push(id + ': stacked_images (blob)');
  }

  issues.push(...auditLivePollinationsInBody(body).map((x) => id + ': ' + x));

  const grade = gradeEntry(id, body, { imagesDeferred: true });
  const metrics = {
    template: id === QA_GOLD_ID ? 'qa' : route.template,
    goldId: id === QA_GOLD_ID ? QA_GOLD_ID : route.goldId,
    grade: grade.score,
    imageCount: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length,
    goldCompliant: gold.compliant,
  };

  return { issues: [...new Set(issues)], metrics, route, gold };
}

module.exports = {
  WD,
  STATUS_F,
  LOG_F,
  SAMPLE_ENTRIES,
  sleep,
  log,
  logCrossover,
  hasDeepSeekKey,
  readStatus,
  writeStatus,
  updateAgentLane,
  recomputeGlobal,
  fetchLiveHtml,
  heuristicLayoutAudit,
  heuristicImageAudit,
  extractImgSrcs,
  checkImgLoads,
  dsEvaluateLayout,
  dsEvaluateImages,
  cursorBlobGoldAudit,
};
