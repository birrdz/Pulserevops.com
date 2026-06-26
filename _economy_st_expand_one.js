// Economy expand: one sales training → full 60-min facilitator guide (blob only, no LLM).
// Usage: node _economy_st_expand_one.js st0074
const fs = require('fs');
const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const HOST = 'pulserevops.com';

const CONTENT = require('./_economy_st_hour_content.js');

function loadToken() {
  const line = fs
    .readFileSync(`${__dirname}/.env.local`, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('BLOBS_PAT='));
  if (!line) throw new Error('BLOBS_PAT missing');
  return line.slice('BLOBS_PAT='.length).trim();
}

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  const id = process.argv[2];
  if (!id || !CONTENT[id]) {
    console.error('Usage: node _economy_st_expand_one.js st0074');
    console.error('Available:', Object.keys(CONTENT).join(', '));
    process.exit(1);
  }

  const { question, answer, tags } = CONTENT[id];
  const words = answer.split(/\s+/).filter(Boolean).length;
  if (words < 1400) {
    console.error('ABORT: answer too short for 60-min economy hour:', words, 'words (need ~1400+, st0073 benchmark ~1600)');
    process.exit(1);
  }
  if (!answer.includes('```mermaid')) {
    console.error('ABORT: missing mermaid');
    process.exit(1);
  }

  const token = loadToken();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });
  const existing = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!existing) {
    console.error('ABORT: no blob for', id);
    process.exit(1);
  }

  const ts = Date.now();
  await store.setJSON(`answers/${id}.json`, {
    ...existing,
    question,
    answer,
    tags: tags || existing.tags,
    last_modified_ms: ts,
    lab_run: 'economy-st-60min-expand',
    economy_expand_at: ts,
  });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    idx.entries[i] = {
      ...idx.entries[i],
      question,
      tags: tags || idx.entries[i].tags,
      last_modified_ms: ts,
    };
    await store.setJSON('_index.json', idx);
  }

  const pageUrl = `https://${HOST}/sales-trainings/${id}`;
  const page = await new Promise((resolve) => {
    https.get(pageUrl, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });
  const seoOk =
    page.status === 200 &&
    page.body.includes('<title') &&
    page.body.includes('meta name="description"') &&
    page.body.includes(`/sales-trainings/${id}`);

  const pageUrl2 = `https://${HOST}/sales-trainings/${id}`;
  const payload = {
    host: HOST,
    key: '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b',
    keyLocation: `https://${HOST}/7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b.txt`,
    urlList: [pageUrl2],
  };
  const pings = {};
  for (const ep of [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ]) {
    const r = await postJSON(ep, payload);
    pings[new URL(ep).hostname] = r.status;
  }

  if (i >= 0) {
    idx.entries[i] = { ...idx.entries[i], was_indexed_at: ts };
    await store.setJSON('_index.json', idx);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        id,
        words,
        chars: answer.length,
        url: pageUrl,
        seo: seoOk,
        indexnow: pings,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
