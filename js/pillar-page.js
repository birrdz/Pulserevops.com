/* PULSE pillar-page renderer — shared by /knowledge, /sales-trainings,
 * /industry-kpis, /tech-stacks, /graphics, /sales-book-summaries,
 * /electronic-reviews, /revenue-architecture, /go-to-market-playbooks.
 *
 * Each page sets `window.PILLAR_DEFAULT` (e.g. "st") before this script loads.
 * "all" = the universal /knowledge hub (shows entries from every pillar).
 */
(function(){
  'use strict';

  var DEFAULT_PILLAR = (window.PILLAR_DEFAULT || 'all');

  var entries = [];
  var view = [];
  // Tag cache (id -> tags[]). The full-library fetch uses mini=1, which returns
  // id+question ONLY (no tags) to keep the payload small. The tag-based Sports
  // pillar then matched ZERO entries once the tagless mini set replaced `entries`,
  // making /knowledge's Sports filter look empty. We remember tags from every
  // full-record fetch and re-attach them after any reload so tag filtering survives.
  var tagCache = {};
  function rememberTags(arr){
    if (!Array.isArray(arr)) return;
    for (var i = 0; i < arr.length; i++){
      var e = arr[i];
      if (e && e.id && Array.isArray(e.tags) && e.tags.length) tagCache[e.id] = e.tags;
    }
  }
  function applyTags(arr){
    if (!Array.isArray(arr)) return arr;
    for (var i = 0; i < arr.length; i++){
      var e = arr[i];
      if (e && e.id && !(Array.isArray(e.tags) && e.tags.length) && tagCache[e.id]) e.tags = tagCache[e.id];
    }
    return arr;
  }
  // One-time prefetch of the Sports pillar's tag-matched entries (full records,
  // WITH tags) via the server's exact-tag filter. The Sports tags spread across
  // q#### ids that can fall outside the recent window, so we pull them directly
  // by the lead tags. Populates tagCache so the Sports chip always resolves.
  var sportsPrefetched = false;
  function prefetchSportsTags(){
    if (sportsPrefetched) return;
    sportsPrefetched = true;
    var leadTags = ['nil','sports','football'];
    leadTags.forEach(function(t){
      fetch('/.netlify/functions/pulse-machine-library-list?tag=' + encodeURIComponent(t) + '&recent=5000', { cache: 'default' })
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){
          if (d && Array.isArray(d.entries) && d.entries.length){
            rememberTags(d.entries);
            applyTags(entries);
            try { render(); } catch(_e){}
          }
        })
        .catch(function(){});
    });
  }
  var pillar = DEFAULT_PILLAR;
  var query = '';
  var page = 1;
  var PER_PAGE = 30;
  // Authoritative chip counts from pulse-library-pulse — always reflect the
  // TRUE library totals even before/while universal feed is still loading.
  var trueCounts = null; // {all, q, st, ik, tk, gb, bs, er, ra, gp}
  // Full library loaded? false until phase 2 (recent=12000) completes —
  // status bar shows a "loading rest of library" pill during the gap.
  var fullLibraryLoaded = false;
  // Real per-pillar totals + last-24h-new counts (so every chip shows its true
  // count before any click, and pillars with new entries highlight green).
  var pillarTotals = null, pillarNew24 = {};
  (function(){
    try{
      fetch('/.netlify/functions/pulse-pillar-counts').then(function(r){return r.json();}).then(function(j){
        if(j && j.ok){ pillarTotals = j.total || {}; pillarNew24 = j.new24 || {}; if(!query.trim()){ try{ buildFilters(null); }catch(e){} } }
      }).catch(function(){});
    }catch(e){}
  })();

  // Pillars list — Sports REPLACED Graphics as 9th pillar (2026-06-03).
  // Sports uses a TAG-based match (entries live under q#### ids but carry
  // 'sports'/'nil'/'football'/'mbb'/'wbb' tags), while every other pillar
  // matches on an ID-prefix regex. The applyFilter logic handles both.
  var PILLARS = [
    { key: 'all',    label: 'All',           re: /./ },
    { key: 'q',      label: '📚 Knowledge',  re: /^q\d+$/i },
    { key: 'st',     label: '🎓 Trainings',  re: /^st\d+$/i },
    { key: 'ik',     label: '📊 KPIs',       re: /^ik\d+$/i },
    { key: 'tk',     label: '🧰 Tech Stacks',re: /^tk\d+$/i },
    { key: 'sports', label: '🏈 Sports',     tag: /^(sports|nil|football|mbb|wbb|college-sports|college-nil|nil-gtm|nil-business)$/i },
    { key: 'bs',     label: '📖 Books',      re: /^bs\d+$/i },
    { key: 'er',     label: '⭐ Reviews',    re: /^er\d+$/i },
    { key: 'ra',     label: '🏗️ RevArch',    re: /^ra\d+$/i },
    { key: 'gp',     label: '🗺️ GTM',        re: /^gp\d+$/i },
    { key: 'fr',     label: '🏪 Franchises', re: /^fr\d+$/i },
    { key: 'ca',     label: '🚗 Cars',       re: /^ca\d+$/i },
    { key: 'tn',     label: '🏘️ Towns',      re: /^tn\d+$/i },
    { key: 'sc',     label: '🏫 Schools',    re: /^sc\d+$/i },
    { key: 'nl',     label: '🌃 Nightlife',  re: /^nl\d+$/i },
    { key: 'dn',     label: '🍽️ Dining',     re: /^dn\d+$/i },
    { key: 'bt',     label: '⛵ Boats',       re: /^bt\d+$/i },
    { key: 'mv',     label: '🎬 Movies',     re: /^mv\d+$/i },
    { key: 'wl',     label: '🧘 Wellness',   re: /^wl\d+$/i },
    { key: 'tv',     label: '✈️ Travel',     re: /^tv\d+$/i },
    { key: 'rs',     label: '🌴 Resorts',    re: /^rs\d+$/i },
    { key: 'es',     label: '🏡 Estates',    re: /^es\d+$/i },
    { key: 'cl',     label: '⛳ Clubs',       re: /^cl\d+$/i },
    { key: 'lv',     label: '🛋 Living',      re: /^lv\d+$/i },
    { key: 'ev',     label: '🎟 Events',      re: /^ev\d+$/i },
    { key: 'sy',     label: '👗 Style',       re: /^sy\d+$/i },
    { key: 'ga',     label: '🥂 Gatherings', re: /^ga\d+$/i },
    { key: 'gm',     label: '🎮 Gaming',     re: /^gm\d+$/i },
    { key: 'sk',     label: '🎯 Skill Drills', re: /^sk\d+$/i },
    { key: 'sp',     label: '🎤 Speeches',   re: /^sp\d+$/i },
    { key: 'tl',     label: '🛠️ Tools',      re: /^tl\d+$/i },
    { key: 'cg',     label: '🧭 Coaching',   re: /^cg\d+$/i },
    { key: 'co',     label: '🃏 Collectibles', re: /^co\d+$/i },
    { key: 'aq',     label: '🐠 Aquariums', re: /^aq\d+$/i },
    { key: 'tc',     label: '📶 Telco', re: /^tc\d+$/i },
    { key: 'hf',     label: '🏈 HS Football Recruiting', re: /^hf\d+$/i },
    { key: 'ai',     label: '🤖 AI Infrastructure', re: /^ai\d+$/i },
    { key: 'pt',     label: '🐾 Pets',       re: /^pt\d+$/i },
    { key: 'sw',     label: '💻 Software',   re: /^sw\d+$/i },
    { key: 'ce',     label: '📰 Current Events', re: /^ce\d+$/i },
  ];
  // Keep "All" pinned first, then order every pillar pill alphabetically by its
  // display name (ignoring the leading emoji).
  (function(){
    var head = PILLARS[0];
    var rest = PILLARS.slice(1).sort(function(a, b){
      var an = a.label.replace(/^[^A-Za-z]+/, '').toLowerCase();
      var bn = b.label.replace(/^[^A-Za-z]+/, '').toLowerCase();
      return an < bn ? -1 : an > bn ? 1 : 0;
    });
    PILLARS = [head].concat(rest);
  })();
  // 2026-06-25 FIX: every entry routes through /knowledge/<id> (the only answer
  // route that always resolves). Pretty pillar paths like /style/<id> 404 because
  // a same-named static file (style.html) shadows them at the edge, so a forced
  // /style/* redirect can't win. /knowledge/<id> has no such collision and the
  // entry renderer resolves any id regardless of pillar.
  var KNOW = '/knowledge/';
  var PILLAR_ROUTE = {
    q: KNOW, st: KNOW, ik: KNOW, tk: KNOW, gb: KNOW, bs: KNOW, er: KNOW, ra: KNOW,
    gp: KNOW, fr: KNOW, ca: KNOW, tn: KNOW, sc: KNOW, nl: KNOW, dn: KNOW, bt: KNOW,
    mv: KNOW, wl: KNOW, dr: KNOW, tv: KNOW, rs: KNOW, es: KNOW, cl: KNOW, lv: KNOW,
    ev: KNOW, sy: KNOW, ga: KNOW, gm: KNOW, sk: KNOW, sp: KNOW, tl: KNOW, cg: KNOW,
    co: KNOW, aq: KNOW, hf: KNOW, pt: KNOW, sw: KNOW, tc: KNOW, sports: KNOW,
  };
  // Hub/landing URL for each pillar — clicking a chip navigates here so the
  // hero headline/description always matches the pillar being viewed.
  var PILLAR_PAGE = {
    all:    '/knowledge',           q:      '/knowledge',
    st:     '/sales-trainings',     ik:     '/industry-kpis',
    tk:     '/tech-stacks',         sports: '/sports',
    bs:     '/sales-book-summaries',er:     '/electronic-reviews',
    ra:     '/revenue-architecture',gp:     '/go-to-market-playbooks',
    fr:     '/franchises',          ca:     '/cars',
    tn:     '/towns',               sc:     '/schools',
    nl:     '/nightlife',           dn:     '/dining',
    bt:     '/boats',
    mv:     '/movies',             wl:     '/wellness',
    dr:     '/drills',
    tv:     '/travel',             rs:     '/resorts',
    es:     '/estates',            cl:     '/clubs',
    lv:     '/living',             ev:     '/events',
    sy:     '/style',              ga:     '/gatherings',
    gm:     '/gaming',
    sk:     '/skills',
    sp:     '/speeches',
    tl:     '/tools',
    cg:     '/coaching',
    co:     '/collectibles',
    aq:     '/aquariums',
    tc:     '/telco',
    hf:     '/highschool-football-recruiting',
    pt:     '/pets',
    sw:     '/software',
  };
  var FOOTER_LABELS = {
    knowledge:'Knowledge', sales_trainings:'Trainings', industry_kpis:'KPIs',
    tech_stacks:'Tech Stacks', sports:'Sports', book_summaries:'Books',
    electronic_reviews:'Reviews', revenue_architecture:'RevArch', gtm_playbooks:'GTM Playbooks',
    franchises:'Franchises', cars:'Cars'
  };
  var FOOTER_ORDER = ['knowledge','sales_trainings','industry_kpis','tech_stacks','sports','book_summaries','electronic_reviews','revenue_architecture','gtm_playbooks','franchises','cars'];

  function esc(s){ return String(s||'').replace(/[<>&"]/g, function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }

  function hlQuery(text, q){
    if (!q) return esc(text);
    var safe = esc(text);
    var parts = q.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return safe;
    var re = new RegExp('(' + parts.map(function(p){
      return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  function prefersReducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_e){ return false; }
  }

  // Pulse-branded loading state — used both for initial paint and when the
  // grid renders zero entries while phase-2 is still in flight. Far more
  // visible than a thin spinner; reads as "active fetching" not "broken".
  function loadingMarkup(label){
    var skel = '';
    for (var i = 0; i < 9; i++) skel += '<div class="skel-card"></div>';
    return '<div class="loading">' +
      '<div class="pulse-logo"><span class="pulse-dot"></span></div>' +
      '<div class="pulse-label">' + esc(label || 'Loading') + '<span class="pulse-dots">...</span></div>' +
      '<div class="pulse-skeleton">' + skel + '</div>' +
    '</div>';
  }
  function fmtN(n){ return typeof n === 'number' ? n.toLocaleString() : '…'; }
  function relTime(ts){
    if (!ts || typeof ts !== 'number') return '';
    var d = (Date.now() - ts) / 60000;
    if (d < 1) return 'just now';
    if (d < 60) return Math.max(1, Math.round(d)) + 'm ago';
    if (d < 1440) return Math.round(d/60) + 'h ago';
    if (d < 43200) return Math.round(d/1440) + 'd ago';
    return Math.round(d/43200) + 'mo ago';
  }
  function pillarOf(id){
    if (!id) return null;
    if (/^vq_/i.test(id)) return 'q';
    var m = id.match(/^([a-z]+)\d/i);
    return m ? m[1].toLowerCase() : null;
  }
  function routeOf(id){
    var p = pillarOf(id);
    return (p && PILLAR_ROUTE[p]) ? PILLAR_ROUTE[p] : '/knowledge/';
  }

  // ─── Stale-while-revalidate cache ───
  // Returning visitors see entries in ~0ms from localStorage, then we
  // refresh in the background. Critical for mobile UX — without this, a
  // first paint can take 3-6s on a slow connection and the page looks
  // broken/empty until then.
  var LS_KEY = 'pulse.library.entries.v3';
  var LS_TTL_MS = 30 * 60 * 1000; // 30 min cache freshness ceiling
  function loadFromCache(){
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var blob = JSON.parse(raw);
      if (!blob || !Array.isArray(blob.entries) || !blob.ts) return null;
      if (Date.now() - blob.ts > LS_TTL_MS) return null;
      return blob.entries;
    } catch(_e){ return null; }
  }
  function saveToCache(arr){
    try {
      // Cap at ~25000 — library is 16k+; the in-memory `entries` holds them all,
      // this only bounds the localStorage warm-cache (falls back to slim on quota).
      var capped = (arr || []).slice(0, 25000);
      localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), entries: capped }));
    } catch(_e){
      try {
        var slim = (arr || []).slice(0, 4000);
        localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), entries: slim }));
      } catch(_e2){}
    }
  }

  // Minimum show time for the Pulse loading animation. Without this, fast
  // cache hits flash past in <100ms and the animation is invisible. Owner
  // wants the animation to be visible on EVERY pillar (not just slow ones).
  var FIRST_PAINT_MIN_MS = 300;
  var firstPaintAt = Date.now();
  function delayedRender(){
    if (MOSAIC) { render(); return; }
    var elapsed = Date.now() - firstPaintAt;
    if (elapsed >= FIRST_PAINT_MIN_MS) { render(); return; }
    setTimeout(render, FIRST_PAINT_MIN_MS - elapsed);
  }

  // True pillar count comes from the phase-1 feed (which returns the COMPLETE
  // pillar). Never show 0 while loading — that makes a populated pillar look
  // empty and bounces new visitors.
  function setHeroCount(){
    if (DEFAULT_PILLAR === 'all' || DEFAULT_PILLAR === 'sports') return;
    var n = entries.filter(function(e){ return pillarOf(e.id) === DEFAULT_PILLAR; }).length;
    var hc = document.getElementById('hc-total');
    if (hc && n > 0) hc.textContent = fmtN(n);
  }

  // Full library (every pillar) — needed ONLY for cross-pillar search and to
  // warm the cache for the next pillar. Fetched lazily so the 3-4 MB / ~10 s
  // universal payload never blocks a pillar's first paint.
  // Full library — grow gradually. Never yank 25k on first paint (owner 2026-07-11).
  var fullLibLoading = false;
  var FULL_STEPS = [2000, 5000, 10000];
  var fullStep = 0;
  function ensureFullLibrary(){
    if (fullLibraryLoaded && fullStep >= FULL_STEPS.length) return;
    if (fullLibLoading) return;
    fullLibLoading = true;
    var n = FULL_STEPS[Math.min(fullStep, FULL_STEPS.length - 1)] || 2000;
    fetch('/.netlify/functions/pulse-machine-library-list?recent=' + n + '&mini=1', { cache: 'default' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d2){
        if (d2 && Array.isArray(d2.entries)) {
          entries = applyTags(d2.entries.filter(function(e){ return e && e.id && !/^vq_/i.test(e.id); }));
          fullLibraryLoaded = true;
          saveToCache(entries);
          setHeroCount();
          render();
        }
        fullLibLoading = false;
        fullStep++;
        if (fullStep < FULL_STEPS.length) {
          var grow = function(){ ensureFullLibrary(); };
          if (typeof requestIdleCallback === 'function') requestIdleCallback(grow, { timeout: 5000 });
          else setTimeout(grow, 2500);
        }
      })
      .catch(function(){ fullLibLoading = false; });
  }
  // Expose so the search box can force-load the full library on first use.
  window.__pulseEnsureFullLibrary = ensureFullLibrary;

  function loadEntries(){
    var grid = document.getElementById('grid');

    if (MOSAIC && grid) {
      hideMosaicChrome();
      applyPillarBg();
      grid.innerHTML = '';
      renderHomeMosaic(grid);
    }

    // PHASE 0 — instant paint from cache (cache holds the full library).
    var cached = loadFromCache();
    if (cached && cached.length) {
      entries = cached.filter(function(e){ return e && e.id && !/^vq_/i.test(e.id); });
      fullLibraryLoaded = true;
      setHeroCount();
      delayedRender();
    } else if (grid && !MOSAIC) {
      // No cache: show an ACTIVE loading skeleton immediately. The visitor must
      // never see a blank grid or a "0 answers" empty state during the fetch.
      grid.innerHTML = loadingMarkup('Loading answers');
    }

    // PHASE 1 — pillar-scoped, small + fast (~0.7 s). Returns the COMPLETE
    // pillar, so it both renders the grid and gives the true count.
    var pillarParam = (DEFAULT_PILLAR && DEFAULT_PILLAR !== 'all' && DEFAULT_PILLAR !== 'sports')
      ? '&pillar=' + encodeURIComponent(DEFAULT_PILLAR) : '';
    // Pillar-scoped requests return only that one pillar (small payload even at a high
    // cap), so load the FULL pillar — otherwise a growing pillar (e.g. tl/tools) looks
    // "stuck" at the old 2000 cap. The universal hub stays at 2000 for fast first paint
    // (phase 2 warms the rest in the background).
    var phase1Url = '/.netlify/functions/pulse-machine-library-list?recent=' + (pillarParam ? '25000' : '2000') + pillarParam;

    return fetch(phase1Url, { cache: 'default' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        if (d && Array.isArray(d.entries) && d.entries.length) {
          rememberTags(d.entries); // full records here carry tags — cache them
          var fresh = d.entries.filter(function(e){ return e && e.id && !/^vq_/i.test(e.id); });
          // Always take the pillar's FRESH entries from phase 1 — a cached full
          // library can be stale or predate a newly-added pillar (which made new
          // pillars like Movies/Speeches render empty). Merge fresh pillar entries
          // over the cached other-pillar entries so cross-pillar search still works.
          if (fresh.length) {
            if (fullLibraryLoaded && pillarParam) {
              var others = entries.filter(function(e){ return pillarOf(e.id) !== DEFAULT_PILLAR; });
              entries = fresh.concat(others);
            } else if (!fullLibraryLoaded) {
              entries = fresh;
            }
          }
          setHeroCount();
          delayedRender();
        } else if (!cached && !pillarParam) {
          // Universal hub with nothing yet — keep the skeleton, full lib is coming.
          if (grid) grid.innerHTML = loadingMarkup('Loading the library');
        }
        // Warm the full library in the BACKGROUND (search + next-pillar cache),
        // never blocking this pillar's paint.
        if (!fullLibraryLoaded) {
          if (window.requestIdleCallback) requestIdleCallback(function(){ ensureFullLibrary(); }, { timeout: 2500 });
          else setTimeout(ensureFullLibrary, 1500);
        }
      })
      .catch(function(){
        // Phase 1 failed — fall straight back to the full library.
        ensureFullLibrary();
      });
  }

  function loadCounts(){
    fetch('/.netlify/functions/pulse-library-pulse', { cache: 'default' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if (!j || !j.ok) return;
        var pillarKeyMap = { all:'total', q:'knowledge', st:'sales_trainings', ik:'industry_kpis', tk:'tech_stacks', gb:'graphics', bs:'book_summaries', er:'electronic_reviews', ra:'revenue_architecture', gp:'gtm_playbooks', fr:'franchises', ca:'cars' };
        var heroN = null;
        if (DEFAULT_PILLAR === 'all') {
          heroN = j.total;
        } else if (j.by_pillar) {
          var mk = pillarKeyMap[DEFAULT_PILLAR];
          if (mk && typeof j.by_pillar[mk] === 'number') heroN = j.by_pillar[mk];
          // New pillars (mv/wl/tv/…) aren't in by_pillar — leave null so the
          // count comes from the phase-1 pillar feed (setHeroCount), never 0.
        }
        if (typeof heroN === 'number' && heroN > 0) {
          var hc = document.getElementById('hc-total'); if (hc) hc.textContent = fmtN(heroN);
        }
        if (typeof j.total === 'number') {
          var lp = document.getElementById('lp-num'); if (lp) lp.textContent = fmtN(j.total);
        }
        if (j.by_pillar) {
          var box = document.getElementById('lp-pillars'); if (!box) return;
          box.innerHTML = FOOTER_ORDER.map(function(k){
            var n = j.by_pillar[k] || 0;
            return '<span><strong>' + fmtN(n) + '</strong> ' + FOOTER_LABELS[k] + '</span>';
          }).join('');
        }
      }).catch(function(){});
  }

  function entryHaystack(e){
    return ((e.id || '') + ' ' + (e.question || '') + ' ' + (e.tags || []).join(' ')).toLowerCase();
  }

  // Relevance score for ranking search hits (higher = better). 0 = no match.
  function queryScore(e, q){
    if (!q) return 0;
    var idLc = (e.id || '').toLowerCase();
    var qNoSpace = q.replace(/\s+/g, '');
    if (idLc === qNoSpace) return 100000;
    if (idLc.indexOf(qNoSpace) === 0) return 50000;
    if (/^\d+$/.test(qNoSpace)) {
      var numPart = idLc.replace(/^[a-z_]+/, '');
      if (numPart === qNoSpace || numPart === qNoSpace.replace(/^0+/, '') || parseInt(numPart, 10) === parseInt(qNoSpace, 10)) return 90000;
      if (numPart.indexOf(qNoSpace) >= 0) return 40000;
    }
    if (/^[a-z]{1,3}\d+$/i.test(qNoSpace) && idLc.indexOf(qNoSpace) >= 0) return 45000;
    var hay = entryHaystack(e);
    var title = (e.question || '').toLowerCase();
    var s = 0;
    if (hay.indexOf(q) >= 0) s += 8000;
    if (title.indexOf(q) === 0) s += 6000;
    else if (title.indexOf(q) >= 0) s += 3500;
    var words = q.split(/\s+/).filter(Boolean);
    if (!words.length) return s;
    var hit = 0, titleHits = 0;
    for (var i = 0; i < words.length; i++) {
      if (words[i].length < 2) continue;
      if (hay.indexOf(words[i]) >= 0) {
        hit++;
        if (title.indexOf(words[i]) >= 0) titleHits++;
      }
    }
    var need = words.filter(function(w){ return w.length >= 2; }).length;
    if (!need) return s || (hay.indexOf(q) >= 0 ? 1000 : 0);
    if (hit === need) s += 5000 + titleHits * 400;
    else if (hit > 0 && hit >= Math.ceil(need * 0.5)) s += 1200 + hit * 200;
    else return 0;
    s += Math.max(0, 80 - title.length);
    return s;
  }

  function matchesQuery(e, q){ return !q || queryScore(e, q) > 0; }

  // Chip counts:
  //  - If a search query IS active → counts reflect query hits across all 9 pillars
  //  - If no query → counts reflect TRUE library totals from pulse-library-pulse
  //    (so the user always sees the real total per pillar, even before the
  //    universal feed finishes loading)
  function buildFilters(searchHits){
    var counts = {};
    PILLARS.forEach(function(p){ counts[p.key] = 0; });
    var qActive = !!query.trim();
    function tally(arr){
      arr.forEach(function(e){
        var p = pillarOf(e.id);
        if (p && counts[p] !== undefined) counts[p]++;
        // Sports cuts across q-pillar IDs — count by tag too
        if (Array.isArray(e.tags)) {
          for (var i = 0; i < e.tags.length; i++) {
            var t = String(e.tags[i]).toLowerCase();
            if (/^(sports|nil|football|mbb|wbb|college-sports|college-nil|nil-gtm|nil-business)$/i.test(t)) { counts.sports = (counts.sports || 0) + 1; break; }
          }
        }
      });
    }
    if (qActive) {
      counts.all = searchHits.length;
      tally(searchHits);
    } else if (pillarTotals) {
      PILLARS.forEach(function(p){ counts[p.key] = pillarTotals[p.key] || 0; });
      counts.all = pillarTotals.all || entries.length;
    } else if (trueCounts) {
      Object.keys(trueCounts).forEach(function(k){ counts[k] = trueCounts[k]; });
      // Sports count isn't in trueCounts (pulse-library-pulse doesn't return it).
      // Fall back to local-entries tag count if available.
      var sportsCount = 0;
      entries.forEach(function(e){
        if (Array.isArray(e.tags)) {
          for (var i = 0; i < e.tags.length; i++) {
            if (/^(sports|nil|football|mbb|wbb|college-sports|college-nil|nil-gtm|nil-business)$/i.test(String(e.tags[i]))) { sportsCount++; break; }
          }
        }
      });
      counts.sports = sportsCount;
    } else {
      counts.all = entries.length;
      tally(entries);
    }
    var box = document.getElementById('filters');
    box.innerHTML = PILLARS.map(function(p){
      var n = counts[p.key] || 0;
      var active = (pillar === p.key) ? ' is-active' : '';
      var hasNew = !qActive && (pillarNew24[p.key] || 0) > 0;
      var newAttr = hasNew ? (' title="' + (pillarNew24[p.key]) + ' new in last 24h"') : '';
      return '<button class="filter-chip' + active + (hasNew ? ' has-new' : '') + '" data-pillar="' + p.key + '"' + newAttr + '>' + p.label + ' <span class="filter-count">' + fmtN(n) + '</span></button>';
    }).join('');
  }

  // Helper — does this entry belong to a given pillar key?
  // Most pillars match by ID regex; the 'sports' pillar matches by tag.
  function entryInPillar(e, pcfg) {
    if (!pcfg || !e || !e.id) return false;
    if (pcfg.tag && Array.isArray(e.tags)) {
      for (var i = 0; i < e.tags.length; i++) {
        if (pcfg.tag.test(String(e.tags[i]))) return true;
      }
      return false;
    }
    if (pcfg.re) return pcfg.re.test(e.id);
    return true;
  }
  function computeView(){
    var q = query.trim().toLowerCase();
    var searchHits = q ? entries.filter(function(e){ return matchesQuery(e, q); }) : entries.slice();
    var v = searchHits;
    // On pillar hubs, DEFAULT_PILLAR scopes the default grid — but an active search
    // spans the whole library unless the visitor explicitly picked another chip.
    var filterPillar = pillar;
    if (q && pillar === DEFAULT_PILLAR && DEFAULT_PILLAR !== 'all') filterPillar = 'all';
    if (filterPillar !== 'all') {
      var pcfg = PILLARS.find(function(p){ return p.key === filterPillar; });
      if (pcfg) v = v.filter(function(e){ return entryInPillar(e, pcfg); });
    }
    var vs = function(){ return 0; };   // Yup/Nope removed (owner 2026-07-02)
    if (q) {
      v.sort(function(a, b){
        return (queryScore(b, q) - queryScore(a, q)) || (vs(b.id) - vs(a.id)) || ((b.ts || 0) - (a.ts || 0));
      });
    } else {
      v.sort(function(a, b){ return (vs(b.id) - vs(a.id)) || ((b.ts || 0) - (a.ts || 0)); });
    }
    return { searchHits: searchHits, view: v };
  }

  function emptyMarkup(){
    var qActive = !!query.trim();
    var pillarLabel = (PILLARS.find(function(p){ return p.key === pillar; }) || {}).label || 'All';
    var tips = qActive
      ? 'Try fewer words, an entry ID (q1234, aq0012), or a pillar chip to narrow results.'
      : 'Pick a pillar chip above or search across all entries.';
    var actions = '';
    if (qActive || pillar !== DEFAULT_PILLAR) {
      actions = '<div class="empty-actions"><button type="button" class="empty-btn" id="empty-clear">Clear search &amp; filters</button></div>';
    } else {
      actions = '<div class="empty-actions"><a class="empty-btn" href="/knowledge">Browse all entries</a></div>';
    }
    var scopeLabel = (qActive && pillar === DEFAULT_PILLAR && DEFAULT_PILLAR !== 'all')
      ? 'the library'
      : esc(pillarLabel.replace(/^[^A-Za-z]+/, ''));
    return '<div class="empty">'
      + '<div class="empty-icon">🔍</div>'
      + '<h3>No entries match</h3>'
      + '<p>' + (qActive ? 'Nothing in <strong>' + scopeLabel + '</strong> for “' + esc(query.trim()) + '”.' : 'This filter returned zero results.') + '</p>'
      + '<p class="empty-tips">' + esc(tips) + '</p>'
      + actions
    + '</div>';
  }

  var HUB_SCROLL_KEY = 'pulse.hub.scroll.' + (location.pathname || '/knowledge');
  var HUB_LAST_KEY = 'pulse.hub.last.' + (location.pathname || '/knowledge');
  function saveHubScroll(){
    try { sessionStorage.setItem(HUB_SCROLL_KEY, String(window.scrollY || 0)); } catch(_e){}
  }
  function restoreHubScroll(){
    try {
      var y = parseInt(sessionStorage.getItem(HUB_SCROLL_KEY) || '', 10);
      if (!isNaN(y) && y > 0) {
        requestAnimationFrame(function(){ window.scrollTo(0, y); });
      }
    } catch(_e){}
  }
  function markLastVisitedCard(){
    try {
      var last = sessionStorage.getItem(HUB_LAST_KEY);
      if (!last) return;
      var card = document.querySelector('.card[href="' + last + '"], .card[href$="/' + last.replace(/^.*\//, '') + '"]');
      if (card) {
        card.classList.add('card-visited');
        setTimeout(function(){ card.classList.remove('card-visited'); }, 3200);
      }
    } catch(_e){}
  }

  function setSearchLoading(on){
    var wrap = document.querySelector('.search-wrap');
    if (wrap) wrap.classList.toggle('is-searching', !!on);
  }

  function announceResults(n){
    var live = document.getElementById('hub-sr-live');
    if (!live) return;
    var qActive = !!query.trim();
    live.textContent = fmtN(n) + ' entries' + (qActive ? ' matching your search' : ' shown');
  }

  // batch-3: reflect match count in placeholder + aria-label while searching
  function updateSearchPlaceholder(n){
    var qi = document.getElementById('q');
    if (!qi) return;
    var base = qi.getAttribute('data-ph-base');
    if (!base) {
      base = qi.getAttribute('placeholder') || 'Search entries…';
      qi.setAttribute('data-ph-base', base);
    }
    var qActive = !!query.trim();
    if (qActive && (fullLibraryLoaded || n > 0)) {
      qi.setAttribute('placeholder', fmtN(n) + ' matches — refine or pick a pillar');
      qi.setAttribute('aria-label', fmtN(n) + ' entries match your search');
    } else {
      qi.setAttribute('placeholder', base);
      qi.setAttribute('aria-label', 'Search library entries');
    }
  }

  var HUB_QUERY_KEY = 'pulse.hub.q.' + (location.pathname || '/knowledge');
  function persistHubQuery(){
    try {
      var q = query.trim();
      if (q) sessionStorage.setItem(HUB_QUERY_KEY, q);
      else sessionStorage.removeItem(HUB_QUERY_KEY);
    } catch(_e){}
  }

  function injectRecentlyViewed(){
    try {
      var raw = localStorage.getItem('pulse_recent_v1');
      if (!raw) return;
      var list = JSON.parse(raw);
      if (!Array.isArray(list) || !list.length) return;
      if (document.getElementById('hub-recent')) return;
      var anchor = document.getElementById('status') || document.querySelector('.toolbar');
      if (!anchor) return;
      var slice = list.slice(0, 8);
      var track = slice.map(function(r){
        if (!r || !r.id) return '';
        var href = r.url || (routeOf(r.id) + r.id);
        var qtxt = String(r.question || r.id);
        var short = qtxt.length > 52 ? qtxt.slice(0, 52) + '…' : qtxt;
        return '<a class="hub-recent-pill" href="' + esc(href) + '" title="' + esc(qtxt) + '">'
          + '<span class="hub-recent-id">' + esc(r.id) + '</span>'
          + '<span class="hub-recent-q">' + esc(short) + '</span></a>';
      }).join('');
      if (!track) return;
      var box = document.createElement('div');
      box.id = 'hub-recent';
      box.className = 'hub-recent';
      box.innerHTML = '<h3 class="hub-recent-title">Recently viewed</h3><div class="hub-recent-track" role="list">' + track + '</div>';
      anchor.insertAdjacentElement('afterend', box);
    } catch(_e){}
  }

  function updateResultsBar(n){
    var bar = document.getElementById('hub-results-bar');
    var cnt = document.getElementById('hub-bar-count');
    if (cnt) cnt.textContent = fmtN(n);
    if (!bar) return;
    var toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;
    var past = toolbar.getBoundingClientRect().bottom < 0;
    bar.classList.toggle('is-visible', past && n > 0);
    bar.setAttribute('aria-hidden', past && n > 0 ? 'false' : 'true');
  }

  // ── MOSAIC tile-box style (per-pillar, gated by window.PILLAR_MOSAIC) — owner 2026-07-02 ──
  // Renders the pillar inventory as the CNET-style image mosaic (like the homepage) instead of text
  // cards. Uses each entry's face-card image (e.img, stamped into the index) proxied through wsrv.
  var MOSAIC = !!window.PILLAR_MOSAIC;
  // per-pillar two-tone palette (from pillar-palette.js) — [primary, secondary(dark)]
  var PPAL={q:['#C0531F','#2A1206'],ra:['#1B7A3D','#0A3019'],gp:['#1C6EA4','#082635'],ik:['#1565C0','#071E3C'],tk:['#3B5BA5','#101A33'],ev:['#EC2D7C','#141414'],nl:['#7A1FA2','#1C0A28'],gm:['#6D28D9','#170A33'],sk:['#3949AB','#0D1234'],sp:['#8E1B4B','#260711'],bt:['#0E6BA8','#052433'],tv:['#1C9AD6','#063347'],rs:['#0E9C9C','#04302F'],aq:['#0E7C86','#03282B'],ga:['#C026D3','#260A2A'],ca:['#C0392B','#2A0907'],fr:['#1E3A5F','#C8972E'],mv:['#B71C3B','#270710'],er:['#E08A1E','#3A2206'],es:['#B8860B','#2C1F03'],cl:['#2E7D32','#0B280D'],hf:['#B45309','#2C1403'],wl:['#2E9E5B','#0C321F'],lv:['#A0522D','#28130A'],sy:['#BE185D','#260512'],gb:['#0D9488','#04302B'],bs:['#8B5A2B','#241405'],tn:['#5B7553','#182015'],dr:['#D2691E','#341805'],pt:['#0E8C7A','#042E28'],sw:['#475569','#131A24'],ai:['#0A66C2','#0A0A0A'],cg:['#0891B2','#04303A'],co:['#92400E','#2A1304'],tl:['#52525B','#18181B'],dn:['#9F1239','#270710'],sc:['#1E40AF','#0A1533'],st:['#2563EB','#0A1A3A'],bo:['#D97706','#341B03'],ce:['#D7263D','#A81729']};
  function applyPillarBg(){
    var p=(window.PILLAR_DEFAULT||'q'); var c=PPAL[p]||PPAL.q;
    document.body.style.background='radial-gradient(1200px 620px at 18% -8%, '+c[0]+'66, transparent 62%), linear-gradient(162deg, '+c[1]+' 0%, #0b0908 52%, '+c[1]+' 100%)';
    document.body.style.backgroundAttachment='fixed';
  }
  function routeSeg(){ try { return location.pathname.replace(/^\//,'').split('/')[0]||''; } catch(e){ return ''; } }
  function hideMosaicChrome(){
    ['.hero','.toolbar','.statusbar','.hdr','.footer','#hub-recent','#hub-results-bar','#mos-head'].forEach(function(sel){
      [].forEach.call(document.querySelectorAll(sel), function(el){ el.style.display = 'none'; });
    });
    var gw = document.querySelector('.grid-wrap');
    if (gw) { gw.style.maxWidth = '1080px'; gw.style.marginLeft = 'auto'; gw.style.marginRight = 'auto'; gw.style.padding = '0 clamp(10px,2vw,24px) 48px'; }
  }
  function ensureHomeMosaicScript(cb){
    function go(){ if (window.PulseHomeMosaic) { cb(); return; } setTimeout(go, 40); }
    if (window.PulseHomeMosaic) { cb(); return; }
    if (!window.PulseFaceImg && !document.querySelector('script[data-pulse-face-img-loader]')) {
      var f = document.createElement('script');
      f.src = '/js/pulse-face-img.js';
      f.defer = true;
      f.setAttribute('data-pulse-face-img-loader', '');
      document.head.appendChild(f);
    }
    if (document.querySelector('script[data-pulse-home-mosaic-loader]')) { go(); return; }
    var s = document.createElement('script');
    s.src = '/js/pulse-home-mosaic.js?v=20260711f';
    s.defer = true;
    s.setAttribute('data-pulse-home-mosaic-loader', '');
    s.onload = function(){ go(); };
    document.head.appendChild(s);
  }
  var mosaicMountedKey = '';
  function switchMosaicPillar(targetPillar) {
    targetPillar = targetPillar || 'all';
    pillar = targetPillar;
    window.PILLAR_DEFAULT = targetPillar;
    page = 1;
    mosaicMountedKey = '';
    hideMosaicChrome();
    applyPillarBg();
    buildFilters(null);
    render();
  }
  window.__pulsePillarPageSwitch = switchMosaicPillar;
  function renderHomeMosaic(grid){
    var key = String(window.PILLAR_DEFAULT || '') + '|' + query.trim();
    if (mosaicMountedKey === key && grid.__pulseHome) return;
    mosaicMountedKey = key;
    hideMosaicChrome();
    applyPillarBg();
    grid.classList.remove('mosaic');
    ensureHomeMosaicScript(function(){
      if (!window.PulseHomeMosaic) return;
      window.PulseHomeMosaic.mount(grid, {
        pillar: window.PILLAR_DEFAULT || '',
        query: query.trim(),
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
      });
    });
  }

  function render(){
    var computed = computeView();
    view = computed.view;
    buildFilters(computed.searchHits);
    var grid = document.getElementById('grid');
    if (MOSAIC && grid) {
      renderHomeMosaic(grid);
      var pgM = document.getElementById('pager'); if (pgM) pgM.innerHTML = '';
      setSearchLoading(!fullLibraryLoaded && !entries.length);
      announceResults(view.length);
      updateSearchPlaceholder(view.length);
      updateResultsBar(view.length);
      return;
    }
    var status = document.getElementById('st-count');
    if (status) status.textContent = fmtN(view.length);
    // Status label: make it explicit that search spans every pillar
    var statusBar = document.querySelector('.statusbar');
    if (statusBar) {
      var qActive = !!query.trim();
      var right = statusBar.querySelector('span:last-child');
      if (right) {
        if (qActive) {
          right.innerHTML = 'Searching all <strong>9 pillars</strong>' + (fullLibraryLoaded ? '' : ' · <em>still loading full library…</em>');
        } else {
          right.textContent = fullLibraryLoaded ? 'Sorted newest first' : 'Loading full library…';
        }
      }
    }

    if (!view.length && !MOSAIC) {
      // Distinguish "still loading" from "actually empty" so the user never
      // sees "no entries match" while the universal feed is still in flight.
      var qActiveNow = !!query.trim();
      if ((!fullLibraryLoaded && qActiveNow) || (!fullLibraryLoaded && !qActiveNow && entries.length === 0)) {
        grid.innerHTML = loadingMarkup(qActiveNow ? 'Searching the full library…' : 'Loading the full library across all pillars');
      } else {
        grid.innerHTML = emptyMarkup();
        var clearBtn = document.getElementById('empty-clear');
        if (clearBtn) clearBtn.addEventListener('click', function(){
          query = ''; pillar = DEFAULT_PILLAR; page = 1;
          var qi = document.getElementById('q');
          if (qi) qi.value = '';
          var qc = document.getElementById('qclear');
          if (qc) qc.classList.remove('is-on');
          render();
          var tb = document.querySelector('.toolbar');
          if (tb) window.scrollTo({ top: tb.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        });
      }
      var pgBlank = document.getElementById('pager'); if (pgBlank) pgBlank.innerHTML = '';
      setSearchLoading(false);
      announceResults(0);
      updateSearchPlaceholder(0);
      updateResultsBar(0);
      return;
    }

    var totalPages = Math.max(1, Math.ceil(view.length / PER_PAGE));
    if (page > totalPages) page = totalPages;
    var start = (page - 1) * PER_PAGE;
    var slice = view.slice(start, start + PER_PAGE);

    grid.innerHTML = slice.map(function(e){
      var pfx = pillarOf(e.id) || 'q';
      var pcfg = PILLARS.find(function(p){ return p.key === pfx; }) || PILLARS[0];
      var route = routeOf(e.id);
      var qs = (typeof e.quality_score === 'number') ? e.quality_score : 5;
      var qsClass = 'qs-' + Math.max(5, Math.min(10, qs));
      var when = relTime(e.ts || e.polished_at);
      return '<a class="card" href="' + route + esc(e.id) + '">'
        + '<div class="card-top">'
          + '<span class="card-pillar">' + esc(pcfg.label.replace(/^[^A-Za-z]+/, '')) + '</span>'
          + '<span class="card-id">' + esc(e.id) + '</span>'
          + '<span class="card-qs ' + qsClass + '">' + qs + '/10</span>'
        + '</div>'
        + '<div class="card-q">' + hlQuery(e.question || '(no title)', query.trim()) + '</div>'
        + '<div class="card-meta"><span class="card-date">' + esc(when) + '</span><span class="card-cta">Open →</span></div>'
      + '</a>';
    }).join('');

    renderPager(totalPages);
    setSearchLoading(false);
    announceResults(view.length);
    updateSearchPlaceholder(view.length);
    updateResultsBar(view.length);
    markLastVisitedCard();
  }

  (function(){ if (document.getElementById('hg-js')) return; var g = document.createElement('script'); g.id='hg-js'; g.src='/js/human-gate.js'; g.defer=true; (document.head||document.documentElement).appendChild(g); })();

  function renderPager(total){
    var pg = document.getElementById('pager');
    if (!pg) return;
    if (total <= 1) { pg.innerHTML = ''; return; }
    var btns = [];
    btns.push('<button data-pg="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + ' aria-label="Previous page">‹ Prev</button>');
    var pageSet = new Set([1, total]);
    for (var i = page - 2; i <= page + 2; i++) if (i >= 1 && i <= total) pageSet.add(i);
    var sorted = Array.from(pageSet).sort(function(a, b){ return a - b; });
    var prev = 0;
    sorted.forEach(function(p){
      if (p - prev > 1) btns.push('<span class="pg-ellipsis" aria-hidden="true">…</span>');
      var active = (p === page) ? ' class="is-active"' : '';
      var aria = (p === page) ? ' aria-current="page"' : '';
      btns.push('<button data-pg="' + p + '"' + active + aria + ' aria-label="Page ' + p + '">' + p + '</button>');
      prev = p;
    });
    btns.push('<button data-pg="' + (page + 1) + '"' + (page >= total ? ' disabled' : '') + ' aria-label="Next page">Next ›</button>');
    // batch-3: jump-to-page — essential when search returns 100+ pages of hits
    if (total > 3) {
      btns.push('<span class="pg-jump" role="group" aria-label="Jump to page">'
        + '<span class="pg-jump-label">Go to</span>'
        + '<input type="number" class="pg-jump-in" id="pg-jump-in" min="1" max="' + total + '" value="' + page + '" inputmode="numeric" aria-label="Page number, 1 to ' + total + '">'
        + '<span class="pg-jump-of">/ ' + total + '</span>'
        + '<button type="button" class="pg-jump-go" id="pg-jump-go">Go</button>'
        + '</span>');
    }
    pg.innerHTML = btns.join('');
  }

  function jumpToPage(total){
    var jumpIn = document.getElementById('pg-jump-in');
    if (!jumpIn) return;
    var n = parseInt(jumpIn.value, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > total) n = total;
    jumpIn.value = n;
    if (n === page) return;
    page = n;
    render();
    var tb = document.querySelector('.toolbar');
    if (tb) window.scrollTo({ top: tb.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function(e){
    var card = e.target.closest('.card[href]');
    if (card) {
      saveHubScroll();
      try { sessionStorage.setItem(HUB_LAST_KEY, card.getAttribute('href') || ''); } catch(_e){}
    }
    var fbtn = e.target.closest('.filter-chip');
    if (fbtn) {
      var targetPillar = fbtn.getAttribute('data-pillar') || 'all';
      // Sports is a TAG-based pillar with no dedicated listing page (its hub
      // route /sports is the separate fantasy-football feature). Filter it in
      // place so its NIL/football Q&A entries are actually browsable here, and
      // pull the full tag-matched set so it never shows empty.
      if (targetPillar === 'sports') {
        prefetchSportsTags();
        pillar = targetPillar;
        page = 1;
        render();
        var tbS = document.querySelector('.toolbar');
        if (tbS) window.scrollTo({ top: tbS.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        return;
      }
      // Mosaic mode: smooth in-place pillar switch (no full page reload / old-format flash).
      if (MOSAIC && window.PulsePillarSpa && targetPillar !== pillar) {
        var qs = query.trim();
        var dest = window.PulsePillarSpa.keyToPath(targetPillar);
        if (qs) dest += '?q=' + encodeURIComponent(qs);
        window.PulsePillarSpa.go(dest, { pillar: targetPillar, force: true });
        return;
      }
      // Navigate to the target pillar's hub page so the hero/description
      // always matches the active pillar. Same pillar = client-side filter.
      if (targetPillar !== DEFAULT_PILLAR && PILLAR_PAGE[targetPillar] && !MOSAIC) {
        var qs = query.trim();
        var url = PILLAR_PAGE[targetPillar];
        if (qs) url += '?q=' + encodeURIComponent(qs);
        window.location.href = url;
        return;
      }
      pillar = targetPillar;
      page = 1;
      render();
      var tb = document.querySelector('.toolbar');
      if (tb) window.scrollTo({ top: tb.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return;
    }
    var pbtn = e.target.closest('button[data-pg]');
    if (pbtn && !pbtn.disabled) {
      var pg = parseInt(pbtn.getAttribute('data-pg'), 10);
      if (!isNaN(pg)) {
        page = pg;
        render();
        var tb2 = document.querySelector('.toolbar');
        if (tb2) window.scrollTo({ top: tb2.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
      return;
    }
    if (e.target.closest('.pg-jump-go')) {
      var jumpIn = document.getElementById('pg-jump-in');
      var maxPg = jumpIn ? parseInt(jumpIn.getAttribute('max'), 10) : 0;
      if (maxPg > 0) jumpToPage(maxPg);
    }
  });

  document.addEventListener('keydown', function(e){
    if (e.key !== 'Enter' || e.target.id !== 'pg-jump-in') return;
    e.preventDefault();
    var jumpIn = document.getElementById('pg-jump-in');
    var maxPg = jumpIn ? parseInt(jumpIn.getAttribute('max'), 10) : 0;
    if (maxPg > 0) jumpToPage(maxPg);
  });

  var qInput = document.getElementById('q');
  if (qInput) {
    var qClear = document.getElementById('qclear');
    var qTimer;
    var searchWrap = qInput.closest('.search-wrap');
    if (searchWrap && !searchWrap.querySelector('.search-kbd-hint')) {
      var hint = document.createElement('span');
      hint.className = 'search-kbd-hint';
      hint.innerHTML = 'Press <kbd>/</kbd> to focus search · <kbd>Esc</kbd> to clear';
      searchWrap.insertAdjacentElement('afterend', hint);
    }
    if (searchWrap && !searchWrap.querySelector('.search-spinner')) {
      var spin = document.createElement('span');
      spin.className = 'search-spinner';
      spin.id = 'search-spinner';
      spin.setAttribute('aria-hidden', 'true');
      var clr = searchWrap.querySelector('.search-clear');
      if (clr) searchWrap.insertBefore(spin, clr);
      else searchWrap.appendChild(spin);
    }
    // Cross-pillar search needs the full library — force-load it the moment the
    // visitor engages the search box (in case the idle warm hasn't run yet).
    qInput.addEventListener('focus', function(){ try { ensureFullLibrary(); } catch(_e){} }, { once: true });
    qInput.addEventListener('input', function(){
      query = qInput.value;
      if (qClear) qClear.classList.toggle('is-on', !!query);
      if (query && !fullLibraryLoaded) { try { ensureFullLibrary(); } catch(_e){} }
      clearTimeout(qTimer);
      setSearchLoading(true);
      qTimer = setTimeout(function(){ page = 1; persistHubQuery(); render(); }, 220);
    });
    if (qClear) qClear.addEventListener('click', function(){
      qInput.value = ''; query = ''; qClear.classList.remove('is-on');
      persistHubQuery();
      page = 1; render(); qInput.focus();
    });
  }

  document.addEventListener('keydown', function(e){
    var tag = (e.target && e.target.tagName) || '';
    var inField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);
    if (e.key === '/' && !inField && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var qi = document.getElementById('q');
      if (qi) { e.preventDefault(); qi.focus(); try { ensureFullLibrary(); } catch(_e){} }
    }
    if (e.key === 'Escape' && qInput && document.activeElement === qInput && query) {
      qInput.value = ''; query = '';
      var qc = document.getElementById('qclear');
      if (qc) qc.classList.remove('is-on');
      page = 1; render();
    }
  });

  // ─── TOP 5 TRENDING (per-pillar) ────────────────────────────────────
  // Pulls 7-day-rolling top entries within this pillar from entry-view
  // trending endpoint. Inserts a strip above the entry grid.
  function injectPillarTrending(){
    return; // Top-5 Trending strip removed from all landing pages per owner 2026-06-16
    if (DEFAULT_PILLAR === 'all') return; // homepage handles all-pillar top 5
    var existing = document.getElementById('pillar-trending'); if (existing) return;
    var toolbar = document.querySelector('.toolbar'); if (!toolbar) return;
    var stripCss = '<style>' +
      '.pillar-trending{max-width:1280px;margin:0 auto;padding:10px 20px 6px;}' +
      '.pillar-trending h4{font-size:11.5px;font-weight:900;letter-spacing:.06em;color:#FFD7A8;text-transform:uppercase;margin:0 0 8px;display:flex;align-items:center;gap:6px}' +
      '.pillar-trending h4 span{color:#8A8BA6;font-weight:600;letter-spacing:0;text-transform:none;font-size:10.5px;margin-left:4px}' +
      '.pillar-trending h4 .dot{display:inline-block;width:6px;height:6px;background:#22C55E;border-radius:50%;animation:tdot 1.6s infinite}' +
      '@keyframes tdot{0%,100%{opacity:1}50%{opacity:.3}}' +
      '.pt-grid{display:grid;gap:8px;grid-template-columns:1fr}' +
      '@media(min-width:640px){.pt-grid{grid-template-columns:repeat(5,1fr)}}' +
      '.pt-card{display:flex;flex-direction:column;gap:5px;padding:10px 10px 8px;background:var(--card);border:1px solid var(--bdr);border-radius:10px;text-decoration:none;color:var(--t1);min-height:80px;transition:border-color .15s,background .15s,transform .12s}' +
      '.pt-card:hover{border-color:rgba(255,107,48,.32);background:var(--cardh);transform:translateY(-1px)}' +
      '.pt-rank{font:900 16px/1 \'JetBrains Mono\',monospace;color:#FF6B30}' +
      '.pt-q{font-size:11.5px;font-weight:700;line-height:1.3;color:#EEEEF5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}' +
      '.pt-v{margin-top:auto;font-size:9.5px;color:#8A8BA6;font-family:\'JetBrains Mono\',monospace}' +
      '</style>';
    var wrap = document.createElement('div');
    wrap.id = 'pillar-trending';
    wrap.className = 'pillar-trending';
    wrap.style.display = 'none';
    wrap.innerHTML = stripCss + '<h4><span class="dot"></span>Top 5 Trending This Week <span>· 7-day rolling</span></h4><div class="pt-grid"></div>';
    toolbar.parentNode.insertBefore(wrap, toolbar);
    fetch('/.netlify/functions/entry-view?trending=1&pillar=' + encodeURIComponent(DEFAULT_PILLAR), { cache: 'default' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if (!j || !j.ok || !Array.isArray(j.trending) || !j.trending.length) return;
        // Wait until entries are loaded so we have titles
        var waitForTitles = function(){
          if (!entries.length) { setTimeout(waitForTitles, 300); return; }
          var titleById = {};
          entries.forEach(function(e){ titleById[e.id] = e.question || '(no title)'; });
          var top5 = j.trending.filter(function(t){ return titleById[t.id]; }).slice(0, 5);
          if (!top5.length) return;
          var html = top5.map(function(t, i){
            return '<a class="pt-card" href="' + routeOf(t.id) + esc(t.id) + '">' +
              '<span class="pt-rank">' + (i+1) + '</span>' +
              '<span class="pt-q">' + esc(titleById[t.id]) + '</span>' +
              '<span class="pt-v">' + t.sum + ' views this week</span>' +
            '</a>';
          }).join('');
          wrap.querySelector('.pt-grid').innerHTML = html;
          wrap.style.display = '';
        };
        waitForTitles();
      })
      .catch(function(){});
  }
  // Inject after first render so entries are in flight
  setTimeout(injectPillarTrending, 800);

  // batch-3: skip-to-content link (injected once — works on every pillar hub)
  (function(){
    if (document.querySelector('.skip-to-grid')) return;
    var grid = document.getElementById('grid');
    if (!grid) return;
    var skip = document.createElement('a');
    skip.href = '#grid';
    skip.className = 'skip-link skip-to-grid';
    skip.textContent = 'Skip to entries';
    document.body.insertBefore(skip, document.body.firstChild);
    if (!grid.getAttribute('tabindex')) grid.setAttribute('tabindex', '-1');
  })();

  // Seed search from ?q= (pillar chip nav) or sessionStorage (same-tab return).
  try {
    var params = new URLSearchParams(window.location.search || '');
    var qSeed = params.get('q');
    if (!qSeed) {
      try { qSeed = sessionStorage.getItem(HUB_QUERY_KEY) || ''; } catch(_e){}
    }
    if (qSeed) {
      query = qSeed;
      var qEl = document.getElementById('q');
      if (qEl) {
        qEl.value = qSeed;
        var qc = document.getElementById('qclear');
        if (qc) qc.classList.add('is-on');
      }
    }
  } catch (_e) {}

  injectRecentlyViewed();

  // batch-2: restore hub scroll when returning via back button
  window.addEventListener('pageshow', function(ev){
    if (ev.persisted || (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] && performance.getEntriesByType('navigation')[0].type === 'back_forward')) {
      restoreHubScroll();
    }
  });

  // batch-2: sticky results bar scroll + back-to-search
  (function(){
    var barTop = document.getElementById('hub-bar-top');
    if (barTop) barTop.addEventListener('click', function(){
      var tb = document.querySelector('.toolbar');
      if (tb) window.scrollTo({ top: tb.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      var qi = document.getElementById('q');
      if (qi) qi.focus();
    });
    var scrollTick = false;
    window.addEventListener('scroll', function(){
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(function(){
        updateResultsBar(view.length);
        scrollTick = false;
      });
    }, { passive: true });
    // Inject sticky bar + sr-live if hub page omitted them (other pillar HTML files)
    if (!document.getElementById('hub-results-bar')) {
      var status = document.getElementById('status');
      if (status) {
        var bar = document.createElement('div');
        bar.id = 'hub-results-bar';
        bar.className = 'hub-results-bar';
        bar.setAttribute('aria-hidden', 'true');
        bar.innerHTML = '<span><strong id="hub-bar-count">0</strong> entries</span><button type="button" id="hub-bar-top">↑ Back to search</button>';
        status.insertAdjacentElement('afterend', bar);
        bar.querySelector('#hub-bar-top').addEventListener('click', function(){
          var tb = document.querySelector('.toolbar');
          if (tb) window.scrollTo({ top: tb.offsetTop - 80, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
          var qi = document.getElementById('q');
          if (qi) qi.focus();
        });
      }
    }
    if (!document.getElementById('hub-sr-live')) {
      var live = document.createElement('div');
      live.id = 'hub-sr-live';
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      (document.getElementById('hub-results-bar') || document.body).insertAdjacentElement('afterend', live);
    }
  })();

  loadCounts();
  loadEntries();
  setInterval(loadCounts, 60000);
})();

/* ── Clerk auth UI injection (added 2026-06-15) — runs on every pillar page.
   Adds a Sign In button / user-avatar slot to the header and loads the shared
   Clerk module, so login is available site-wide without editing each page. ── */
(function () {
  try {
    var hdrIn = document.querySelector('.hdr-in') || document.querySelector('header');
    if (hdrIn && !hdrIn.querySelector('[data-pulse-auth-slot]')) {
      var slot = document.createElement('span');
      slot.setAttribute('data-pulse-auth-slot', '');
      slot.className = 'pulse-auth-slot';
      hdrIn.appendChild(slot);
    }
    if (!document.querySelector('script[data-pulse-auth-loader]')) {
      var s = document.createElement('script');
      s.src = '/js/pulse-auth.js';
      s.defer = true;
      s.setAttribute('data-pulse-auth-loader', '');
      document.head.appendChild(s);
    }
    // PWA install — load the install widget on every pillar page too (it
    // self-injects the manifest link + registers the service worker), so the
    // "Install the app" option works sitewide, not just on the homepage.
    if (!document.querySelector('script[data-pulse-pwa-loader]')) {
      var p = document.createElement('script');
      p.src = '/js/pwa-install.js';
      p.defer = true;
      p.setAttribute('data-pulse-pwa-loader', '');
      document.head.appendChild(p);
    }
  } catch (_e) {}
})();
