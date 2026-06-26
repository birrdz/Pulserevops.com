// Render a visible "Related Searches" internal-link block on the HS Football
// Recruiting hub page from _hf_keyword_phrases.json. Each phrase becomes an
// anchor link to the site search (/knowledge?q=...), maximizing internal SEO
// coverage of similar searches. Idempotent: replaces the block on re-run.
// Usage: node _hf_render_related_searches.js
const fs = require('fs');
const path = require('path');

const HUB = path.join(__dirname, 'highschool-football-recruiting.html');
const phrases = JSON.parse(fs.readFileSync(path.join(__dirname, '_hf_keyword_phrases.json'), 'utf8'));

const START = '<!-- HF_RELATED_SEARCHES -->';
const END = '<!-- /HF_RELATED_SEARCHES -->';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const links = phrases.map((p) =>
  `<a class="hf-rs-link" href="/knowledge?q=${encodeURIComponent(p)}">${esc(p)}</a>`
).join('\n');

const block = `${START}
<style>
.hf-related-searches{max-width:1100px;margin:48px auto 8px;padding:0 20px}
.hf-related-searches h2{font-size:1.35rem;margin:0 0 6px}
.hf-related-searches .hf-rs-sub{color:#667085;margin:0 0 18px;font-size:.95rem}
.hf-rs-grid{display:flex;flex-wrap:wrap;gap:8px}
.hf-rs-link{display:inline-block;padding:7px 13px;border:1px solid #e3e6ea;border-radius:999px;background:#f7f8fa;color:#0f2742;text-decoration:none;font-size:.9rem;line-height:1.2;transition:background .15s,border-color .15s}
.hf-rs-link:hover{background:#eef3ff;border-color:#b9ccf5}
</style>
<section class="hf-related-searches" aria-label="Related searches for high school football recruiting">
  <h2>Related Searches — High School Football Recruiting</h2>
  <p class="hf-rs-sub">${phrases.length} similar searches recruits and parents look for. Tap any to explore.</p>
  <nav class="hf-rs-grid">
${links}
  </nav>
</section>
${END}`;

let html = fs.readFileSync(HUB, 'utf8');
const re = new RegExp(`${START}[\\s\\S]*?${END}`);
if (re.test(html)) {
  html = html.replace(re, block);
  console.log('replaced existing Related Searches block');
} else {
  // inject right before the footer
  html = html.replace(/<footer class="footer">/, `${block}\n\n<footer class="footer">`);
  console.log('injected Related Searches block before footer');
}
fs.writeFileSync(HUB, html);
console.log(`hub updated with ${phrases.length} related-search links`);
