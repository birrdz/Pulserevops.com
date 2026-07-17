/* Pulse browse squares helper — paint rows/grids, grab-scroll, idle auto-scroll left.
   Owner 2026-07-11: same gold-trim squares until answer pages. */
(function (global) {
  'use strict';

  var PN = {
    q: 'Knowledge', ce: 'Knowledge', tl: 'Pulse Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums',
    ik: 'Industry KPIs', tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises',
    ai: 'AI Infrastructure', gb: 'Graphics', bo: 'Buildouts', sy: 'Style', gp: 'GTM Playbooks',
    ra: 'Revenue Architecture', pt: 'Pets', es: 'Estates', tv: 'Travel', rs: 'Resorts', cl: 'Clubs',
    lv: 'Living', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness',
    dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics',
    hf: 'HS Football', sw: 'Software', sk: 'Skills', sp: 'Speeches', cg: 'Coaching', cd: 'Contracts',
    dr: 'Drills', cr: 'Crabbing', fs: 'Fishing'
  };
  var TI = {
    q: '/assets/topics/current-events.jpg', ce: '/assets/topics/current-events.jpg',
    st: '/assets/topics/sales-trainings.jpg', ik: '/assets/topics/industry-kpis.jpg',
    tk: '/assets/topics/tech-stacks.jpg', gb: '/assets/topics/graphics.jpg',
    bs: '/assets/topics/sales-book-summaries.jpg', er: '/assets/topics/electronic-reviews.jpg',
    ra: '/assets/topics/revenue-architecture.jpg', gp: '/assets/topics/go-to-market-playbooks.jpg',
    fr: '/assets/topics/franchises.jpg', ca: '/assets/topics/cars.jpg', tn: '/assets/topics/towns.jpg',
    sc: '/assets/topics/towns.jpg', nl: '/assets/topics/nightlife.jpg', dn: '/assets/topics/dining.jpg',
    bt: '/assets/topics/boats.jpg', mv: '/assets/topics/movies.jpg', wl: '/assets/topics/wellness.jpg',
    dr: '/assets/topics/drills.jpg', tv: '/assets/topics/travel.jpg', rs: '/assets/topics/resorts.jpg',
    es: '/assets/topics/estates.jpg', cl: '/assets/topics/clubs.jpg', lv: '/assets/topics/living.jpg',
    ev: '/assets/topics/events.jpg', sy: '/assets/topics/style.jpg', ga: '/assets/topics/events.jpg',
    gm: '/assets/topics/gaming.jpg', sk: '/assets/topics/skills.jpg', sp: '/assets/topics/speeches.jpg',
    tl: '/assets/topics/tools.jpg', cg: '/assets/topics/coaching.jpg', co: '/assets/topics/collectibles.jpg',
    aq: '/assets/topics/aquariums.jpg', hf: '/assets/topics/highschool-football-recruiting.jpg',
    ai: '/assets/topics/ai-infrastructure.jpg', bo: '/assets/topics/buildouts.jpg',
    cd: '/assets/topics/contracts.jpg', tc: '/assets/topics/telco.jpg', pt: '/assets/topics/pets.jpg',
    sw: '/assets/topics/software.jpg', cr: '/assets/topics/fish-and-crabs-crab.jpg',
    fs: '/assets/topics/fish-and-crabs-fish.jpg'
  };
      /* Trim groups: revenue/pro at top → pets at bottom */
  var TC = {
    gp: '#EAC15C',
    ik: '#EAC15C',
    ra: '#EAC15C',
    st: '#EAC15C',
    bs: '#EAC15C',
    cg: '#EAC15C',
    q: '#EAC15C',
    sk: '#EAC15C',
    sp: '#E0B84A',
    cd: '#E0B84A',
    tk: '#A78BDB',
    tl: '#A78BDB',
    sw: '#A78BDB',
    ai: '#A78BDB',
    er: '#A78BDB',
    tc: '#A78BDB',
    fr: '#C8A878',
    es: '#C8A878',
    bo: '#C8A878',
    ca: '#5AA8D4',
    bt: '#5AA8D4',
    tv: '#4AB8A8',
    rs: '#4AB8A8',
    tn: '#4AB8A8',
    sc: '#4AB8A8',
    gb: '#C090D0',
    sy: '#C090D0',
    co: '#C090D0',
    dn: '#E090A8',
    cl: '#E090A8',
    nl: '#1A1A1E',
    ev: '#E8E4D8',
    ga: '#E8E4D8',
    lv: '#E8E4D8',
    hf: '#5CBC70',
    dr: '#5CBC70',
    gm: '#6BC88A',
    wl: '#E090A8',
    mv: '#C090D0',
    aq: '#6BC88A',
    pt: '#6BC88A',
    ce: '#EAC15C',
    fs: '#4AB8A8',
    cr: '#E07878'
  };
  function colorOf(idOrPillar) {
    var p = pref(idOrPillar);
    if (TC[p]) return TC[p];
    var k = String(idOrPillar || '').toLowerCase();
    if (TC[k]) return TC[k];
    return '#E0C05A';
  }

  function pref(id) {
    var m = String(id || '').match(/^([a-z]+)/i);
    return m ? m[1].toLowerCase() : 'q';
  }
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  /** Card headline — punchy, capitalized; full Q on hover. */
  function shortTitle(s, max) {
    max = max || 36;
    var raw = String(s || '').replace(/\s+/g, ' ').trim().replace(/[?]+$/g, '');
    var t = raw;
    var year = '';
    var ym = t.match(/\b(20\d{2})\s*$/);
    if (ym) { year = ' ' + ym[1]; t = t.slice(0, -ym[1].length).trim(); }

    // Prefer readable headline transforms over chopping mid-phrase
    var rules = [
      [/^top\s+(\d+)\s+best\s+(.+?)(?:\s+options)?$/i, function (_, n, rest) { return 'Top ' + n + ' ' + rest; }],
      [/^top\s+(\d+)\s+(.+)$/i, function (_, n, rest) { return 'Top ' + n + ' ' + rest; }],
      [/^what are the most common mistakes (?:in|with|for)\s+(.+)$/i, function (_, rest) { return 'Common Mistakes in ' + rest; }],
      [/^what(?:'s| is| are) the best way to approach\s+(.+)$/i, function (_, rest) { return 'How to Approach ' + rest; }],
      [/^what is the best way to\s+(.+)$/i, function (_, rest) { return 'How to ' + rest; }],
      [/^how do you get started with\s+(.+)$/i, function (_, rest) { return 'Getting Started with ' + rest; }],
      [/^how (?:do|can|should) (?:you|i) get started (?:with|in)\s+(.+)$/i, function (_, rest) { return 'Getting Started with ' + rest; }],
      [/^what should you know before investing in\s+(.+)$/i, function (_, rest) { return 'Before Investing in ' + rest; }],
      [/^how much does\s+(.+?)\s+cost(?:\s+in)?$/i, function (_, rest) { return rest + ' Cost'; }],
      [/^is\s+(.+?)\s+worth it(?:\s+in)?$/i, function (_, rest) { return 'Is ' + rest + ' Worth It'; }],
      [/^how to\s+(.+)$/i, function (_, rest) { return 'How to ' + rest; }],
      [/^a guide to\s+(.+)$/i, function (_, rest) { return rest; }]
    ];
    var hit = false;
    for (var i = 0; i < rules.length; i++) {
      var m = t.match(rules[i][0]);
      if (m) { t = rules[i][1].apply(null, m); hit = true; break; }
    }
    if (!hit) {
      t = t.replace(/^(what(?:'s| is| are| do| does| did| should| can| will)|how(?: to| do| does| can| should| much| many)|why(?: do| does| is| are)?|which|when|where|who|is there|are there)\s+/i, '');
      t = t.replace(/^(the|a|an)\s+/i, '');
      t = t.replace(/^(you|i)\s+(get started with|know before)\s+/i, function (_, _p, v) {
        return v.charAt(0).toUpperCase() + v.slice(1) + ' ';
      });
      t = t.replace(/^(does|do|is|are|can|should)\s+/i, '');
      t = t.replace(/^(most common mistakes in)\s+/i, 'Common Mistakes in ');
      t = t.replace(/^(get started with)\s+/i, 'Getting Started with ');
    }
    t = t.replace(/\s+/g, ' ').trim();
    if (!t) t = raw.replace(/\b(20\d{2})\s*$/, '').trim();

    // Capitalize first letter; keep existing internals
    t = t.charAt(0).toUpperCase() + t.slice(1);
    // Fix leftover lowercase starters after strip
    t = t.replace(/^(you|does|do|is|are|most|how|what)\b/i, function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });

    var limit = Math.max(12, max - year.length);
    if (t.length <= limit) return (t + year).trim();
    var cut = t.slice(0, limit);
    var sp = cut.lastIndexOf(' ');
    if (sp >= 8) cut = cut.slice(0, sp);
    return (cut.replace(/[,:;.\-\u2013\u2014\s]+$/g, '') + year).trim();
  }
  var ROUTE = {
    q:'knowledge',ce:'knowledge',st:'sales-trainings',ik:'industry-kpis',tk:'tech-stacks',
    gb:'graphics',bs:'sales-book-summaries',er:'electronic-reviews',ra:'revenue-architecture',
    gp:'go-to-market-playbooks',fr:'franchises',ca:'cars',tn:'towns',sc:'schools',
    nl:'nightlife',dn:'dining',bt:'boats',mv:'movies',wl:'wellness',dr:'drills',
    tv:'travel',rs:'resorts',es:'estates',cl:'clubs',lv:'living',ev:'events',
    sy:'style',ga:'gatherings',gm:'gaming',sk:'skills',sp:'speeches',tl:'tools',
    cg:'coaching',co:'collectibles',aq:'aquariums',hf:'highschool-football-recruiting',
    ai:'ai-infrastructure',bo:'buildouts',cd:'contracts',tc:'telco',pt:'pets',
    sw:'software',cr:'crabbing',fs:'fishing'
  };
  function hrefOf(id) {
    var p = pref(id);
    var seg = ROUTE[p] || 'knowledge';
    return '/' + seg + '/' + encodeURIComponent(String(id || ''));
  }
  function topicOf(id) {
    return TI[pref(id)] || '/assets/topics/current-events.jpg';
  }
  function labelOf(id) {
    return PN[pref(id)] || pref(id).toUpperCase();
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function faceOf(id) {
    // DEPRECATED for browse rows — kept only so old callers don't crash.
    // Browse must use squareOf / imgSq. Returning '' blocks double-title face JPGs.
    return '';
  }
  /** Untitled browse square (no baked mosaic title). Prefer when present. */
  function squareOf(id) {
    if (!id) return '';
    return '/assets/qa/' + String(id) + '.sq.jpg';
  }
  function rawImg(e) {
    var id = e && e.id;
    // Browse squares ONLY: untitled .sq.jpg (or stamped imgSq). NEVER mosaic face — that doubles titles.
    if (e && e.imgSq) return e.imgSq;
    if (e && e.img && /\.sq\.jpg(\?|$)/i.test(String(e.img))) return e.img;
    if (id) return squareOf(id);
    return topicOf(id);
  }

  /** Pick an image not already used in this row. Skip card if every candidate is taken. */
  function claimImg(e, used) {
    used = used || Object.create(null);
    var id = e && e.id;
    var cands = [];
    if (e && e.imgSq) cands.push(e.imgSq);
    if (id) cands.push(squareOf(id));
    // Allow non-face stamped imgs only if they are already .sq.jpg (never mosaic .jpg face cards)
    if (e && e.img && /\.sq\.jpg(\?|$)/i.test(String(e.img))) cands.push(e.img);
    var fb = topicOf(id);
    if (fb) cands.push(fb);
    for (var i = 0; i < cands.length; i++) {
      var a = cands[i];
      if (!a || used[a]) continue;
      // Hard ban: baked face mosaics on browse rows
      if (/\.jpg(\?|$)/i.test(a) && !/\.sq\.jpg(\?|$)/i.test(a) && /\/assets\/qa\//i.test(a)) continue;
      used[a] = 1;
      return a;
    }
    return null;
  }

  function uniqueOnScreen(entries, used, allowDupes) {
    used = used || Object.create(null);
    var out = [];
    (entries || []).forEach(function (e) {
      if (!e) return;
      var img = claimImg(e, used);
      if (!img) {
        if (!allowDupes) return; // drop rather than repeat the same picture
        img = rawImg(e) || topicOf(e.id);
        if (!img || used[img]) return;
        used[img] = 1;
      }
      var copy = {};
      for (var k in e) if (Object.prototype.hasOwnProperty.call(e, k)) copy[k] = e[k];
      copy.img = img;
      out.push(copy);
    });
    return out;
  }

  // Soft blank — no network until hydrate. Keeps scroll buttery with dozens of rows.
  var IMG_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  /** Live/draft: 2× CSS-size WebP thumbs (sharp + light). Local stays direct for quality preview. */
  function browseThumb(path) {
    var src = String(path || '');
    if (!src || src.indexOf('data:') === 0 || /wsrv\.nl/i.test(src)) return src;
    var host = '';
    try { host = String(location.hostname || ''); } catch (err) { host = ''; }
    if (!host || host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host) || /^10\./.test(host)) {
      return src;
    }
    var abs = src;
    if (src.charAt(0) === '/') {
      try { abs = location.origin + src.split('?')[0]; } catch (err2) { return src; }
    } else if (!/^https?:\/\//i.test(src)) {
      return src;
    }
    return 'https://wsrv.nl/?url=' + encodeURIComponent(abs) + '&w=440&h=396&fit=cover&output=webp&q=82';
  }

  function cardHtml(e, opts) {
    opts = opts || {};
    var id = e && e.id;
    if (!id && !(e && e.href)) return '';
    var href = e.href || hrefOf(id);
    var full = String(e.question || e.title || e.label || id || '');
    var q = esc(shortTitle(full, 36));
    var tip = esc(full);
    var label = esc(e.cat || (id ? labelOf(id) : '') || '');
    var rawImg = String(e.imgSq || (e.img && /\.sq\.jpg(\?|$)/i.test(String(e.img)) ? e.img : '') || squareOf(id) || topicOf(id || 'q') || '');
    var thumb = browseThumb(rawImg);
    var img = esc(thumb);
    var origAttr = (thumb !== rawImg && rawImg) ? ' data-orig="' + esc(rawImg) + '"' : '';
    var fallback = esc(browseThumb(topicOf(id || 'q')));
    var col = opts.color || colorOf(id || opts.pillar || 'q');
    // Creative lag fix: paint cards immediately, hydrate real photos only near the lens.
    return '<a class="rcard" href="' + esc(href) + '" style="--tc:' + col + '" title="' + tip + '">'
      + '<span class="rcard-imgwrap"><img class="psq-img" width="220" height="198" decoding="async" draggable="false" src="' + IMG_PLACEHOLDER + '" data-src="' + img + '"' + origAttr + ' alt="' + tip + '" data-fb="' + fallback + '" onerror="window.PulseSquares&&PulseSquares.imgFail(this)"></span>'
      + (label ? '<div class="rc">' + label + '</div>' : '')
      + '<div class="rt"><span>' + q + '</span></div></a>';
  }

  /** Reveal images as they enter the horizontal lens (or vertical page). Caps decode thrash. */
  function wireLazyImgs(sc) {
    if (!sc) return;
    var imgs = sc.querySelectorAll('img.psq-img[data-src]');
    if (!imgs.length) return;

    function reveal(img) {
      if (!img || img.__psqHydrated) return;
      var src = img.getAttribute('data-src');
      if (!src) return;
      img.__psqHydrated = true;
      img.removeAttribute('data-src');
      // Fade in ONLY after the render trick's pixels are fully decoded & paint-ready — never
      // mid-swap. `load` fires when bytes arrive but BEFORE decode, so fading there flashes a
      // blank/half-decoded frame (the mobile+desktop flicker). decode() resolves post-decode.
      var lit = false;
      function light() {
        if (lit) return; lit = true;
        img.removeEventListener('load', onLoad);
        // one frame so the opacity:0 baseline is committed before transitioning to 1
        requestAnimationFrame(function () { img.classList.add('is-on'); });
      }
      function onLoad() {
        if (typeof img.decode === 'function') { img.decode().then(light, light); }
        else light();
      }
      img.addEventListener('load', onLoad);
      img.src = src;                                   // <-- render trick fires here
      if (img.complete && img.naturalWidth) onLoad();  // cached: still decode-gate for a clean paint
    }

    // First screenful: hydrate now with high priority (phone or monitor width).
    var eager = 2;
    try {
      var mob = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.innerWidth || 900) < 700;
      if (mob) eager = 2;
      else if (window.__PULSE_FIRST_SCREEN_N) eager = Math.max(3, Math.min(8, window.__PULSE_FIRST_SCREEN_N|0));
      else eager = 4;
    } catch (errE) {}
    // If fly-in owns hydrate, skip eager (caller handles)
    if (sc.__psqFlyHydrate) {
      return;
    }
    for (var i = 0; i < imgs.length && i < eager; i++) {
      try { imgs[i].setAttribute('fetchpriority', 'high'); } catch (errP) {}
      reveal(imgs[i]);
    }

    if (typeof IntersectionObserver !== 'function') {
      for (var j = eager; j < imgs.length; j++) reveal(imgs[j]);
      return;
    }
    if (sc.__psqImgIo) {
      try { sc.__psqImgIo.disconnect(); } catch (err) {}
    }
    var io = new IntersectionObserver(function (ents) {
      for (var k = 0; k < ents.length; k++) {
        if (ents[k].isIntersecting) {
          reveal(ents[k].target);
          try { io.unobserve(ents[k].target); } catch (err2) {}
        }
      }
    }, { root: sc, rootMargin: '0px 100px 0px 100px', threshold: 0.01 });
    sc.__psqImgIo = io;
    for (var n = eager; n < imgs.length; n++) io.observe(imgs[n]);
  }

  /** Missing .sq.jpg → topic stock once. NEVER fall back to baked face mosaics (double-title bug). */
  function imgFail(img) {
    if (!img) return;
    // Thumb proxy miss → original full square (quality preserved)
    var orig = img.getAttribute('data-orig') || '';
    if (orig) {
      img.removeAttribute('data-orig');
      img.onerror = function () { imgFail(img); };
      img.src = orig;
      return;
    }
    var fb = img.getAttribute('data-fb') || '';
    img.onerror = null;
    var sc = img.closest('.psq-scroll, .recentscroll');
    if (!sc) sc = img.closest('a');
    if (sc && !sc.__psqFbUsed) sc.__psqFbUsed = Object.create(null);
    if (fb && sc && !sc.__psqFbUsed[fb]) {
      sc.__psqFbUsed[fb] = 1;
      img.removeAttribute('data-src');
      img.__psqHydrated = true;
      img.addEventListener('load', function () { img.classList.add('is-on'); });
      img.src = fb;
      return;
    }
    var a = img.closest('a.rcard, a.psq');
    if (a) try { a.remove(); } catch (err) {}
  }

  function wireGrabScroll(sc, opts) {
    opts = opts || {};
    if (!sc || sc.__psqWired) return;
    sc.__psqWired = true;
    // Owner 2026-07-12: no idle autoscroll — thumb only.
    var drag = false, moved = false, startX = 0, startY = 0, startLeft = 0, pid = null;
    var pressed = null, suppressClick = false, touchy = false;
    var DRAG_MOUSE = 8;
    var DRAG_TOUCH = 12;
    var VERT_CANCEL = 14;
    var lastX = 0, lastT = 0, velX = 0; // px/ms finger → fling uses -vel
    var momRaf = 0;
    var reduceMotion = false;
    var isMob = false;
    try {
      reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      isMob = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.innerWidth || 900) < 700;
    } catch (err0) {}
    // 1:1 drag; gentler mobile fling (owner 2026-07-13 — less vigorous thumb coast)
    var SWIPE_GAIN = 1;
    var FLING_BOOST = isMob ? 1.25 : 1.55;

    function dragThresh() { return touchy ? DRAG_TOUCH : DRAG_MOUSE; }
    function stopMom() {
      if (momRaf) { cancelAnimationFrame(momRaf); momRaf = 0; }
      sc.classList.remove('is-flinging');
    }
    function fling(vx) {
      // vx = scrollLeft velocity in px/ms
      stopMom();
      if (reduceMotion || !vx || Math.abs(vx) < 0.08) return;
      var v = vx * FLING_BOOST;
      // Soft cap — a flick covers a few cards, not half the row
      var cap = isMob ? 1.85 : 2.6;
      if (v > cap) v = cap;
      if (v < -cap) v = -cap;
      sc.classList.add('is-flinging');
      var last = performance.now();
      var friction = isMob ? 0.90 : 0.945; // mobile dies sooner
      function step(now) {
        var dt = Math.min(34, now - last); last = now;
        var max = Math.max(0, sc.scrollWidth - sc.clientWidth);
        sc.scrollLeft += v * dt;
        // Allow endless-loop wrap to run; re-read max each frame
        v *= Math.pow(friction, dt / 16);
        if (Math.abs(v) < 0.04) {
          stopMom();
          return;
        }
        momRaf = requestAnimationFrame(step);
      }
      momRaf = requestAnimationFrame(step);
    }

    // Wheel: horizontal moves the row; vertical page scroll wins.
    sc.addEventListener('wheel', function (e) {
      var dy = e.deltaY;
      var dx = e.deltaX;
      if (e.deltaMode === 1) { dy *= 16; dx *= 16; }
      else if (e.deltaMode === 2) { dy *= window.innerHeight; dx *= sc.clientWidth; }
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2) {
        e.preventDefault();
        e.stopPropagation();
        stopMom();
        sc.scrollLeft += dx * 1.25;
      }
    }, { passive: false });

    sc.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      touchy = e.pointerType === 'touch' || e.pointerType === 'pen';
      stopMom();
      drag = true; moved = false; pid = e.pointerId;
      startX = e.clientX; startY = e.clientY; startLeft = sc.scrollLeft;
      lastX = e.clientX; lastT = performance.now(); velX = 0;
      pressed = e.target && e.target.closest ? e.target.closest('a.rcard, a.psq') : null;
      suppressClick = false;
      if (!touchy) {
        try { sc.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });
    sc.addEventListener('pointermove', function (e) {
      if (!drag || (pid != null && e.pointerId !== pid)) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var now = performance.now();
      var dt = Math.max(1, now - lastT);
      var instant = (e.clientX - lastX) / dt;
      // Favor recent samples so a hard flick registers
      velX = velX * 0.2 + instant * 0.8;
      lastX = e.clientX; lastT = now;
      if (touchy && Math.abs(dy) > VERT_CANCEL && Math.abs(dy) >= Math.abs(dx)) {
        moved = true;
        pressed = null;
        drag = false;
        sc.classList.remove('is-dragging');
        return;
      }
      if (Math.abs(dx) > dragThresh()) {
        if (!moved) { moved = true; sc.classList.add('is-dragging'); }
        sc.scrollLeft = startLeft - dx * SWIPE_GAIN;
        e.preventDefault();
      }
    }, { passive: false });
    function onUp(e) {
      if (!drag || (pid != null && e.pointerId !== pid)) return;
      var wasMoved = moved;
      var dx = Math.abs(e.clientX - startX);
      var dy = Math.abs(e.clientY - startY);
      var scrollDelta = Math.abs(sc.scrollLeft - startLeft);
      var th = dragThresh();
      var stale = (performance.now() - lastT) > 90; // finger paused → no fling
      var tap = !wasMoved && pressed && pressed.getAttribute('href')
        && scrollDelta < 6 && dx < th && dy < (touchy ? VERT_CANCEL : th);
      var go = tap ? pressed.getAttribute('href') : '';
      var flingVel = (wasMoved && !stale) ? (-velX * SWIPE_GAIN) : 0;
      drag = false; pid = null; pressed = null; moved = false; touchy = false;
      velX = 0;
      sc.classList.remove('is-dragging');
      try { sc.releasePointerCapture(e.pointerId); } catch (err) {}
      if (go) {
        suppressClick = true;
        e.preventDefault();
        location.href = go;
        return;
      }
      if (wasMoved || scrollDelta >= 6) {
        suppressClick = true;
        fling(flingVel);
      }
    }
    sc.addEventListener('pointerup', onUp);
    sc.addEventListener('pointercancel', onUp);
    sc.addEventListener('click', function (e) {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  /** Soft wrap only after truly past the end — let the last card fully “hit right”. */
  function wireEndlessLoop(sc) {
    if (!sc || sc.__psqLoop) return;
    sc.__psqLoop = true;
    var lock = false;
    function wrap() {
      if (lock) return;
      var max = sc.scrollWidth - sc.clientWidth;
      if (max < 80) return;
      // Was max-2 (jumped before last card settled). Now only after overshoot.
      if (sc.scrollLeft >= max - 0.5) {
        lock = true;
        sc.scrollLeft = 0;
        lock = false;
      } else if (sc.scrollLeft <= 0) {
        // Stay at 0 while dragging left; wrap only if user keeps past start mid-fling
        // (no jump on first pixel — felt like “can’t hit left/right”)
      }
    }
    sc.addEventListener('scroll', wrap, { passive: true });
  }

  /** Top→bottom: row drops in, then cards soft-fill L→R (buys decode time). */
  function wireFlyIn(sc, opts) {
    opts = opts || {};
    if (!sc) {
      if (opts.onFlyDone) opts.onFlyDone();
      return;
    }
    var row = sc.closest('.psq-row, .recentrow');
    var cards = sc.querySelectorAll('a.rcard, a.psq');
    var reduce = false;
    try { reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (err) {}
    var stagger = opts.flyStaggerMs != null ? opts.flyStaggerMs : 140;

    function revealImg(card) {
      var img = card && card.querySelector('img.psq-img[data-src]');
      if (!img || img.__psqHydrated) return;
      var src = img.getAttribute('data-src');
      if (!src) return;
      img.__psqHydrated = true;
      img.removeAttribute('data-src');
      // Decode-gated fade: wait for the render trick to finish decoding before revealing.
      var lit = false;
      function light() {
        if (lit) return; lit = true;
        img.removeEventListener('load', onLoad);
        requestAnimationFrame(function () { img.classList.add('is-on'); });
      }
      function onLoad() {
        if (typeof img.decode === 'function') { img.decode().then(light, light); }
        else light();
      }
      img.addEventListener('load', onLoad);
      img.src = src;
      if (img.complete && img.naturalWidth) onLoad();
    }

    function fillCards(done) {
      var flyMax = opts.flyMax != null ? opts.flyMax : cards.length;
      if (flyMax > cards.length) flyMax = cards.length;
      if (!cards.length || reduce) {
        for (var r = 0; r < cards.length; r++) {
          cards[r].classList.add('psq-fly', 'is-in');
          revealImg(cards[r]);
        }
        wireLazyImgs(sc);
        if (done) done();
        return;
      }
      for (var c = 0; c < cards.length; c++) {
        if (c < flyMax) cards[c].classList.add('psq-fly');
        else cards[c].classList.add('psq-fly', 'is-in');
      }
      var i = 0;
      function step() {
        if (!sc.isConnected) { if (done) done(); return; }
        if (i >= flyMax) {
          wireLazyImgs(sc);
          if (done) done();
          return;
        }
        var card = cards[i++];
        card.classList.add('is-in');
        revealImg(card);
        setTimeout(step, stagger);
      }
      setTimeout(step, 40);
    }

    if (row && !reduce) {
      row.classList.add('psq-row-enter');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          row.classList.add('is-in');
          // After row lands, fill cards L→R
          setTimeout(function () { fillCards(opts.onFlyDone); }, 520);
        });
      });
      return;
    }
    if (row) row.classList.add('psq-row-enter', 'is-in');
    fillCards(opts.onFlyDone);
  }

  function paintRow(el, entries, opts) {
    opts = opts || {};
    if (!el) return;
    // Keep FULL source pool so 30‑min reshuffle can draw different squares (not just reorder the same N).
    if (!opts._reshufflePass) {
      el.__psqSource = Array.isArray(entries) ? entries.filter(Boolean) : [];
    } else if (Array.isArray(entries) && entries.length > (el.__psqSource || []).length) {
      el.__psqSource = entries.filter(Boolean);
    }
    el.__psqOpts = opts;
    var pool = el.__psqSource || [];
    var used = opts.usedImages || Object.create(null);
    if (!opts.usedImages || opts._reshufflePass) used = Object.create(null);

    var lim = opts.limit != null ? opts.limit : 40;
    if (lim > 200) lim = 200;

    // Prefer cards not shown last time so reshuffle feels like new face/squares
    var avoid = opts._reshufflePass ? (el.__psqLastIds || Object.create(null)) : Object.create(null);
    var list = shuffle(pool.slice());
    list = uniqueOnScreen(list, used, opts.allowImageDupes === true);

    var fresh = [];
    var rest = [];
    for (var i = 0; i < list.length; i++) {
      var id = list[i] && list[i].id ? String(list[i].id) : '';
      if (id && avoid[id]) rest.push(list[i]);
      else fresh.push(list[i]);
    }
    list = fresh.concat(rest).slice(0, lim);
    if (!list.length) { el.style.display = 'none'; return; }

    var shown = Object.create(null);
    for (var s = 0; s < list.length; s++) {
      if (list[s] && list[s].id) shown[String(list[s].id)] = 1;
    }
    el.__psqLastIds = shown;

    var title = opts.title || '';
    var moreHref = opts.moreHref || '';
    var inv = opts.inventory != null ? Number(opts.inventory) : (opts.count != null ? Number(opts.count) : 0);
    if (!isFinite(inv) || inv < 0) inv = 0;
    var invHtml = inv > 0
      ? ' <span class="psq-inv" title="Inventory">' + inv.toLocaleString() + '</span>'
      : '';
    var col = opts.color || (opts.pillar ? colorOf(opts.pillar) : null);
    if (col) opts.color = col; // lock whole row to one trim
    var head = title
      ? '<h3>' + (moreHref
        ? '<a class="psq-head" href="' + esc(moreHref) + '">' + esc(title) + invHtml + '</a>'
        : (esc(title) + invHtml)) + '</h3>'
      : '';
    // One set only — endless L/R via scroll wrap (no dual-DOM; cuts lag ~2×)
    var cards = list.map(function (e) { return cardHtml(e, opts); }).join('');
    el.className = 'recentrow psq-row';
    if (col) el.style.setProperty('--tc', col);
    el.innerHTML = head + '<div class="recentscroll psq-scroll" tabindex="0" role="region" aria-label="' + esc(title || 'Browse') + '">'
      + cards + '</div>';
    el.style.display = 'block';
    var scNode = el.querySelector('.recentscroll');
    // New scroll node each paint — wire once per node (do not clear __psqWired)
    wireGrabScroll(scNode, opts);
    wireEndlessLoop(scNode);
    // Reshuffle: no fly-in (instant swap of different squares)
    var doFly = opts.flyIn !== false && !opts._reshufflePass;
    if (doFly) {
      scNode.__psqFlyHydrate = true;
      wireFlyIn(scNode, {
        flyStaggerMs: opts.flyStaggerMs,
        flyMax: opts.flyMax,
        onFlyDone: opts.onFlyDone
      });
    } else {
      wireLazyImgs(scNode);
      if (opts.onFlyDone) opts.onFlyDone();
    }

    // Mix in NEW squares 1-by-1 (visually healthier than nuking the whole row).
    // Default cadence 15s per swap — one card at a time per row (owner 2026-07-13)
    if (opts.reshuffle !== false && !el.__psqReshuffleTimer) {
      var period = opts.reshuffleMs || 15 * 1000;
      // Stagger row starts so the page doesn't pulse in sync
      var stagger = Math.floor(Math.random() * Math.min(period, 8000));

      function shownIds() {
        var ids = Object.create(null);
        var cards = el.querySelectorAll('a.rcard, a.psq');
        for (var i = 0; i < cards.length; i++) {
          var href = cards[i].getAttribute('href') || '';
          var m = href.match(/\/knowledge\/([^/?#]+)/i);
          if (m) ids[decodeURIComponent(m[1])] = 1;
        }
        return ids;
      }

      function swapOneCard() {
        if (document.hidden || !el.isConnected) return;
        var sc = el.querySelector('.recentscroll, .psq-scroll');
        if (!sc) return;
        var cards = sc.querySelectorAll('a.rcard, a.psq');
        if (!cards.length) return;
        var src = el.__psqSource || [];
        if (src.length < 2) return;

        var onScreen = shownIds();
        var candidates = [];
        for (var i = 0; i < src.length; i++) {
          var e = src[i];
          if (!e || !e.id) continue;
          if (!onScreen[String(e.id)]) candidates.push(e);
        }
        if (!candidates.length) {
          // Soft refresh pool, then try again next tick
          if (typeof el.__psqRefetch === 'function') {
            el.__psqRefetch().then(function (fresh) {
              if (Array.isArray(fresh) && fresh.length) el.__psqSource = fresh;
            }).catch(function () {});
          }
          return;
        }

        var pick = candidates[Math.floor(Math.random() * candidates.length)];
        // Prefer swapping a card near the visible window (healthier than far off-screen churn)
        var target = null;
        var sl = sc.scrollLeft || 0;
        var vw = sc.clientWidth || 800;
        var near = [];
        var far = [];
        for (var c = 0; c < cards.length; c++) {
          var left = cards[c].offsetLeft;
          var w = cards[c].offsetWidth || 220;
          if (left + w > sl - 40 && left < sl + vw + 40) near.push(cards[c]);
          else far.push(cards[c]);
        }
        var poolCards = near.length ? near : cards;
        target = poolCards[Math.floor(Math.random() * poolCards.length)];
        if (!target) return;

        var html = cardHtml(pick, Object.assign({}, el.__psqOpts || opts));
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        var neu = wrap.firstChild;
        if (!neu) return;

        var reduce = false;
        try { reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (errR) {}

        // Slow, progressive swap — old eases out, new rises in (owner 2026-07-13)
        if (reduce) {
          target.parentNode.replaceChild(neu, target);
          var imgFast = neu.querySelector('img.psq-img[data-src]');
          if (imgFast) {
            var sf = imgFast.getAttribute('data-src');
            imgFast.removeAttribute('data-src');
            imgFast.src = sf;
            imgFast.classList.add('is-on');
          }
          return;
        }

        target.classList.add('psq-swap-out');
        setTimeout(function () {
          if (!target.parentNode) return;
          neu.classList.add('psq-swap-in');
          target.parentNode.replaceChild(neu, target);
          var img = neu.querySelector('img.psq-img[data-src]');
          if (img) {
            var s = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            // Decode-gate the rising card so it never fades in a blank/half-decoded frame.
            var swapLit = false;
            var swapLight = function () {
              if (swapLit) return; swapLit = true;
              img.removeEventListener('load', swapReady);
              requestAnimationFrame(function () { img.classList.add('is-on'); });
            };
            var swapReady = function () {
              if (typeof img.decode === 'function') { img.decode().then(swapLight, swapLight); }
              else swapLight();
            };
            img.addEventListener('load', swapReady);
            img.src = s;
            if (img.complete && img.naturalWidth) swapReady();
          } else {
            var on = neu.querySelector('img.psq-img');
            if (on) on.classList.add('is-on');
          }
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { neu.classList.add('is-in'); });
          });
        }, 720);
      }

      function tickSwap() {
        swapOneCard();
        // Occasionally refresh pool so 90s mixes stay fresh (not the same N forever)
        if (typeof el.__psqRefetch === 'function' && Math.random() < 0.35) {
          el.__psqRefetch().then(function (fresh) {
            if (Array.isArray(fresh) && fresh.length) el.__psqSource = fresh;
          }).catch(function () {});
        }
      }

      el.__psqReshuffleTimer = setTimeout(function () {
        tickSwap();
        el.__psqReshuffleTimer = setInterval(tickSwap, period);
      }, stagger); // start soon; then every 15s per row
    }
  }

  function paintGrid(el, entries, opts) {
    opts = opts || {};
    if (!el) return;
    el.__psqSource = Array.isArray(entries) ? entries.filter(Boolean) : [];
    el.__psqOpts = opts;
    var list = shuffle(el.__psqSource.slice());
    list = uniqueOnScreen(list, Object.create(null), opts.allowImageDupes);
    var glim = opts.limit != null ? opts.limit : 60;
    if (glim > 80) glim = 80;
    list = list.slice(0, glim);
    el.className = (el.className || '').replace(/\bpsq-grid\b/g, '').trim() + ' psq-grid';
    if (!list.length) {
      el.innerHTML = '<p style="color:rgba(234,193,92,.55);padding:24px;text-align:center">Nothing here yet.</p>';
      return;
    }
    el.innerHTML = list.map(function (e) { return cardHtml(e, opts); }).join('');
    wireLazyImgs(el);
    if (opts.reshuffle !== false && !el.__psqReshuffleTimer) {
      el.__psqReshuffleTimer = setInterval(function () {
        if (document.hidden) return;
        paintGrid(el, el.__psqSource || [], Object.assign({}, el.__psqOpts || opts));
      }, opts.reshuffleMs || 15 * 1000);
    }
  }

  global.PulseSquares = {
    pref: pref,
    esc: esc,
    hrefOf: hrefOf,
    topicOf: topicOf,
    labelOf: labelOf,
    shortTitle: shortTitle,
    colorOf: colorOf,
    shuffle: shuffle,
    rawImg: rawImg,
    faceOf: faceOf,
    squareOf: squareOf,
    imgFail: imgFail,
    uniqueOnScreen: uniqueOnScreen,
    cardHtml: cardHtml,
    wireLazyImgs: wireLazyImgs,
    wireGrabScroll: wireGrabScroll,
    wireEndlessLoop: wireEndlessLoop,
    wireFlyIn: wireFlyIn,
    paintRow: paintRow,
    paintGrid: paintGrid,
    PN: PN,
    TI: TI,
    TC: TC
  };
})(typeof window !== 'undefined' ? window : this);
