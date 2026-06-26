// Pulse Signal — site-wide UX strip (new idea every ~15 min via blob).
(function () {
  var API = '/.netlify/functions/pulse-innovation-signals';
  var ROOT_ID = 'pulse-signal-root';
  var STYLE_ID = 'pulse-signal-styles';
  var mounted = false;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function themeClass(theme) {
    if (!theme || theme === 'warm') return '';
    return ' ps-theme-' + String(theme).replace(/[^a-z0-9-]/gi, '');
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#pulse-signal-root{--ps-accent:#E8710A;position:fixed;bottom:0;left:0;right:0;z-index:99990;font-family:Inter,-apple-system,sans-serif;font-size:0.72rem;pointer-events:none;}',
      '#pulse-signal-root.ps-hidden{display:none!important;}',
      '#pulse-signal-root .ps-inner{pointer-events:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;background:linear-gradient(90deg,rgba(10,14,20,0.97),rgba(20,14,8,0.97));border-top:2px solid var(--ps-accent);box-shadow:0 -8px 32px rgba(0,0,0,0.5),0 0 20px color-mix(in srgb,var(--ps-accent) 25%,transparent);}',
      '#pulse-signal-root .ps-badge{font-weight:900;letter-spacing:0.14em;color:var(--ps-accent);white-space:nowrap;font-size:0.62rem;}',
      '#pulse-signal-root .ps-marquee{flex:1;min-width:120px;color:rgba(237,229,216,0.92);line-height:1.35;}',
      '#pulse-signal-root .ps-cards{display:flex;gap:6px;flex-wrap:wrap;max-width:52%;}',
      '#pulse-signal-root .ps-card{color:#FFB870;text-decoration:none;border:1px solid color-mix(in srgb,var(--ps-accent) 45%,transparent);border-radius:8px;padding:4px 8px;background:color-mix(in srgb,var(--ps-accent) 10%,transparent);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '#pulse-signal-root .ps-card:hover{border-color:var(--ps-accent);color:#fff;}',
      '#pulse-signal-root .ps-close{margin-left:auto;background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(237,229,216,0.7);border-radius:6px;width:28px;height:28px;cursor:pointer;font-size:1rem;line-height:1;}',
      '#pulse-signal-root.ps-theme-teal{--ps-accent:#2DD4BF;}',
      '#pulse-signal-root.ps-theme-gold{--ps-accent:#FFD740;}',
      '#pulse-signal-root.ps-theme-gold .ps-card{color:#FFE9A8;}',
      '#pulse-signal-root.ps-theme-green{--ps-accent:#39FF14;}',
      '#pulse-signal-root.ps-theme-green .ps-card{color:#B6FFB4;}',
      '#pulse-signal-root.ps-theme-violet{--ps-accent:#B388FF;}',
      '#pulse-signal-root.ps-theme-violet .ps-card{color:#E8D4FF;}',
      '@media(max-width:720px){#pulse-signal-root .ps-cards{max-width:100%;}#pulse-signal-root .ps-marquee{flex-basis:100%;}}',
      '@media print{#pulse-signal-root{display:none!important;}}',
    ].join('');
    document.head.appendChild(style);
  }

  function render(data) {
    if (!data || data.ok === false || !data.marquee) return;
    ensureStyles();
    var root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = ROOT_ID;
      root.setAttribute('role', 'complementary');
      root.setAttribute('aria-label', 'Pulse Signal — live site tips and library links');
      document.body.appendChild(root);
    }

    var accent = data.accent || '#E8710A';
    var wasHidden = root.classList && root.classList.contains('ps-hidden');
    root.style.setProperty('--ps-accent', accent);
    root.className = 'ps-root' + themeClass(data.theme);
    try {
      if (sessionStorage.getItem('pulse_signal_dismissed')) wasHidden = true;
    } catch (e) {}
    if (wasHidden) root.classList.add('ps-hidden');

    var badge = data.badgeLabel || (data.mode ? String(data.mode).replace(/-/g, ' ').toUpperCase() : 'PULSE SIGNAL');
    var cards = (data.cards || []).slice(0, 3);
    var cardHtml = cards.map(function (c) {
      return '<a class="ps-card" href="' + esc(c.url) + '">' + esc((c.question || c.id).slice(0, 72)) + (c.question && c.question.length > 72 ? '…' : '') + '</a>';
    }).join('');

    root.innerHTML =
      '<div class="ps-inner">'
      + '<span class="ps-badge">◉ ' + esc(badge) + '</span>'
      + '<span class="ps-marquee" title="' + esc(data.report || '') + '">' + esc(data.marquee) + '</span>'
      + '<span class="ps-cards">' + cardHtml + '</span>'
      + '<button type="button" class="ps-close" aria-label="Dismiss Pulse Signal">×</button>'
      + '</div>';

    if (!mounted) {
      mounted = true;
      root.querySelector('.ps-close').addEventListener('click', function () {
        try { sessionStorage.setItem('pulse_signal_dismissed', '1'); } catch (e) {}
        root.classList.add('ps-hidden');
      });
    }
  }

  function refresh() {
    fetch(API, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(render)
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh);
  else refresh();
  setInterval(refresh, 60000);
})();
