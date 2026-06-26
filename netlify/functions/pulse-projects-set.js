// pulse-projects-set — writes the live project registry the 15-min heartbeat
// reads. POST { key, projects:[ {name, prefix, base, target} ] }. `done` is
// computed live by the heartbeat as (count of <prefix> entries) - base, out of
// (target - base). Send projects:[] to clear → heartbeat says "No current projects."
const { getStore } = require('@netlify/blobs');
const KEY = 'pulsemachine-writer-2026';

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  return (tok && sid) ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }) : getStore('pulse-machine-library');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) {}
  if (b.key !== KEY) return { statusCode: 401, body: 'bad key' };
  const projects = Array.isArray(b.projects) ? b.projects.slice(0, 50).map((p) => ({
    name: String(p.name || '').slice(0, 120),
    prefix: String(p.prefix || '').toLowerCase().slice(0, 6),
    base: Number(p.base) || 0,
    target: Number(p.target) || 0,
  })) : [];
  try {
    await store().setJSON('_projects.json', { projects, updated_at: new Date().toISOString() });
    return { statusCode: 200, body: JSON.stringify({ ok: true, count: projects.length, projects }) };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
