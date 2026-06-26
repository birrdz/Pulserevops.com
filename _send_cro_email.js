(async () => {
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=2000&pillar=tl&cb=' + Date.now());
  const d = await r.json();
  const ads = (d.entries || []).filter(e => /^tl9\d{3}$/.test(e.id)).sort((a,b)=>parseInt(a.id.slice(2))-parseInt(b.id.slice(2)));
  const rows = ads.map(e => `<tr><td style="padding:4px 10px;color:#888;">${e.id}</td><td style="padding:4px 10px;"><a href="https://pulserevops.com/tools/${e.id}">${e.question}</a></td></tr>`).join('');
  const premium = ads.slice(0,10).map(e=>`<li><a href="https://pulserevops.com/tools/${e.id}">${e.question}</a></li>`).join('');
  const html = `<h2>110 Fractional-CRO "hire me" pages — LIVE & pinned to the top of /tools</h2>
  <p><b>${ads.length}</b> pages published in the Pulse Tools pillar, all pinned to the top via <code>pinned_until</code>, each linking your 1-page resume (rotated variants) + CRO Syndicate, with genuine praise. IndexNow pinged for all.</p>
  <p><b>Pillar:</b> <a href="https://pulserevops.com/tools">https://pulserevops.com/tools</a></p>
  <h3>Top 10 (hand-written premium):</h3><ol>${premium}</ol>
  <h3>All ${ads.length} links:</h3>
  <table style="border-collapse:collapse;font:13px system-ui;">${rows}</table>`;
  const res = await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ subject:`PULSE — ${ads.length} fractional-CRO pages live + pinned on /tools`, html })
  });
  console.log('email status', res.status, 'ads', ads.length);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
