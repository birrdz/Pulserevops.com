// Netlify Blobs-backed visitor tracker
// Tracks: unique visitor count + list of cities with timestamps (no personal data stored)
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    const store = getStore('visitors');

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const city = (body.city || '').trim().slice(0, 60); // sanitise

      // Increment unique visitor count (one per session via client-side dedup)
      const raw = await store.get('count');
      const count = (parseInt(raw) || 0) + 1;
      await store.set('count', String(count));

      // Append city to the list with timestamp (deduplicated by name, max 120 entries)
      if (city) {
        const rawCities = await store.get('cities');
        // Support both old string[] format and new {city,ts}[] format
        let cities = JSON.parse(rawCities || '[]');
        cities = cities.map(c => typeof c === 'string' ? { city: c, ts: 0 } : c);
        const now = Date.now();
        const updated = [
          { city, ts: now },
          ...cities.filter(c => c.city !== city),
        ].slice(0, 120);
        await store.set('cities', JSON.stringify(updated));
      }

      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      };
    }

    if (event.httpMethod === 'GET') {
      const [rawCount, rawCities] = await Promise.all([
        store.get('count'),
        store.get('cities'),
      ]);
      // Normalise to {city, ts} objects for the client
      let cities = JSON.parse(rawCities || '[]');
      cities = cities.map(c => typeof c === 'string' ? { city: c, ts: 0 } : c);
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: parseInt(rawCount) || 0,
          cities,
        }),
      };
    }

    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  } catch (err) {
    console.error('visitors fn error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
