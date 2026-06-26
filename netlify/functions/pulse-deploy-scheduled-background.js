// pulse-deploy-scheduled-background — production deploy every 2 hours.
// Uses NETLIFY_BUILD_HOOK_URL (preferred) or Netlify API builds endpoint.
// Set in Netlify UI → Site configuration → Environment variables.

const https = require('https');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function request(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? JSON.stringify(body) : '';
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method,
        headers: Object.assign(
          {},
          headers,
          data ? { 'Content-Length': Buffer.byteLength(data) } : {}
        ),
        timeout: 45000,
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => {
          buf += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 500) }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    if (data) req.write(data);
    req.end();
  });
}

async function triggerBuildHook(hookUrl) {
  return request('POST', hookUrl, { 'Content-Type': 'application/json' }, {});
}

async function triggerApiBuild(token) {
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/builds`;
  return request(
    'POST',
    url,
    {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    { clear_cache: false }
  );
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async () => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const hook = process.env.NETLIFY_BUILD_HOOK_URL || process.env.DEPLOY_HOOK_URL;
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_PAT;

  try {
    if (hook) {
      const r = await triggerBuildHook(hook);
      const ok = r.status >= 200 && r.status < 300;
      console.log('[deploy-scheduled] hook', r.status, ok);
      return {
        statusCode: 200,
        body: JSON.stringify({ ok, via: 'build_hook', status: r.status, at: new Date().toISOString() }),
      };
    }
    if (token) {
      const r = await triggerApiBuild(token);
      const ok = r.status >= 200 && r.status < 300;
      console.log('[deploy-scheduled] api', r.status, ok);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok,
          via: 'netlify_api',
          status: r.status,
          detail: r.body,
          at: new Date().toISOString(),
        }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: false,
        reason: 'Set NETLIFY_BUILD_HOOK_URL or NETLIFY_AUTH_TOKEN on the site',
      }),
    };
  } catch (e) {
    console.error('[deploy-scheduled]', e.message);
    return { statusCode: 200, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
