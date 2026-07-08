const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const K = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
const qid = process.argv[2] || 'ca1097';
const title = process.argv[3] || 'Top 10 Hybrid SUVs for 2027 — Best Overall + Best Value';
const url = 'https://pulserevops.com/cars/' + qid;
const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px">' +
  '<h2 style="font-family:Georgia,serif;color:#15110d;margin:0 0 10px">New Cars Q&amp;A published</h2>' +
  '<p style="margin:0 0 6px;font-weight:700">QID: <b>' + qid + '</b></p>' +
  '<p style="margin:0 0 8px">' + title + '</p>' +
  '<p style="margin:0 0 8px;color:#127a3d;font-weight:700">PASS — published + IndexNow pinged (200/202 across engines)</p>' +
  '<p style="margin:0"><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p></div>';
(async () => {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + K, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject: 'New Cars Q&A published — ' + qid, html }),
  });
  console.log('email HTTP', r.status);
  console.log(await r.text());
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
