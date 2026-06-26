// Usage: node _notify.js "Subject" "HTML body"
(async () => {
  const subject = process.argv[2] || 'Pulse progress update';
  const html = process.argv[3] || '<p>update</p>';
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
    });
    console.log(r.status, await r.text());
  } catch (e) { console.log('ERR', e.message); }
})();
