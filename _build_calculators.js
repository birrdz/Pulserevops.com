// Assembles a CLEAN standalone calculators.html from dashboard.html by slicing the
// 4 fully-standalone tool sections + their scripts + shared CSS + pulseAnimNum.
// No CRM, no Firebase, no external libs, no hash-router — tools self-init on load.
const fs = require('fs');
const L = fs.readFileSync('C:/Users/koryj/website/dashboard.html', 'utf8').split('\n');
// slice 1-indexed inclusive
const cut = (a, b) => L.slice(a - 1, b).join('\n');

const SHARED_CSS   = cut(234, 4556);     // <style>…</style> shared theme + tool CSS
const PULSE_ANIM   = cut(22570, 22606);  // window.pulseAnimNum (raw JS)
const HGPC_HTML    = cut(5067, 5137);    // House Goals + Pulse Check tables
const HGPC_JS      = cut(5140, 5428);    // <script>…</script>
const GP_HTML      = cut(5632, 5663);    // #profit-calc-section
const GP_JS        = cut(5666, 5784);
const SF_HTML      = cut(5800, 5852);    // #service-fees-section
const SF_JS        = cut(5855, 6031);
const SCHED_HTML   = cut(6360, 6398);    // #sched-matrix-section
const SCHED_JS     = cut(6401, 6559);

const block = (id, title, sub, html) => `
  <section id="${id}" class="container calc-block">
    <div class="calc-head">
      <h2 class="section-title">${title}</h2>
      ${sub ? `<p class="section-sub">${sub}</p>` : ''}
    </div>
${html}
  </section>`;

const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Free RevOps Calculators · PULSE</title>
<meta name="description" content="Free interactive RevOps calculators from PULSE — House Goals & Pulse Check, Gross Profit, Service Fees, and the Rep Scheduling Matrix. No login, runs in your browser.">
<link rel="canonical" href="https://pulserevops.com/calculators">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
${SHARED_CSS}
<style>
  /* ── clean-page overrides (no fixed nav / honeycomb / CRM shell) ── */
  body { padding-top: 0 !important; background: var(--bg); min-height: 100vh; }
  .calc-topbar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 14px 24px; background: rgba(17,21,24,0.92); backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,140,26,0.18); }
  .calc-topbar a { color: var(--pink); text-decoration: none; font-weight: 800; font-size: 0.95rem; }
  .calc-topbar .brand { color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 900; letter-spacing: 0.04em; }
  .calc-topbar .brand small { color: var(--muted); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 0.62rem; }
  .calc-hero { text-align: center; padding: 48px 20px 8px; }
  .calc-hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(2.1rem, 5vw, 3.2rem); margin: 0 0 10px; color: #fff; }
  .calc-hero p { color: var(--muted); font-size: 1.05rem; max-width: 640px; margin: 0 auto; line-height: 1.7; }
  .calc-block { padding: 40px 20px; max-width: 1080px; margin: 0 auto; }
  .calc-head { text-align: center; margin-bottom: 22px; }
  .calc-foot { text-align: center; color: var(--muted); font-size: 0.85rem; padding: 40px 20px 60px; }
  .calc-foot a { color: var(--pink); }
</style>
</head>
<body>
  <div class="calc-topbar">
    <a class="brand" href="/">PULSE <small>RevOps</small></a>
    <a href="/tools">← All tools &amp; answers</a>
  </div>

  <div class="calc-hero">
    <h1>Free RevOps Calculators</h1>
    <p>Interactive tools that run entirely in your browser — no login, nothing leaves your device. Your inputs save locally.</p>
  </div>

  <main>
${block('house-goals', 'House Goals &amp; Pulse Check', 'Set your revenue goals and pressure-test the plan across all 9 KPIs.', HGPC_HTML)}
${block('gross-profit', 'Gross Profit Calculator', 'Toggle each KPI between monthly recurring revenue and per-unit profit to see your full revenue picture in real time.', GP_HTML)}
${block('service-fees', 'Service Fees', 'Add up to 5 service fees with attach rates and monthly units to see the exact bottom-line impact.', SF_HTML)}
${block('rep-scheduling', 'Rep Scheduling Matrix', 'Enter gross profit by day per store and PULSE calculates how many rep shifts you need at your agreed GP/dealer rate.', SCHED_HTML)}
  </main>

  <div class="calc-foot">
    © 2027 Kory White · PULSE RevOps · <a href="/">pulserevops.com</a> · <a href="/tools">Tools &amp; Answers</a>
  </div>

  <!-- shared: number count-up animator -->
  <script>
${PULSE_ANIM}
  </script>

  <!-- House Goals + Pulse Check -->
${HGPC_JS}

  <!-- Gross Profit Calculator -->
${GP_JS}

  <!-- Service Fees -->
${SF_JS}

  <!-- Rep Scheduling Matrix -->
${SCHED_JS}
</body>
</html>`;

fs.writeFileSync('C:/Users/koryj/website/calculators.html', page);
console.log('wrote calculators.html', page.length, 'bytes |', page.split('\n').length, 'lines');
