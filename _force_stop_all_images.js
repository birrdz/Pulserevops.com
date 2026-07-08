// Force-stop every image/scrub station via scrub server API.
const KEY = '4444';
const BASE = 'http://localhost:8899';
const paths = [
  '/image-duplicator-force-stop',
  '/image-generator-force-stop',
  '/face-hero-force-stop',
  '/image-rewrite-force-stop',
  '/internal-images-force-stop',
  '/format-fixer-force-stop',
  '/rubric-station-force-stop',
  '/scrub-force-stop',
  '/gen-force-stop',
];

(async () => {
  for (const p of paths) {
    try {
      const r = await fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY }) });
      const j = await r.json().catch(() => ({}));
      console.log(p, r.status, JSON.stringify(j));
    } catch (e) {
      console.log(p, 'ERR', e.message);
    }
  }
})();
