/* Site-wide navigation loader. Shows a branded full-screen pulse overlay the
   instant a same-origin link is clicked (and on beforeunload), so cross-page
   navigation feels smooth instead of frozen during the load. Self-injecting:
   include with <script src="/assets/nav-loader.js"></script> — no markup edits.
   Auto-hides on bfcache restore (pageshow) and after a safety timeout. */
(function () {
  if (window.__navLoader) return;
  window.__navLoader = 1;

  var css =
    '#nav-loader{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:radial-gradient(ellipse at center,#0f141b 0%,#070a0f 100%);opacity:0;pointer-events:none;' +
    'transition:opacity .16s ease;}' +
    '#nav-loader.on{opacity:1;pointer-events:auto;}' +
    '#nav-loader .nl-inner{text-align:center;transform:translateY(-4%);}' +
    "#nav-loader .nl-mark{font:900 2rem/1 'Inter','Segoe UI',system-ui,sans-serif;letter-spacing:.04em;" +
    'background:linear-gradient(135deg,#FF8C1A,#E8710A 50%,#FFD740);-webkit-background-clip:text;background-clip:text;' +
    '-webkit-text-fill-color:transparent;color:transparent;}' +
    '#nav-loader .nl-ekg{width:210px;height:40px;margin:16px auto 10px;display:block;}' +
    '#nav-loader .nl-ekg polyline{fill:none;stroke:url(#nlg);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;' +
    'stroke-dasharray:340;stroke-dashoffset:340;animation:nlDash 1s linear infinite;}' +
    '@keyframes nlDash{to{stroke-dashoffset:-340;}}' +
    "#nav-loader .nl-text{font:800 .66rem/1 'Inter','Segoe UI',system-ui,sans-serif;letter-spacing:.22em;" +
    'text-transform:uppercase;color:rgba(237,229,216,.5);}' +
    '@media (prefers-reduced-motion: reduce){#nav-loader .nl-ekg polyline{animation:none;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var nl = document.createElement('div');
  nl.id = 'nav-loader';
  nl.setAttribute('aria-hidden', 'true');
  nl.innerHTML =
    '<div class="nl-inner">' +
    '<div class="nl-mark">PULSE</div>' +
    '<svg class="nl-ekg" viewBox="0 0 210 40" aria-hidden="true"><defs>' +
    '<linearGradient id="nlg" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#FF8C1A"/><stop offset="0.55" stop-color="#E8710A"/><stop offset="1" stop-color="#FFD740"/>' +
    '</linearGradient></defs>' +
    '<polyline points="0,20 56,20 70,20 80,6 94,34 106,20 150,20 162,20 172,9 186,31 198,20 210,20"/>' +
    '</svg>' +
    '<div class="nl-text">Loading…</div>' +
    '</div>';

  function mount() { (document.body || document.documentElement).appendChild(nl); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  var hideTimer = null, shownAt = 0;
  var MIN_SHOW = 300;   // don't flicker — keep visible at least this long
  var SAFETY = 15000;   // never leave it stuck (download link, hung fetch, etc.)
  function show() {
    if (!nl.classList.contains('on')) shownAt = Date.now();
    nl.classList.add('on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { nl.classList.remove('on'); }, SAFETY);
  }
  function hide() {
    clearTimeout(hideTimer);
    var wait = Math.max(0, MIN_SHOW - (Date.now() - shownAt));
    hideTimer = setTimeout(function () { nl.classList.remove('on'); }, wait);
  }
  // Expose so any page can hold the loader open until its content/answers render:
  //   set window.__pulseHoldForContent = true (in <head>), then call
  //   window.PulseLoader.hide() once the answers are on screen.
  window.PulseLoader = { show: show, hide: hide };

  function flagNav() { try { sessionStorage.setItem('pulseNav', '1'); } catch (_e) {} }

  // ── Outgoing: show the pulse the instant a same-origin link is clicked, and
  //    flag the destination page to keep pulsing until it's fully loaded.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if (href.indexOf('/graphics/assets/') !== -1) return; // asset downloads don't navigate
    var u;
    try { u = new URL(a.href, location.href); } catch (_e) { return; }
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return; // same page / hash
    flagNav();
    show();
  }, false);

  window.addEventListener('beforeunload', function () { flagNav(); show(); });

  // ── Incoming: if we arrived via an in-site screen switch, keep the pulse
  //    animating over the new page until it has fully loaded (with answers).
  var cameFromNav = false;
  try { cameFromNav = sessionStorage.getItem('pulseNav') === '1'; sessionStorage.removeItem('pulseNav'); } catch (_e) {}
  if (cameFromNav) {
    show();
    var release = function () {
      if (window.__pulseHoldForContent) return; // page releases explicitly when answers render
      setTimeout(hide, 450); // small post-load delay lets late content (mermaid, etc.) paint
    };
    if (document.readyState === 'complete') release();
    else window.addEventListener('load', release);
  }

  window.addEventListener('pageshow', function (e) { if (e.persisted) hide(); });
})();
