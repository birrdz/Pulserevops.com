// Newsletter subscriber collection — stores to Netlify Blobs
// POST { email } → stores with timestamp, deduplicates
// GET  ?secret=XXX → returns full subscriber list (admin only)
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ADMIN_SECRET = process.env.NEWSLETTER_ADMIN_SECRET || 'pulse-admin-2025';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    const store = getStore('newsletter');

    // ── ADMIN: GET all subscribers ──────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const secret = (event.queryStringParameters || {}).secret;
      if (secret !== ADMIN_SECRET) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
      const raw = await store.get('subscribers');
      const subscribers = JSON.parse(raw || '[]');
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: subscribers.length, subscribers }),
      };
    }

    // ── SUBSCRIBE: POST { email } ───────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const email = (body.email || '').trim().toLowerCase();

      if (!isValidEmail(email)) {
        return {
          statusCode: 400,
          headers: CORS,
          body: JSON.stringify({ error: 'Invalid email address' }),
        };
      }

      const raw = await store.get('subscribers');
      const subscribers = JSON.parse(raw || '[]');

      // Deduplicate
      const exists = subscribers.some(s => s.email === email);
      if (exists) {
        return {
          statusCode: 200,
          headers: CORS,
          body: JSON.stringify({ ok: true, message: 'Already subscribed' }),
        };
      }

      subscribers.push({
        email,
        ts: Date.now(),
        source: body.source || 'website',
      });

      await store.set('subscribers', JSON.stringify(subscribers));

      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ ok: true, message: 'Subscribed', count: subscribers.length }),
      };
    }

    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  } catch (err) {
    console.error('subscribe fn error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
