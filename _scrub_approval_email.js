// Email owner when a Q&A lands in the scrub approval pile (bypasses _emails_off.flag).
// Disable: touch _scrub_approval_email_off.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const OFF = WD + '/_scrub_approval_email_off.flag';
const NOTIFY = 'https://pulserevops.com/.netlify/functions/pulse-owner-notify';
const NOTIFY_KEY = 'pulsemachine-writer-2026';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function emailApprovalPending(rec) {
  if (!rec || !rec.id) return { ok: false, skipped: 'no-id' };
  if (fs.existsSync(OFF)) return { ok: false, skipped: 'off-flag' };
  const id = rec.id;
  const score = rec.score != null ? rec.score : '?';
  const title = String(rec.title || id).slice(0, 160);
  const scrubUrl = 'http://localhost:8899/?approve=' + encodeURIComponent(id);
  const liveUrl = 'https://pulserevops.com/knowledge/' + id;
  const reviewNote = rec.needsReview && (rec.caveats || []).length
    ? ('<p style="color:#b45309;font-weight:700">⚠️ Review caveats: ' + esc((rec.caveats || []).join(', ')) + '</p>')
    : '';
  const subject = '📋 Approve ' + id + ' (' + score + '/13)';
  const html = '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.55;color:#15110d">'
    + '<p style="font-size:17px;font-weight:800;color:#6d28d9">📋 Ready for your approval</p>'
    + '<p><b>' + esc(title) + '</b><br><span style="color:#6b7280">' + esc(id) + ' · ' + esc(String(rec.pillar || '')) + ' · ' + score + '/13</span></p>'
    + reviewNote
    + '<p style="margin:18px 0"><a href="' + esc(scrubUrl) + '" style="display:inline-block;background:#22c55e;color:#06121a;font-weight:800;text-decoration:none;padding:12px 20px;border-radius:10px">▶ Review in scrub panel</a></p>'
    + '<p><a href="' + esc(liveUrl) + '" style="color:#0891b2;font-weight:700">Live page preview</a></p>'
    + '<p style="color:#8a7a63;font-size:12px;margin-top:16px">Scrub link opens <code>localhost:8899</code> on your PC — enter <b>4444</b> if prompted; approval opens fullscreen.</p>'
    + '</div>';
  try {
    const { ownerEmail } = require('./_ask_owner');
    const r = await ownerEmail(subject, html);
    return { ok: true, id, provider: 'resend', r };
  } catch (e) {
    const message = '📋 ' + id + ' — ' + score + '/13 awaiting approval\n\n'
      + title + '\n\n▶ REVIEW (scrub panel):\n' + scrubUrl + '\n\nLive preview:\n' + liveUrl
      + '\n\n(Enter 4444 on scrub panel if prompted.)';
    try {
      const r = await fetch(NOTIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: NOTIFY_KEY, subject, message }),
        signal: AbortSignal.timeout(15000),
      });
      return { ok: r.ok, id, provider: 'pulse-owner-notify', fallback: true };
    } catch (e2) {
      return { ok: false, id, error: String(e.message || e) + ' | ' + String(e2.message || e2) };
    }
  }
}

module.exports = { emailApprovalPending };
