'use strict';
/**
 * Serve /assets/qa/* from Netlify Blobs (qa-bin/) when the static file is not in the deploy.
 * CONTENT images go live via blob put — no per-image deploy.
 *
 * Wired: netlify.toml rewrite /assets/qa/* → this function (static files still win when present).
 */
const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'pulse-machine-library';
const KEY_PREFIX = 'qa-bin/';

function store() {
  const sid = process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  const tok = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (tok && sid) {
    try {
      return getStore({ name: STORE_NAME, siteID: sid, token: tok });
    } catch (e) {}
  }
  try {
    return getStore(STORE_NAME);
  } catch (e) {
    return null;
  }
}

function fileFromEvent(event) {
  const q = (event.queryStringParameters && (event.queryStringParameters.f || event.queryStringParameters.path)) || '';
  if (q) return String(q).replace(/^\/+/, '').replace(/^assets\/qa\//i, '');
  const p = String(event.path || '');
  const m = p.match(/\/assets\/qa\/(.+)$/i) || p.match(/pulse-qa-asset\/(.+)$/i);
  if (m) return m[1];
  const parts = p.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function contentTypeFor(name) {
  const n = String(name || '').toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.webp')) return 'image/webp';
  if (n.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

exports.handler = async (event) => {
  try {
    const rel = String(fileFromEvent(event) || '')
      .replace(/\\/g, '/')
      .replace(/\.\./g, '');
    if (!rel || rel.includes('..')) {
      return { statusCode: 400, body: 'bad path' };
    }
    const s = store();
    if (!s) return { statusCode: 503, body: 'store unavailable' };

    const key = KEY_PREFIX + rel;
    const meta = await s.getMetadata(key).catch(() => null);
    const raw = await s.get(key, { type: 'arrayBuffer' });
    if (!raw || raw.byteLength < 2000) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
        body: 'not found',
      };
    }
    const ct =
      (meta && meta.metadata && meta.metadata.contentType) ||
      contentTypeFor(rel);
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Pulse-Asset': 'blob',
      },
      body: Buffer.from(raw).toString('base64'),
    };
  } catch (e) {
    return { statusCode: 500, body: String(e.message || e) };
  }
};
