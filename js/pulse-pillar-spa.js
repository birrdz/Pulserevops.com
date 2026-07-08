/* pulse-pillar-spa.js — in-place pillar/topic navigation (no old-format page flash). Owner 2026-07-04. */
(function () {
  'use strict';

  var TOPICS_KEY = '__topics__';
  var KEY_TO_PATH = {
    all: '/knowledge', q: '/knowledge',
    st: '/sales-trainings', ik: '/industry-kpis', tk: '/tech-stacks', sports: '/sports',
    bs: '/sales-book-summaries', er: '/electronic-reviews', ra: '/revenue-architecture', gp: '/go-to-market-playbooks',
    fr: '/franchises', ca: '/cars', tn: '/towns', sc: '/schools', nl: '/nightlife', dn: '/dining',
    bt: '/boats', mv: '/movies', wl: '/wellness', dr: '/drills', tv: '/travel', rs: '/resorts',
    es: '/estates', cl: '/clubs', lv: '/living', ev: '/events', sy: '/style', ga: '/gatherings',
    gm: '/gaming', sk: '/skills', sp: '/speeches', tl: '/tools', cg: '/coaching', co: '/collectibles',
    aq: '/aquariums', tc: '/telco', hf: '/highschool-football-recruiting', pt: '/pets', sw: '/software',
    ce: '/current-events', ai: '/ai-infrastructure', bo: '/buildouts', gb: '/graphics',
    fs: '/fishing', cr: '/crabbing', cd: '/contracts',
    [TOPICS_KEY]: '/topics',
  };
  var PATH_TO_KEY = {};
  Object.keys(KEY_TO_PATH).forEach(function (k) {
    var p = KEY_TO_PATH[k].replace(/\/$/, '') || '/knowledge';
    PATH_TO_KEY[p] = k;
    PATH_TO_KEY[p.replace(/^\//, '')] = k;
  });
  PATH_TO_KEY.knowledge = 'all';
  PATH_TO_KEY.topics = TOPICS_KEY;
  PATH_TO_KEY['/topics'] = TOPICS_KEY;

  var TITLES = {
    all: 'Knowledge Library', q: 'Knowledge Library', ca: 'Cars', dn: 'Dining', bt: 'Boats',
    wl: 'Wellness', tv: 'Travel', rs: 'Resorts', tn: 'Towns', mv: 'Movies', st: 'Sales Trainings',
    ik: 'Industry KPIs', tk: 'Tech Stacks', bs: 'Book Summaries', er: 'Electronics Reviews',
    ra: 'Revenue Architecture', gp: 'GTM Playbooks', fr: 'Franchises', nl: 'Nightlife', sc: 'Schools',
    sy: 'Style', ga: 'Gatherings', gm: 'Gaming', tl: 'Tools', cg: 'Coaching', co: 'Collectibles',
    aq: 'Aquariums', pt: 'Pets', sw: 'Software', ce: 'Current Events', ai: 'AI Infrastructure',
    es: 'Estates', cl: 'Clubs', lv: 'Living', ev: 'Events', dr: 'Drills', sk: 'Skills', sp: 'Speeches',
    hf: 'HS Football Recruiting', tc: 'Telco', bo: 'Buildouts', sports: 'Sports',
    fs: 'Fishing', cr: 'Crabbing', cd: 'Contracts', gb: 'Graphics',
    [TOPICS_KEY]: 'Browse Topics',
  };

  var PPAL = {
    q: ['#C0531F', '#2A1206'], ra: ['#1B7A3D', '#0A3019'], gp: ['#1C6EA4', '#082635'], ik: ['#1565C0', '#071E3C'],
    tk: ['#3B5BA5', '#101A33'], ev: ['#EC2D7C', '#141414'], nl: ['#7A1FA2', '#1C0A28'], gm: ['#6D28D9', '#170A33'],
    sk: ['#3949AB', '#0D1234'], sp: ['#8E1B4B', '#260711'], bt: ['#0E6BA8', '#052433'], tv: ['#1C9AD6', '#063347'],
    rs: ['#0E9C9C', '#04302F'], aq: ['#0E7C86', '#03282B'], ga: ['#C026D3', '#260A2A'], ca: ['#C0392B', '#2A0907'],
    fr: ['#1E3A5F', '#C8972E'], mv: ['#B71C3B', '#270710'], er: ['#E08A1E', '#3A2206'], es: ['#B8860B', '#2C1F03'],
    cl: ['#2E7D32', '#0B280D'], hf: ['#B45309', '#2C1403'], wl: ['#2E9E5B', '#0C321F'], lv: ['#A0522D', '#28130A'],
    sy: ['#BE185D', '#260512'], gb: ['#0D9488', '#04302B'], bs: ['#8B5A2B', '#241405'], tn: ['#5B7553', '#182015'],
    dr: ['#D2691E', '#341805'], pt: ['#0E8C7A', '#042E28'], sw: ['#475569', '#131A24'], ai: ['#0A66C2', '#0A0A0A'],
    cg: ['#0891B2', '#04303A'], co: ['#92400E', '#2A1304'], tl: ['#52525B', '#18181B'], dn: ['#9F1239', '#270710'],
    sc: ['#1E40AF', '#0A1533'], st: ['#2563EB', '#0A1A3A'], bo: ['#D97706', '#341B03'], ce: ['#D7263D', '#A81729'],
  };

  function normPath(path) {
    path = String(path || '').split('?')[0].split('#')[0].replace(/\.html$/, '');
    if (!path || path === '/') return '/knowledge';
    if (path.charAt(0) !== '/') path = '/' + path;
    return path.replace(/\/$/, '') || '/knowledge';
  }

  function pathToPillar(href) {
    try {
      var u = typeof href === 'string' && href.indexOf('://') === -1
        ? { pathname: normPath(href) }
        : new URL(href, location.origin);
      var p = normPath(u.pathname);
      if (p === '/topics') return TOPICS_KEY;
      if (PATH_TO_KEY[p]) return PATH_TO_KEY[p];
      var seg = p.split('/').filter(Boolean).pop();
      if (seg && PATH_TO_KEY['/' + seg]) return PATH_TO_KEY['/' + seg];
      if (seg && PATH_TO_KEY[seg]) return PATH_TO_KEY[seg];
    } catch (e) {}
    return null;
  }

  function mosaicEl() {
    return document.getElementById('grid')
      || document.querySelector('[data-pulse-home-mosaic]')
      || document.getElementById('magMosaic');
  }

  function spaActive() {
    return !!(window.PILLAR_MOSAIC || window.PILLAR_SPA || mosaicEl());
  }

  function applyBg(pillar) {
    var p = pillar === 'all' ? 'q' : pillar;
    var c = PPAL[p] || PPAL.q;
    document.body.style.background = 'radial-gradient(1200px 620px at 18% -8%, ' + c[0] + '66, transparent 62%), linear-gradient(162deg, ' + c[1] + ' 0%, #0b0908 52%, ' + c[1] + ' 100%)';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.color = '#fff';
  }

  function mosaicOpts(pillar) {
    return {
      pillar: pillar && pillar !== 'all' ? pillar : '',
      query: '',
      hubTiles: true,
      searchBox: false,
      allPillars: false,
      recent: 25000,
      poolCap: 25000,
      recentFaceOnly: true,
      perfectFirst: true,
      rotateTiles: true,
      fluxFirst: true,
      sortNewest: true,
      endlessLoop: true,
    };
  }

  function fade(el, out, cb) {
    if (!el) { cb(); return; }
    el.style.transition = 'opacity .28s ease, transform .28s ease';
    if (out) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(cb, 280);
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        setTimeout(cb, 280);
      });
    }
  }

  function remount(pillar, el) {
    el = el || mosaicEl();
    if (!el || !window.PulseHomeMosaic) return false;
    document.documentElement.classList.add('pillar-mosaic-instant');
    window.PILLAR_MOSAIC = true;
    el.__pulseHomeBoot = false;
    el.__pulseHome = null;
    if (pillar === TOPICS_KEY) {
      window.PILLAR_DEFAULT = '';
      el.setAttribute('data-topics-page', '');
      el.removeAttribute('data-pillar');
      el.classList.add('pulse-topics-mosaic');
      if (window.PulseHomeMosaic.bootFromDom) window.PulseHomeMosaic.bootFromDom();
      else window.PulseHomeMosaic.mount(el, { topicsOnly: true, hubTiles: false });
      return true;
    }
    el.classList.remove('pulse-topics-mosaic');
    el.removeAttribute('data-topics-page');
    window.PILLAR_DEFAULT = pillar;
    if (pillar && pillar !== 'all') el.setAttribute('data-pillar', pillar);
    else el.removeAttribute('data-pillar');
    el.innerHTML = '';
    if (typeof window.__pulsePillarPageSwitch === 'function') {
      window.__pulsePillarPageSwitch(pillar);
    } else {
      window.PulseHomeMosaic.mount(el, mosaicOpts(pillar));
    }
    return true;
  }

  function waitForMosaic(cb, tries) {
    tries = tries || 0;
    if (window.PulseHomeMosaic && mosaicEl()) { cb(true); return; }
    if (tries > 120) { cb(false); return; }
    setTimeout(function () { waitForMosaic(cb, tries + 1); }, 40);
  }

  function go(href, opts) {
    opts = opts || {};
    var pillar = opts.pillar || pathToPillar(href);
    if (!pillar) {
      window.location.href = href;
      return;
    }
    var path = KEY_TO_PATH[pillar] || '/knowledge';
    if (opts.query) path += '?q=' + encodeURIComponent(opts.query);
    var el = mosaicEl();
    if (!el) {
      window.location.href = path + (opts.query ? ('?q=' + encodeURIComponent(opts.query)) : '');
      return;
    }
    var cur = pathToPillar(location.pathname);
    if (cur === pillar && !opts.force) {
      if (opts.replace) history.replaceState({ pillar: pillar }, '', path);
      return;
    }
    document.documentElement.classList.add('pillar-spa-busy', 'pillar-mosaic-instant');
    document.body.style.background = '#0a0806';
    document.body.style.color = '#fff';
    waitForMosaic(function (ok) {
      if (!ok || !window.PulseHomeMosaic) {
        document.documentElement.classList.remove('pillar-spa-busy');
        window.location.href = path + (opts.query ? ('?q=' + encodeURIComponent(opts.query)) : '');
        return;
      }
      fade(el, true, function () {
        remount(pillar, el);
        applyBg(pillar === TOPICS_KEY ? 'all' : pillar);
        var title = TITLES[pillar] || pillar.toUpperCase();
        document.title = title + ' — Pulse';
        if (opts.replace) history.replaceState({ pillar: pillar }, '', path);
        else history.pushState({ pillar: pillar }, '', path);
        fade(el, false, function () {
          document.documentElement.classList.remove('pillar-spa-busy');
        });
      });
    });
  }

  function onClick(e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;
    if (/^\/knowledge\/[^/?#]+/i.test(href)) return;
    if (/^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0) return;
    var pillar = pathToPillar(href);
    if (!pillar) return;
    if (!spaActive()) return;
    e.preventDefault();
    go(href);
  }

  window.PulsePillarSpa = {
    go: go,
    pathToPillar: pathToPillar,
    keyToPath: function (k) { return KEY_TO_PATH[k] || '/knowledge'; },
    applyBg: applyBg,
  };

  document.addEventListener('click', onClick, true);
  window.addEventListener('popstate', function () {
    var pillar = pathToPillar(location.pathname);
    if (pillar && mosaicEl() && window.PulseHomeMosaic) go(location.pathname, { replace: true, force: true });
  });
})();
