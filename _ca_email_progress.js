// Email Pulse Cars sprint + SEO progress to owner.
const fs = require('fs');

const PROG = 'C:/Users/koryj/_ca_sprint50_progress.json';
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
const done = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')).done || [] : [];
const total = QUEUE.length;
const remaining = QUEUE.filter((q) => !done.includes(q.id));

const lines = [
  '<h2>Pulse Cars — Sprint 50 + Semantic SEO Progress</h2>',
  `<p><b>Published this sprint:</b> ${done.length} / ${total} (ca0924–ca0973 queue)</p>`,
  '<p><b>Live pillar:</b> ~924+ entries before this batch; generator running for remainder.</p>',
  '<h3>Published IDs</h3><ul>',
  ...done.map((id) => {
    const row = QUEUE.find((q) => q.id === id);
    const title = row ? row.title : id;
    return `<li><a href="https://pulserevops.com/cars/${id}">${id}</a> — ${title}</li>`;
  }),
  '</ul>',
  remaining.length
    ? `<h3>Remaining (${remaining.length})</h3><p>${remaining.slice(0, 8).map((r) => r.id).join(', ')}${remaining.length > 8 ? '…' : ''}</p>`
    : '<p><b>Sprint queue complete.</b></p>',
  '<h3>Image laws (post-publish)</h3>',
  '<ul>',
  '<li>Top cover image — <code>_img_cover_all.js ca</code> or <code>_ca_sprint50_finish.js</code></li>',
  '<li>10 @@PRODUCT images per Top-10 — Serper via <code>_build_cards.js</code> + <code>_insert_cards.js</code></li>',
  '<li>Gap audit — <code>node _img_gap_audit.js</code> (42 legacy ca entries still need cards pre-sprint)</li>',
  '</ul>',
  '<h3>Semantic SEO (compete keywords)</h3>',
  '<ul>',
  '<li><code>_ca_compete_semantic_keywords.js</code> — 102 FAQ/question phrases for semantic search</li>',
  '<li><code>cars.html</code> hub meta keywords patched</li>',
  '<li><code>_ca_seo_optimize.js</code> — applying tags + seo_brand_keywords to all ca#### blobs</li>',
  '</ul>',
  '<h3>Scripts created</h3>',
  '<ul>',
  '<li><code>_ca_build_sprint50.js</code> — queue builder</li>',
  '<li><code>_ca_workflow.js</code> — Cursor automation workflow</li>',
  '<li><code>_ca_sprint50_generate.js</code> — Gemini resumable writer</li>',
  '<li><code>_ca_sprint50_finish.js</code> — cards + cover backfill after publish</li>',
  '<li><code>_ca_publish_one.js</code> — single-entry full pipeline</li>',
  '</ul>',
  '<p>Hub: <a href="https://pulserevops.com/cars">pulserevops.com/cars</a></p>',
  `<p><i>Generated ${new Date().toISOString()}</i></p>`,
];

const subject = `PULSE Cars: ${done.length}/${total} sprint published + semantic SEO`;
const html = lines.join('\n');

(async () => {
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, html, to: 'koryjordanwhite@gmail.com' }),
    signal: AbortSignal.timeout(20000),
  });
  console.log('email status', r.status, (await r.text()).slice(0, 300));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
