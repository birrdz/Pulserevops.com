// Netlify Blobs-backed visitor tracker
// Tracks: unique visitor count + list of cities with timestamps (no personal data stored)
// Geo lookup is server-side from visitor IP — no client-side API calls needed
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Extract visitor IP from Netlify headers
function getClientIp(event) {
  return event.headers['x-nf-client-connection-ip']
    || event.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || event.headers['client-ip']
    || '';
}

// Server-side geo lookup using ip-api.com (free, no key, 45 req/min)
async function lookupCity(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return '';
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName`);
    if (!res.ok) return '';
    const data = await res.json();
    const city = data.city || '';
    const region = data.regionName || '';
    if (!city) return '';
    return region ? `${city}, ${region}` : city;
  } catch (e) {
    return '';
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    const store = getStore('visitors');

    if (event.httpMethod === 'POST') {
      // Try client-provided city first, fall back to server-side geo lookup
      const body = JSON.parse(event.body || '{}');
      let city = (body.city || '').trim().slice(0, 60);

      // If client didn't send a city, look it up server-side
      if (!city) {
        const ip = getClientIp(event);
        city = await lookupCity(ip);
      }

      // Increment unique visitor count
      const raw = await store.get('count');
      const count = (parseInt(raw) || 0) + 1;
      await store.set('count', String(count));

      // Append city to the list with timestamp
      if (city) {
        const rawCities = await store.get('cities');
        let cities = JSON.parse(rawCities || '[]');
        cities = cities.map(c => typeof c === 'string' ? { city: c, ts: 0 } : c);
        const now = Date.now();
        const updated = [
          { city, ts: now },
          ...cities.filter(c => c.city !== city),
        ].slice(0, 200);
        await store.set('cities', JSON.stringify(updated));
      }

      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, city }),
      };
    }

    if (event.httpMethod === 'GET') {
      // Check if this is a "register visit" GET (has no session flag)
      // Also do server-side geo for GET requests with ?register=1
      const params = new URLSearchParams(event.rawQuery || '');
      if (params.get('register') === '1') {
        const ip = getClientIp(event);
        const city = await lookupCity(ip);

        const raw = await store.get('count');
        const count = (parseInt(raw) || 0) + 1;
        await store.set('count', String(count));

        if (city) {
          const rawCities = await store.get('cities');
          let cities = JSON.parse(rawCities || '[]');
          cities = cities.map(c => typeof c === 'string' ? { city: c, ts: 0 } : c);
          const updated = [
            { city, ts: Date.now() },
            ...cities.filter(c => c.city !== city),
          ].slice(0, 200);
          await store.set('cities', JSON.stringify(updated));
        }

        const rawCities2 = await store.get('cities');
        let allCities = JSON.parse(rawCities2 || '[]');
        allCities = allCities.map(c => typeof c === 'string' ? { city: c, ts: 0 } : c);

        return {
          statusCode: 200,
          headers: { ...CORS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ count, city, cities: allCities }),
        };
      }

      // Normal GET — just return data
      const [rawCount, rawCities] = await Promise.all([
        store.get('count'),
        store.get('cities'),
      ]);
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
