'use strict';
// Deploy local assets/qa/*.jpg files to Netlify (file digest deploy + promote).
// Used by cursor drip so rewritten pages do not keep /assets/qa/* URLs that 404.
// Token: NETLIFY_AUTH_TOKEN, or BLOBS_PAT (same Netlify personal access token).
//
// Concurrent promote races drop newly uploaded files (last restore wins) →
// false "fixed" emails while live covers still 404. Serialize with a lockfile.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const API = 'https://api.netlify.com/api/v1';
const DEPLOY_LOCK = process.env.PULSE_QA_DEPLOY_LOCK || '/tmp/pulse-qa-deploy.lock';
const LOCK_STALE_MS = Math.max(60_000, parseInt(process.env.PULSE_QA_DEPLOY_LOCK_STALE_MS || '900000', 10) || 900000);

function authToken() {
  return (
    process.env.NETLIFY_AUTH_TOKEN ||
    process.env.BLOBS_PAT ||
    process.env.NETLIFY_BLOBS_TOKEN ||
    ''
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withDeployLock(fn) {
  const start = Date.now();
  for (;;) {
    try {
      const fd = fs.openSync(DEPLOY_LOCK, 'wx');
      fs.writeFileSync(fd, String(process.pid) + ' ' + new Date().toISOString());
      fs.closeSync(fd);
      break;
    } catch (e) {
      if (!e || e.code !== 'EEXIST') throw e;
      try {
        const st = fs.statSync(DEPLOY_LOCK);
        if (Date.now() - st.mtimeMs > LOCK_STALE_MS) {
          try {
            fs.unlinkSync(DEPLOY_LOCK);
          } catch (e2) {}
          continue;
        }
      } catch (e3) {}
      if (Date.now() - start > LOCK_STALE_MS + 30_000) {
        throw new Error('qa-deploy lock timeout: ' + DEPLOY_LOCK);
      }
      await sleep(1500);
    }
  }
  try {
    return await fn();
  } finally {
    try {
      fs.unlinkSync(DEPLOY_LOCK);
    } catch (e) {}
  }
}

async function api(token, url, opts = {}) {
  const r = await fetch(API + url, {
    ...opts,
    headers: {
      Authorization: 'Bearer ' + token,
      ...(opts.headers || {}),
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error((opts.method || 'GET') + ' ' + url + ': ' + r.status + ' ' + text.slice(0, 300));
  return text ? JSON.parse(text) : {};
}

async function uploadFile(token, deployId, deployPath, file) {
  const data = fs.readFileSync(file);
  const r = await fetch(API + '/deploys/' + deployId + '/files/' + deployPath.replace(/^\/+/, ''), {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/octet-stream',
    },
    body: data,
  });
  if (!r.ok) throw new Error('upload ' + deployPath + ': ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

/**
 * @param {string[]} absFiles absolute paths to local jpg/png/webp
 * @param {{ promote?: boolean, title?: string }} opts
 */
async function deployQaAssetFiles(absFiles, opts) {
  opts = opts || {};
  const promote = opts.promote !== false;
  const token = authToken();
  if (!token) return { ok: false, error: 'NETLIFY_AUTH_TOKEN/BLOBS_PAT missing' };

  const files = (absFiles || [])
    .map((f) => path.resolve(f))
    .filter((f) => fs.existsSync(f) && /\.(?:jpe?g|png|webp)$/i.test(f));
  if (!files.length) return { ok: true, skipped: true, assets: 0, reason: 'no-files' };

  return withDeployLock(async () => {
    const site = await api(token, '/sites/' + SITE_ID);
    const previousId = site.published_deploy && site.published_deploy.id;
    if (!previousId) return { ok: false, error: 'no published deploy' };

    const [deployFiles, functionDoc] = await Promise.all([
      api(token, '/deploys/' + previousId + '/files'),
      api(token, '/sites/' + SITE_ID + '/functions'),
    ]);
    const fileMap = Object.fromEntries(deployFiles.map((f) => [f.path, f.sha]));
    const localBySha = new Map();
    const names = [];

    for (const file of files) {
      const name = path.basename(file);
      const sha = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
      const deployPath = '/assets/qa/' + name;
      fileMap[deployPath] = sha;
      names.push(name);
      if (!localBySha.has(sha)) localBySha.set(sha, { file, deployPath });
    }

    const fns = functionDoc.functions || [];
    const functions = Object.fromEntries(fns.map((f) => [f.n, f.d]));
    const function_schedules = fns.filter((f) => f.schedule).map((f) => ({ name: f.n, cron: f.schedule }));
    const title = opts.title || 'cursor drip qa assets · ' + names.length;
    const draft = await api(token, '/sites/' + SITE_ID + '/deploys?title=' + encodeURIComponent(title), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft: true, files: fileMap, functions, function_schedules }),
    });

    const required = draft.required || [];
    for (const sha of required) {
      const local = localBySha.get(sha);
      if (!local) throw new Error('Netlify requested unknown digest ' + sha);
      await uploadFile(token, draft.id, local.deployPath, local.file);
    }

    let state = draft.state;
    for (let i = 0; i < 90 && state !== 'ready'; i++) {
      if (state === 'error') throw new Error('draft ' + draft.id + ' failed');
      await sleep(1000);
      state = (await api(token, '/deploys/' + draft.id)).state;
    }
    if (state !== 'ready') throw new Error('draft ' + draft.id + ' did not become ready');

    let promoted = false;
    if (promote) {
      await api(token, '/sites/' + SITE_ID + '/deploys/' + draft.id + '/restore', { method: 'POST' });
      promoted = true;
      // CDN / edge can lag a beat behind restore
      await sleep(1200);
    }

    return {
      ok: true,
      deployId: draft.id,
      assets: names.length,
      required: required.length,
      promoted,
      names: names.slice(0, 40),
    };
  });
}

/** Collect local assets/qa files for an entry id (cover + numbered slots). */
function listLocalQaFilesForId(assetDir, id) {
  const dir = assetDir || path.join(process.cwd(), 'assets', 'qa');
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp('^' + String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:-\\d+)?\\.jpe?g$', 'i');
  return fs
    .readdirSync(dir)
    .filter((f) => re.test(f))
    .map((f) => path.join(dir, f))
    .filter((f) => {
      try {
        return fs.statSync(f).size > 8000;
      } catch (e) {
        return false;
      }
    });
}

module.exports = { deployQaAssetFiles, listLocalQaFilesForId, authToken };
