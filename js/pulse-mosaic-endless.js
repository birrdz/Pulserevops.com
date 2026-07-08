/* pulse-mosaic-endless.js — Q&A mosaic tiles append forever; at end of buffer, recycle (owner 2026-07-04). */
(function () {
  if (window.__pulseMosaicEndless) return;
  window.__pulseMosaicEndless = true;

  var FI = window.PulseFaceImg || {};
  function imgOf(c) { return FI.imgOf ? FI.imgOf(c) : ((c && c.img) || ('/assets/qa/' + encodeURIComponent(c.id) + '.jpg')); }
  function px(u) { return FI.px ? FI.px(u || '') : (u || ''); }
  function mosaicSrc(c) { return FI.mosaicTileSrc ? FI.mosaicTileSrc(c) : px(imgOf(c)); }
  function bindFaceTiles(root) { if (FI.bindTiles) FI.bindTiles(root, 'a.mm[href^="/knowledge/"]:not([data-face-bound])'); }
  function observeLazy(root) { if (FI.observeLazyTiles) FI.observeLazyTiles(root); }
  function preloadAhead(cards, n) { if (FI.preloadAhead) FI.preloadAhead(cards, n); else if (FI.preloadCards) FI.preloadCards(cards, n || 8); }
  function visibleTileCount(container) {
    if (FI.estimateVisibleTileCount) return FI.estimateVisibleTileCount(container, { hubTiles: 0 });
    return 12;
  }
  function scrollBatch(first) {
    if (FI.scrollBatchSize) return FI.scrollBatchSize(first);
    return Math.max(6, Math.min(14, Math.ceil((first || 12) * 0.55)));
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
  var SZ_COMPACT = ['', 'wide', '', 'tall', '', 'wide', ''];
  var POOL = 25000;

  function entryTitle(c) { return String((c && (c.question || c.title)) || (c && c.id) || ''); }
  function longTitleSize(c) {
    var n = entryTitle(c).length;
    if (n >= 88) return 'mm-long';
    if (n >= 58) return 'big';
    return '';
  }

  function entryOk(e) {
    if (!faceOk(e)) return false;
    var p = pof(e.id);
    if (p === 'tl' && e.img && /\/assets\/cro-cover-/.test(e.img)) return false;
    return true;
  }
  function prioritizeAll(list) {
    if (!list || !list.length) return list || [];
    var perfect = [], rest = [];
    list.forEach(function (e) {
      if (scrubbedPerfect13Ok(e)) perfect.push(e);
      else rest.push(e);
    });
    perfect.sort(byNewestQuality);
    rest.sort(byNewestQuality);
    return perfect.concat(rest);
  }

  function esc(s) {
    return String(s || '').replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }
  function pof(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }
  function entryTs(e) {
    return Number(e && e.ts) || parseInt(String(e && e.id || '').replace(/\D/g, ''), 10) || 0;
  }
  function faceOk(e) {
    if (FI.cardFaceOk) return FI.cardFaceOk(e);
    return !!(e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
  }
  function scrubbedPerfect13Ok(e) {
    if (!faceOk(e)) return false;
    var qs = typeof e.quality_score === 'number' ? e.quality_score : null;
    return qs != null && qs >= 13;
  }
  function byNewestQuality(a, b) {
    var ta = entryTs(a), tb = entryTs(b);
    if (ta !== tb) return tb - ta;
    return (Number(b.quality_score) || 0) - (Number(a.quality_score) || 0);
  }
  function shuf(x) {
    for (var i = x.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = x[i]; x[i] = x[j]; x[j] = t;
    }
    return x;
  }

  function roundRobinPillars(list, poolCap, mixing) {
    if (!list || !list.length) return list || [];
    poolCap = poolCap || POOL;
    mixing = mixing !== false;
    var byp = {};
    list.forEach(function (e) {
      if (!e || !e.id) return;
      var p = pof(e.id);
      (byp[p] = byp[p] || []).push(e);
    });
    var pills = Object.keys(byp);
    if (!pills.length) return [];
    shuf(pills);
    function capFor(p) {
      if (FI.pillarPoolCap) return FI.pillarPoolCap(p, poolCap, pills.length, mixing);
      if (mixing && p === 'tl') return Math.min(3, Math.max(2, Math.floor(poolCap / 120)));
      return Math.max(6, Math.ceil(poolCap / Math.max(pills.length, 8)));
    }
    function imgKey(c) {
      return FI.mosaicImgKey ? FI.mosaicImgKey(c) : String(mosaicSrc(c)).replace(/\?.*$/, '').toLowerCase();
    }
    pills.forEach(function (p) {
      byp[p].sort(byNewestQuality);
      var cap = capFor(p);
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
          var ik = imgKey(e);
          if (ik && seenImg[ik]) continue;
          if (ik) seenImg[ik] = 1;
          out.push(e);
          added = true;
          break;
        }
      }
    }
    return FI.dedupeMosaicEntries ? FI.dedupeMosaicEntries(out, poolCap) : out;
  }

  function ensureCss() {
    if (document.getElementById('pulse-mosaic-css')) return;
    var l = document.createElement('link');
    l.id = 'pulse-mosaic-css';
    l.rel = 'stylesheet';
    l.href = '/css/pulse-mosaic.css';
    document.head.appendChild(l);
  }

  function initMosaic(mm) {
    if (!mm || mm.__pulseMosaic || mm.__pulseHomeBoot) return;
    if (window.PulseHomeMosaic && window.PulseHomeMosaic.mount) {
      mm.__pulseHomeBoot = true;
      var mp = mm.getAttribute('data-pillar') || '';
      window.PulseHomeMosaic.mount(mm, {
        pillar: mp,
        hubTiles: false,
        endlessLoop: true,
        perfectFirst: true,
        recent: 25000,
        poolCap: 25000,
        sortNewest: true,
        recentFaceOnly: true,
        lazyTiles: true,
        rotateTiles: true,
        batch: parseInt(mm.getAttribute('data-mosaic-batch') || '0', 10) || undefined
      });
      return;
    }
    mm.__pulseMosaic = true;
    ensureCss();

    var pillar = mm.getAttribute('data-pillar') || '';
    var compact = mm.classList.contains('mosaic-compact');
    var szPool = compact ? SZ_COMPACT : SZ;
    var batch = parseInt(mm.getAttribute('data-mosaic-batch') || (compact ? '18' : '36'), 10) || 24;
    var placedSz = [];

    function _w(s) { return (s === 'big' || s === 'wide' || s === 'mm-long') ? 2 : 1; }
    function _h(s) { return s === 'mm-long' ? 3 : ((s === 'big' || s === 'tall') ? 2 : 1); }
    function nextSize() {
      if (compact) return szPool[placedSz.length % szPool.length];
      var cols = Math.max(2, Math.round(((mm.clientWidth || 1200)) / 245));
      var left = placedSz[placedSz.length - 1];
      var up = placedSz[placedSz.length - cols];
      var s, t = 0;
      do { s = szPool[Math.floor(Math.random() * szPool.length)]; t++; }
      while (t < 16 && ((left && _h(s) === _h(left)) || (up && _w(s) === _w(up))));
      placedSz.push(s);
      return s;
    }
    function tileSizeFor(c) {
      var forced = longTitleSize(c);
      if (forced) { placedSz.push(forced); return forced; }
      return nextSize();
    }
    function ftile(c, eager) {
      if (!entryOk(c)) return '';
      var z = tileSizeFor(c);
      var src = mosaicSrc(c);
      var title = entryTitle(c);
      var imgHtml = FI.mosaicImgTag ? FI.mosaicImgTag(src, title, !!eager) : '';
      var lazyCls = eager ? '' : ' mm-lazy mm-img-pending';
      var dataLazy = eager ? ' data-mosaic-loaded="1"' : ' data-mosaic-lazy="1"';
      return '<a class="mm' + lazyCls + ' ' + z + '" href="/knowledge/' + encodeURIComponent(c.id) + '" data-face-bound="1" data-mosaic-src="' + esc(src) + '"' + dataLazy + '>'
        + imgHtml
        + '<div class="mm-scrim"></div><div class="mm-txt"><span class="mm-cat">' + esc(NM[pof(c.id)] || '') + '</span>'
        + '<h4>' + esc(title) + '</h4></div></a>';
    }

    var sent = document.createElement('div');
    sent.className = 'pulse-mosaic-sentinel';
    sent.style.cssText = 'grid-column:1/-1;height:1px;';
    mm.appendChild(sent);

    var buf = [], bi = 0, loading = false, fetched = false;
    var FIRST_BATCH = visibleTileCount(mm);
    var BATCH = scrollBatch(FIRST_BATCH);

    function paint(n, eagerAll) {
      if (!buf.length) return;
      var painted = [], out = '', k = 0, guard = 0;
      while (k < n && guard++ < n * 4) {
        if (bi > 0 && bi % buf.length === 0) {
          buf = pillar ? prioritizeAll(buf.slice()) : roundRobinPillars(buf.slice(), POOL, true);
          bi = 0;
        }
        var c = buf[bi % buf.length];
        bi++;
        if (!c || !c.id || !entryOk(c)) continue;
        var t = ftile(c, !!eagerAll || k < 6);
        if (!t) continue;
        painted.push(c);
        out += t;
        k++;
      }
      preloadAhead(buf.slice(bi, bi + BATCH + 4), 8);
      if (out) { sent.insertAdjacentHTML('beforebegin', out); observeLazy(mm); }
    }

    function buildBuf(raw) {
      if (pillar) raw = raw.filter(function (e) { return pof(e.id) === pillar; });
      raw = raw.map(function (e) { return normEntry(e); }).filter(function (e) {
        return entryOk(e);
      });
      if (pillar) {
        return prioritizeAll(raw);
      }
      return roundRobinPillars(raw, POOL, true);
    }

    function more() {
      if (loading) return;
      loading = true;
      if (fetched) { paint(BATCH, false); loading = false; return; }
      var url = '/.netlify/functions/pulse-machine-library-list?recent=35000';
      if (pillar) url += '&pillar=' + encodeURIComponent(pillar);
      fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var a = Array.isArray(j) ? j : (j.entries || j.items || []);
        buf = buildBuf(a);
        bi = 0;
        fetched = true;
        paint(FIRST_BATCH, true);
        loading = false;
      }).catch(function () { loading = false; });
    }

    if (window.PULSE_DEFAULTS && PULSE_DEFAULTS.length && !pillar) {
      buf = buildBuf(PULSE_DEFAULTS.slice());
      bi = 0;
      fetched = true;
      paint(batch);
    }
    more();
    var io = new IntersectionObserver(function (en) {
      if (en[0] && en[0].isIntersecting) more();
    }, { rootMargin: '600px' });
    io.observe(sent);

    setInterval(function () {
      if (!buf.length) return;
      var tiles = [].slice.call(mm.querySelectorAll('a.mm[href^="/knowledge/"]')).filter(function (t) {
        return t.style.backgroundImage || (t.querySelector('img.mm-img') && t.querySelector('img.mm-img').getAttribute('src'));
      });
      if (tiles.length < 6) return;
      var n = 2 + Math.floor(Math.random() * 2);
      var vis = {};
      tiles.forEach(function (t) {
        var im = t.querySelector('img.mm-img');
        var key = im && im.getAttribute('src') ? im.getAttribute('src') : t.style.backgroundImage;
        if (key) vis[key] = 1;
      });
      for (var i = 0; i < n; i++) {
        var SKIP = Math.min(4, tiles.length - 1);
        var elTile = tiles[SKIP + Math.floor(Math.random() * (tiles.length - SKIP))];
        if (!elTile) continue;
        var c = buf[Math.floor(Math.random() * buf.length)];
        var tries = 0;
        while (c && (!scrubbedPerfect13Ok(c) || vis[mosaicSrc(c)] || vis['url("' + px(imgOf(c)) + '")']) && tries++ < 12) {
          c = buf[Math.floor(Math.random() * buf.length)];
        }
        if (!c || !scrubbedPerfect13Ok(c)) continue;
        (function (tile, card) {
          tile.style.transition = 'transform .5s ease';
          tile.style.transform = 'perspective(900px) rotateY(90deg)';
          setTimeout(function () {
            tile.setAttribute('href', '/knowledge/' + encodeURIComponent(card.id));
            tile.removeAttribute('data-face-bound');
            if (FI.bindTile) FI.bindTile(tile, card);
            else tile.style.backgroundImage = "url('" + px(imgOf(card)) + "')";
            var h4 = tile.querySelector('h4');
            if (h4) h4.textContent = card.question || card.title || '';
            var cat = tile.querySelector('.mm-cat');
            if (cat) cat.textContent = NM[pof(card.id)] || '';
            tile.style.transform = 'perspective(900px) rotateY(0deg)';
          }, 260);
        })(elTile, c);
      }
    }, 10000);
  }

  function scan() {
    document.querySelectorAll('[data-pulse-mosaic]').forEach(initMosaic);
    var auto = document.getElementById('magMosaic');
    if (auto && auto.hasAttribute('data-pulse-mosaic-auto')) initMosaic(auto);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
