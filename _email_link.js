// _email_link.js — email Kory the current fixer/panel link on demand.
// Usage: node _email_link.js   (owner 2026-07-15: "email me newest link every time I ask")
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const LAN_IP = process.env.LAN_IP || '192.168.5.68';
const PORT = process.env.FIXER_PORT || '8905';
const LINK = `http://${LAN_IP}:${PORT}/`;

(async () => {
  // quick health so the email says whether it's actually up
  let up = false, gate = null;
  try { const r = await fetch(`http://127.0.0.1:${PORT}/api/health`, { signal: AbortSignal.timeout(6000) }); if (r.ok) { const j = await r.json(); up = true; gate = !!j.gate; } } catch (e) {}
  const status = up ? `panel UP · gate ${gate ? '🟢 up' : '🔴 DOWN — tap Restart Gate'}` : 'panel not answering — run start_fixer / node fixer_panel.js';
  const subject = `Kory's Fixer link — ${LINK}`;
  const html = `<div style="font-family:system-ui,Arial;font-size:16px">
    <p><b>Kory's Fixer</b></p>
    <p><a href="${LINK}" style="font-size:20px;font-weight:700">${LINK}</a></p>
    <p style="color:#555">${status}</p>
    <p style="color:#888;font-size:13px">Open on your phone (same WiFi). If the fixer looks stuck: tap 🔌 Restart Gate or 🚀 Restart Everything in the Recover box.</p>
  </div>`;
  if (!RESEND) { console.log('NO resend key — link is', LINK); return; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: "Kory's Fixer <onboarding@resend.dev>", to: 'koryjordanwhite@gmail.com', subject, html }),
    });
    const j = await r.json().catch(() => ({}));
    console.log(r.ok ? 'EMAIL SENT ✓ id=' + (j.id || '?') + ' · ' + LINK : 'EMAIL FAIL ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
  } catch (e) { console.log('EMAIL ERROR', e.message, '· link', LINK); }
})();
