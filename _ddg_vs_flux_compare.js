// Quick visual compare: DDG (web search) vs Pollinator flux (AI + mosaic treatment)
const fs = require('fs');
const path = require('path');
const { pickImage, ddgImages } = require('./_v2_nr_ddg');

const OUT = path.join(__dirname, 'lab', '_ddg_vs_flux_compare.html');
const fluxSamples = [
  { id: 'ed1071', title: 'Top 10 investment apps for beginners with low fees in 2027' },
  { id: 'wl0111', title: 'Top 10 Things for a 13-Year-Old Girl to Take When She Has a Stopped-Up Nose' },
  { id: 'bo0336', title: 'How do I finance a buildout if the landlord offers zero TI allowance in 2027?' },
];

const ddgQueries = [
  { section: 'Direct Answer', title: fluxSamples[0].title },
  { section: 'How to Choose the Right App', title: fluxSamples[0].title },
  { section: 'Buildout Financing Options', title: fluxSamples[2].title },
];

function sectionDdgQuery(sectionHeading, qaTitle) {
  const sect = String(sectionHeading || '').replace(/^#{2,3}\s+/, '').replace(/[^\w\s'-]/g, ' ').trim();
  const titleCore = String(qaTitle || '').replace(/\bin 20\d\d\b/gi, '').replace(/[?.!]+$/,'').trim();
  return (sect + ' ' + titleCore + ' high quality editorial photograph realistic').trim().slice(0, 180);
}

(async () => {
  const ddgResults = [];
  for (const q of ddgQueries) {
    const query = sectionDdgQuery(q.section, q.title);
    const url = await pickImage(query);
    const alts = (await ddgImages(query)).slice(0, 4).map(x => x.image).filter(Boolean);
    ddgResults.push({ query, url, alts });
    console.log('[ddg]', query.slice(0, 70), url ? 'OK' : 'MISS');
    await new Promise(r => setTimeout(r, 800));
  }

  const rows = fluxSamples.map((f, i) => {
    const d = ddgResults[i] || ddgResults[0];
    const fluxPath = '/assets/qa/' + f.id + '.jpg';
    const fluxExists = fs.existsSync(path.join(__dirname, 'assets', 'qa', f.id + '.jpg'));
    return { f, d, fluxPath, fluxExists };
  });

  const html = `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>DDG vs Pollinator flux — visual compare</title>
<style>
body{font-family:system-ui,sans-serif;background:#0b0f14;color:#e8eef2;margin:0;padding:24px;max-width:1100px;margin:0 auto}
h1{font-size:1.35rem}p,li{color:#9fb0bd;line-height:1.55;font-size:.92rem}
.card{border:1px solid #334;border-radius:14px;padding:16px;margin:18px 0;background:#0e1620}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
@media(max-width:720px){.grid{grid-template-columns:1fr}}
h3{margin:0 0 8px;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:#8aa}
img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;background:#111;border:1px solid #223}
.flux img{box-shadow:0 8px 28px rgba(46,204,113,.15)}
.ddg img{box-shadow:0 4px 16px rgba(0,0,0,.35)}
.caption{font-size:.78rem;color:#8aa;margin-top:8px;word-break:break-all}
.tag{display:inline-block;padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:800;margin-right:6px}
.tag-flux{background:rgba(46,204,113,.2);color:#2ecc71}
.tag-ddg{background:rgba(56,189,248,.15);color:#38bdf8}
.altrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.altrow img{width:72px;height:72px;aspect-ratio:1;border-radius:6px}
</style></head><body>
<h1>DDG vs Pollinator flux</h1>
<p><strong>DDG</strong> = DuckDuckGo <em>image search</em> — picks real photos already on the internet (hotlinked URL). It does <strong>not</strong> generate images.</p>
<p><strong>Pollinator flux</strong> = AI-generated image (Pollinations) + your pipeline sharpens it, adds grain/vignette, saves as <code>/assets/qa/&lt;id&gt;.jpg</code> — that's what the homepage mosaic tiles use.</p>
<p>Section images in scrub use DDG queries like: <em>"[section heading] + [title] high quality editorial photograph realistic"</em></p>
${rows.map(({ f, d, fluxPath, fluxExists }) => `
<div class=card>
  <p><b>${f.title.replace(/</g,'')}</b></p>
  <div class=grid>
    <div class=flux>
      <h3><span class="tag tag-flux">Flux cover</span> Main-page mosaic style</h3>
      ${fluxExists ? `<img src="${fluxPath}" alt="flux cover">` : '<p>Missing local file</p>'}
      <div class=caption>${fluxPath} — generated + treated</div>
    </div>
    <div class=ddg>
      <h3><span class="tag tag-ddg">DDG section</span> Web photo pick</h3>
      ${d.url ? `<img src="${d.url}" alt="ddg" referrerpolicy=no-referrer>` : '<p>No DDG hit</p>'}
      <div class=caption>Query: ${d.query.replace(/</g,'')}</div>
      ${d.alts.length ? `<div class=altrow>${d.alts.map(u => `<img src="${u}" referrerpolicy=no-referrer>`).join('')}</div><div class=caption>Other DDG candidates (same query)</div>` : ''}
    </div>
  </div>
</div>`).join('')}
<p style="margin-top:24px">Open this file in a browser on the same machine as the site, or serve via <code>http://localhost:8899/</code> if you add a static route. File: <code>lab/_ddg_vs_flux_compare.html</code></p>
</body></html>`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html);
  console.log('[done] wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
