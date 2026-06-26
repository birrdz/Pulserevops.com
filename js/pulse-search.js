/* PULSE smart search — predictive autocomplete + fuzzy + synonyms + ranking.
   Self-contained. Expects markup:
     #home-search > .hs-field (#hs-ghost[.g-typed,.g-rest], #hs-input, #hs-clear) + #hs-suggest
   Data: /.netlify/functions/pulse-machine-library-list?recent=12000  (id, question/title, ts) */
(function () {
  'use strict';
  var PMAP = {
    q:['/knowledge/','📚','RevOps Q&A'], st:['/sales-trainings/','🎓','Sales Training'], ik:['/industry-kpis/','📊','Industry KPI'],
    tk:['/tech-stacks/','🧰','Tech Stack'], gb:['/graphics/','🎨','Graphic'], bs:['/sales-book-summaries/','📖','Book Summary'],
    er:['/electronic-reviews/','⭐','Electronics'], ra:['/revenue-architecture/','🏗️','Revenue Architecture'],
    gp:['/go-to-market-playbooks/','🗺️','GTM Playbook'], fr:['/franchises/','🏪','Franchise'], ca:['/cars/','🚗','Cars'],
    tn:['/towns/','🏘️','Towns'], sc:['/schools/','🏫','Schools'], nl:['/nightlife/','🌃','Nightlife'], dn:['/dining/','🍽️','Dining'],
    bt:['/boats/','⛵','Boats'], mv:['/movies/','🎬','Movies'], wl:['/wellness/','🧘','Wellness'], dr:['/drills/','🛠','Drills'],
    tv:['/travel/','✈️','Travel'], rs:['/resorts/','🌴','Resorts'], es:['/estates/','🏡','Estates'], cl:['/clubs/','⛳','Clubs'],
    lv:['/living/','🛋','Living'], ev:['/events/','🎟','Events'], sy:['/style/','👗','Style'], ga:['/gatherings/','🥂','Gatherings'],
    gm:['/gaming/','🎮','Gaming'], sk:['/skills/','🎯','Skills'], tl:['/tools/','🛠️','Tools'], cg:['/coaching/','🧭','Coaching'],
    co:['/collectibles/','🃏','Collectibles'], aq:['/aquariums/','🐠','Aquariums'], hf:['/highschool-football-recruiting/','🏈','Football Recruiting'], ai:['/ai-infrastructure/','🤖','AI Tools'], bo:['/buildouts/','🏗️','Buildouts'], cd:['/contracts/','📑','Contracts']
  };
  var SYN = {
    cro:['chief revenue officer'], revops:['revenue operations','rev ops'], gtm:['go to market','go-to-market'],
    kpi:['kpis','metric','metrics'], movie:['movies','film','films'], film:['movie','movies','films'],
    car:['cars','vehicle','vehicles','auto','automobile'], boat:['boats','yacht','vessel'], school:['schools','college','university'],
    ai:['artificial intelligence'], saas:['software'], vc:['venture capital'], comp:['compensation','commission'],
    sdr:['bdr','sales development'], ae:['account executive'], crm:['salesforce','hubspot'], nrr:['net revenue retention'],
    pe:['private equity'], jordans:['air jordan','sneakers'], sneaker:['sneakers','shoes']
  };
  var EXAMPLES = ['best sci-fi movies','fractional CRO','country clubs in florida','best AI tools for coding',
    'air jordans','boats for the chesapeake bay','sales compensation plan','how to forecast revenue','luxury watches','q1946'];

  var $ = function (id) { return document.getElementById(id); };
  var input = $('hs-input'), box = $('hs-suggest'), clr = $('hs-clear'), ghost = $('hs-ghost');
  if (!input || !box) return;
  var gTyped = ghost && ghost.querySelector('.g-typed'), gRest = ghost && ghost.querySelector('.g-rest');

  var ALL = null, loading = false, loadWait = [], active = -1, rows = [], lastQ = '';
  var HIST_KEY = 'pulse_search_hist';

  function pref(id){ var m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : ''; }
  function routeOf(id){ var c = PMAP[pref(id)]; return (c ? c[0] : '/knowledge/') + id; }
  function emojiOf(id){ var c = PMAP[pref(id)]; return c ? c[1] : '📄'; }
  function pillarOf(id){ var c = PMAP[pref(id)]; return c ? c[2] : 'Answer'; }
  function esc(s){ return String(s).replace(/[<>&"]/g, function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }
  function norm(s){ return String(s).toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim(); }

  function getHist(){ try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch(e){ return []; } }
  function pushHist(q){ q = q.trim(); if(!q) return; try { var h = getHist().filter(function(x){ return norm(x) !== norm(q); }); h.unshift(q); localStorage.setItem(HIST_KEY, JSON.stringify(h.slice(0, 8))); } catch(e){} }

  function load(cb){
    if (ALL){ cb && cb(); return; }
    if (loading) { if (cb) loadWait.push(cb); return; }
    loading = true;
    fetch('/.netlify/functions/pulse-machine-library-list?recent=20000&mini=1', { cache: 'default' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        var it = (d && d.entries) || [];
        ALL = it.map(function(e){
          var t = String(e.question || e.title || '');
          var tags = Array.isArray(e.tags) ? e.tags.join(' ') : '';
          return { id:String(e.id||''), t:t, n:norm(t + ' ' + tags), ts:(e.polished_at||e.ts||0) };
        }).filter(function(e){ return e.id && e.t && !/^vq_/i.test(e.id); });
        loading = false;
        var w = loadWait.slice(); loadWait = [];
        cb && cb();
        w.forEach(function(fn){ try { fn(); } catch(_e){} });
      })
      .catch(function(){ loading = false; loadWait = []; });
  }

  // cheap bounded Levenshtein (early-exit at max+1)
  function lev(a, b, max){
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++){
      cur[0] = i; var best = cur[0];
      for (j = 1; j <= lb; j++){
        var cost = a.charCodeAt(i-1) === b.charCodeAt(j-1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + cost);
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[lb];
  }
  function fuzzyWordHit(qw, titleWords){
    var max = qw.length >= 7 ? 2 : (qw.length >= 4 ? 1 : 0);
    if (max === 0) return false;
    for (var k = 0; k < titleWords.length; k++){
      var tw = titleWords[k];
      if (Math.abs(tw.length - qw.length) > max) continue;
      if (lev(qw, tw, max) <= max) return true;
    }
    return false;
  }
  function expand(word){
    var out = [word]; var s = SYN[word]; if (s) out = out.concat(s); return out;
  }

  function score(e, ql, qwords){
    var n = e.n, s = 0;
    if (e.id.toLowerCase() === ql) return 100000;
    if (e.id.toLowerCase().indexOf(ql) === 0) s += 4000;
    if (n === ql) s += 9000;
    if (n.indexOf(ql) === 0) s += 3000;
    else if (n.indexOf(ql) >= 0) s += 1400;
    var tw = n.split(' ');
    var hits = 0, strong = 0, fuzzyUsed = false;
    for (var i = 0; i < qwords.length; i++){
      var variants = expand(qwords[i]), hit = false, wordStrong = false;
      for (var v = 0; v < variants.length; v++){
        var w = variants[v];
        if (n.indexOf(w) >= 0){ hit = true; if (new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(n)) wordStrong = true; break; }
      }
      if (!hit && fuzzyWordHit(qwords[i], tw)){ hit = true; fuzzyUsed = true; }
      if (hit){ hits++; if (wordStrong) strong++; s += wordStrong ? 300 : 160; }
    }
    if (!hits) return s > 0 ? s : 0;
    if (hits < qwords.length) {
      s += hits * 90;
      if (hits < Math.ceil(qwords.length * 0.5)) return s > 400 ? s * 0.6 : 0;
      s -= 180;
    }
    if (fuzzyUsed) s -= 250;
    s += Math.max(0, 60 - n.length) * 2;
    s += Math.min(40, (e.ts ? 1 : 0) * 8);
    return s;
  }

  function run(qv){
    var ql = norm(qv); lastQ = ql;
    if (!ql){ renderEmpty(); return; }
    load(function(){
      if (!ALL) return;
      var res = [];
      // exact / prefix id & bare-number fast paths
      if (/^[a-z]{1,3}\d+$/i.test(ql)){
        ALL.forEach(function(e){ if (e.id.toLowerCase() === ql) res.push({e:e, s:1e6}); });
        ALL.forEach(function(e){ if (e.id.toLowerCase() !== ql && e.id.toLowerCase().indexOf(ql) === 0) res.push({e:e, s:5e5}); });
      } else if (/^\d+$/.test(ql)){
        ALL.forEach(function(e){ if (e.id.toLowerCase() === 'q'+ql) res.push({e:e, s:1e6}); });
        ALL.forEach(function(e){ if (e.id.replace(/^[a-z]+/i,'').indexOf(ql) >= 0 && e.id.toLowerCase() !== 'q'+ql) res.push({e:e, s:4e5}); });
      }
      var qwords = ql.split(' ').filter(Boolean);
      var seen = {}; res.forEach(function(r){ seen[r.e.id] = 1; });
      for (var i = 0; i < ALL.length; i++){
        var e = ALL[i]; if (seen[e.id]) continue;
        var sc = score(e, ql, qwords);
        if (sc > 0) res.push({ e:e, s:sc });
      }
      res.sort(function(a,b){ return b.s - a.s; });
      rows = res.slice(0, 16).map(function(r){ return r.e; });
      renderResults(rows, qv);
      paintGhost(qv, rows);
    });
  }

  function hl(title, qv){
    var safe = esc(title);
    var ql = norm(qv); if (!ql) return safe;
    var parts = ql.split(' ').filter(function(w){ return w.length > 1; });
    parts.push(ql);
    parts = parts.filter(function(v,i,a){ return a.indexOf(v) === i; })
                 .sort(function(a,b){ return b.length - a.length; })
                 .map(function(w){ return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); });
    if (!parts.length) return safe;
    try { return safe.replace(new RegExp('(' + parts.join('|') + ')', 'ig'), '<mark>$1</mark>'); }
    catch(e){ return safe; }
  }

  function rowHtml(e, qv){
    return '<a class="hs-row" role="option" href="' + routeOf(e.id) + '">'
      + '<span class="hs-em">' + emojiOf(e.id) + '</span>'
      + '<span class="hs-t">' + hl(e.t, qv) + '</span>'
      + '<span class="hs-meta"><span class="hs-cat">' + esc(pillarOf(e.id)) + '</span><span class="hs-pill">' + esc(e.id) + '</span></span>'
      + '</a>';
  }

  function renderResults(list, qv){
    active = -1;
    if (!list.length){
      var didYouMean = bestFuzzyTitle(qv);
      box.innerHTML = '<div class="hs-empty">No matches yet for “' + esc(qv) + '”.'
        + (didYouMean ? ' <span class="hs-dym">Did you mean <a href="#" data-q="' + esc(didYouMean) + '">' + esc(didYouMean) + '</a>?</span>' : '')
        + (ALL && !ALL.length ? ' <em>Still loading library…</em>' : '')
        + '</div>';
      wireDym(); box.classList.add('open'); return;
    }
    box.innerHTML = '<div class="hs-sec">Top matches</div>' + list.map(function(e){ return rowHtml(e, qv); }).join('')
      + '<div class="hs-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>Tab</kbd> complete</div>';
    box.classList.add('open');
  }

  function bestFuzzyTitle(qv){
    if (!ALL) return ''; var ql = norm(qv); if (ql.length < 4) return '';
    var best = '', bd = 3;
    for (var i = 0; i < ALL.length && i < 4000; i++){
      var first = ALL[i].n.split(' ').slice(0, ql.split(' ').length).join(' ');
      var d = lev(ql, first.slice(0, ql.length + 2), bd);
      if (d < bd){ bd = d; best = ALL[i].t; if (d === 1) break; }
    }
    return best;
  }

  function renderEmpty(){
    active = -1; rows = [];
    load(function(){
      var html = '';
      var hist = getHist();
      if (hist.length){
        html += '<div class="hs-sec">Recent searches</div>';
        html += hist.slice(0, 5).map(function(q){ return '<a class="hs-row hs-q" href="#" data-q="' + esc(q) + '"><span class="hs-em">🕘</span><span class="hs-t">' + esc(q) + '</span></a>'; }).join('');
      }
      html += '<div class="hs-sec">Try one of these</div><div class="hs-chips">'
        + EXAMPLES.slice(0, 6).map(function(q){ return '<button class="hs-chip" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>';
      if (ALL && ALL.length){
        var recent = ALL.slice().sort(function(a,b){ return (b.ts||0) - (a.ts||0); }).slice(0, 6);
        html += '<div class="hs-sec">Just added</div>' + recent.map(function(e){ return rowHtml(e, ''); }).join('');
      }
      box.innerHTML = html; box.classList.add('open'); wireChips();
    });
  }

  function paintGhost(qv, list){
    if (!gTyped || !gRest) return;
    gTyped.textContent = ''; gRest.textContent = '';
    var ql = norm(qv); if (!ql || !list || !list.length) return;
    // caret must be at end for an inline completion to make sense
    if (input.selectionStart !== input.value.length) return;
    var cand = null;
    for (var i = 0; i < list.length; i++){
      if (list[i].n.indexOf(ql) === 0 && list[i].n.length > ql.length){ cand = list[i]; break; }
    }
    if (!cand) return;
    gTyped.textContent = qv;                       // reserves exact width (transparent)
    gRest.textContent = cand.t.slice(qv.length);   // gray completion
    ghost.dataset.full = cand.t;
  }
  function acceptGhost(){
    if (!ghost || !ghost.dataset.full) return false;
    var full = ghost.dataset.full;
    if (norm(full).indexOf(norm(input.value)) !== 0) return false;
    input.value = full; clr.style.display = 'block';
    gTyped.textContent = ''; gRest.textContent = ''; ghost.dataset.full = '';
    run(full); return true;
  }

  function close(){ box.classList.remove('open'); box.innerHTML = ''; active = -1; if (gTyped){ gTyped.textContent=''; gRest.textContent=''; } }
  function go(id){ pushHist(lastQ || input.value); location.href = routeOf(id); }

  function wireChips(){
    box.querySelectorAll('[data-q]').forEach(function(el){
      el.addEventListener('click', function(ev){ ev.preventDefault(); input.value = el.getAttribute('data-q'); clr.style.display='block'; input.focus(); run(input.value); });
    });
  }
  function wireDym(){ box.querySelectorAll('.hs-dym a[data-q]').forEach(function(el){ el.addEventListener('click', function(ev){ ev.preventDefault(); input.value = el.getAttribute('data-q'); run(input.value); }); }); }

  var t;
  input.addEventListener('input', function(){
    clr.style.display = input.value ? 'block' : 'none';
    if (gTyped){ gTyped.textContent=''; gRest.textContent=''; }
    clearTimeout(t); var v = input.value; t = setTimeout(function(){ run(v); }, 90);
  });
  input.addEventListener('focus', function(){ if (input.value) run(input.value); else renderEmpty(); load(); });
  input.addEventListener('keydown', function(e){
    var items = box.querySelectorAll('.hs-row');
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost && ghost.dataset.full && input.selectionStart === input.value.length){
      if (acceptGhost()){ e.preventDefault(); return; }
    }
    if (e.key === 'ArrowDown'){ e.preventDefault(); active = Math.min(active + 1, items.length - 1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); active = Math.max(active - 1, -1); }
    else if (e.key === 'Enter'){
      if (active >= 0 && items[active]){ pushHist(input.value); location.href = items[active].getAttribute('href'); }
      else if (rows.length){ go(rows[0].id); }
      return;
    }
    else if (e.key === 'Escape'){ close(); return; }
    else return;
    items.forEach(function(el, i){ el.classList.toggle('active', i === active); });
    if (active >= 0 && items[active]) items[active].scrollIntoView({ block: 'nearest' });
  });
  if (clr) clr.addEventListener('click', function(){ input.value = ''; clr.style.display = 'none'; close(); input.focus(); renderEmpty(); });
  document.addEventListener('click', function(e){ var hsEl = $('home-search'); if (hsEl && !hsEl.contains(e.target)) close(); });
  box.addEventListener('click', function(e){ var a = e.target.closest && e.target.closest('.hs-row[href]'); if (a && a.getAttribute('href') !== '#') pushHist(input.value); });
})();
