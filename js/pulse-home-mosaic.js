/* pulse-home-mosaic.js — shared homepage-style endless mosaic (hero + hub tiles + face cards).
 * Used by index pattern, pillar hubs, /search, and /topics. Owner 2026-07-04. */
(function () {
  'use strict';

  var FI = window.PulseFaceImg || {};
  function imgOf(c) { return FI.imgOf ? FI.imgOf(c) : ((c && c.img) || ('/assets/qa/' + encodeURIComponent(c.id) + '.jpg')); }
  function mosaicSrc(c) { return FI.mosaicTileSrc ? FI.mosaicTileSrc(c) : px(imgOf(c)); }
  function px(u) { return FI.px ? FI.px(u || '') : (u || ''); }
  function bindFaceTiles(root) { if (FI.bindTiles) FI.bindTiles(root, 'a.mm[href^="/knowledge/"]:not([data-face-bound])'); }
  function observeLazy(root) { if (FI.observeLazyTiles) FI.observeLazyTiles(root); }
  function hydrateMosaic(root, eager) {
    if (FI.hydrateMosaicTiles) FI.hydrateMosaicTiles(root, { eager: eager });
    else observeLazy(root);
  }
  function preloadAhead(cards, n) { if (FI.preloadAhead) FI.preloadAhead(cards, n); else if (FI.preloadCards) FI.preloadCards(cards, n || 8); }
  function visibleTileCount(container, hubN) {
    if (FI.mosaicFirstBatchSize) return FI.mosaicFirstBatchSize(container, { hubTiles: hubN });
    if (FI.estimateVisibleTileCount) return FI.estimateVisibleTileCount(container, { hubTiles: hubN });
    return 18;
  }
  function scrollBatch(first) {
    if (FI.mosaicScrollBatchSize) return FI.mosaicScrollBatchSize(first);
    if (FI.scrollBatchSize) return FI.scrollBatchSize(first);
    return 20;
  }
  function scrollDelayMs() {
    return FI.mosaicScrollDelayMs ? FI.mosaicScrollDelayMs() : 120;
  }
  function normEntry(e) { return FI.normEntry ? FI.normEntry(Object.assign({}, e)) : (e && e.id ? Object.assign({}, e, { img: imgOf(e) }) : null); }
  var NM = {
    tl: 'CRO & Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks',
    bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infrastructure',
    gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM Playbooks',
    ra: 'Revenue Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne',
    lv: 'Luxury Travel', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness',
    dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics',
    ce: 'Pulse News', q: 'Knowledge', ed: 'Advice', sw: 'Software', hf: 'Home & Family', sp: 'Speeches', sk: 'Skills'
  };
  var SZ = ['big', 'tall', 'wide', '', 'tall', 'wide', 'big', '', 'wide', 'tall', '', 'big', 'wide', 'tall'];
  var TOPIC_SZ = ['big', 'tall', 'wide', '', 'tall', 'wide', 'big', '', 'wide', 'tall', '', 'big', 'wide', 'tall', 'wide', ''];
  var HUBT = 'position:absolute;left:16px;right:16px;bottom:14px;z-index:3;color:#FFD54F;font-family:Fraunces,\'Playfair Display\',Georgia,serif;font-style:italic;font-weight:900;line-height:1.02;text-shadow:0 0 1px #000,0 0 2px #000,0 1px 0 #000,0 2px 10px rgba(0,0,0,.95),0 4px 16px rgba(0,0,0,.85);-webkit-text-stroke:0.35px rgba(0,0,0,.85);';

  /** Image may also have title baked; mosaic always shows gold CSS overlay like homepage hub tiles. */
  function faceTitleBaked() { return false; }
  function esc(s) {
    return String(s || '').replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }
  function entryTitle(c) { return String((c && (c.question || c.title)) || (c && c.id) || ''); }
  // tile size tracks TITLE LENGTH (owner 2026-07-06): short → small, long → larger so the baked gold title has room.
  function longTitleSize(c) {
    var n = entryTitle(c).length;
    if (n >= 88) return 'mm-long';
    if (n >= 58) return 'big';
    if (n >= 40) return (n % 2 ? 'tall' : 'wide');
    return '';
  }
  function pof(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }

  function prefetchMosaicApi(url) {
    if (!url || document.querySelector('link[data-mosaic-api-prefetch="' + url + '"]')) return;
    var pf = document.createElement('link');
    pf.rel = 'prefetch';
    pf.as = 'fetch';
    pf.crossOrigin = 'anonymous';
    pf.href = url;
    pf.setAttribute('data-mosaic-api-prefetch', url);
    document.head.appendChild(pf);
  }

  var FULL_PILLAR_POOL = 25000;

  function poolFetchCap(opts) {
    opts = opts || {};
    var n = parseInt(opts.recent || opts.poolCap || '500', 10) || 500;
    if (opts.pillar || opts.mixPillars || opts.topicsOnly) return Math.min(n, FULL_PILLAR_POOL);
    return Math.min(n, 500);
  }

  function mosaicWarmUrls(opts) {
    opts = opts || {};
    var recent = poolFetchCap(opts);
    if (opts.pillar && (opts.perfectOnly || opts.sortNewest)) {
      return ['/.netlify/functions/pulse-machine-library-list?recent=' + recent + '&pillar=' + encodeURIComponent(opts.pillar) + '&sort=ts'];
    }
    if (opts.newOnly) {
      var cap = Math.min(parseInt(opts.recent || '500', 10) || 500, 40000);
      return [
        '/.netlify/functions/pulse-machine-library-list?recent=' + cap + '&newOnly=1&days=' + (parseInt(opts.newDays, 10) || 14) + '&sort=ts',
        '/.netlify/functions/pulse-machine-library-list?recent=' + cap + '&tag=pulse-recent&sort=ts'
      ];
    }
    if (opts.currentEvents) {
      return [
        '/.netlify/functions/pulse-machine-library-list?recent=' + recent + '&pillar=ce&sort=ts',
        '/.netlify/functions/pulse-machine-library-list?recent=' + recent + '&tag=current-events&sort=ts'
      ];
    }
    if (opts.pillar) {
      return ['/.netlify/functions/pulse-machine-library-list?recent=' + recent + '&pillar=' + encodeURIComponent(opts.pillar) + '&sort=ts'];
    }
    return [];
  }

  function recentFaceOk(e) {
    if (FI.cardFaceOk) return FI.cardFaceOk(e);
    if (!e || !e.id || !/^[a-z]{2,3}\d/i.test(String(e.id))) return false;
    var p = pof(e.id);
    var img = String(e.img || e.cover || '');
    if (p === 'tl' && /\/assets\/cro-cover-/.test(img)) return false;
    return true;
  }
  function mosaicFaceOk(e, opts) {
    if (opts && opts.perfectOnly && !perfectEntryOk(e, opts)) return false;
    if (opts && opts.fluxOnly && FI.hasFluxFace) return FI.hasFluxFace(e);
    if (FI.cardFaceOk) return FI.cardFaceOk(e);
    return recentFaceOk(e);
  }
  function entryTs(e) {
    return Number(e && e.ts) || parseInt(String(e && e.id || '').replace(/\D/g, ''), 10) || 0;
  }
  /** Neon trim on homepage bands for edited / new / revised answers (owner 2026-07-20). */
  var NEON_TRIMS = ['mm-neon-green', 'mm-neon-purple', 'mm-neon-blue', 'mm-neon-pink'];
  var NEON_WINDOW_MS = 45 * 24 * 60 * 60 * 1000; // ~45 days — campaign visibility
  function neonTrimClass(e) {
    if (!e || !e.id) return '';
    var now = Date.now();
    var polished = Number(e.polished_at) || 0;
    var created = Number(e.ts) || 0;
    var pinned = Number(e.pinned_until) || 0;
    var qs = typeof e.quality_score === 'number' ? e.quality_score : 0;
    var isFreshPin = pinned > now;
    var isRecentPolish = polished > 0 && (now - polished) <= NEON_WINDOW_MS;
    var isRecentCreate = created > 0 && (now - created) <= NEON_WINDOW_MS;
    var isFinished = qs >= 13 && polished > 0;
    if (!(isFreshPin || isRecentPolish || isRecentCreate || isFinished)) return '';
    var h = 0;
    var s = String(e.id);
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return NEON_TRIMS[Math.abs(h) % NEON_TRIMS.length];
  }
  /** Scrubbed-perfect: face card + quality_score >= 13 (owner 2026-07-04). */
  function scrubbedPerfect13Ok(e) {
    if (!e || !e.id) return false;
    if (!FI.cardFaceOk || !FI.cardFaceOk(e)) {
      if (!recentFaceOk(e)) return false;
    }
    if (e.cover_src === 'flux') return true;   // flux covers always render (owner 2026-07-06 — mosaic IS the flux face cards)
    var qs = typeof e.quality_score === 'number' ? e.quality_score : null;
    if (qs == null || qs < 13) return false;
    return true;
  }
  function readLocalLibraryCache() {
    try {
      var raw = localStorage.getItem('pulse.library.entries.v3');
      if (!raw) return null;
      var blob = JSON.parse(raw);
      return (blob && Array.isArray(blob.entries) && blob.entries.length) ? blob.entries : null;
    } catch (e) { return null; }
  }
  function seedEntries(raw) {
    return (raw || []).map(function (e) {
      return Object.assign({}, e, {
        quality_score: typeof e.quality_score === 'number' ? e.quality_score : 13,
        ts: e.ts || Date.now(),
        img: e.img || ('/assets/qa/' + encodeURIComponent(e.id) + '.jpg'),
      });
    });
  }
  function perfectEntryOk(e, opts) {
    if (opts && opts.perfectOnly) return scrubbedPerfect13Ok(e);
    if (!e || !e.id) return false;
    if (!FI.cardFaceOk || !FI.cardFaceOk(e)) {
      if (!recentFaceOk(e)) return false;
    }
    var qs = typeof e.quality_score === 'number' ? e.quality_score : null;
    if (qs != null && qs < 13) return false;
    if (FI.hasFluxFace && FI.hasFluxFace(e)) return true;
    if (e.cover_src === 'flux') return true;
    return qs == null || qs >= 13;
  }
  function byNewestQuality(a, b) {
    var ta = entryTs(a), tb = entryTs(b);
    if (ta !== tb) return tb - ta;
    return (Number(b.quality_score) || 0) - (Number(a.quality_score) || 0);
  }
  function shouldMixPillars(opts) {
    if (!opts || opts.mixPillars === false) return false;
    if (opts.topicsOnly && opts.mixPillars) return true;
    if (opts.pillar || opts.currentEvents || opts.topicsOnly) return false;
    return true;
  }
  function pillarCap(p, poolCap, pillCount, mixing) {
    if (FI.pillarPoolCap) return FI.pillarPoolCap(p, poolCap, pillCount, mixing);
    if (mixing && p === 'tl') return Math.min(3, Math.max(2, Math.floor(poolCap / 120)));
    return Math.max(6, Math.ceil(poolCap / Math.max(pillCount, 8)));
  }
  function mosaicImgKey(c) {
    return FI.mosaicImgKey ? FI.mosaicImgKey(c) : String(mosaicSrc(c)).replace(/\?.*$/, '').toLowerCase();
  }
  function dedupeMosaicImgs(list, maxLen) {
    if (FI.dedupeMosaicEntries) return FI.dedupeMosaicEntries(list, maxLen);
    var seen = {}, out = [];
    (list || []).forEach(function (e) {
      if (!e || !e.id) return;
      var k = mosaicImgKey(e);
      if (k && seen[k]) return;
      if (k) seen[k] = 1;
      out.push(e);
    });
    return maxLen ? out.slice(0, maxLen) : out;
  }
  /** Interleave one tile per pillar so no topic (e.g. CRO/tl) dominates the mosaic. */
  function roundRobinPillars(list, opts) {
    if (!list || !list.length) return list || [];
    var poolCap = parseInt((opts && (opts.poolCap || opts.pool)) || '500', 10) || 500;
    var mixing = shouldMixPillars(opts) || !(opts && opts.pillar);
    var byp = {};
    list.forEach(function (e) {
      if (!e || !e.id) return;
      var p = pof(e.id);
      (byp[p] = byp[p] || []).push(e);
    });
    var pills = Object.keys(byp);
    if (!pills.length) return [];
    shuf(pills);
    pills.forEach(function (p) {
      byp[p].sort(byNewestQuality);
      var cap = pillarCap(p, poolCap, pills.length, mixing);
      if (byp[p].length > cap) byp[p] = byp[p].slice(0, cap);
    });
    var out = [], cur = {}, seenImg = {}, added = true;
    pills.forEach(function (p) { cur[p] = 0; });
    while (added && out.length < poolCap) {
      added = false;
      for (var pi = 0; pi < pills.length && out.length < poolCap; pi++) {
        var pill = pills[pi], lst = byp[pill];
        while (cur[pill] < lst.length) {
          var e = lst[cur[pill]++];
          var ik = mosaicImgKey(e);
          if (ik && seenImg[ik]) continue;
          if (ik) seenImg[ik] = 1;
          out.push(e);
          added = true;
          break;
        }
      }
    }
    return dedupeMosaicImgs(out, poolCap);
  }
  /** Pin fully finished 13/13 face cards at the top of endless scroll (owner 2026-07-04). */
  function prioritizePerfect13(list, opts) {
    if (!list || !list.length) return list || [];
    if (opts && opts.perfectFirst === false) return list;
    if (shouldMixPillars(opts)) return roundRobinPillars(list, opts);
    var perfect = [], rest = [];
    list.forEach(function (e) {
      if (scrubbedPerfect13Ok(e)) perfect.push(e);
      else rest.push(e);
    });
    perfect.sort(byNewestQuality);
    if (opts && opts.sortNewest) rest.sort(byNewestQuality);
    else rest = shuf(rest.slice());
    return perfect.concat(rest);
  }
  function recycleMosaicBuf(buf, opts) {
    if (!buf || !buf.length) return buf || [];
    if (shouldMixPillars(opts)) return roundRobinPillars(buf, opts);
    if (opts && (opts.perfectOnly || opts.scrubbedOnly)) return roundRobinPillars(buf, opts);
    return prioritizePerfect13(buf, opts);
  }
  function shuf(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function ensureCss() {
    if (document.getElementById('pulse-mosaic-css')) return;
    var l = document.createElement('link');
    l.id = 'pulse-mosaic-css';
    l.rel = 'stylesheet';
    l.href = '/css/pulse-mosaic.css';
    document.head.appendChild(l);
  }

  function ensureHubCss() {
    if (document.getElementById('pulse-home-mosaic-css')) return;
    var s = document.createElement('style');
    s.id = 'pulse-home-mosaic-css';
    s.textContent =
      'body.pulse-mosaic-page{margin:0;min-height:100vh;background:radial-gradient(1100px 560px at 82% -6%, rgba(14,140,122,.25), transparent 60%), linear-gradient(165deg,#0a0806 0%,#100b06 55%,#0a0806 100%);background-attachment:fixed;color:#fff;font-family:Inter,system-ui,sans-serif;}'
      + '.pulse-mosaic-shell{max-width:1080px;margin:0 auto;padding:0 clamp(10px,2vw,24px) 48px;box-sizing:border-box;}'
      + '.mag-mosaic.pulse-home-mosaic{margin:0 auto;padding-top:8px;max-width:1080px;}'
      + '.mm.mm-menu{display:flex;align-items:center;justify-content:center;text-align:center;}'
      + '.mm.mm-menu::after,.mm.mm-menu .mm-scrim{display:none;}'
      + '.mm.mm-menu .mm-txt{position:static;padding:0;}'
      + '.mm-menu-t{margin:0;font-family:Fraunces,"Playfair Display",Georgia,serif;font-style:italic;font-weight:900;font-size:1.5rem;line-height:1.06;color:#fff;text-shadow:0 2px 7px rgba(0,0,0,.5);}'
      + '.mm.mm-menu.big .mm-menu-t{font-size:3.7rem;}.mm.mm-menu.wide .mm-menu-t{font-size:2.8rem;}.mm.mm-menu.tall .mm-menu-t{font-size:2.6rem;}'
      + '.mm.mm-hero{grid-column:span 1;grid-row:span 1;min-height:120px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(120deg,#0a0b0f 0%,#171006 52%,#0a0b0f 100%);border:1px solid rgba(246,192,73,.34);}'
      + '.mm.mm-hero::after,.mm.mm-hero .mm-scrim{display:none;}'
      + '.mm-hero-in{padding:16px 22px;}'
      + '.mm-hero-k{font:800 .62rem/1 system-ui;letter-spacing:.2em;text-transform:uppercase;color:#F6C049;}'
      + '.mm-hero-logo{display:block;margin:8px auto 0;max-width:min(430px,74%);max-height:88px;height:auto;width:auto;object-fit:contain;}'
      + '.mm.mm-hire{grid-column:span 2;grid-row:span 2;position:relative;background-size:cover;background-position:center 18%;border:1px solid rgba(246,192,73,.4);}'
      + '.mm.mm-hire::after,.mm.mm-hire .mm-scrim{display:none;}'
      + '.mm.mm-hire .mm-hire-t{position:absolute;left:0;right:0;bottom:0;padding:26px 30px;background:linear-gradient(0deg,rgba(6,7,11,.95),rgba(6,7,11,.5) 58%,transparent);color:#EAC15C;font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:900;font-size:2.5rem;line-height:1.06;z-index:3;}'
      + '.mm.mm-hire .mm-hire-cta{display:block;margin-top:10px;font-family:system-ui;font-style:normal;font-weight:800;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:#fff;}'
      + '.mm.mm-searchbox{grid-column:span 2;display:flex;align-items:center;gap:12px;padding:0 20px;background:linear-gradient(150deg,rgba(18,14,8,.86),rgba(18,14,8,.92)),url(/assets/topics/_search.jpg) center/cover;border:1px solid rgba(246,192,73,.34);}'
      + '.mm.mm-searchbox input{flex:1;background:transparent;border:0;color:#fff;font:600 1.15rem/1 Inter,system-ui,sans-serif;height:64px;outline:none;min-width:0;}'
      + '.mm.mm-searchbox input::placeholder{color:rgba(255,255,255,.45);}'
      + '.mm.mm-topic{background-size:cover;background-position:center;}'
      + '.pulse-topics-mosaic .mm.mm-topic{min-height:150px;}'
      + '.mm.mm-ce-topic{border:2px solid rgba(215,38,61,.72);box-shadow:0 0 32px rgba(215,38,61,.28);}'
      + '.pulse-topics-mosaic .mm.mm-ce-topic{grid-column:span 2;grid-row:span 2;min-height:200px;}'
      + '.mm.mm-recent-topic{border:2px solid rgba(14,140,122,.72);box-shadow:0 0 32px rgba(14,140,122,.28);}'
      + '.pulse-topics-mosaic .mm.mm-recent-topic{grid-column:span 2;grid-row:span 2;min-height:200px;}'
      + '.mm.mm-topic::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.28) 40%,transparent 100%);}'
      + '.mm.mm-topic .mm-menu-t{position:absolute;left:14px;right:14px;bottom:12px;z-index:2;}'
      + '@media(max-width:600px){.mm.mm-menu.big .mm-menu-t{font-size:2.4rem;}.mm.mm-hire{min-height:320px;}.mm.mm-hire .mm-hire-t{font-size:2.15rem;padding:18px 20px;}.mm.mm-searchbox{grid-column:span 2;}}';
    document.head.appendChild(s);
  }

  var CURRENT_EVENTS_TILE = {
    slug: 'current-events',
    href: '/current-events',
    label: 'Current Events',
    cls: 'wide tall mm-ce-topic',
    size: '2.2rem',
    sub: 'News · pop culture · trending'
  };

  var RECENT_TILE = {
    slug: '_recent',
    href: '/recent',
    label: 'Recent',
    cls: 'wide tall mm-recent-topic',
    size: '2.2rem',
    sub: 'Newest Q&As · go here first'
  };

  function isCurrentEventsEntry(e) {
    if (!e || !e.id) return false;
    if (pof(e.id) === 'ce') return true;
    var tags = Array.isArray(e.tags) ? e.tags : [];
    return tags.indexOf('current-events') >= 0 || tags.indexOf('current-events-2027') >= 0 || tags.indexOf('pulse-news') >= 0;
  }

  function hubHtml(opts) {
    var o = opts || {};
    var html = '';
    if (o.hubTiles !== false) {
      html += '<a class="mm mm-hero" href="/" aria-label="Pulse News home"><div class="mm-hero-in"><span class="mm-hero-k">● LIVE · The RevOps Authority</span>'
        + '<img class="mm-hero-logo" src="/pulse-news-logo.png" alt="Pulse News — Value Added"></div></a>';
      html += '<a class="mm mm-hire" href="/hire" data-pulse-click="hire-cro" aria-label="Hire your Fractional CRO here" style="background-image:url(\'/assets/hire-tile-hire.jpg\');background-size:cover;background-position:center 18%">'
        + '<div class="mm-hire-t">Hire your Fractional CRO here<span class="mm-hire-cta">Book a call &rarr;</span></div></a>';
      html += '<a class="mm mm-menu wide mm-topic" href="/topics" style="background-image:url(\'/assets/topics/_topics.jpg\')"><div style="' + HUBT + 'font-size:2rem">Browse Topics</div></a>';
      // Search hub tile removed (owner 2026-07-06) — use the dedicated top-of-page search instead.
      // Keep the functional inline search box only where a page explicitly requests it (e.g. /search).
      if (o.searchBox) {
        html += '<div class="mm mm-searchbox tall" id="pulse-search-tile"><span style="font-size:1.35rem;opacity:.85">🔍</span>'
          + '<input id="pulse-mosaic-search" type="search" placeholder="Search Pulse News…" autocomplete="off" aria-label="Search Pulse News"></div>';
      }
      html += '<a class="mm mm-menu mm-topic" href="/recent" style="background-image:url(\'/assets/topics/_recent.jpg\');background-size:cover;background-position:center"><div style="' + HUBT + 'font-size:1.55rem">Recent</div></a>';
      // Current Events tile removed (owner) — pillar deleted 100% from the site.
    }
    if (Array.isArray(o.extraTiles)) {
      o.extraTiles.forEach(function (t) {
        var cls = 'mm mm-topic ' + (t.cls || '');
        html += '<a class="' + cls + '" href="' + esc(t.href) + '" aria-label="' + esc(t.label) + '" style="background-image:url(\'/assets/topics/' + esc(t.slug) + '.jpg\');background-size:cover;background-position:center">'
          + '<div class="mm-scrim"></div>'
          + '<div class="mm-menu-t" style="' + HUBT + 'font-size:' + (t.size || '1.35rem') + '">' + esc(t.label) + '</div>'
          + (t.sub ? '<div class="mm-menu-sub" style="position:absolute;left:14px;right:14px;bottom:2.15rem;z-index:2;font-size:.72rem;color:rgba(255,255,255,.78);font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.9)">' + esc(t.sub) + '</div>' : '')
          + '</a>';
      });
    }
    return html;
  }

  function buildBuf(raw, opts) {
    var pillar = (opts && opts.pillar) || '';
    var query = ((opts && opts.query) || '').trim().toLowerCase();
    var source = (raw || []).slice();
    raw = source.map(function (e) { return normEntry(e); }).filter(function (e) {
      if (!e || !e.id) return false;
      if (opts && opts.perfectOnly && !scrubbedPerfect13Ok(e)) return false;
      if (opts && opts.perfectOnly && !perfectEntryOk(e, opts)) return false;
      if (opts && opts.currentEvents) return isCurrentEventsEntry(e);
      var p = pof(e.id);
      if (pillar && p !== pillar) return false;
      if (query && String(e.question || '').toLowerCase().indexOf(query) < 0) return false;
      return true;
    });
    if (opts && opts.sortNewest) {
      var seenN = {}, newest = [];
      raw.forEach(function (e) { if (!seenN[e.id]) { seenN[e.id] = 1; newest.push(e); } });
      newest.sort(function (a, b) {
        var ta = Number(b.ts) || 0, tb = Number(a.ts) || 0;
        if (ta !== tb) return ta - tb;
        var na = parseInt(String(a.id).replace(/\D/g, ''), 10) || 0;
        var nb = parseInt(String(b.id).replace(/\D/g, ''), 10) || 0;
        return nb - na;
      });
      if (opts.recentFaceOnly) newest = newest.filter(recentFaceOk);
      else if (opts.fluxOnly && FI.hasFluxFace) newest = newest.filter(function (e) { return FI.hasFluxFace(e); });
      else newest = newest.filter(function (e) { return mosaicFaceOk(e, opts); });
      var poolCapNewest = parseInt((opts && (opts.poolCap || opts.pool)) || '500', 10) || 500;
      if (shouldMixPillars(opts)) return roundRobinPillars(newest, opts);
      if (poolCapNewest && newest.length > poolCapNewest) newest = newest.slice(0, poolCapNewest);
      if (opts && opts.perfectOnly && !newest.length) {
        return buildBuf(Array.isArray(raw) ? raw : [], Object.assign({}, opts, { perfectOnly: false }));
      }
      if (opts && opts.perfectOnly) return newest;
      return prioritizePerfect13(newest, opts);
    }
    if (pillar || query) {
      var pq = shuf(raw.slice());
      var poolCapPQ = parseInt((opts && (opts.poolCap || opts.pool)) || '500', 10) || 500;
      if (poolCapPQ && pq.length > poolCapPQ) pq = pq.slice(0, poolCapPQ);
      if (opts && opts.perfectOnly) return pq;
      return prioritizePerfect13(pq, opts);
    }
    var byp = {};
    raw.forEach(function (e) { (byp[pof(e.id)] = byp[pof(e.id)] || []).push(e); });
    var pills = Object.keys(byp);
    shuf(pills);
    pills.forEach(function (p) { byp[p].sort(byNewestQuality); });
    var out = [], cur = {}, seenImg = {}, added = true;
    var poolCap = parseInt((opts && (opts.poolCap || opts.pool)) || '500', 10) || 500;
    var mixing = shouldMixPillars(opts);
    pills.forEach(function (p) {
      var cap = pillarCap(p, poolCap, pills.length, mixing);
      if (byp[p].length > cap) byp[p] = byp[p].slice(0, cap);
      cur[p] = 0;
    });
    while (added && out.length < poolCap) {
      added = false;
      for (var pi = 0; pi < pills.length && out.length < poolCap; pi++) {
        var pill = pills[pi], lst = byp[pill];
        while (cur[pill] < lst.length) {
          var e = lst[cur[pill]++];
          var ik = mosaicImgKey(e);
          if (ik && seenImg[ik]) continue;
          if (ik) seenImg[ik] = 1;
          out.push(e);
          added = true;
          break;
        }
      }
    }
    out = dedupeMosaicImgs(out, poolCap);
    if (window.PULSE_DEFAULTS && window.PULSE_DEFAULTS.length) {
      var defs = window.PULSE_DEFAULTS.slice();
      if (pillar) defs = defs.filter(function (e) { return pof(e.id) === pillar; });
      if (query) defs = defs.filter(function (e) { return String(e.question || '').toLowerCase().indexOf(query) >= 0; });
      if (defs.length) out = roundRobinPillars(defs.concat(out), opts);
    }
    if (poolCap && out.length > poolCap) out = out.slice(0, poolCap);
    if (opts && opts.perfectOnly) {
      if (!out.length && raw && raw.length) {
        var relaxed = Object.assign({}, opts, { perfectOnly: false });
        return buildBuf(raw, relaxed);
      }
      return out;
    }
    return prioritizePerfect13(out, opts);
  }

  function mount(el, opts) {
    if (!el) return null;
    opts = opts || {};
    if (opts.endlessLoop !== false) opts.endlessLoop = true;
    if (opts.perfectFirst !== false) opts.perfectFirst = true;
    if (opts.poolCap == null && opts.pool == null) {
      opts.poolCap = (opts.pillar || opts.topicsOnly) ? FULL_PILLAR_POOL : 500;
    }
    if (opts.rotateTiles !== false && !opts.query) opts.rotateTiles = true;
    if (opts.topicsOnly) {
      opts.mixPillars = opts.mixPillars !== false;
      opts.recent = opts.recent || FULL_PILLAR_POOL;
      opts.poolCap = opts.poolCap || FULL_PILLAR_POOL;
      opts.recentFaceOnly = opts.recentFaceOnly !== false;
    } else if (!opts.pillar && !opts.currentEvents && opts.mixPillars !== false) {
      opts.mixPillars = true;
    }
    if (opts.pillar && !opts.recent) opts.recent = FULL_PILLAR_POOL;
    ensureCss();
    ensureHubCss();
    document.body.classList.add('pulse-mosaic-page');
    if (opts.pillar === 'ce') {
      document.body.style.background = 'radial-gradient(1100px 560px at 82% -6%, rgba(215,38,61,.28), transparent 60%), linear-gradient(165deg,#0a0806 0%,#1a0a0c 55%,#0a0806 100%)';
      document.body.style.backgroundAttachment = 'fixed';
    }

    if (el.__pulseHome) {
      if (el.__pulseHome.io) el.__pulseHome.io.disconnect();
      if (el.__pulseHome.searchTimer) clearTimeout(el.__pulseHome.searchTimer);
    }

    el.classList.add('mag-mosaic', 'pulse-home-mosaic');
    if (opts.topicsOnly) el.classList.add('pulse-topics-mosaic');
    el.innerHTML = hubHtml(opts);

    var placedSz = [];
    function _w(s) { return (s === 'big' || s === 'wide' || s === 'mm-long') ? 2 : 1; }
    function _h(s) { return s === 'mm-long' ? 3 : ((s === 'big' || s === 'tall') ? 2 : 1); }
    function nextSize() {
      var cols = Math.max(2, Math.round((el.clientWidth || 1200) / 245));
      var left = placedSz[placedSz.length - 1];
      var up = placedSz[placedSz.length - cols];
      var s, t = 0;
      do { s = SZ[Math.floor(Math.random() * SZ.length)]; t++; }
      while (t < 16 && ((left && _h(s) === _h(left)) || (up && _w(s) === _w(up))));
      placedSz.push(s);
      return s;
    }
    function tileSizeFor(c) {
      placedSz.push(''); // uniform rectangle tiles, all same size (owner 2026-07-06)
      return '';
    }
    function ftile(c, eager) {
      var z = tileSizeFor(c);
      var src = mosaicSrc(c);
      var title = entryTitle(c);
      var imgHtml = FI.mosaicImgTag ? FI.mosaicImgTag(src, title, !!eager) : '';
      var lazy = opts.lazyTiles !== false && !eager;
      var titleHtml = '<h4>' + esc(title) + '</h4>';
      var scrim = '<div class="mm-scrim"></div>';
      var lazyCls = lazy ? ' mm-lazy mm-img-pending' : '';
      var neon = neonTrimClass(c);
      var neonCls = neon ? ' ' + neon : '';
      var dataLazy = lazy ? ' data-mosaic-lazy="1"' : ' data-mosaic-loaded="1"';
      var dataNeon = neon ? ' data-neon-trim="1"' : '';
      return '<a class="mm' + lazyCls + neonCls + ' ' + z + '" href="/knowledge/' + encodeURIComponent(c.id) + '" data-face-bound="1" data-mosaic-src="' + esc(src) + '"' + dataLazy + dataNeon + '>'
        + imgHtml
        + scrim + '<div class="mm-txt"><span class="mm-cat">' + esc(NM[pof(c.id)] || pof(c.id).toUpperCase()) + '</span>'
        + titleHtml + '</div></a>';
    }

    var sent = document.createElement('div');
    sent.className = 'pulse-home-sentinel';
    sent.style.cssText = 'grid-column:1/-1;height:1px;';
    el.appendChild(sent);

    var state = { buf: [], bi: 0, loading: false, fetched: false, io: null, searchTimer: null, opts: opts, seeded: false, paintedTotal: 0 };
    el.__pulseHome = state;
    var hubCount = opts.hubTiles !== false ? 6 : 0;
    var FIRST_BATCH = parseInt(opts.firstBatch, 10) || visibleTileCount(el, hubCount);
    var BATCH = parseInt(opts.batch, 10) || scrollBatch(FIRST_BATCH);
    if (opts.lazyTiles !== false) opts.lazyTiles = true;
    var _libCache = {};

    function fetchLibrary(url) {
      var hit = _libCache[url];
      if (hit && (Date.now() - hit.at) < 300000) return Promise.resolve(hit.data);
      return fetch(url, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && (j.ok !== false) && (Array.isArray(j) || (j.entries && j.entries.length))) {
            _libCache[url] = { at: Date.now(), data: j };
            return j;
          }
          var cached = readLocalLibraryCache();
          if (cached && cached.length) return { ok: true, entries: cached, source: 'localStorage' };
          if (window.PULSE_DEFAULTS && window.PULSE_DEFAULTS.length) {
            return { ok: true, entries: seedEntries(window.PULSE_DEFAULTS), source: 'defaults' };
          }
          return j;
        })
        .catch(function () {
          var cached = readLocalLibraryCache();
          if (cached && cached.length) return { ok: true, entries: cached, source: 'localStorage' };
          if (window.PULSE_DEFAULTS && window.PULSE_DEFAULTS.length) {
            return { ok: true, entries: seedEntries(window.PULSE_DEFAULTS), source: 'defaults' };
          }
          return null;
        });
    }

    mosaicWarmUrls(opts).forEach(function (u) {
      prefetchMosaicApi(u);
      fetchLibrary(u);
    });

    function paint(n) {
      if (!state.buf.length) return;
      var painted = [], out = '', k = 0, guard = 0, batchImgs = {};
      var eagerFirst = (state.paintedTotal || 0) === 0;
      while (k < n && guard++ < n * 4) {
        if (!opts.endlessLoop && opts.newOnly && state.bi >= state.buf.length) break;
        if (opts.endlessLoop && state.buf.length && state.bi > 0 && state.bi % state.buf.length === 0) {
          state.buf = recycleMosaicBuf(state.buf.slice(), opts);
          state.shownImgs = {};
          state.bi = 0;
        } else if (!opts.endlessLoop && state.bi > 0 && state.bi % state.buf.length === 0) {
          if (opts.perfectFirst) state.buf = recycleMosaicBuf(state.buf.slice(), opts);
          else if (!opts.sortNewest) shuf(state.buf);
        }
        if (!state.buf.length) break;
        var c = state.buf[state.bi % state.buf.length];
        state.bi++;
        if (!c || !c.id) continue;
        if (opts.recentFaceOnly && !recentFaceOk(c)) continue;
        if (!mosaicFaceOk(c, opts)) continue;
        var ik = mosaicImgKey(c);
        if (ik && (batchImgs[ik] || (state.shownImgs && state.shownImgs[ik]))) continue;
        if (ik) batchImgs[ik] = 1;
        painted.push(c);
        out += ftile(c, eagerFirst);
        k++;
      }
      if (!state.shownImgs) state.shownImgs = {};
      Object.keys(batchImgs).forEach(function (k) { state.shownImgs[k] = 1; });
      if (out) {
        sent.insertAdjacentHTML('beforebegin', out);
        if (opts.lazyTiles !== false) {
          hydrateMosaic(el, eagerFirst ? FIRST_BATCH : 0);
        } else bindFaceTiles(el);
        state.paintedTotal = (state.paintedTotal || 0) + painted.length;
      }
      preloadAhead(painted.concat(state.buf.slice(state.bi, state.bi + BATCH + 4)), eagerFirst ? 20 : 10);
      requestAnimationFrame(function () {
        var r = sent.getBoundingClientRect();
        if (r.top < window.innerHeight + 920 && !state.loading && state.fetched) more();
      });
    }

    function reloadBuffer() {
      state.buf = [];
      state.bi = 0;
      state.fetched = false;
      placedSz = [];
      [].slice.call(el.querySelectorAll('a.mm[href^="/knowledge/"]')).forEach(function (n) { n.remove(); });
      more();
    }

    function fetchMixedFluxPool(done) {
      // FAST PATH (owner 2026-07-06): one prebuilt pool file instead of 43 per-pillar calls (~20s → ~0.1s).
      fetchLibrary('/mosaic-pool.json?v=' + Math.floor(Date.now() / 3600000)).then(function (pj) {
        var parr = Array.isArray(pj) ? pj : ((pj && (pj.entries || pj.items)) || null);
        if (parr && parr.length > 40) { var b = buildBuf(parr, opts); if (b && b.length) { done(b); return; } }
        fetchMixedFluxPoolFanout(done);
      }).catch(function () { fetchMixedFluxPoolFanout(done); });
    }
    function fetchMixedFluxPoolFanout(done) {
      var poolCap = parseInt(opts.poolCap || opts.pool || '500', 10) || 500;
      var PER_PILLAR = parseInt(opts.perPillar || String(Math.max(40, Math.ceil(poolCap / 4))), 10) || 40;
      var merged = {}, list = [], pills = Object.keys(NM), batch = 16, idx = 0;
      function add(arr) {
        (arr || []).forEach(function (e) {
          e = normEntry(e);
          if (!e || merged[e.id]) return;
          if (opts.perfectOnly && !scrubbedPerfect13Ok(e)) return;
          merged[e.id] = 1;
          list.push(e);
        });
      }
      function runBatch() {
        if (idx >= pills.length) { done(buildBuf(list, opts)); return; }
        var chunk = pills.slice(idx, idx + batch);
        idx += batch;
        Promise.all(chunk.map(function (p) {
          var per = (FI.mixedFetchCap && FI.mixedFetchCap(p)) || PER_PILLAR;
          return fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=' + per + '&pillar=' + encodeURIComponent(p));
        })).then(function (rows) {
          rows.forEach(function (j) {
            if (!j) return;
            var arr = (Array.isArray(j) ? j : (j.entries || j.items || [])).slice();
            arr.sort(function (a, b) {
              return (b.cover_src === 'flux' ? 1 : 0) - (a.cover_src === 'flux' ? 1 : 0)
                || (Number(b.quality_score) || 0) - (Number(a.quality_score) || 0);
            });
            add(arr);
          });
          runBatch();
        }).catch(function () { runBatch(); });
      }
      runBatch();
    }

    function fetchEntries(done) {
      if (opts.topicTilesOnly) { done([]); return; } // owner 2026-07-06: topics page shows only topic tiles (extraTiles), no Q&As
      if (opts.fluxFirst && !opts.pillar && !opts.query && !opts.newOnly && !opts.currentEvents) {
        fetchMixedFluxPool(done);
        return;
      }
      if (opts.pillar && (opts.perfectOnly || opts.sortNewest)) {
        var pillarCap = poolFetchCap(opts);
        var sortFlux = function (arr) {
          arr.sort(function (a, b) {
            return (b.cover_src === 'flux' ? 1 : 0) - (a.cover_src === 'flux' ? 1 : 0)
              || (Number(b.quality_score) || 0) - (Number(a.quality_score) || 0);
          });
          return arr;
        };
        var pillarFanout = function () {
          fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=' + pillarCap + '&pillar=' + encodeURIComponent(opts.pillar) + '&sort=ts')
            .then(function (j) { done(buildBuf(sortFlux((Array.isArray(j) ? j : (j.entries || j.items || [])).slice()), opts)); })
            .catch(function () { done([]); });
        };
        // FAST PATH (owner 2026-07-06): prebuilt per-pillar file instead of the ~2.8s library-list call.
        fetchLibrary('/mosaic-pool-' + encodeURIComponent(opts.pillar) + '.json?v=' + Math.floor(Date.now() / 3600000))
          .then(function (pj) {
            var parr = Array.isArray(pj) ? pj : ((pj && (pj.entries || pj.items)) || null);
            if (parr && parr.length) { var b = buildBuf(sortFlux(parr.slice()), opts); if (b && b.length) { done(b); return; } }
            pillarFanout();
          })
          .catch(pillarFanout);
        return;
      }
      var recent = parseInt(opts.recent || '50000', 10) || 50000;
      if (opts.newOnly) {
        var days = parseInt(opts.newDays, 10) || 14;
        var cap = Math.min(recent, 40000);
        var recentUrls = [
          '/.netlify/functions/pulse-machine-library-list?recent=' + cap + '&newOnly=1&days=' + days + '&sort=ts',
          '/.netlify/functions/pulse-machine-library-list?recent=' + cap + '&tag=pulse-recent&sort=ts'
        ];
        var fallbackUrl = '/.netlify/functions/pulse-machine-library-list?recent=' + Math.min(cap, 500) + '&sort=ts';
        Promise.all(recentUrls.map(function (u) {
          return fetchLibrary(u).catch(function () { return []; });
        })).then(function (rows) {
          var merged = {}, list = [];
          rows.forEach(function (j) {
            (Array.isArray(j) ? j : (j.entries || j.items || [])).forEach(function (e) {
              if (e && e.id && !merged[e.id]) { merged[e.id] = 1; list.push(e); }
            });
          });
          var built = buildBuf(list, opts);
          if (built.length) { done(built); return; }
          return fetchLibrary(fallbackUrl)
            .then(function (j2) {
              done(buildBuf(Array.isArray(j2) ? j2 : (j2.entries || j2.items || []), opts));
            });
        }).catch(function () { done([]); });
        return;
      }
      if (opts.currentEvents) {
        var ceCap = Math.min(recent, 500);
        var ceUrls = [
          '/.netlify/functions/pulse-machine-library-list?recent=' + ceCap + '&pillar=ce&sort=ts',
          '/.netlify/functions/pulse-machine-library-list?recent=' + ceCap + '&tag=current-events&sort=ts'
        ];
        Promise.all(ceUrls.map(function (u) {
          return fetchLibrary(u).catch(function () { return []; });
        })).then(function (rows) {
          var merged = {}, list = [];
          rows.forEach(function (j) {
            (Array.isArray(j) ? j : (j.entries || j.items || [])).forEach(function (e) {
              if (e && e.id && !merged[e.id]) { merged[e.id] = 1; list.push(e); }
            });
          });
          done(buildBuf(list, opts));
        });
        return;
      }
      if (opts.sortNewest) {
        fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=' + Math.min(recent, 40000))
          .then(function (j) {
            done(buildBuf(Array.isArray(j) ? j : (j.entries || j.items || []), opts));
          })
          .catch(function () { done([]); });
        return;
      }
      var merged = {}, list = [];
      function add(arr) {
        (arr || []).forEach(function (e) {
          if (!e || !e.id || merged[e.id]) return;
          merged[e.id] = 1;
          list.push(e);
        });
      }
      if (opts.pillar) {
        fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=' + recent + '&pillar=' + encodeURIComponent(opts.pillar))
          .then(function (j) { done(buildBuf(Array.isArray(j) ? j : (j.entries || j.items || []), opts)); })
          .catch(function () { done([]); });
        return;
      }
      fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=' + recent)
        .then(function (j) {
          add(Array.isArray(j) ? j : (j.entries || j.items || []));
          if (!opts.allPillars && !opts.pillar && !opts.query) { done(buildBuf(list, opts)); return; }
          if (opts.pillar || opts.query) { done(buildBuf(list, opts)); return; }
          var pills = Object.keys(NM);
          var batch = 16, idx = 0;
          function runBatch() {
            if (idx >= pills.length) { done(buildBuf(list, opts)); return; }
            var chunk = pills.slice(idx, idx + batch);
            idx += batch;
            Promise.all(chunk.map(function (p) {
              return fetchLibrary('/.netlify/functions/pulse-machine-library-list?recent=25000&pillar=' + encodeURIComponent(p));
            })).then(function (rows) {
              rows.forEach(function (j) { if (j) add(j.entries || j.items || []); });
              runBatch();
            }).catch(function () { runBatch(); });
          }
          runBatch();
        })
        .catch(function () { done([]); });
    }

    function more() {
      if (state.loading) return;
      if (!opts.endlessLoop && state.fetched && opts.newOnly && state.bi >= state.buf.length) return;
      state.loading = true;
      if (state.fetched) { paint(BATCH); state.loading = false; return; }
      fetchEntries(function (buf) {
        var nb = Array.isArray(buf) ? buf : buildBuf(buf, opts);
        state.loading = false;
        if (!nb.length) {
          state.fetched = !!state.buf.length;
          return;
        }
        if (state.buf.length && !opts.endlessLoop && (opts.newOnly || (opts.pillar && opts.sortNewest))) {
          placedSz = [];
          [].slice.call(el.querySelectorAll('a.mm[href^="/knowledge/"]')).forEach(function (n) { n.remove(); });
        }
        var hadTiles = state.seeded || state.bi > 0;
        state.buf = nb;
        if (!hadTiles) state.bi = 0;
        state.fetched = true;
        paint(hadTiles ? BATCH : FIRST_BATCH);
      });
    }

    function refreshRecent() {
      if (!opts.newOnly || state.loading) return;
      state.loading = true;
      fetchEntries(function (buf) {
        var nb = Array.isArray(buf) ? buf : buildBuf(buf, opts);
        state.loading = false;
        if (!nb.length) return;
        if (opts.endlessLoop) {
          var prevBi = state.bi;
          state.buf = nb;
          if (prevBi && state.buf.length) state.bi = prevBi % state.buf.length;
          return;
        }
        var topChanged = !state.buf.length || !state.buf[0] || !nb[0] || state.buf[0].id !== nb[0].id;
        if (topChanged || nb.length > state.buf.length) {
          state.buf = nb;
          state.bi = 0;
          placedSz = [];
          [].slice.call(el.querySelectorAll('a.mm[href^="/knowledge/"]')).forEach(function (n) { n.remove(); });
          paint(BATCH);
        }
      });
    }

    function instantSeedPaint() {
      if (!window.PULSE_DEFAULTS || !window.PULSE_DEFAULTS.length || opts.query) return;
      if (opts.perfectOnly && !opts.pillar && !opts.newOnly && !opts.currentEvents) return;
      var seed = buildBuf(seedEntries(window.PULSE_DEFAULTS.slice()), opts);
      if (!seed.length) return;
      state.buf = seed;
      state.bi = 0;
      state.seeded = true;
      paint(Math.min(FIRST_BATCH, seed.length));
    }
    instantSeedPaint();
    more();

    state.io = new IntersectionObserver(function (en) {
      if (en[0] && en[0].isIntersecting) more();
    }, { rootMargin: '600px' });
    state.io.observe(sent);

    if (opts.newOnly) {
      setInterval(refreshRecent, 180000);
    }

    if (opts.rotateTiles !== false && !opts.topicsOnly && !opts.query) {
      var __swapCycle = function () {
        if (!state.buf.length) return;
        var tiles = [].slice.call(el.querySelectorAll('a.mm[href^="/knowledge/"]')).filter(function (t) {
          return t.style.backgroundImage || t.classList.contains('mm-noimg') === false;
        });
        if (tiles.length < 8) return;
        var n = 1; // ONE tile swaps per cycle (owner 2026-07-09)
        var vis = {};
        tiles.forEach(function (t) {
          var bg = t.style.backgroundImage;
          if (bg) vis[bg] = 1;
        });
        for (var i = 0; i < n; i++) {
          var SKIP = 6;
          var elTile = tiles[SKIP + Math.floor(Math.random() * (Math.min(tiles.length, 36) - SKIP))];
          if (!elTile) continue;
          var c = state.buf[Math.floor(Math.random() * state.buf.length)];
          var tries = 0;
          while (c && vis['url("' + px(imgOf(c)) + '")'] && tries++ < 10) {
            c = state.buf[Math.floor(Math.random() * state.buf.length)];
          }
          if (!c || !mosaicFaceOk(c, opts)) continue;
          (function (tile, card) {
            tile.style.transition = 'transform .5s cubic-bezier(.45,0,.15,1)';
            tile.style.transform = 'perspective(1000px) rotateY(90deg) scale(.94)';
            setTimeout(function () {
              tile.setAttribute('href', '/knowledge/' + encodeURIComponent(card.id));
              tile.removeAttribute('data-face-bound');
              tile.removeAttribute('data-mosaic-loaded');
              tile.removeAttribute('data-img-retried');
              var src = mosaicSrc(card);
              tile.setAttribute('data-mosaic-src', src);
              var img = tile.querySelector('img.mm-img');
              if (img) {
                img.style.display = '';
                tile.classList.remove('mm-noimg');
                if (FI.bindTile) {
                  FI.bindTile(tile, card);
                } else {
                  img.src = src;
                }
              } else if (opts.lazyTiles !== false) {
                tile.classList.add('mm-lazy', 'mm-img-pending');
                tile.setAttribute('data-mosaic-lazy', '1');
                tile.style.backgroundImage = '';
                if (FI.loadLazyTile && tile.getBoundingClientRect().top < window.innerHeight + 400) {
                  FI.loadLazyTile(tile);
                } else if (FI.observeLazyTiles) {
                  FI.observeLazyTiles(tile.parentElement || el, { selector: 'a.mm[data-mosaic-lazy]:not([data-mosaic-loaded])' });
                }
              } else if (FI.bindTile) {
                FI.bindTile(tile, card);
              } else {
                tile.style.backgroundImage = "url('" + src.replace(/'/g, '%27') + "')";
              }
              var h4 = tile.querySelector('h4');
              if (h4) h4.textContent = card.question || card.title || card.id;
              var cat = tile.querySelector('.mm-cat');
              if (cat) cat.textContent = NM[pof(card.id)] || pof(card.id).toUpperCase();
              tile.style.transform = 'perspective(1000px) rotateY(0deg) scale(1)';
            }, 260);
          })(elTile, c);
        }
      };
      // first swap at 5s, then a different one every 20s (owner 2026-07-09)
      setTimeout(function () { __swapCycle(); setInterval(__swapCycle, 20000); }, 5000);
    }

    var searchInput = document.getElementById('pulse-mosaic-search');
    if (searchInput) {
      if (opts.query) searchInput.value = opts.query;
      searchInput.addEventListener('input', function () {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(function () {
          opts.query = searchInput.value.trim();
          state.opts = opts;
          reloadBuffer();
        }, 220);
      });
      if (opts.autofocusSearch !== false) setTimeout(function () { searchInput.focus(); }, 120);
    }

    return state;
  }

  function topicsFromTax() {
    var T = window.PULSE_TAX || [];
    var items = [], seen = {};
    T.forEach(function (cat) {
      (cat.subs || []).forEach(function (s) {
        (s.items || []).forEach(function (it) {
          if (!it || !it[1] || seen[it[1]]) return;
          if (/^\/knowledge(\/|$)/.test(it[1])) return;
          if (/\b(knowledge|library)\b/i.test(it[0] || '')) return;
          seen[it[1]] = 1;
          items.push({
            slug: String(it[1]).replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'x',
            href: it[1],
            label: String(it[0]).replace(/^[^A-Za-z0-9]+/, '')
          });
        });
      });
    });
    return items;
  }

  function bootFromDom() {
    document.querySelectorAll('[data-pulse-home-mosaic]').forEach(function (el) {
      if (el.__pulseHomeBoot) return;
      el.__pulseHomeBoot = true;
      var pillar = el.getAttribute('data-pillar') || '';
      var opts = {
        pillar: pillar,
        hubTiles: el.getAttribute('data-hub-tiles') !== 'false',
        searchBox: el.hasAttribute('data-search-page'),
        query: el.getAttribute('data-query') || ''
      };
      if (el.hasAttribute('data-topics-page')) {
        // owner 2026-07-06: /topics endless scroll = ONLY the topic tiles, alphabetized, repeating over and over. No Q&As.
        opts.hubTiles = false;
        opts.topicsOnly = true;
        opts.topicTilesOnly = true;   // no Q&A entries fetched/mixed
        opts.mixPillars = false;
        opts.endlessLoop = true;
        var skipHref = { '/current-events': 1, '/recent': 1, '/topics': 1, '/': 1, '/fresh': 1 };
        var topicTiles = topicsFromTax()
          .filter(function (t) { return !skipHref[t.href]; })
          .sort(function (a, b) { return String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' }); }) // alphabetize
          .map(function (t, i) {
            var cls = TOPIC_SZ[i % TOPIC_SZ.length];
            return { slug: t.slug, href: t.href, label: t.label, cls: cls, size: (cls === 'big' || cls === 'wide') ? '1.85rem' : '1.35rem' };
          });
        opts.extraTiles = topicTiles; // ONLY topics, alphabetized, looped
      }
      if (el.hasAttribute('data-recent-page')) {
        opts.hubTiles = false;
        opts.newOnly = true;
        opts.newDays = 14;
        opts.recent = 500;
        opts.poolCap = 500;
        opts.sortNewest = true;
        opts.recentFaceOnly = true;
        opts.perfectOnly = true;
        opts.endlessLoop = true;
        opts.mixPillars = true;
        opts.extraTiles = [Object.assign({}, RECENT_TILE, { label: 'Recent — New Q&As', sub: 'Newest certified · pipeline + fresh publishes' })];
      }
      if (el.hasAttribute('data-current-events-page')) {
        opts.hubTiles = false;
        opts.pillar = 'ce';
        opts.currentEvents = true;
        opts.tag = 'current-events';
        opts.sortNewest = true;
        opts.recent = 500;
        opts.poolCap = 500;
        opts.recentFaceOnly = true;
        opts.perfectOnly = true;
        opts.endlessLoop = true;
        opts.extraTiles = [{ slug: 'current-events', href: '/current-events', label: 'Current Events — Trending Now', cls: 'wide tall mm-ce-topic', size: '2rem', sub: 'All ce#### · tagged current-events' }];
      }
      if (el.hasAttribute('data-search-page')) {
        opts.perfectFirst = true;
        opts.recentFaceOnly = true;
        opts.sortNewest = true;
        opts.mixPillars = true;
        opts.poolCap = 500;
        opts.recent = 500;
        opts.endlessLoop = true;
        opts.perfectOnly = true;
      }
      if (pillar && !opts.topicsOnly && !opts.newOnly && !opts.currentEvents && !el.hasAttribute('data-search-page')) {
        opts.perfectFirst = true;
        opts.recentFaceOnly = true;
        opts.poolCap = FULL_PILLAR_POOL;
        opts.recent = FULL_PILLAR_POOL;
        opts.sortNewest = true;
        opts.endlessLoop = true;
        opts.rotateTiles = true;
      }
      if ((opts.newOnly || opts.currentEvents) && opts.endlessLoop !== false) opts.endlessLoop = true;
      mount(el, opts);
    });
    document.querySelectorAll('[data-pulse-mosaic]').forEach(function (el) {
      if (el.__pulseHomeBoot || el.__pulseMosaic) return;
      el.__pulseHomeBoot = true;
      var mp = el.getAttribute('data-pillar') || '';
      mount(el, {
        pillar: mp,
        hubTiles: false,
        endlessLoop: true,
        perfectFirst: true,
        recent: FULL_PILLAR_POOL,
        poolCap: FULL_PILLAR_POOL,
        sortNewest: true,
        recentFaceOnly: true,
        lazyTiles: true,
        rotateTiles: true,
        batch: parseInt(el.getAttribute('data-mosaic-batch') || '0', 10) || undefined
      });
    });
  }

  window.PulseHomeMosaic = {
    mount: mount,
    bootFromDom: bootFromDom,
    buildBuf: buildBuf,
    scrubbedPerfect13Ok: scrubbedPerfect13Ok,
    prioritizePerfect13: prioritizePerfect13,
    roundRobinPillars: roundRobinPillars
  };

  (function earlyMosaicPrefetch() {
    if (!document.querySelectorAll) return;
    [].slice.call(document.querySelectorAll('[data-pulse-home-mosaic][data-pillar]')).forEach(function (el) {
      var p = el.getAttribute('data-pillar');
      if (!p) return;
      prefetchMosaicApi('/.netlify/functions/pulse-machine-library-list?recent=500&pillar=' + encodeURIComponent(p) + '&sort=ts');
    });
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootFromDom);
  else bootFromDom();
})();
