(async () => {
  for (const p of ['/health', '/ping', '/scrub-status', '/scrubber', '/pillar-progress-data']) {
    try {
      const r = await fetch('http://localhost:8899' + p);
      const t = await r.text();
      console.log(p, r.status, t.slice(0, 100));
    } catch (e) {
      console.log(p, 'ERR', e.message);
    }
  }
})();
