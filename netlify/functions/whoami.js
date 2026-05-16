// ════════════════════════════════════════════════════════════════════════
// whoami — returns the caller's IP + a copy-pasteable env-var snippet for
// adding it to ALERT_SUPPRESS_IPS. Used so Kory can silence his own visit
// alerts without leaving the browser.
//
// Usage: visit https://pulserevops.com/.netlify/functions/whoami from each
// device you want to suppress. Copy the IP. Paste into Netlify env var
// ALERT_SUPPRESS_IPS (comma-separated if you have multiple).
// ════════════════════════════════════════════════════════════════════════

exports.handler = async (event) => {
  const ip = event.headers['x-nf-client-connection-ip']
          || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || 'unknown';

  let geo = {};
  try {
    if (event.headers['x-nf-geo']) {
      geo = JSON.parse(Buffer.from(event.headers['x-nf-geo'], 'base64').toString('utf-8'));
    }
  } catch (e) {}

  const city = (geo.city || '').trim();
  const country = (geo.country && (geo.country.name || geo.country.code)) || '';
  const region = (geo.subdivision && geo.subdivision.name) || '';
  const loc = [city, region, country].filter(Boolean).join(', ');

  const html = `<!doctype html>
<html><head><title>Whoami · PULSE</title>
<style>
  body { background:#0a0d12; color:#EDE5D8; font-family:'Segoe UI',system-ui,sans-serif; padding:48px 24px; margin:0; min-height:100vh; }
  .card { max-width:540px; margin:0 auto; background:#12161c; border:1px solid rgba(232,113,10,0.3); border-radius:14px; padding:32px; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
  h1 { color:#FF8C1A; font-size:14px; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; }
  .ip { font-family:'JetBrains Mono','Consolas',monospace; font-size:32px; font-weight:800; color:#fff; margin:12px 0; padding:16px 18px; background:#0a0d12; border:1px solid rgba(232,113,10,0.4); border-radius:8px; user-select:all; cursor:text; }
  .loc { color:rgba(237,229,216,0.7); font-size:14px; margin-bottom:24px; }
  .step { background:#1A2025; border-left:3px solid #E8710A; padding:14px 16px; border-radius:8px; margin:10px 0; font-size:14px; line-height:1.6; }
  .step b { color:#FFD740; }
  .copy { display:inline-block; padding:8px 14px; background:#E8710A; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:13px; margin-top:6px; }
  code { background:#0a0d12; padding:2px 6px; border-radius:4px; color:#FF8C1A; font-size:13px; }
</style></head>
<body>
  <div class="card">
    <h1>◉ Your current IP</h1>
    <div class="ip" id="ip">${ip}</div>
    <div class="loc">${loc || 'Location unknown'}</div>

    <div class="step"><b>Step 1.</b> Copy the IP above (already selectable — click + Cmd/Ctrl+C).</div>
    <div class="step"><b>Step 2.</b> Open Netlify → Site settings → Environment variables.</div>
    <div class="step"><b>Step 3.</b> Add or update <code>ALERT_SUPPRESS_IPS</code> with this IP. If you already have one, comma-separate: <code>1.2.3.4,5.6.7.8</code></div>
    <div class="step"><b>Step 4.</b> Trigger a redeploy (or wait for next deploy). Visit alerts from this IP will silently drop.</div>

    <button class="copy" onclick="navigator.clipboard.writeText('${ip}').then(()=>this.textContent='✓ Copied')">Copy IP</button>
  </div>
</body></html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body: html,
  };
};
