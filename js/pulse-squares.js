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

  function cardHtml(e, opts) {
    opts = opts || {};
    var id = e && e.id;
    if (!id && !(e && e.href)) return '';
    var href = e.href || hrefOf(id);
    var full = String(e.question || e.title || e.label || id || '');
    var q = esc(shortTitle(full, 36));
    var tip = esc(full);
    var label = esc(e.cat || (id ? labelOf(id) : '') || '');
    var img = esc(e.imgSq || (e.img && /\.sq\.jpg(\?|$)/i.test(String(e.img)) ? e.img : '') || squareOf(id) || topicOf(id || 'q'));
    var fallback = esc(topicOf(id || 'q'));
    var col = opts.color || colorOf(id || opts.pillar || 'q');
    // Creative lag fix: paint cards immediately, hydrate real photos only near the lens.
    return '<a class="rcard" href="' + esc(href) + '" style="--tc:' + col + '" title="' + tip + '">'
      + '<span class="rcard-imgwrap"><img class="psq-img" width="220" height="198" decoding="async" draggable="false" src="' + IMG_PLACEHOLDER + '" data-src="' + img + '" alt="' + tip + '" data-fb="' + fallback + '" onerror="window.PulseSquares&&PulseSquares.imgFail(this)"></span>'
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
      function onReady() {
        img.classList.add('is-on');
        img.removeEventListener('load', onReady);
      }
      img.addEventListener('load', onReady);
      // If cached, load may have already fired
      if (img.complete && img.naturalWidth) onReady();
      img.src = src;
    }

    // First 3 cards in each row: hydrate immediately so the row never looks empty
    for (var i = 0; i < imgs.length && i < 3; i++) reveal(imgs[i]);

    if (typeof IntersectionObserver !== 'function') {
      for (var j = 3; j < imgs.length; j++) reveal(imgs[j]);
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
    }, { root: sc, rootMargin: '0px 280px 0px 280px', threshold: 0.01 });
    sc.__psqImgIo = io;
    for (var n = 3; n < imgs.length; n++) io.observe(imgs[n]);
  }

  /** Missing .sq.jpg → topic stock once. NEVER fall back to baked face mosaics (double-title bug). */
  function imgFail(img) {
    if (!img) return;
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
    var idleMs = opts.idleMs != null ? opts.idleMs : 15000;
    var auto = opts.auto !== false;
    var drag = false, moved = false, startX = 0, startLeft = 0, pid = null;
    var pressed = null, suppressClick = false;
    var DRAG_PX = 12;
    var paused = false, resumeTimer = null, lastInteract = Date.now();
    var hovering = false, rowVisible = true;

    function pause(ms) {
      paused = true;
      lastInteract = Date.now();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (ms == null) return;
      resumeTimer = setTimeout(function () { paused = false; }, ms);
    }

    // Wheel: page up/down only. Never move the row sideways (drag + autoscroll do that).
    sc.addEventListener('wheel', function (e) {
      var dy = e.deltaY;
      var dx = e.deltaX;
      if (e.deltaMode === 1) { dy *= 16; dx *= 16; }
      else if (e.deltaMode === 2) { dy *= window.innerHeight; dx *= sc.clientWidth; }
      e.preventDefault();
      e.stopPropagation();
      // Ignore horizontal trackpad swipes for the row; only scroll the page vertically
      if (dy) window.scrollBy(0, dy);
    }, { passive: false });

    // Remember the card under pointerdown — setPointerCapture retargets pointerup
    // to the scroller, which used to break click → link on Recent + topic rows.
    sc.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = true; moved = false; pid = e.pointerId;
      startX = e.clientX; startLeft = sc.scrollLeft;
      pressed = e.target && e.target.closest ? e.target.closest('a.rcard, a.psq') : null;
      suppressClick = false;
      pause(null);
      try { sc.setPointerCapture(e.pointerId); } catch (err) {}
    });
    sc.addEventListener('pointermove', function (e) {
      if (!drag || (pid != null && e.pointerId !== pid)) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_PX) {
        if (!moved) { moved = true; sc.classList.add('is-dragging'); }
        sc.scrollLeft = startLeft - dx;
        e.preventDefault();
      }
    }, { passive: false });
    function onUp(e) {
      if (!drag || (pid != null && e.pointerId !== pid)) return;
      var wasMoved = moved;
      var go = (!wasMoved && pressed && pressed.getAttribute('href')) ? pressed.href : '';
      drag = false; pid = null; pressed = null; moved = false;
      sc.classList.remove('is-dragging');
      try { sc.releasePointerCapture(e.pointerId); } catch (err) {}
      pause(2800);
      if (go) {
        suppressClick = true;
        e.preventDefault();
        location.href = go;
        return;
      }
      if (wasMoved) suppressClick = true;
    }
    sc.addEventListener('pointerup', onUp);
    sc.addEventListener('pointercancel', onUp);
    sc.addEventListener('click', function (e) {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
    sc.addEventListener('mouseenter', function () { hovering = true; pause(null); });
    sc.addEventListener('mouseleave', function () {
      hovering = false;
      if (!drag) pause(1200);
    });

    // Only auto-creep when the row is on screen — kills lag from dozens of 16ms timers
    if (typeof IntersectionObserver === 'function') {
      try {
        var io = new IntersectionObserver(function (ents) {
          for (var i = 0; i < ents.length; i++) {
            if (ents[i].target === sc) rowVisible = !!ents[i].isIntersecting;
          }
        }, { root: null, threshold: 0.05 });
        io.observe(sc);
      } catch (err) {}
    }

    if (auto) {
      var creep = function () {
        if (!sc.isConnected) return;
        if (rowVisible && !paused && !drag && !document.hidden && !hovering) {
          if (Date.now() - lastInteract >= idleMs) {
            var max = Math.max(0, sc.scrollWidth - sc.clientWidth);
            if (max > 0) {
              if (sc.scrollLeft >= max - 1) sc.scrollLeft = 0;
              else sc.scrollLeft += 0.7;
            }
          }
        }
        // Slower tick when off-screen / hidden — less timer thrash across 40 rows
        setTimeout(creep, rowVisible ? 48 : 600);
      };
      setTimeout(creep, idleMs);
    }
  }

  function paintRow(el, entries, opts) {
    opts = opts || {};
    if (!el) return;
    // Keep source list so we can reshuffle every 30 min without refetch.
    el.__psqSource = Array.isArray(entries) ? entries.filter(Boolean) : [];
    el.__psqOpts = opts;
    var used = opts.usedImages || Object.create(null);
    // Always shuffle card order so repeat visits / refreshes feel fresh.
    var list = shuffle(el.__psqSource.slice());
    // Keep shared page-level used map so no image repeats across rows on screen
    if (!opts.usedImages) used = Object.create(null);
    list = uniqueOnScreen(list, used, opts.allowImageDupes === true);
    // Hard cap DOM cards — thousands of imgs was melting scroll. Pool stays in __psqSource for reshuffle.
    var lim = opts.limit != null ? opts.limit : 40;
    if (lim > 48) lim = 48;
    list = list.slice(0, lim);
    if (!list.length) { el.style.display = 'none'; return; }
    var title = opts.title || '';
    var moreHref = opts.moreHref || '';
    var col = opts.color || (opts.pillar ? colorOf(opts.pillar) : null);
    if (col) opts.color = col; // lock whole row to one trim
    var head = title
      ? '<h3>' + (moreHref
        ? '<a class="psq-head" href="' + esc(moreHref) + '">' + esc(title) + '</a>'
        : esc(title)) + '</h3>'
      : '';
    var cards = list.map(function (e) { return cardHtml(e, opts); }).join('');
    el.className = 'recentrow psq-row';
    if (col) el.style.setProperty('--tc', col);
    el.innerHTML = head + '<div class="recentscroll psq-scroll" tabindex="0" role="region" aria-label="' + esc(title || 'Browse') + '">'
      + cards + '</div>';
    el.style.display = 'block';
    var scNode = el.querySelector('.recentscroll');
    // New scroll node each paint — wire once per node (do not clear __psqWired)
    wireGrabScroll(scNode, opts);
    wireLazyImgs(scNode);

    // STANDING ORDER (owner): every pillar/browse row randomly swaps square order every 30 min.
    // Stagger start so dozens of rows don't all repaint on the same tick (lag).
    if (opts.reshuffle !== false && !el.__psqReshuffleTimer) {
      var period = opts.reshuffleMs || 15 * 60 * 1000;
      var stagger = Math.floor(Math.random() * Math.min(period, 120000));
      el.__psqReshuffleTimer = setTimeout(function tick() {
        el.__psqReshuffleTimer = setInterval(function () {
          if (document.hidden) return;
          var src = el.__psqSource || [];
          if (src.length < 2) return;
          var o = Object.assign({}, el.__psqOpts || opts, {
            usedImages: null,
            shuffle: true,
            _reshufflePass: true
          });
          paintRow(el, src, o);
          var sc2 = el.querySelector('.recentscroll, .psq-scroll');
          if (sc2) sc2.scrollLeft = 0;
        }, period);
      }, stagger);
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
      }, opts.reshuffleMs || 15 * 60 * 1000);
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
    paintRow: paintRow,
    paintGrid: paintGrid,
    PN: PN,
    TI: TI,
    TC: TC
  };
})(typeof window !== 'undefined' ? window : this);
