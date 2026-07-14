/* pulse-square-refresh.js — keep the homepage lively (owner 2026-07-14).
 * Every ~15s, each visible row fades ONE random visible square out and a FRESH one in.
 * Standalone add-on: no changes to pulse-squares.js. Draws fresh cards from the pool of
 * already-rendered cards not currently on screen. Respects reduced-motion; pauses when hidden. */
(function () {
  if (window.__pulseSquareRefresh) return;
  window.__pulseSquareRefresh = true;

  try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}

  var INTERVAL = 15000;   // per-row swap cadence
  var FADE_MS = 550;      // fade-out / fade-in duration
  var ROW_SEL = '.psq-row, .recentrow';
  var CARD_SEL = 'a.rcard, a.psq';

  function inViewport(el, pad) {
    pad = pad || 0;
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > -pad && r.top < vh + pad && r.right > -pad && r.left < vw + pad;
  }

  function hrefOf(card) { return card.getAttribute('href') || ''; }

  // Every card currently on screen — never fade in a duplicate of something already showing.
  function visibleHrefs() {
    var set = {};
    var cards = document.querySelectorAll(CARD_SEL);
    for (var i = 0; i < cards.length; i++) { if (inViewport(cards[i], 40)) set[hrefOf(cards[i])] = 1; }
    return set;
  }

  // A card is safe to reuse only if its photo has ALREADY loaded — otherwise we'd swap in a blank
  // placeholder (the mosaic hydrates images lazily as they scroll into the lens).
  function isLoaded(card) {
    var img = card.querySelector && card.querySelector('img');
    if (!img) return false;
    if (img.hasAttribute('data-src')) return false;           // not yet hydrated
    var src = img.getAttribute('src') || '';
    if (!src || src.indexOf('data:') === 0) return false;      // still the transparent placeholder
    return img.classList.contains('is-on') || (img.complete && img.naturalWidth > 1);
  }

  // Fresh-card pool = LOADED cards not currently visible (guarantees the swapped-in square shows a photo).
  function buildPool(visible) {
    var pool = [], seen = {};
    var cards = document.querySelectorAll(CARD_SEL);
    for (var i = 0; i < cards.length; i++) {
      var h = hrefOf(cards[i]);
      if (!h || seen[h] || visible[h] || !isLoaded(cards[i])) continue;
      seen[h] = 1;
      pool.push(cards[i].outerHTML);
    }
    return pool;
  }

  function crossFade(oldCard, newHtml) {
    var tmp = document.createElement('div');
    tmp.innerHTML = newHtml;
    var nu = tmp.firstElementChild;
    if (!nu) return;
    oldCard.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    oldCard.style.opacity = '0';
    setTimeout(function () {
      if (!oldCard.parentNode) return;
      nu.style.opacity = '0';
      nu.style.transition = 'opacity ' + FADE_MS + 'ms ease';
      oldCard.parentNode.replaceChild(nu, oldCard);
      // hydrate the swapped-in photo (data-src → src) via the mosaic helper if present
      try {
        var sc = nu.closest && (nu.closest('.psq-scroll') || nu.parentNode);
        if (window.PulseSquares && PulseSquares.wireLazyImgs && sc) PulseSquares.wireLazyImgs(sc);
        else { var im = nu.querySelector && nu.querySelector('img[data-src]'); if (im) { im.src = im.getAttribute('data-src'); im.classList.add('is-on'); } }
      } catch (e) {}
      requestAnimationFrame(function () { nu.style.opacity = '1'; });
    }, FADE_MS);
  }

  function tick() {
    if (document.hidden) return;
    var rows = document.querySelectorAll(ROW_SEL);
    if (!rows.length) return;
    var visible = visibleHrefs();
    var pool = buildPool(visible);
    if (!pool.length) return;
    for (var i = 0; i < rows.length; i++) {
      if (!inViewport(rows[i], 0)) continue;               // only rows on screen
      var cards = rows[i].querySelectorAll(CARD_SEL);
      var vis = [];
      for (var j = 0; j < cards.length; j++) { if (inViewport(cards[j], 0) && cards[j].style.opacity !== '0') vis.push(cards[j]); }
      if (!vis.length) continue;
      var target = vis[Math.floor(Math.random() * vis.length)];
      var pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick || pick.indexOf(hrefOf(target)) !== -1) continue;   // skip if same entry
      crossFade(target, pick);
    }
  }

  var timer = null;
  function start() { if (!timer) timer = setInterval(tick, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

  // give the mosaic time to paint the first rows before the first swap
  setTimeout(start, INTERVAL);
  window.PulseSquareRefresh = { tick: tick, start: start, stop: stop };
})();
