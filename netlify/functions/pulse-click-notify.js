// pulse-click-notify — emails the owner on lead clicks.
// Owner 2026-07-13:
//   - CRO card clicks → SEPARATE immediate email subject "!!! CRO CARD CLICK"
//   - Other lead signals → digest queue
//   - General link clicks → separate batched click digest
const RECIPIENT = process.env.OWNER_EMAIL || 'koryjordanwhite@gmail.com';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const KIND_LABEL = {
  curator: 'Kory White name (→ LinkedIn)',
  'curator-photo': "Kory White's profile photo (→ LinkedIn)",
  'kory-title': "Kory White's title ‘Chief Revenue Officer’ (→ resume)",
  'cro-syndicate': 'CRO Syndicate link',
  'cro-syndicate-about': 'CRO Syndicate About',
  'cro-syndicate-contact': 'CRO Syndicate Contact',
  'kory-linkedin': 'Kory White LinkedIn',
  'kory-resume': "Kory White's 1-page resume (PDF)",
  'kory-calendly': 'Calendly book-a-call',
  'hire-cro': "Hire / revenue-checkup CTA",
  'fractional-cro-hub': 'Fractional CRO hub',
  tool: 'a PULSE Tool link',
  followup: 'submitted a follow-up question',
  'cro-card-click': 'CRO card (whole card)',
  'cro-card-dismiss': 'CRO card dismiss (×)',
};

const CRO_CARD_KINDS = new Set([
  'cro-card-click',
  'hire-cro',
  'fractional-cro-hub',
  'kory-calendly',
  'cro-syndicate',
  'cro-syndicate-about',
  'cro-syndicate-contact',
  'curator',
  'curator-photo',
  'kory-linkedin',
  'kory-resume',
  'kory-title',
]);

async function sendOwnerEmail(subject, html) {
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  const pmKey = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const rsKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  if (pmKey) {
    const r = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Postmark-Server-Token': pmKey },
      body: JSON.stringify({ From: from, To: RECIPIENT, Subject: subject, HtmlBody: html, MessageStream: 'outbound', Tag: 'cro-card-click' }),
    });
    return r.ok;
  }
  if (rsKey) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + rsKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }),
    });
    return r.ok;
  }
  return false;
}

function esc(s) {
  return String(s || '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  const ua = String((event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '').toLowerCase();
  if (!ua || /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|lighthouse|pingdom|uptime|monitor|preview|prerender|curl|wget|python|axios|node-fetch|go-http|scrapy|semrush|ahrefs|bingpreview|facebookexternalhit|embedly/.test(ua)) {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) {}
  const kind = String(b.kind || 'unknown').slice(0, 40);
  try {
    const st = require('./_stats');
    await st.bump({ clicks: 1 });
    await st.bumpDaily({ clicks: 1 });
  } catch (e) {}

  const label = String(b.label || '').slice(0, 200);
  const page = String(b.page || '').slice(0, 300);
  const url = String(b.url || '').slice(0, 400);
  const title = String(b.title || '').slice(0, 200);
  const fromCard = !!(b.fromCard || b.croCard || /cro-card|crohdr|\.cro-card/i.test(String(b.source || '')));
  const ref = (event.headers && (event.headers['referer'] || event.headers['referrer'])) || '';
  const fullPage = url || (page ? ('https://pulserevops.com' + page) : '') || ref;
  const what = KIND_LABEL[kind] || kind;
  const note = String(b.note || '').slice(0, 500);
  const isCroCard = kind === 'cro-card-click' || fromCard || (CRO_CARD_KINDS.has(kind) && fromCard !== false && (fromCard || kind === 'cro-card-click' || kind === 'hire-cro' || kind === 'kory-calendly'));

  // STRICT: only real CRO-card surface clicks → immediate !!! email
  // (nav/footer hire-cro links stay on the normal digest)
  if (kind === 'cro-card-click' || fromCard) {
    const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const absPage = /^https?:\/\//i.test(fullPage)
      ? fullPage
      : ('https://pulserevops.com' + (String(page || '/').charAt(0) === '/' ? page || '/' : '/' + (page || '')));
    const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#C8112B;margin:0 0 12px">!!! CRO CARD CLICK</h2>
      <p style="margin:0 0 12px"><b>Site visited:</b><br>
        <a href="${esc(absPage)}" style="color:#C8112B;font-size:16px;font-weight:700;word-break:break-all">${esc(absPage)}</a>
      </p>
      <p style="margin:0 0 8px"><b>What:</b> ${esc(what)}</p>
      <p style="margin:0 0 8px"><b>Title:</b> ${esc(title || '—')}</p>
      <p style="margin:0 0 8px"><b>Label / href:</b> ${esc(label || '—')}</p>
      ${note ? `<p style="margin:0 0 8px"><b>Note:</b> ${esc(note)}</p>` : ''}
      <p style="margin:0 0 8px"><b>When:</b> ${esc(when)} ET</p>
      <p style="margin:0;color:#888;font-size:12px">Separate from visitor digests · instant Resend/Postmark</p>
    </div>`;
    try {
      const sent = await sendOwnerEmail('!!! CRO CARD CLICK · ' + (page || kind), html);
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, croCard: true, sent }) };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
    }
  }

  try {
    const { queueOwnerEmail } = require('./lib/owner-digest');
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
    const r = (kind === 'click')
      ? await queueOwnerEmail({ what: detail, url: digestUrl, queueKey: 'click-digest-queue.json', flushAt: 25, label: 'human clicks' })
      : await queueOwnerEmail({ what: detail, url: digestUrl });
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, digest: r }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
