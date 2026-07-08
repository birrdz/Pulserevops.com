// One-shot: email the owner the exact Google Search Console steps + sitemaps.
const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#1a1a1a;line-height:1.5">
<h2 style="color:#E8710A;margin-bottom:4px">🚀 Get Google indexing your PULSE pages</h2>
<p style="margin-top:0;color:#555">Do this once. Steps 1–3 cover ALL ~22,000 URLs in one shot via your sitemaps. Step 4 is for jumping the line on your money pages.</p>

<h3 style="margin-bottom:4px">1) Open Google Search Console</h3>
<p style="margin-top:0">Go to <a href="https://search.google.com/search-console" style="color:#E8710A">https://search.google.com/search-console</a> and sign in with your Google account.</p>

<h3 style="margin-bottom:4px">2) Make sure pulserevops.com is added &amp; verified</h3>
<p style="margin-top:0">If you don't already see <b>pulserevops.com</b> in the top-left property dropdown: click it → <b>Add property</b> → choose <b>URL prefix</b> → type <code>https://pulserevops.com</code> → Continue → verify (the "HTML tag" or "DNS" option; if it's on Netlify DNS, the DNS TXT method is easiest). If it's already there and verified, skip this.</p>

<h3 style="margin-bottom:4px">3) Submit your sitemaps (this is the big one — covers everything)</h3>
<p style="margin-top:0">Left menu → <b>Sitemaps</b>. Under <b>"Add a new sitemap"</b> there's a box that already shows <code>https://pulserevops.com/</code> — you just type the part below and hit <b>SUBMIT</b>, one at a time:</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<tr><td style="padding:6px 8px;border:1px solid #eee;background:#faf6f2"><code>sitemap.xml</code></td><td style="padding:6px 8px;border:1px solid #eee">core pages</td></tr>
<tr><td style="padding:6px 8px;border:1px solid #eee;background:#faf6f2"><code>sitemap-knowledge.xml</code></td><td style="padding:6px 8px;border:1px solid #eee">the whole library (~21k Q&amp;As + Top-10s) — the important one</td></tr>
<tr><td style="padding:6px 8px;border:1px solid #eee;background:#faf6f2"><code>.netlify/functions/pulse-machine-reviews-sitemap</code></td><td style="padding:6px 8px;border:1px solid #eee">Top-10 review pages</td></tr>
<tr><td style="padding:6px 8px;border:1px solid #eee;background:#faf6f2"><code>.netlify/functions/pulse-tools-sitemap</code></td><td style="padding:6px 8px;border:1px solid #eee">tools pages</td></tr>
</table>
<p style="color:#555;font-size:13px">All four return HTTP 200 right now. After you submit, status will say "Success" within a day or two and Google starts crawling. You do NOT have to submit pages one by one — the sitemap is the bulk lever.</p>

<h3 style="margin-bottom:4px">4) Jump the line on your money pages (optional, ~10–20/day max)</h3>
<p style="margin-top:0">At the very top of Search Console there's a search bar that says <b>"Inspect any URL in pulserevops.com."</b> Paste a full URL → Enter → click <b>"Request indexing."</b> Google limits this to roughly 10–20/day, so use it on your highest-value pages first. Suggested order:</p>
<ul style="margin-top:0;font-size:14px">
<li><code>https://pulserevops.com/</code> (homepage)</li>
<li><code>https://pulserevops.com/tools</code></li>
<li>your top fractional-CRO state pages (e.g. Texas, California, New York, Florida)</li>
<li>the franchise leaderboard + any flagship Top-10s</li>
</ul>

<h3 style="margin-bottom:4px">5) Bing / others — already automated</h3>
<p style="margin-top:0">Your site auto-pings <b>IndexNow</b> (Bing, Yandex, DuckDuckGo) after each content batch, so no action needed there. Optionally add the site to <a href="https://www.bing.com/webmasters" style="color:#E8710A">Bing Webmaster Tools</a> and submit the same sitemaps.</p>

<h3 style="margin-bottom:4px">⏱ What to expect</h3>
<p style="margin-top:0;font-size:14px">Indexing: a few days to ~3 weeks (Google crawls a big site in waves). First long-tail traffic: ~3–6 weeks. Niche/local terms ("fractional CRO in Alaska"): 1–3 months. Competitive head terms ("best blenders 2027"): 6–12 months. Submitting the sitemap + a few real backlinks is what actually starts the clock.</p>

<p style="color:#888;font-size:12px;margin-top:24px">Sent from your PULSE build assistant. Reply-to-self note: the keyword-cluster backfill is running across all 22,776 URLs and every future page gets its own cluster automatically.</p>
</div>`;

(async () => {
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: '🚀 Google Search Console — exact steps to get all your pages indexed', html }),
    signal: AbortSignal.timeout(15000),
  });
  console.log('email POST status:', r.status, await r.text().catch(() => ''));
})().catch(e => { console.error('SEND ERR', e.message); process.exit(1); });
