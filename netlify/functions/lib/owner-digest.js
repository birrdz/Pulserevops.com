// owner-digest.js — consolidate owner alert emails into ONE digest per batch.
// Owner (2026-06-27): "one email with 10 things instead of 10 emails."
//
// Instead of each notify function emailing immediately, call queueOwnerEmail():
// it appends the event to a blob queue and, when the queue reaches FLUSH_AT (10),
// sends ONE email listing all queued events and clears the queue. A time-based
// safety flush (forceFlush, called by a heartbeat/cron) sends partial batches so
// fewer-than-10 events don't sit forever.
const { getStore } = require('@netlify/blobs');

const RECIPIENT = process.env.OWNER_EMAIL || 'koryjordanwhite@gmail.com';
const FLUSH_AT = parseInt(process.env.DIGEST_FLUSH_AT || '25', 10);
const KEY = 'owner-digest-queue.json';

function store() {
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const siteID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore('pulse-machine-stats'); }
  catch (e) { try { return getStore({ name: 'pulse-machine-stats', siteID, token }); } catch (e2) { return null; } }
}

async function sendEmail(subject, html) {
  const from = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
  const pmKey = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const rsKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  try {
    if (pmKey) return (await fetch('https://api.postmarkapp.com/email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Postmark-Server-Token': pmKey }, body: JSON.stringify({ From: from, To: RECIPIENT, Subject: subject, HtmlBody: html, MessageStream: 'outbound' }) })).ok;
    if (rsKey) return (await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + rsKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [RECIPIENT], subject, html }) })).ok;
  } catch (e) {}
  return false;
}

function renderDigest(items) {
  const rows = items.map(it => {
    const when = new Date(it.ts).toLocaleString('en-US', { timeZone: 'America/New_York' });
    const link = it.url ? ` &middot; <a href="${it.url}">${it.url}</a>` : '';
    return `<li style="margin:6px 0"><b>${it.what}</b>${link}<br><span style="color:#888;font-size:12px">${when} ET</span></li>`;
  }).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1a1a1a">
    <h2 style="color:#E8710A">🔔 PULSE — ${items.length} new signals</h2>
    <ul style="padding-left:18px">${rows}</ul>
    <p style="color:#888;font-size:12px">Batched digest (1 email per ${FLUSH_AT} events) so your inbox isn't flooded.</p></div>`;
}

// Queue one owner alert; auto-flush when the batch hits flushAt. opts.queueKey/flushAt let a caller use a
// SEPARATE batched queue (e.g. noisy human clicks) so it doesn't affect the real-time lead-signal queue.
async function queueOwnerEmail({ what, url, queueKey, flushAt, label }) {
  const s = store();
  if (!s) return { ok: false, reason: 'no-store' };
  const key = queueKey || KEY;
  const at = parseInt(flushAt || FLUSH_AT, 10) || FLUSH_AT;
  const q = (await s.get(key, { type: 'json' }).catch(() => null)) || { items: [] };
  q.items.push({ what: String(what || 'signal').slice(0, 200), url: url || '', ts: Date.now() });
  if (q.items.length >= at) {
    const batch = q.items.splice(0, q.items.length);
    await s.setJSON(key, q);
    const sent = await sendEmail(`🔔 PULSE: ${batch.length} ${label || 'new signals'}`, renderDigest(batch));
    return { ok: true, flushed: batch.length, sent };
  }
  await s.setJSON(key, q);
  return { ok: true, queued: q.items.length };
}

// Time-based safety flush — call from a cron/heartbeat so partial batches still go out.
async function forceFlush(queueKey, label) {
  const s = store();
  if (!s) return { ok: false };
  const key = queueKey || KEY;
  const q = (await s.get(key, { type: 'json' }).catch(() => null)) || { items: [] };
  if (!q.items.length) return { ok: true, flushed: 0 };
  const batch = q.items.splice(0, q.items.length);
  await s.setJSON(key, q);
  const sent = await sendEmail(`🔔 PULSE: ${batch.length} ${label || 'new signals'}`, renderDigest(batch));
  return { ok: true, flushed: batch.length, sent };
}

module.exports = { queueOwnerEmail, forceFlush };
