// Post economy 60-min sales training (st####) — blob write + IndexNow + SEO. No LLM.

const { getStore } = require('@netlify/blobs');
const { checkAgainst } = require('./economy-dedupe');
const { buildTrainingFromTopic } = require('./economy-st-hour-from-topic');
const { pingIndexNowEntry } = require('./indexnow-ping-entry');
const { capitalizeQuestion, capitalizeSentencesInMarkdown } = require('./text-capitalize');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const SITE = 'https://pulserevops.com';
const MIN_WORDS = 1400;

function getStoreSafe() {
  const tok = process.env.BLOBS_PAT;
  try {
    return getStore('pulse-machine-library');
  } catch {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

async function fetchLibraryAll() {
  const r = await fetch(
    SITE + '/.netlify/functions/pulse-machine-library-list?recent=5000'
  );
  const j = await r.json().catch(() => ({}));
  return (j.entries || []).filter((e) => e && e.id);
}

function maxStNum(entries) {
  let max = 83;
  for (const e of entries) {
    const m = String(e.id || '').match(/^st(\d+)$/i);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max;
}

async function writeTrainingBlob(store, id, question, answer, tags) {
  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  if (existing) return { ok: false, status: 409, reason: 'id exists', id };

  const ts = Date.now();
  question = capitalizeQuestion(question);
  answer = capitalizeSentencesInMarkdown(answer);

  await store.setJSON('answers/' + id + '.json', {
    id,
    question,
    answer,
    tags: Array.isArray(tags) ? tags : [],
    sources: ['Pulse RevOps sales training methodology'],
    ts,
    model: 'economy-st-60min',
    lab_run: 'economy-st-60min-tick',
    polished_at: null,
    quality_score: 5,
    polish_history: [],
    baseline_answer_v5: answer,
    images_deferred_at: ts,
    images_deferred_note: 'ddg-turtle-backfill',
  });

  await new Promise((r) => setTimeout(r, 200 + Math.floor(Math.random() * 300)));
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const indexed = new Set((idx.entries || []).map((e) => e.id));
  if (!indexed.has(id)) {
    idx.entries.unshift({
      id,
      question,
      tags: tags || [],
      ts,
      polished_at: null,
      quality_score: 5,
    });
  }
  idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  await store.setJSON('_index.json', idx);

  const indexResult = await pingIndexNowEntry(id, store);
  return { ok: true, status: 201, id, ts, index: indexResult, chars: answer.length };
}

async function seoSpotCheckTraining(id) {
  const url = SITE + '/sales-trainings/' + id;
  const r = await fetch(url, { headers: { 'User-Agent': 'pulse-cro-economy-tick/1.0' } });
  const body = await r.text();
  const canonical = 'rel="canonical" href="' + url + '"';
  const ok =
    r.status === 200 &&
    /<title[^>]*>/i.test(body) &&
    /<meta\s+name="description"/i.test(body) &&
    body.includes(canonical) &&
    /application\/ld\+json/i.test(body);
  return { id, status: r.status, seoOk: ok, url };
}

/**
 * Post one sales training from the same RevOps topic line as the Q&A tick.
 * @returns {{ ok, id?, status?, skipped?, reason?, words?, index?, seo? }}
 */
async function postTrainingFromTopic(num, topic, libraryEntries) {
  const { answer, words, question, tags } = buildTrainingFromTopic(topic);
  if (words < MIN_WORDS) {
    return { ok: false, reason: 'answer_too_short', words, min: MIN_WORDS };
  }
  if (!/```mermaid/.test(answer)) {
    return { ok: false, reason: 'missing_mermaid' };
  }

  const dup = checkAgainst(libraryEntries, question);
  if (!dup.clear) {
    return {
      ok: false,
      skipped: true,
      reason: 'duplicate',
      hit: dup.exact[0] || dup.similar[0],
      question: question.slice(0, 80),
    };
  }

  const store = getStoreSafe();
  let stNum = num;
  let result;
  for (let tries = 0; tries < 200; tries++) {
    const id = 'st' + stNum;
    result = await writeTrainingBlob(store, id, question, answer, tags);
    if (result.ok) {
      await new Promise((r) => setTimeout(r, 800));
      const seo = await seoSpotCheckTraining(id);
      return { ok: true, id, status: result.status, words, chars: result.chars, index: result.index, seo, question };
    }
    if (result.status === 409) {
      stNum++;
      continue;
    }
    return { ok: false, reason: 'write_failed', status: result.status, id };
  }
  return { ok: false, reason: 'id_exhausted' };
}

module.exports = {
  SITE,
  MIN_WORDS,
  fetchLibraryAll,
  maxStNum,
  postTrainingFromTopic,
  seoSpotCheckTraining,
};
