// Press release store — Netlify Blobs
// POST { title, subtitle, body, tags, author, contact } → save release
// GET  ?slug=xxx → single release
// GET  ?list=1   → all releases (public)
// DELETE ?slug=xxx&secret=xxx → remove release
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ADMIN_SECRET = process.env.PRESS_ADMIN_SECRET || 'pulse-press-2025';

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
    const store = (tok && sid)
      ? getStore({ name: 'press-releases', siteID: sid, token: tok })
      : getStore('press-releases');
    const qs = event.queryStringParameters || {};

    // ── GET single release by slug ───────────────────────────────────────────
    if (event.httpMethod === 'GET' && qs.slug) {
      const raw = await store.get(qs.slug);
      if (!raw) return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Not found' }) };
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: raw,
      };
    }

    // ── GET list of all releases ─────────────────────────────────────────────
    if (event.httpMethod === 'GET' && qs.list) {
      const raw = await store.get('_index');
      const index = JSON.parse(raw || '[]');
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify(index),
      };
    }

    // ── POST: publish new release ────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const secret = qs.secret || '';
      if (secret !== ADMIN_SECRET) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      const body = JSON.parse(event.body || '{}');
      const title = (body.title || '').trim();
      if (!title) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Title required' }) };
      }

      const now = Date.now();
      const dateStr = new Date(now).toISOString().split('T')[0];
      const baseSlug = slugify(title);
      const slug = `${dateStr}-${baseSlug}`;

      const release = {
        slug,
        title,
        subtitle: (body.subtitle || '').trim(),
        body: (body.body || '').trim(),
        tags: (body.tags || '').trim(),
        author: (body.author || 'Kory White, PULSE RevOps').trim(),
        contact: (body.contact || 'hello@pulserevops.com').trim(),
        publishedAt: now,
        dateStr,
      };

      // Save full release
      await store.set(slug, JSON.stringify(release));

      // Update index
      const rawIdx = await store.get('_index');
      const index = JSON.parse(rawIdx || '[]');
      index.unshift({ slug, title, subtitle: release.subtitle, tags: release.tags, dateStr, publishedAt: now });
      await store.set('_index', JSON.stringify(index));

      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, slug, url: `https://pulserevops.com/press/?r=${slug}` }),
      };
    }

    // ── DELETE: remove a release ─────────────────────────────────────────────
    if (event.httpMethod === 'DELETE') {
      if (qs.secret !== ADMIN_SECRET) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
      const slug = qs.slug;
      if (!slug) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'slug required' }) };

      await store.delete(slug);

      const rawIdx = await store.get('_index');
      const index = JSON.parse(rawIdx || '[]').filter(r => r.slug !== slug);
      await store.set('_index', JSON.stringify(index));

      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  } catch (err) {
    console.error('press fn error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
