/* pulse-face-img.js — flux face-card URL normalization + tile load fallback (owner 2026-07-04) */
(function () {
  'use strict';
  if (window.PulseFaceImg) return;

  var MOSAIC_W = 400;
  var PRELOAD_MAX = 24;
  var MOSAIC_FIRST_BATCH = 20;
  var MOSAIC_SCROLL_BATCH = 25;
  var MOSAIC_MOBILE_FIRST = 18;
  var MOSAIC_MOBILE_SCROLL = 20;
  var preloadSeen = {};
  var lazyIO = null;

  function isMobileMosaic() {
    return (window.innerWidth || 1200) <= 820;
  }

  function mosaicFirstBatchSize(container, opts) {
    if (isMobileMosaic()) return MOSAIC_MOBILE_FIRST;
    return MOSAIC_FIRST_BATCH;
  }

  function mosaicScrollBatchSize(firstBatch) {
    if (isMobileMosaic()) return MOSAIC_MOBILE_SCROLL;
    return MOSAIC_SCROLL_BATCH;
  }

  function mosaicScrollDelayMs() {
    return isMobileMosaic() ? 80 : 150;
  }

  function escAttr(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  /** Native lazy <img> for mosaic face-cards — avoids IO lazy-load failures on mobile Safari. */
  function mosaicImgTag(src, alt, eager) {
    if (!src) return '';
    var load = eager ? 'eager' : 'lazy';
    var prio = eager ? ' fetchpriority="high"' : '';
    var err = "var p=this.closest('a.mm');if(!p||p.getAttribute('data-img-retried')){if(p)p.classList.add('mm-noimg');this.style.display='none';return;}p.setAttribute('data-img-retried','1');var m=(p.getAttribute('href')||'').match(/\\/knowledge\\/([^/?#]+)/);if(m&&window.PulseFaceImg){PulseFaceImg.bindTile(p,{id:decodeURIComponent(m[1])});}else{if(p)p.classList.add('mm-noimg');this.style.display='none';}";
    return '<img class="mm-img img-cover" src="' + escAttr(src) + '" alt="' + escAttr(alt || '') + '" width="1200" height="400" loading="' + load + '"' + prio + ' decoding="async" onload="var p=this.closest(\'.mm\');if(p)p.classList.remove(\'mm-img-pending\')" onerror="' + err + '">';
  }

  function tileImgEl(el) {
    return el && el.querySelector ? el.querySelector('img.mm-img') : null;
  }

  function loadLazyTile(el) {
    if (!el || el.getAttribute('data-mosaic-loaded')) return;
    el.setAttribute('data-mosaic-loaded', '1');
    el.classList.remove('mm-lazy', 'mm-img-pending');
    var src = el.getAttribute('data-mosaic-src') || '';
    var img = tileImgEl(el);
    if (img) {
      if (src && (!img.getAttribute('src') || img.getAttribute('src') === '')) img.src = src;
      el.setAttribute('data-face-bound', '1');
      return;
    }
    var m = (el.getAttribute('href') || '').match(/\/knowledge\/([^/?#]+)/);
    el.setAttribute('data-face-bound', '1');
    if (src) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () {
        el.style.backgroundImage = cssUrl(src);
        el.style.backgroundPosition = 'center';   // centered — scene/object covers, don't clip subject (owner 2026-07-07)
        el.style.backgroundSize = 'cover';
        el.classList.remove('mm-noimg');
      };
      im.onerror = function () {
        if (m) bindTile(el, { id: decodeURIComponent(m[1]) });
        else el.classList.add('mm-noimg');
      };
      im.src = src;
      return;
    }
    if (m) bindTile(el, { id: decodeURIComponent(m[1]) });
  }

  function getLazyIO(rootMargin) {
    if (lazyIO) return lazyIO;
    lazyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        lazyIO.unobserve(en.target);
        loadLazyTile(en.target);
      });
    }, { rootMargin: rootMargin || '120px 0px 720px 0px', threshold: 0.01 });
    return lazyIO;
  }

  /** Observe legacy bg-only tiles; img tiles use native loading="lazy" and need no IO. */
  function observeLazyTiles(root, opts) {
    opts = opts || {};
    var scope = root || document;
    var sel = opts.selector || 'a.mm[data-mosaic-lazy]:not([data-mosaic-loaded])';
    var margin = opts.rootMargin || '120px 0px 720px 0px';
    var io = getLazyIO(margin);
    [].slice.call(scope.querySelectorAll(sel)).forEach(function (el) {
      var img = tileImgEl(el);
      if (img && img.getAttribute('src')) {
        el.setAttribute('data-mosaic-loaded', '1');
        el.classList.remove('mm-lazy', 'mm-img-pending');
        return;
      }
      io.observe(el);
    });
  }

  /** Paint first N tile images immediately; lazy-load the rest. */
  function hydrateMosaicTiles(root, opts) {
    opts = opts || {};
    var scope = root || document;
    var sel = opts.selector || 'a.mm[href^="/knowledge/"][data-mosaic-lazy]:not([data-mosaic-loaded])';
    var tiles = [].slice.call(scope.querySelectorAll(sel));
    var eager = parseInt(opts.eager, 10);
    if (isNaN(eager)) eager = mosaicFirstBatchSize(scope, opts);
    tiles.slice(0, eager).forEach(function (el) { loadLazyTile(el); });
    if (tiles.length > eager) observeLazyTiles(scope, opts);
    else if (!tiles.length) observeLazyTiles(scope, opts);
  }

  /** How many Q&A tiles fit above the fold (+ one row buffer). */
  function estimateVisibleTileCount(container, opts) {
    return mosaicFirstBatchSize(container, opts);
  }

  function scrollBatchSize(firstBatch) {
    return mosaicScrollBatchSize(firstBatch);
  }

  function pof(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }

  function facePath(id) {
    return '/assets/qa/' + encodeURIComponent(String(id || '').replace(/\.jpg$/i, '')) + '.jpg';
  }

  function badFace(u, id) {
    if (!u) return true;
    var s = String(u);
    if (/pollinations|lightbulb|pulse-logo|pulse-news|pulse-icon|pravatar|growleads|placeholder|unsplash\.com\/photo/i.test(s)) return true;
    if (/\/assets\/qa\/[^/?#]+-\d+\.jpg/i.test(s)) return true;
    if (pof(id) === 'tl' && /\/assets\/cro-cover-/.test(s)) return true;
    return false;
  }

  function imgOf(c) {
    if (!c || !c.id) return '';
    var id = c.id;
    var u = c.img || c.cover || '';
    if (badFace(u, id)) return facePath(id);
    u = String(u).replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
    if (/^\/assets\/qa\/[^/]+\.jpg$/i.test(u)) return u;
    if (/^[a-z]{2,3}\d/i.test(String(id))) return facePath(id);
    return u || facePath(id);
  }

  function px(u, w) {
    if (!u) return '';
    w = w || MOSAIC_W;
    u = String(u).replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
    if (/^\/assets\//.test(u)) return u;
    if (u[0] === '/') return u;
    if (!/^https?:\/\//.test(u)) return '';
    if (/wsrv\.nl/.test(u)) {
      if (w && w !== MOSAIC_W) return u.replace(/([?&])w=\d+/i, '$1w=' + w);
      return u;
    }
    return 'https://wsrv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//, '')) + '&w=' + w + '&output=webp&q=70&we';
  }

  /** Mosaic tile src — self-hosted direct (fast); proxy only when needed. */
  function mosaicTileSrc(c) {
    var direct = imgOf(c);
    if (/^\/assets\/qa\/[^/]+\.jpg$/i.test(direct)) return direct;
    return px(direct, MOSAIC_W);
  }

  function faceUrls(c) {
    var direct = imgOf(c);
    var urls = [];
    if (/^\/assets\//.test(direct)) {
      urls.push(direct);
      urls.push('https://pulserevops.com' + direct);
    } else {
      urls.push(px(direct, MOSAIC_W));
    }
    var canon = facePath(c.id);
    if (direct !== canon) {
      urls.push(canon);
      urls.push('https://pulserevops.com' + canon);
    }
    return urls.filter(function (u, i, a) { return u && a.indexOf(u) === i; });
  }

  function cssUrl(u) {
    return "url('" + String(u || '').replace(/'/g, '%27') + "')";
  }

  function bindTile(el, c) {
    if (!el || !c || !c.id) return;
    var urls = faceUrls(c);
    var idx = 0;
    var img = tileImgEl(el);
    if (img) {
      function nextImg() {
        if (idx >= urls.length) {
          el.classList.add('mm-noimg');
          img.removeAttribute('src');
          return;
        }
        var u = urls[idx++];
        img.onload = function () {
          el.classList.remove('mm-noimg', 'mm-img-pending');
          el.removeAttribute('data-img-retried');
          el.setAttribute('data-mosaic-src', u);
        };
        img.onerror = nextImg;
        img.src = u;
      }
      nextImg();
      return;
    }
    var im = new Image();
    im.decoding = 'async';
    function next() {
      if (idx >= urls.length) {
        el.classList.add('mm-noimg');
        el.style.backgroundImage = '';
        return;
      }
      var u = urls[idx++];
      im.onload = function () {
        el.style.backgroundImage = cssUrl(u);
        el.style.backgroundPosition = 'center';   // centered — scene/object covers, don't clip subject (owner 2026-07-07)
        el.style.backgroundSize = 'cover';
        el.classList.remove('mm-noimg');
        el.setAttribute('data-mosaic-src', u);
      };
      im.onerror = next;
      im.src = u;
    }
    next();
  }

  function bindTiles(root, selector) {
    var scope = root || document;
    observeLazyTiles(scope);
    [].slice.call(scope.querySelectorAll(selector || 'a.mm[href^="/knowledge/"]:not([data-face-bound]):not([data-mosaic-lazy])')).forEach(function (el) {
      var m = (el.getAttribute('href') || '').match(/\/knowledge\/([^/?#]+)/);
      if (!m) return;
      el.setAttribute('data-face-bound', '1');
      var inline = el.getAttribute('data-mosaic-src') || '';
      if (inline && el.style.backgroundImage && el.style.backgroundImage.indexOf(inline) >= 0) return;
      bindTile(el, { id: decodeURIComponent(m[1]) });
    });
  }

  /** Preload upcoming tile images (parallel, deduped). */
  function preloadUrls(urls) {
    (urls || []).forEach(function (u) {
      if (!u || preloadSeen[u]) return;
      preloadSeen[u] = 1;
      if (Object.keys(preloadSeen).length > 600) preloadSeen = {};
      var im = new Image();
      im.decoding = 'async';
      im.src = u;
    });
  }

  function preloadCards(cards, limit) {
    var n = limit || PRELOAD_MAX;
    var urls = [];
    (cards || []).forEach(function (c) {
      if (!c || urls.length >= n) return;
      var u = mosaicTileSrc(c);
      if (u) urls.push(u);
    });
    preloadUrls(urls);
  }

  /** Preload only the next few cards after the current scroll position. */
  function preloadAhead(cards, limit) {
    preloadCards(cards, limit || 8);
  }

  function hasFluxFace(e) {
    if (!e || !e.id || !/^[a-z]{2,3}\d/i.test(String(e.id))) return false;
    if (pof(e.id) === 'tl' && (e.img || e.cover) && /\/assets\/cro-cover-/.test(e.img || e.cover || '')) return false;
    if (e.cover_src === 'flux') return true;
    var u = e.img || e.cover || '';
    if (!u || badFace(u, e.id)) return false;
    u = String(u).replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
    if (!/^\/assets\/qa\/[^/]+\.jpg$/i.test(u)) return false;
    return u === facePath(e.id);
  }

  function cardFaceOk(e) {
    if (!e || !e.id || !/^[a-z]{2,3}\d/i.test(String(e.id))) return false;
    if (pof(e.id) === 'tl' && (e.img || e.cover) && /\/assets\/cro-cover-/.test(e.img || e.cover || '')) return false;
    if (hasFluxFace(e)) return true;
    var u = String(e.img || e.cover || imgOf(e)).replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
    return /^\/assets\/qa\/[^/?#]+\.jpg$/i.test(u) && !badFace(u, e.id);
  }

  function normEntry(e) {
    if (!e || !e.id || !/^[a-z]{2,3}\d/i.test(String(e.id))) return null;
    if (pof(e.id) === 'tl' && e.img && /\/assets\/cro-cover-/.test(e.img)) return null;
    e.img = imgOf(e);
    return e;
  }

  /** Max tl tiles in a mixed mosaic pool — prevents CRO volume from dominating homepage/search. */
  var TL_MIX_MAX = 3;
  /** Max tl rows fetched into mixed per-pillar API pulls. */
  var TL_FETCH_CAP = 12;

  function isCroCoverUrl(u) {
    return /\/assets\/cro-cover-/.test(String(u || ''));
  }

  function mosaicImgKey(c) {
    if (!c || !c.id) return '';
    return String(imgOf(c)).replace(/\?.*$/, '').toLowerCase();
  }

  /** Per-pillar cap when interleaving mixed mosaics; tl gets a hard low ceiling. */
  function pillarPoolCap(p, poolCap, pillCount, mixing) {
    poolCap = parseInt(poolCap, 10) || 500;
    pillCount = Math.max(parseInt(pillCount, 10) || 8, 1);
    if (mixing && p === 'tl') return Math.min(TL_MIX_MAX, Math.max(2, Math.floor(poolCap / 120)));
    return Math.max(6, Math.ceil(poolCap / Math.max(pillCount, 8)));
  }

  function mixedFetchCap(p) {
    return p === 'tl' ? TL_FETCH_CAP : null;
  }

  /** Drop duplicate face URLs so the grid does not look like one CRO cover repeated. */
  function dedupeMosaicEntries(list, maxLen) {
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

  window.PulseFaceImg = {
    imgOf: imgOf,
    px: px,
    mosaicTileSrc: mosaicTileSrc,
    facePath: facePath,
    faceUrls: faceUrls,
    bindTile: bindTile,
    bindTiles: bindTiles,
    loadLazyTile: loadLazyTile,
    observeLazyTiles: observeLazyTiles,
    hydrateMosaicTiles: hydrateMosaicTiles,
    mosaicFirstBatchSize: mosaicFirstBatchSize,
    mosaicScrollBatchSize: mosaicScrollBatchSize,
    mosaicScrollDelayMs: mosaicScrollDelayMs,
    isMobileMosaic: isMobileMosaic,
    estimateVisibleTileCount: estimateVisibleTileCount,
    scrollBatchSize: scrollBatchSize,
    MOSAIC_FIRST_BATCH: MOSAIC_FIRST_BATCH,
    MOSAIC_SCROLL_BATCH: MOSAIC_SCROLL_BATCH,
    preloadUrls: preloadUrls,
    preloadCards: preloadCards,
    preloadAhead: preloadAhead,
    normEntry: normEntry,
    badFace: badFace,
    hasFluxFace: hasFluxFace,
    cardFaceOk: cardFaceOk,
    isCroCoverUrl: isCroCoverUrl,
    mosaicImgKey: mosaicImgKey,
    pillarPoolCap: pillarPoolCap,
    mixedFetchCap: mixedFetchCap,
    dedupeMosaicEntries: dedupeMosaicEntries,
    TL_MIX_MAX: TL_MIX_MAX,
    TL_FETCH_CAP: TL_FETCH_CAP,
    escAttr: escAttr,
    mosaicImgTag: mosaicImgTag
  };
})();
