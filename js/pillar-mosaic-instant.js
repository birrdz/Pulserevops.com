/* pillar-mosaic-instant.js — first-paint mosaic mode (no old pillar chrome flash). Owner 2026-07-04. */
(function () {
  'use strict';
  if (!window.PILLAR_MOSAIC && !window.PILLAR_SPA) return;
  document.documentElement.classList.add('pillar-mosaic-instant');
  if (!document.getElementById('pillar-mosaic-instant-css')) {
    var s = document.createElement('style');
    s.id = 'pillar-mosaic-instant-css';
    s.textContent =
      'html.pillar-mosaic-instant .hdr,html.pillar-mosaic-instant .hero,html.pillar-mosaic-instant .toolbar,'
      + 'html.pillar-mosaic-instant .statusbar,html.pillar-mosaic-instant .footer,html.pillar-mosaic-instant #hub-recent,'
      + 'html.pillar-mosaic-instant #hub-results-bar,html.pillar-mosaic-instant #mos-head{display:none!important}'
      + 'html.pillar-mosaic-instant body{background:#0a0806!important;color:#fff!important;margin:0}'
      + 'html.pillar-mosaic-instant .grid-wrap{max-width:1080px!important;margin-left:auto!important;margin-right:auto!important;padding:0 clamp(10px,2vw,24px) 48px!important;margin-top:0!important}'
      + 'html.pillar-mosaic-instant .loading,html.pillar-mosaic-instant .pulse-logo,html.pillar-mosaic-instant .pulse-skeleton{display:none!important}'
      + 'html.pillar-mosaic-instant .grid,html.pillar-mosaic-instant [data-pulse-home-mosaic],html.pillar-mosaic-instant #magMosaic{min-height:55vh;background:transparent!important;transition:opacity .28s ease,transform .28s ease}'
      + 'html.pillar-mosaic-instant .grid.mag-mosaic,html.pillar-mosaic-instant .grid.pulse-home-mosaic{display:grid!important;grid-template-columns:repeat(4,1fr)!important;grid-auto-rows:150px!important;gap:12px!important;grid-auto-flow:dense!important}'
      + 'html.pillar-mosaic-instant.pillar-spa-busy .grid,html.pillar-mosaic-instant.pillar-spa-busy [data-pulse-home-mosaic],html.pillar-mosaic-instant.pillar-spa-busy #magMosaic{pointer-events:none}';
    (document.head || document.documentElement).appendChild(s);
  }
  if (!document.querySelector('link[href="/css/pulse-mosaic.css"]')) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '/css/pulse-mosaic.css';
    document.head.appendChild(l);
  }
  if (!window.PULSE_DEFAULTS && !document.querySelector('script[data-pulse-defaults]')) {
    var d = document.createElement('script');
    d.src = '/js/pulse-defaults.js';
    d.setAttribute('data-pulse-defaults', '');
    document.head.appendChild(d);
  }
  var pillar = window.PILLAR_DEFAULT || '';
  if (pillar && !document.querySelector('link[data-pillar-prefetch]')) {
    var pf = document.createElement('link');
    pf.rel = 'prefetch';
    pf.as = 'fetch';
    pf.crossOrigin = 'anonymous';
    pf.href = '/.netlify/functions/pulse-machine-library-list?recent=500&pillar=' + encodeURIComponent(pillar) + '&sort=ts';
    pf.setAttribute('data-pillar-prefetch', '1');
    document.head.appendChild(pf);
  }
  if (!document.querySelector('script[data-pulse-pillar-spa]')) {
    var n = document.createElement('script');
    n.src = '/js/pulse-pillar-spa.js';
    n.defer = true;
    n.setAttribute('data-pulse-pillar-spa', '');
    document.head.appendChild(n);
  }
  if (!document.querySelector('script[data-pulse-idle-scroll]')) {
    var idle = document.createElement('script');
    idle.src = '/js/pulse-idle-scroll.js';
    idle.defer = true;
    idle.setAttribute('data-pulse-idle-scroll', '');
    document.head.appendChild(idle);
  }
})();
