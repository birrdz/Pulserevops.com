'use strict';

const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STORE_NAME = 'pulse-pexels-cro-library';
const STATE_KEY = 'cro-review-state.json';
const PASSCODE = '4444';
const BATCH_SIZE = 100;
const TOTAL_TARGET = 2000;
const TOTAL_BATCHES = TOTAL_TARGET / BATCH_SIZE;
const PEXELS_FLOOR_MS = 18000;
const PER_PAGE = 80;

const QUERIES = [
  'chief revenue officer executive leadership',
  'revenue strategy executive meeting',
  'sales leadership boardroom',
  'executive team business meeting',
  'business leader presenting strategy',
  'revenue operations team meeting',
  'chief executive office leadership',
  'company growth strategy meeting',
  'sales executive coaching team',
  'business forecast planning meeting',
  'executive leadership conference',
  'board of directors meeting',
  'business negotiation executives',
  'sales pipeline review meeting',
  'go to market strategy team',
  'executive woman business leadership',
  'diverse executive team boardroom',
  'business analytics leadership meeting',
  'customer growth strategy meeting',
  'corporate leadership offsite'
];

function libraryStore() {
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  return token
    ? getStore({ name: STORE_NAME, siteID: SITE_ID, token })
    : getStore(STORE_NAME);
}

function blankState() {
  return {
    version: 1,
    target: TOTAL_TARGET,
    batchSize: BATCH_SIZE,
    batches: {},
    approved: {},
    rejected: {},
    seenPhotoIds: {},
    seenSourceUrls: {},
    cursor: 0,
    lastRequestAt: 0,
    updatedAt: Date.now()
  };
}

function normalizeState(raw) {
  return Object.assign(blankState(), raw || {}, {
    batches: (raw && raw.batches) || {},
    approved: (raw && raw.approved) || {},
    rejected: (raw && raw.rejected) || {},
    seenPhotoIds: (raw && raw.seenPhotoIds) || {},
    seenSourceUrls: (raw && raw.seenSourceUrls) || {}
  });
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(body)
  };
}

function photoSource(photo) {
  const src = (photo && photo.src) || {};
  return src.large2x || src.large || src.original || '';
}

function sourceKey(url) {
  return String(url || '').split('?')[0].toLowerCase();
}

function publicPhoto(photo) {
  return {
    id: String(photo.id),
    width: photo.width || 0,
    height: photo.height || 0,
    alt: photo.alt || '',
    photographer: photo.photographer || '',
    photographerUrl: photo.photographer_url || '',
    pexelsUrl: photo.url || '',
    src: photoSource(photo)
  };
}

function batchRecord(state, batchNumber) {
  const key = String(batchNumber);
  if (!state.batches[key]) {
    state.batches[key] = { number: batchNumber, candidates: [], complete: false, createdAt: Date.now() };
  }
  return state.batches[key];
}

function nextSearch(state, batchNumber) {
  const cursor = Number(state.cursor) || 0;
  const queryIndex = (batchNumber * 7 + cursor) % QUERIES.length;
  const page = Math.floor((batchNumber * 7 + cursor) / QUERIES.length) + 1;
  state.cursor = cursor + 1;
  return { query: QUERIES[queryIndex], page };
}

async function fetchPexels(query, page) {
  const apiKey = process.env.PEXELS_API_KEY || '';
  if (!apiKey) throw new Error('PEXELS_API_KEY missing in Netlify environment');
  const url = 'https://api.pexels.com/v1/search?orientation=landscape&per_page=' + PER_PAGE +
    '&page=' + encodeURIComponent(page) + '&query=' + encodeURIComponent(query);
  const response = await fetch(url, {
    headers: { Authorization: apiKey, 'User-Agent': 'pulserevops-cro-review/1.0' }
  });
  if (response.status === 429) {
    const error = new Error('Pexels rate limit');
    error.retryAfterMs = Math.max(60000, Number(response.headers.get('retry-after') || 60) * 1000);
    throw error;
  }
  if (!response.ok) throw new Error('Pexels HTTP ' + response.status);
  return response.json();
}

function addUniquePhotos(state, batch, photos) {
  let added = 0;
  for (const raw of photos || []) {
    if (batch.candidates.length >= BATCH_SIZE) break;
    const photo = publicPhoto(raw);
    const id = photo.id;
    const urlKey = sourceKey(photo.src);
    if (!id || !photo.src || state.seenPhotoIds[id] || state.seenSourceUrls[urlKey]) continue;
    state.seenPhotoIds[id] = batch.number;
    state.seenSourceUrls[urlKey] = id;
    batch.candidates.push(photo);
    added++;
  }
  batch.complete = batch.candidates.length >= BATCH_SIZE;
  state.updatedAt = Date.now();
  return added;
}

function decisionCounts(state) {
  return {
    approved: Object.keys(state.approved).length,
    rejected: Object.keys(state.rejected).length,
    reviewed: Object.keys(state.approved).length + Object.keys(state.rejected).length,
    uniqueServed: Object.keys(state.seenPhotoIds).length
  };
}

function publicBatch(state, batchNumber) {
  const batch = batchRecord(state, batchNumber);
  const decisions = {};
  for (const photo of batch.candidates) {
    if (state.approved[photo.id]) decisions[photo.id] = 'approved';
    else if (state.rejected[photo.id]) decisions[photo.id] = 'rejected';
  }
  return {
    ok: true,
    target: TOTAL_TARGET,
    totalBatches: TOTAL_BATCHES,
    batchSize: BATCH_SIZE,
    batch: {
      number: batchNumber,
      complete: batch.complete,
      count: batch.candidates.length,
      candidates: batch.candidates,
      decisions
    },
    counts: decisionCounts(state)
  };
}

async function readBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch (e) { return {}; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  const params = event.queryStringParameters || {};
  const body = event.httpMethod === 'POST' ? await readBody(event) : {};
  const key = params.key || body.key;
  if (key !== PASSCODE) return json(401, { ok: false, error: 'bad code' });

  const store = libraryStore();
  const state = normalizeState(await store.get(STATE_KEY, { type: 'json', consistency: 'strong' }).catch(() => null));
  const action = body.action || params.action || 'status';
  const batchNumber = Math.max(1, Math.min(TOTAL_BATCHES, Number(body.batch || params.batch || 1)));

  if (action === 'decision') {
    const id = String(body.id || '');
    const batch = batchRecord(state, batchNumber);
    const photo = batch.candidates.find((item) => item.id === id);
    if (!photo) return json(404, { ok: false, error: 'photo not in this batch' });
    delete state.approved[id];
    delete state.rejected[id];
    if (body.approved === true) {
      state.approved[id] = Object.assign({}, photo, { approvedAt: Date.now(), batch: batchNumber });
    } else {
      state.rejected[id] = { id, rejectedAt: Date.now(), batch: batchNumber };
    }
    state.updatedAt = Date.now();
    await store.setJSON(STATE_KEY, state);
    return json(200, Object.assign(publicBatch(state, batchNumber), { decision: body.approved === true ? 'approved' : 'rejected' }));
  }

  if (action === 'fill') {
    const batch = batchRecord(state, batchNumber);
    if (batch.complete) return json(200, publicBatch(state, batchNumber));
    const wait = state.lastRequestAt + PEXELS_FLOOR_MS - Date.now();
    if (wait > 0) return json(200, Object.assign(publicBatch(state, batchNumber), { retryAfterMs: wait }));

    const search = nextSearch(state, batchNumber);
    state.lastRequestAt = Date.now();
    await store.setJSON(STATE_KEY, state);
    try {
      const result = await fetchPexels(search.query, search.page);
      const added = addUniquePhotos(state, batch, result.photos);
      await store.setJSON(STATE_KEY, state);
      return json(200, Object.assign(publicBatch(state, batchNumber), {
        fill: { query: search.query, page: search.page, added },
        retryAfterMs: batch.complete ? 0 : PEXELS_FLOOR_MS
      }));
    } catch (error) {
      return json(200, Object.assign(publicBatch(state, batchNumber), {
        error: error.message,
        retryAfterMs: error.retryAfterMs || PEXELS_FLOOR_MS
      }));
    }
  }

  if (action === 'library') {
    return json(200, {
      ok: true,
      approved: Object.values(state.approved),
      counts: decisionCounts(state)
    });
  }

  return json(200, publicBatch(state, batchNumber));
};

exports._test = {
  blankState,
  normalizeState,
  sourceKey,
  publicPhoto,
  batchRecord,
  nextSearch,
  addUniquePhotos,
  decisionCounts,
  publicBatch
};
