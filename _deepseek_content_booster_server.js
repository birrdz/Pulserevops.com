#!/usr/bin/env node
'use strict';

// Standalone DeepSeek-only duplicate of the 7950 Content Booster.
// New port/state/logs only; it does not modify the original multibox manager.
const fs = require('fs');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const dns = require('dns').promises;
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { makeDeepSeekCandidate, candidateInvariantIssues } = require('./_deepseek_booster_candidate');
const { enforceWriterVisualLock } = require('./_visual_lock_law');

const WD = __dirname;
const PORT = Number(process.env.DEEPSEEK_BOOSTER_PORT || 333);
const PASS = process.env.DEEPSEEK_BOOSTER_KEY || '4444';
const STATE_FILE = path.join(WD, '_deepseek_booster_state.json');
const LOG_FILE = path.join(WD, '_deepseek_booster_log.jsonl');
const STAGING_DIR = path.join(WD, '_deepseek_booster_staging');
const PROGRESS_FILE = path.join(WD, '_deepseek_booster_progress.json');
const PUBLISHED_FILE = path.join(WD, '_deepseek_booster_published.json');
const HOLD_FILE = path.join(WD, '_deepseek_booster_holds.json');
const MAX_PODS = 5;
const TARGET = 13; // Golden-template law: publish only at 13/13.
const MAX_PASSES = 6;
fs.mkdirSync(STAGING_DIR, { recursive: true });

try {
  for (const line of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const blobs = getStore({
  name: 'pulse-machine-library',
  siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
});

function freshState() {
  return {
    running: false,
    stopRequested: false,
    pillar: null,
    mode: 'one-level',
    wave: 0,
    autoWaves: false,
    pods: 0,
    perPod: 0,
    total: 0,
    processed: 0,
    passed: 0,
    upgraded: 0,
    parked: 0,
    active: [],
    recent: [],
    startedAt: null,
    finishedAt: null,
    note: 'idle',
  };
}

let state = freshState();
try {
  const prior = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  state = { ...freshState(), ...prior, running: false, active: [], note: prior.running ? 'recovered after interrupted run' : (prior.note || 'idle') };
} catch (_) {}
let stopRequested = false;
let runProgress = { key: null, completed: [] };
let publishedIds = new Set();
try { publishedIds = new Set(JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf8'))); } catch (_) {}
let heldIds = {};
try { heldIds = JSON.parse(fs.readFileSync(HOLD_FILE, 'utf8')) || {}; } catch (_) {}

function markPublished(id) {
  publishedIds.add(String(id));
  fs.writeFileSync(PUBLISHED_FILE, JSON.stringify([...publishedIds]));
  clearHold(id);
}

function holdId(id, reason) {
  heldIds[String(id)] = { at: Date.now(), reason: String(reason || '').slice(0, 500) };
  fs.writeFileSync(HOLD_FILE, JSON.stringify(heldIds, null, 2));
}

function isHeld(id) {
  const held = heldIds[String(id)];
  return held && Date.now() - Number(held.at || 0) < 7 * 86400000;
}

function clearHold(id) {
  if (!Object.prototype.hasOwnProperty.call(heldIds, String(id))) return;
  delete heldIds[String(id)];
  fs.writeFileSync(HOLD_FILE, JSON.stringify(heldIds, null, 2));
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(event, data = {}) {
  const row = { ts: new Date().toISOString(), event, ...data };
  fs.appendFileSync(LOG_FILE, JSON.stringify(row) + '\n');
  console.log('[ds-booster]', event, data.id || '', data.message || '');
}

function pOf(id) {
  return (String(id || '').match(/^([a-z]+)/i) || [, ''])[1].toLowerCase();
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

function isVisualLine(line) {
  return /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line)
    || /^\s*@@PRODUCT\b/.test(line)
    || /<img\b|<aside\b|class=["'][^"']*(?:cro-|product-card|direct-answer-box)/i.test(line);
}

function syncVisualLines(liveBody, candidateBody) {
  const live = String(liveBody || '').split(/\r?\n/);
  const candidate = String(candidateBody || '').split(/\r?\n/);
  const liveVisual = live.filter(isVisualLine);
  const candidateVisual = candidate.filter(isVisualLine);
  if (liveVisual.length !== candidateVisual.length) return candidateBody;
  let index = 0;
  return candidate.map(line => isVisualLine(line) ? liveVisual[index++] : line).join('\n');
}

function proseHash(body) {
  return sha256(String(body || '').split(/\r?\n/).map(line => isVisualLine(line) ? '<VISUAL_SLOT>' : line).join('\n'));
}

function stageFile(id) {
  return path.join(STAGING_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '') + '.json');
}

function readStage(id, liveBody) {
  try {
    const staged = JSON.parse(fs.readFileSync(stageFile(id), 'utf8'));
    if (staged.liveHash !== proseHash(liveBody)) {
      fs.unlinkSync(stageFile(id));
      return null;
    }
    return staged;
  } catch (_) {
    return null;
  }
}

function writeStage(id, value) {
  fs.writeFileSync(stageFile(id), JSON.stringify(value, null, 2));
}

function clearStage(id) {
  try { fs.unlinkSync(stageFile(id)); } catch (_) {}
}

function stagedCount(pillar = 'ALL') {
  try {
    return fs.readdirSync(STAGING_DIR).filter(name => {
      if (!name.endsWith('.json')) return false;
      const id = name.replace(/\.json$/, '');
      return String(pillar || 'ALL').toUpperCase() === 'ALL' || pOf(id) === String(pillar).toLowerCase();
    }).length;
  } catch (_) { return 0; }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

async function getIndex() {
  const idx = await blobs.get('_index.json', { type: 'json', consistency: 'strong' });
  return (idx && idx.entries) || [];
}

async function getEntry(id) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const entry = await blobs.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      if (entry) return entry;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  return null;
}

function goldAudit(route, body, title, id) {
  if (route.template === 'top10') return auditTop10GoldTemplate(body, title);
  if (route.template === 'qa') return auditQaGoldTemplate(body, title, id);
  return { compliant: true, issues: [], applies: false };
}

function externalUrls(body) {
  const urls = String(body || '').match(/https?:\/\/[^\s)<>"']+/g) || [];
  return [...new Set(urls.map(url => url.replace(/[.,;:!?]+$/, '')))]
    .filter(url => !/pulserevops\.com/i.test(url));
}

function privateAddress(address) {
  return /^(?:127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80)/i.test(String(address || ''));
}

async function safePublicUrl(raw) {
  let parsed;
  try { parsed = new URL(raw); } catch (_) { return false; }
  if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) return false;
  if (/^(?:localhost|.*\.local)$/i.test(parsed.hostname)) return false;
  try {
    const addresses = await dns.lookup(parsed.hostname, { all: true });
    return addresses.length > 0 && addresses.every(row => !privateAddress(row.address));
  } catch (_) {
    return false;
  }
}

async function verifyNewUrls(original, candidate) {
  const before = new Set(externalUrls(original));
  const added = externalUrls(candidate).filter(url => !before.has(url));
  const broken = [];
  if (added.length > 30) broken.push('too_many_new_urls_' + added.length);
  for (const url of added.slice(0, 30)) {
    try {
      if (!(await safePublicUrl(url))) {
        broken.push(url);
        continue;
      }
      let response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
        headers: { 'user-agent': 'Pulse-DeepSeek-Booster/1.0' },
      });
      if (response.status === 403 || response.status === 405) {
        response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(8000),
          headers: { 'user-agent': 'Pulse-DeepSeek-Booster/1.0', range: 'bytes=0-1024' },
        });
      }
      if (response.status >= 400) broken.push(url);
    } catch (_) {
      broken.push(url);
    }
  }
  return broken;
}

function sharedRubricFailures(body, route) {
  const failures = [];
  if (!route || !route.template) failures.push('no_locked_gold_template');
  const direct = String(body || '').match(/^##\s+Direct\s+Answer\s*\n([\s\S]*?)(?=^##\s+|\s*$)/im);
  const directWords = direct ? direct[1].replace(/!\[[^\]]*\]\([^)]+\)/g, ' ').trim().split(/\s+/).filter(Boolean).length : 0;
  if (directWords < 40) failures.push('direct_answer_incomplete');
  const mediaCount = (String(body).match(/!\[[^\]]*\]\([^)]+\)/g) || []).length
    + (String(body).match(/@@PRODUCT[^\n]*\simg=/g) || []).length;
  const maxMedia = route && route.template === 'top10' ? 11 : 10;
  if (mediaCount < 3 || mediaCount > maxMedia) failures.push(`media_count_${mediaCount}`);
  const mermaids = [...String(body).matchAll(/```mermaid\s*\n([\s\S]*?)```/gi)].map(match => match[1]);
  const validMermaidStart = /^(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|mindmap|timeline|gitGraph|quadrantChart|sankey-beta|xychart-beta)\b/i;
  if (mermaids.some(code => {
    const trimmed = code.trim();
    const balanced = (trimmed.match(/\[/g) || []).length === (trimmed.match(/\]/g) || []).length
      && (trimmed.match(/\{/g) || []).length === (trimmed.match(/\}/g) || []).length
      && (trimmed.match(/\(/g) || []).length === (trimmed.match(/\)/g) || []).length;
    return !validMermaidStart.test(trimmed) || !balanced || /\]\](?:\s*(?:-->|---|--|==>|\||$))|[​-‏﻿­]/m.test(trimmed);
  })) failures.push('mermaid_syntax_invalid');
  if (route && (route.template === 'qa' || route.template === 'top10')) {
    const related = String(body).match(/^##\s+Related[^\n]*\n([\s\S]*?)(?=^##\s+|\s*$)/im);
    const relatedLinks = related ? (related[1].match(/https?:\/\/(?:www\.)?pulserevops\.com\/[^\s)]+|\/knowledge\/[a-z0-9_-]+/gi) || []).length : 0;
    if (relatedLinks < 3) failures.push('related_links_under_3');
    const sourceBlock = String(body).match(/^##\s+(?:Sources|References)\s*\n([\s\S]*?)(?=^##\s+|\s*$)/im);
    const sourceLinks = sourceBlock ? externalUrls(sourceBlock[1]).length : 0;
    if (sourceLinks < 5) failures.push('external_sources_under_5');
  }
  const localImages = [...String(body).matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)].map(match => match[1]);
  for (const url of localImages) {
    const localPath = path.join(WD, url.replace(/^\/+/, '').split(/[?#]/)[0]);
    try {
      const stat = fs.statSync(localPath);
      const magic = fs.readFileSync(localPath).subarray(0, 12);
      const validMagic = (magic[0] === 0xff && magic[1] === 0xd8)
        || magic.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        || (magic.subarray(0, 4).toString() === 'RIFF' && magic.subarray(8, 12).toString() === 'WEBP')
        || magic.subarray(0, 4).toString() === '<svg';
      if (stat.size < 1024 || !validMagic) failures.push('corrupt_local_image:' + url);
    } catch (_) {
      failures.push('missing_local_image:' + url);
    }
  }
  return failures;
}

async function gateCandidate({ id, title, original, candidate, lockedRoute }) {
  const grade = gradeEntry(id, candidate, { title });
  const audit = goldAudit(lockedRoute, candidate, title, id);
  const invariants = candidateInvariantIssues(original, candidate, lockedRoute, id, title);
  const brokenNewUrls = await verifyNewUrls('', candidate);
  const sharedFailures = sharedRubricFailures(candidate, lockedRoute);
  const failed = [];
  failed.push(...(grade.missing || []).map(x => 'rubric: ' + x));
  if (!audit.compliant) failed.push(...(audit.issues || []).map(x => 'gold-template: ' + x));
  failed.push(...invariants.map(x => 'invariant: ' + x));
  failed.push(...brokenNewUrls.map(x => 'unverified-new-url: ' + x));
  failed.push(...sharedFailures.map(x => 'shared-rubric: ' + x));
  return {
    pass: grade.score >= TARGET
      && (grade.missing || []).length === 0
      && Object.values(grade.criteria || {}).every(Boolean)
      && audit.compliant
      && (audit.applies !== false || id === lockedRoute.goldId)
      && invariants.length === 0
      && brokenNewUrls.length === 0
      && sharedFailures.length === 0,
    score: grade.score,
    failed: [...new Set(failed)],
    grade,
    audit,
  };
}

async function publishCertified({ id, title, candidate, expectedLiveHash, lockedRoute }) {
  const current = await getEntry(id);
  if (!current) throw new Error('entry disappeared before publish');
  const liveBody = String(current.body || current.answer || '');
  if (proseHash(liveBody) !== expectedLiveHash) {
    throw new Error('live prose changed during the run; stale candidate was NOT published');
  }
  let merged = syncVisualLines(liveBody, candidate);
  merged = enforceWriterVisualLock(liveBody, merged, {
    qaGold: lockedRoute.template === 'qa',
    id,
    title,
  });
  const finalGate = await gateCandidate({
    id,
    title,
    original: liveBody,
    candidate: merged,
    lockedRoute,
  });
  if (!finalGate.pass) throw new Error('final reread gate failed; candidate was NOT published');

  // Re-read once more after asynchronous URL checks. This narrows the remaining
  // non-CAS write window to the final synchronous merge + setJSON call.
  const latest = await getEntry(id);
  if (!latest) throw new Error('entry disappeared at final commit');
  const latestBody = String(latest.body || latest.answer || '');
  if (proseHash(latestBody) !== expectedLiveHash) {
    throw new Error('live prose changed during final verification; candidate was NOT published');
  }
  merged = enforceWriterVisualLock(latestBody, syncVisualLines(latestBody, merged), {
    qaGold: lockedRoute.template === 'qa',
    id,
    title,
  });
  const commitGrade = gradeEntry(id, merged, { title });
  const commitAudit = goldAudit(lockedRoute, merged, title, id);
  if ((commitGrade.missing || []).length
    || !Object.values(commitGrade.criteria || {}).every(Boolean)
    || !commitAudit.compliant
    || candidateInvariantIssues(latestBody, merged, lockedRoute, id, title).length) {
    throw new Error('final synchronous commit gate failed; candidate was NOT published');
  }

  const now = Date.now();
  const updated = {
    ...latest,
    answer: merged,
    quality_score: TARGET,
    polished_at: now,
    deepseek_booster_at: now,
    deepseek_booster_score: TARGET,
  };
  if (Object.prototype.hasOwnProperty.call(latest, 'body')) updated.body = merged;
  await blobs.setJSON('answers/' + id + '.json', updated);
  // Never rewrite shared _index.json here: image and writer lanes also mutate it.
  // A local certified ledger prevents repeats without risking an index clobber.
  markPublished(id);
  return merged;
}

function directiveFor(gate) {
  if (!gate.failed.length) return 'Re-check the full 13/13 rubric and repair any remaining weakness without changing structure.';
  return [
    'Repair exactly these failed checks. Do not rewrite unrelated sections:',
    ...gate.failed.map(item => '- ' + item),
    '',
    'The candidate must pass 13/13 and the locked gold-template audit.',
  ].join('\n');
}

function setActive(pod, id, attempt, score, phase) {
  state.active[pod] = { pod: pod + 1, id, attempt, score, phase };
  saveState();
}

function finishRow(row) {
  state.recent.unshift(row);
  state.recent = state.recent.slice(0, 50);
  state.processed += 1;
  state.active = state.active.filter(x => x && x.id !== row.id);
  if (runProgress.key && !runProgress.completed.includes(row.id)) {
    runProgress.completed.push(row.id);
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(runProgress));
  }
  saveState();
}

async function processOne(id, pod) {
  const entry = await getEntry(id);
  if (!entry) {
    state.parked += 1;
    finishRow({ id, status: 'parked', score: 0, reason: 'entry blob missing', at: new Date().toISOString() });
    return false;
  }
  const title = String(entry.question || entry.title || '');
  const original = String(entry.body || entry.answer || '');
  const lockedRoute = pickGoldTemplate(id, original, title);
  const staged = readStage(id, original);
  let working = staged
    ? enforceWriterVisualLock(original, syncVisualLines(original, String(staged.body || original)), {
      qaGold: lockedRoute.template === 'qa',
      id,
      title,
    })
    : original;
  const passNumber = staged ? Number(staged.passes || 0) + 1 : 1;
  let gate = await gateCandidate({ id, title, original, candidate: working, lockedRoute });
  if (gate.pass) {
    if (staged) {
      setActive(pod, id, passNumber, gate.score, 'publishing staged 13/13');
      await publishCertified({ id, title, candidate: working, expectedLiveHash: proseHash(original), lockedRoute });
      clearStage(id);
      state.upgraded += 1;
    }
    state.passed += 1;
    markPublished(id);
    finishRow({ id, status: staged ? 'upgraded-13' : 'already-13', score: gate.score, passes: staged && staged.passes, at: new Date().toISOString() });
    log(staged ? 'published' : 'already-pass', { id, score: gate.score, template: lockedRoute.template });
    return true;
  }

  if (passNumber > MAX_PASSES) {
    clearStage(id);
    holdId(id, `no 13/13 after ${MAX_PASSES} staged passes`);
    state.parked += 1;
    finishRow({ id, status: 'parked', score: gate.score, reason: `no 13/13 after ${MAX_PASSES} staged passes`, at: new Date().toISOString() });
    return false;
  }

  const priorScore = gate.score;
  const priorFailureCount = gate.failed.length;
  setActive(pod, id, passNumber, gate.score, 'one-level DeepSeek fix');
  const result = await makeDeepSeekCandidate({
    id,
    title,
    body: working,
    directive: directiveFor(gate),
    lockedRoute,
    shouldStop: () => stopRequested,
  });
  if (result.issues.length) {
    if (staged && passNumber < MAX_PASSES) {
      writeStage(id, { ...staged, passes: passNumber, lastNoGain: result.issues, updatedAt: new Date().toISOString() });
    } else if (staged) {
      clearStage(id);
    }
    holdId(id, result.issues.join('; '));
    state.parked += 1;
    finishRow({ id, status: 'no-improvement', score: gate.score, reason: result.issues.join('; '), at: new Date().toISOString() });
    return false;
  }

  working = result.candidate;
  setActive(pod, id, passNumber, priorScore, 'quality + gold verification');
  gate = await gateCandidate({ id, title, original, candidate: working, lockedRoute });
  log('one-level-round', { id, pass: passNumber, from: priorScore, score: gate.score, publish: gate.pass, template: lockedRoute.template, failed: gate.failed.slice(0, 10) });
  if (gate.pass) {
    setActive(pod, id, passNumber, gate.score, 'publishing certified 13/13');
    await publishCertified({ id, title, candidate: working, expectedLiveHash: proseHash(original), lockedRoute });
    clearStage(id);
    state.passed += 1;
    state.upgraded += 1;
    finishRow({ id, status: 'upgraded-13', score: 13, passes: passNumber, at: new Date().toISOString() });
    log('published', { id, score: 13, passes: passNumber, template: lockedRoute.template });
    return true;
  }

  const improved = gate.score >= priorScore
    && (gate.score > priorScore || gate.failed.length < priorFailureCount);
  if (improved) {
    clearHold(id);
    writeStage(id, {
      id,
      title,
      liveHash: proseHash(original),
      body: working,
      score: gate.score,
      failures: gate.failed,
      passes: passNumber,
      template: lockedRoute.template,
      updatedAt: new Date().toISOString(),
    });
    finishRow({
      id,
      status: 'staged-one-level-up',
      score: gate.score,
      reason: `${priorScore}/13 → ${gate.score}/13; not live until 13/13`,
      at: new Date().toISOString(),
    });
    return true;
  }

  if (staged && passNumber < MAX_PASSES) {
    writeStage(id, { ...staged, passes: passNumber, lastNoGain: gate.failed.slice(0, 10), updatedAt: new Date().toISOString() });
  } else if (staged) {
    clearStage(id);
  }
  holdId(id, gate.failed.slice(0, 10).join('; '));
  state.parked += 1;
  finishRow({
    id,
    status: 'no-improvement',
    score: gate.score,
    reason: gate.failed.slice(0, 6).join('; '),
    at: new Date().toISOString(),
  });
  log('no-improvement', { id, score: gate.score, message: gate.failed.slice(0, 6).join('; ') });
  return false;
}

async function runPod(ids, pod) {
  const outcomes = [];
  for (const id of ids) {
    if (stopRequested) break;
    try {
      outcomes.push(await processOne(id, pod));
    } catch (error) {
      if (stopRequested && /stopped before queued call/i.test(error.message || '')) break;
      if (/DS_DAILY_CAP|DeepSeek\s+(?:400|401|402|403)|API_KEY|insufficient|balance/i.test(error.message || '')) {
        stopRequested = true;
        state.note = 'DeepSeek paused: ' + error.message;
        saveState();
        log('deepseek-paused', { id, message: error.message });
        break;
      }
      state.parked += 1;
      finishRow({ id, status: 'error', score: 0, reason: error.message, at: new Date().toISOString() });
      log('error', { id, message: error.message });
      outcomes.push(false);
    }
    const window = outcomes.slice(-25);
    const failures = window.filter(ok => !ok).length;
    if (window.length >= 10 && failures / window.length > 0.2) {
      stopRequested = true;
      state.note = `Pod ${pod + 1} breaker opened: ${failures}/${window.length} parked`;
      saveState();
      log('breaker', { pod: pod + 1, failures, window: window.length });
      break;
    }
  }
}

async function launch({ pillar, pods, perPod, stagedOnly = false, wave = 1, autoWaves = false }) {
  if (state.running) throw new Error('A DeepSeek booster run is already active');
  if (!/^(?:ALL|[a-z]{1,4})$/i.test(pillar)) throw new Error('Select a valid pillar');
  pods = Math.max(1, Math.min(MAX_PODS, Number(pods) || 1));
  const requestedPerPod = Number(perPod);
  stagedOnly = stagedOnly === true;
  wave = Math.max(1, Number(wave) || 1);
  autoWaves = autoWaves === true;
  const progressKey = [pillar.toUpperCase(), wave, stagedOnly ? 'staged' : 'all'].join(':');
  try {
    const saved = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    runProgress = saved && saved.key === progressKey ? saved : { key: progressKey, completed: [] };
  } catch (_) {
    runProgress = { key: progressKey, completed: [] };
  }
  const completed = new Set(runProgress.completed || []);
  const uniqueEntries = [...new Map((await getIndex())
    .filter(entry => entry && entry.id)
    .map(entry => [String(entry.id), entry])).values()];
  const allInScope = uniqueEntries
    .filter(entry => entry && entry.id
      && (pillar.toUpperCase() === 'ALL' || pOf(entry.id) === pillar.toLowerCase())
      && Number(entry.quality_score || 0) < TARGET
      && !publishedIds.has(String(entry.id))
      && !isHeld(entry.id)
      && (!stagedOnly || fs.existsSync(stageFile(entry.id)))
      && !completed.has(String(entry.id)))
    .sort((a, b) => (Number(a.quality_score) || 0) - (Number(b.quality_score) || 0)
      || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  perPod = requestedPerPod === 0
    ? Math.ceil(allInScope.length / pods)
    : Math.max(1, Math.min(10000, requestedPerPod || 250));
  const entries = allInScope.slice(0, pods * perPod);
  if (!entries.length) throw new Error('No entries found for pillar ' + pillar);

  stopRequested = false;
  state = {
    ...freshState(),
    running: true,
    pillar: pillar.toLowerCase(),
    wave,
    autoWaves,
    pods,
    perPod,
    total: entries.length,
    startedAt: new Date().toISOString(),
    note: `Wave ${wave} · one level per URL · sub-13 stays staged locally`,
    active: Array.from({ length: pods }, (_, i) => ({ pod: i + 1, id: null, phase: 'starting' })),
  };
  saveState();
  log('start', { pillar, pods, perPod, total: entries.length, wave, stagedOnly });

  const chunks = Array.from({ length: pods }, () => []);
  entries.forEach((entry, index) => chunks[index % pods].push(String(entry.id)));
  Promise.all(chunks.map((ids, pod) => runPod(ids, pod))).finally(() => {
    state.running = false;
    state.stopRequested = stopRequested;
    state.active = [];
    state.finishedAt = new Date().toISOString();
    state.note = stopRequested
      ? (state.note && state.note !== 'DeepSeek-only · publish gate locked at 13/13' ? state.note : 'stopped')
      : `Wave ${wave} complete`;
    saveState();
    const report = { ...state, stagedRemaining: stagedCount(pillar) };
    fs.writeFileSync(path.join(WD, `_deepseek_booster_wave_${wave}.json`), JSON.stringify(report, null, 2));
    log('finish', { processed: state.processed, passed: state.passed, upgraded: state.upgraded, parked: state.parked, wave, stagedRemaining: report.stagedRemaining });
    if (!stopRequested) {
      try { fs.unlinkSync(PROGRESS_FILE); } catch (_) {}
      runProgress = { key: null, completed: [] };
    }
    if (!stopRequested && autoWaves && report.stagedRemaining > 0 && wave < MAX_PASSES) {
      state.note = `Wave ${wave} complete · next staged wave starting`;
      saveState();
      setTimeout(() => {
        launch({ pillar, pods, perPod: 0, wave: wave + 1, stagedOnly: true, autoWaves: true })
          .catch(error => {
            state.note = `Next wave stopped: ${error.message}`;
            saveState();
            log('wave-error', { wave: wave + 1, message: error.message });
          });
      }, 3000);
    }
  });
}

function json(res, code, value) {
  res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(value));
}

function body(req) {
  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 20000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch (_) { resolve({}); } });
  });
}

function page() {
  const active = state.active.map(x => `<div class="pod"><b>Pod ${x.pod}</b><span>${esc(x.id || 'waiting')}</span><small>${esc(x.phase || '')}${x.score != null ? ' · ' + x.score + '/13' : ''}</small></div>`).join('');
  const recent = state.recent.map(row => `<tr><td>${esc(row.id)}</td><td>${esc(row.status)}</td><td>${esc(row.score)}/13</td><td>${esc(row.reason || '')}</td></tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DeepSeek Content Booster</title>
<style>body{margin:0;background:#090d12;color:#eaf0f7;font:15px system-ui}header{padding:22px;background:#071d18;border-bottom:2px solid #19c37d}main{max-width:1200px;margin:auto;padding:20px}.card{background:#111821;border:1px solid #253445;border-radius:12px;padding:18px;margin-bottom:16px}.row{display:flex;gap:10px;flex-wrap:wrap;align-items:end}label{display:grid;gap:5px;color:#aebbc8}select,input{background:#080c11;color:#fff;border:1px solid #3b4a5b;border-radius:7px;padding:9px}button{border:0;border-radius:8px;padding:11px 18px;font-weight:800;cursor:pointer}.go{background:#19c37d}.stop{background:#dc3545;color:#fff}.stats{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.stat,.pod{background:#0b1118;border:1px solid #263444;border-radius:9px;padding:12px}.stat b{font-size:24px;display:block}.pods{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.pod span,.pod small{display:block;margin-top:5px}.pod small{color:#8fa1b3}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #263444;text-align:left}.law{color:#19c37d;font-weight:700}@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}}</style></head>
<body><header><h1>DeepSeek Content Booster</h1><div>Whole-site one-level quality ladder · no Claude Code · <span class="law">sub-13 work stays local; only verified 13/13 publishes</span></div></header>
<main><section class="card"><div class="row"><label>Scope<select id="pillar"><option value="ALL">Entire site — lowest score first</option><option value="tl">CRO Pulse Tools (tl)</option><option value="q">Q&A (q)</option><option value="ra">Revenue Architecture (ra)</option><option value="gp">GTM Playbooks (gp)</option><option value="fr">Franchises (fr)</option><option value="aq">Aquariums (aq)</option></select></label><label>Pods<input id="pods" type="number" min="1" max="5" value="1"></label><label>URLs per pod (0 = all)<input id="perPod" type="number" min="0" max="10000" value="250"></label><label><input id="autoWaves" type="checkbox" checked>Continue staged waves automatically</label><button class="go" onclick="start()">Start one-level pass</button><button class="stop" onclick="stopRun()">Stop</button></div><p>Start with one pod. Every URL gets one targeted improvement before the staged set advances to its next wave.</p></section>
<section class="card"><div class="stats"><div class="stat"><b>${state.processed}</b>processed</div><div class="stat"><b>${state.passed}</b>13/live</div><div class="stat"><b>${state.upgraded}</b>published</div><div class="stat"><b>${stagedCount(state.pillar || 'ALL')}</b>staged</div><div class="stat"><b>${state.parked}</b>no gain</div><div class="stat"><b>${Math.max(0, state.total - state.processed)}</b>left</div></div><p>${esc(state.note)}</p></section>
<section class="card"><h2>Active pods</h2><div class="pods">${active || '<span>Idle</span>'}</div></section>
<section class="card"><h2>Recent</h2><table><thead><tr><th>ID</th><th>Status</th><th>Score</th><th>Reason</th></tr></thead><tbody>${recent}</tbody></table></section></main>
<script>async function start(){let key=prompt('Owner key');if(!key)return;let r=await fetch('/api/start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key,pillar:pillar.value,pods:+pods.value,perPod:+perPod.value,autoWaves:autoWaves.checked})});let j=await r.json();if(!j.ok)alert(j.error);else location.reload()}async function stopRun(){let key=prompt('Owner key');if(!key)return;await fetch('/api/stop',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key})});location.reload()}setTimeout(()=>location.reload(),8000)</script></body></html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(page());
  }
  if (req.method === 'GET' && url.pathname === '/api/status') return json(res, 200, { ok: true, state });
  if (req.method === 'POST' && url.pathname === '/api/start') {
    const data = await body(req);
    if (String(data.key || '') !== PASS) return json(res, 403, { ok: false, error: 'bad key' });
    try {
      await launch(data);
      return json(res, 200, { ok: true, state });
    } catch (error) {
      return json(res, 400, { ok: false, error: error.message });
    }
  }
  if (req.method === 'POST' && url.pathname === '/api/stop') {
    const data = await body(req);
    if (String(data.key || '') !== PASS) return json(res, 403, { ok: false, error: 'bad key' });
    stopRequested = true;
    state.stopRequested = true;
    state.note = 'stop requested; current DeepSeek call will finish safely';
    saveState();
    return json(res, 200, { ok: true });
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`DeepSeek Content Booster: http://localhost:${PORT}/`);
});
