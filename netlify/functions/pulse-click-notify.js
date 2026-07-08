// pulse-click-notify — emails the owner when a visitor clicks the "Curated by
// Kory White" byline or any CRO Syndicate / Kory LinkedIn link, on any page.
// Public beacon endpoint (no secret — client can't hold one). Reuses the same
// Postmark/Resend env as pulse-progress-notify. Recipient fixed.
const RECIPIENT = 'koryjordanwhite@gmail.com';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const KIND_LABEL = { 'curator': 'Kory White name (→ LinkedIn)', 'curator-photo': "Kory White's profile photo (→ LinkedIn)", 'kory-title': "Kory White's title ‘Chief Revenue Officer’ (→ resume)", 'cro-syndicate': 'CRO Syndicate link', 'kory-linkedin': 'Kory White LinkedIn', 'kory-resume': "Kory White's 1-page resume (PDF)", 'hire-cro': "the ‘Hire a Fractional CRO’ button", 'tool': 'a PULSE Tool link', 'followup': 'submitted a follow-up question (→ Machine / DeepSeek)' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };
  // HUMAN-ONLY (owner 2026-07-06): drop bot/crawler/monitor user-agents. Real link clicks run this JS handler
  // (bots don't), so this is a second safety layer for "human behavior only".
  const ua = String((event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '').toLowerCase();
  if (!ua || /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|lighthouse|pingdom|uptime|monitor|preview|prerender|curl|wget|python|axios|node-fetch|go-http|scrapy|semrush|ahrefs|bingpreview|facebookexternalhit|embedly/.test(ua)) {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) {}
  const kind = String(b.kind || 'unknown').slice(0, 40);
  try { const st = require('./_stats'); await st.bump({ clicks: 1 }); await st.bumpDaily({ clicks: 1 }); } catch (e) {}
  const label = String(b.label || '').slice(0, 200);
  const page = String(b.page || '').slice(0, 300);
  const url = String(b.url || '').slice(0, 400);
  const title = String(b.title || '').slice(0, 200);
  const ref = (event.headers && (event.headers['referer'] || event.headers['referrer'])) || '';
  const fullPage = url || (page ? ('https://pulserevops.com' + page) : '') || ref;
  const what = KIND_LABEL[kind] || kind;
  const note = String(b.note || '').slice(0, 500); // e.g. the follow-up question text
  const noteRow = note ? `<strong>Question / note:</strong> <span style="color:#C8112B">${note.replace(/[<>]/g, '')}</span><br>` : '';

  // CONSOLIDATED: queue into the owner digest instead of emailing per-click.
  // One email per 25 signals (owner 2026-06-27) so the inbox isn't flooded.
  try {
    const { queueOwnerEmail } = require('./lib/owner-digest');
    // General link clicks (owner 2026-07-06): show the CLICKED link + which page. url = the clicked destination.
    let detail, digestUrl;
    if (kind === 'click') {
      const clicked = label || '';
      const clickedAbs = /^https?:\/\//i.test(clicked) ? clicked : (clicked.charAt(0) === '/' ? ('https://pulserevops.com' + clicked) : clicked);
      const txt = String(b.text || '').slice(0, 120).replace(/[<>]/g, '');
      detail = `Click → ${clicked}${txt ? ' ("' + txt + '")' : ''} · on ${page || '/'}`;
      digestUrl = clickedAbs || fullPage;
    } else {
      detail = `Lead-signal: ${what}${note ? ' — ' + note.replace(/[<>]/g, '') : ''}${title ? ' · ' + title : ''}`;
      digestUrl = fullPage;
    }
    // General clicks → SEPARATE batched queue (25/email) so they don't flood; lead signals stay real-time.
    const r = (kind === 'click')
      ? await queueOwnerEmail({ what: detail, url: digestUrl, queueKey: 'click-digest-queue.json', flushAt: 25, label: 'human clicks' })
      : await queueOwnerEmail({ what: detail, url: digestUrl });
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, digest: r }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
