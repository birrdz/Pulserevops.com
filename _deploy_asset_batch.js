'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const API = 'https://api.netlify.com/api/v1';
const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const dir = process.argv[2];
const shouldPromote = process.argv.includes('--promote');
if (!TOKEN || !dir) {
  console.error('usage: NETLIFY_AUTH_TOKEN=... node _deploy_asset_batch.js <asset-dir> [--promote]');
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url, opts = {}) {
  const r = await fetch(API + url, {
    ...opts,
    headers: { ...auth, ...(opts.headers || {}) },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${opts.method || 'GET'} ${url}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

async function uploadFile(deployId, deployPath, file) {
  const data = fs.readFileSync(file);
  const r = await fetch(`${API}/deploys/${deployId}/files/${deployPath.replace(/^\/+/, '')}`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/octet-stream' },
    body: data,
  });
  if (!r.ok) throw new Error(`upload ${deployPath}: ${r.status} ${(await r.text()).slice(0, 200)}`);
}

(async () => {
  const site = await api(`/sites/${SITE_ID}`);
  const previousId = site.published_deploy && site.published_deploy.id;
  if (!previousId) throw new Error('No published deploy');

  const [files, functionDoc] = await Promise.all([
    api(`/deploys/${previousId}/files`),
    api(`/sites/${SITE_ID}/functions`),
  ]);
  const fileMap = Object.fromEntries(files.map((f) => [f.path, f.sha]));
  const localBySha = new Map();
  const names = fs.readdirSync(dir).filter((f) => /\.(?:jpe?g|png|webp)$/i.test(f)).sort();
  for (const name of names) {
    const file = path.join(dir, name);
    const sha = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
    const deployPath = `/assets/qa/${name}`;
    fileMap[deployPath] = sha;
    if (!localBySha.has(sha)) localBySha.set(sha, { file, deployPath });
  }

  const fns = functionDoc.functions || [];
  const functions = Object.fromEntries(fns.map((f) => [f.n, f.d]));
  const function_schedules = fns.filter((f) => f.schedule).map((f) => ({ name: f.n, cron: f.schedule }));
  const draft = await api(`/sites/${SITE_ID}/deploys?title=${encodeURIComponent('Sequential campaign image assets')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft: true, files: fileMap, functions, function_schedules }),
  });
  const required = draft.required || [];
  for (const sha of required) {
    const local = localBySha.get(sha);
    if (!local) throw new Error(`Netlify requested unknown digest ${sha}`);
    await uploadFile(draft.id, local.deployPath, local.file);
  }

  let state = draft.state;
  for (let i = 0; i < 60 && state !== 'ready'; i++) {
    if (state === 'error') throw new Error(`draft ${draft.id} failed`);
    await sleep(1000);
    state = (await api(`/deploys/${draft.id}`)).state;
  }
  if (state !== 'ready') throw new Error(`draft ${draft.id} did not become ready`);

  const deployUrl = draft.deploy_ssl_url || draft.deploy_url;
  for (const name of names) {
    const r = await fetch(`${deployUrl}/assets/qa/${encodeURIComponent(name)}`, { method: 'HEAD' });
    if (!r.ok || !String(r.headers.get('content-type') || '').startsWith('image/')) {
      throw new Error(`draft asset failed: ${name} ${r.status} ${r.headers.get('content-type')}`);
    }
  }

  let promoted = false;
  if (shouldPromote) {
    await api(`/sites/${SITE_ID}/deploys/${draft.id}/restore`, { method: 'POST' });
    promoted = true;
  }
  console.log(JSON.stringify({
    ok: true,
    previousId,
    deployId: draft.id,
    deployUrl,
    assets: names.length,
    required: required.length,
    promoted,
  }));
})().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
