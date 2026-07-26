'use strict';
/**
 * pulse-title-edit — OWNER-ONLY inline title ("dressing") edit from the live homepage (owner 2026-07-17).
 * POST {id, title, secret}. The secret is checked against EDIT_SECRET env OR the private blob key
 * `config/edit_secret` (owner-set, never public). On match, updates answers/<id>.json question/h1/title
 * and the _index.json row. KEEPS the body + image. Saves the previous title in dressing_prev for revert.
 * Anyone without the secret gets 403 — a random visitor can never change the site.
 */
const { getStore } = require('@netlify/blobs');
const STORE = 'pulse-machine-library';
function store() {
  const sid = process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  const tok = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  try { if (tok) return getStore({ name: STORE, siteID: sid, token: tok }); return getStore(STORE); } catch (e) { return null; }
}
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  let b; try { b = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'bad json' }; }
  const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
  const title = String(b.title || '').replace(/\s+/g, ' ').trim();
  const secret = String(b.secret || '');
  if (!id || !title) return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'missing id/title' }) };
  if (title.length < 8 || title.length > 160 || /[<>]/.test(title)) return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'invalid title' }) };
  const s = store(); if (!s) return { statusCode: 503, body: 'store unavailable' };
  let expected = (process.env.EDIT_SECRET || '').trim();
  if (!expected) { try { expected = String((await s.get('config/edit_secret', { type: 'text' })) || '').trim(); } catch (e) {} }
  if (!expected || secret.trim() !== expected) return { statusCode: 403, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'forbidden' }) };
  let blob = null; try { blob = await s.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) return { statusCode: 404, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'entry not found' }) };
  const prev = blob.question || blob.h1 || '';
  blob.dressing_prev = prev; blob.question = title; blob.h1 = title; if ('title' in blob) blob.title = title; blob.updated_at = new Date().toISOString();
  await s.setJSON('answers/' + id + '.json', blob);
  try { const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' }); const ex = (idx.entries || []).find(e => e && e.id === id); if (ex) { ex.question = title; ex.title = title; await s.setJSON('_index.json', idx); } } catch (e) {}
  return { statusCode: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: JSON.stringify({ ok: true, id, title, prev }) };
};
