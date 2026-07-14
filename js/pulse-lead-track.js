/* PULSE lead-signal + brand presence + fractional-CRO lead form handler.
   Loaded on every page (static + answer). Credit/schema injection is skipped on
   answer pages (they already render .op-byline server-side). */
(function(){
  // Visit beacon (human / likely-human) — same path as human-gate.js so pillar pages email too
  (function visitBeacon(){
    if (window.__pulseVisitBeacon) return;
    window.__pulseVisitBeacon = true;
    var LOAD = Date.now(), moved = false, clicked = false, fired = false, lx = null, ly = null;
    document.addEventListener('mousemove', function(e){
      if (lx !== null && (e.clientX !== lx || e.clientY !== ly)) moved = true;
      lx = e.clientX; ly = e.clientY;
    }, { passive: true });
    document.addEventListener('pointerdown', function(){ clicked = true; }, { passive: true, once: true });
    function notify(){
      if (fired) return;
      fired = true;
      try {
        var payload = JSON.stringify({
          human: !!(moved || clicked),
          click: !!clicked,
          dwell_ms: Date.now() - LOAD,
          page: location.pathname + location.search,
          ref: document.referrer || '',
          ua: navigator.userAgent || '',
          ts: Date.now()
        });
        var url = '/.netlify/functions/visitor-alert';
        var blob = new Blob([payload], { type: 'application/json' });
        if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) return;
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function(){});
      } catch (_e) {}
    }
    setTimeout(notify, 1400);
    document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') notify(); });
    window.addEventListener('pagehide', notify);
  })();

  // (1) click -> email owner (one alert per click-type per session)
  function notify(kind,label,extra){
    // Tool clicks dedup per-tool (kind+slug) so EVERY distinct PULSE-tool link
    // accessed in a session emails the owner; other kinds dedup once per session.
    // CRO card clicks always fire (separate !!! email) — light dedup only.
    try{
      var k='pclk_'+kind+(kind==='tool'?('_'+String(label||'').replace(/[^a-z0-9]/gi,'').slice(0,48)):'');
      if(kind!=='cro-card-click' && !(extra&&extra.fromCard)){
        if(sessionStorage.getItem(k)) return;
        sessionStorage.setItem(k,'1');
      }
    }catch(e){}
    try{
      var payload=JSON.stringify(Object.assign({
        kind:kind,
        label:(label||'').slice(0,200),
        page:(location.pathname+location.search),
        url:location.href,
        title:document.title
      }, extra||{}));
      if(navigator.sendBeacon){ navigator.sendBeacon('/.netlify/functions/pulse-click-notify', new Blob([payload],{type:'application/json'})); }
      else{ fetch('/.netlify/functions/pulse-click-notify',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true}); }
    }catch(e){}
  }
  // (1b) EVERY human click on a link → owner digest (owner 2026-07-06). No per-click dedup; every click counts.
  // Bots don't run JS click handlers, so these are human by nature; the server also filters bot user-agents.
  function trackClick(href,text){
    if(!href) return;
    var h=String(href);
    if(h.charAt(0)==='#'||/^(javascript:|mailto:|tel:)/i.test(h)) return; // skip in-page/util links
    try{
      var payload=JSON.stringify({kind:'click',label:h.slice(0,300),text:String(text||'').slice(0,120),page:(location.pathname+location.search),url:location.href,title:document.title});
      if(navigator.sendBeacon){ navigator.sendBeacon('/.netlify/functions/pulse-click-notify', new Blob([payload],{type:'application/json'})); }
      else{ fetch('/.netlify/functions/pulse-click-notify',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true}); }
    }catch(e){}
  }
  document.addEventListener('click',function(e){
    var a=e.target && e.target.closest ? e.target.closest('a') : null;
    var onCard = !!(e.target && e.target.closest && e.target.closest('.cro-card, .crohdr, .cro-ad, .cro-ad-root, #croFixed, [data-cro-card]'));
    // Whole-card surface click (even non-link areas) → !!! CRO CARD CLICK
    if(onCard && !a){
      notify('cro-card-click', 'CRO card surface', { fromCard: true, croCard: true, source: 'cro-card' });
      return;
    }
    if(!a) return;
    var href=a.getAttribute('href')||'';
    // PULSE Tool link = a /tools/<slug> destination (NOT /tools/tl#### answers, NOT the /tools hub)
    // or any anchor the renderer marked with the tool-cta highlight class.
    var isTool=(a.className&&/\btool-cta\b/.test(a.className))||/^\/tools\/(?!tl\d)[a-z0-9-]+/i.test(href)||/pulserevops\.com\/tools\/(?!tl\d)[a-z0-9-]+/i.test(href);
    var kind=a.getAttribute('data-pulse-click') || (/calendly\.com\/korywhiterevops/i.test(href)?'kory-calendly':(/crosyndicate\.com/i.test(href)?'cro-syndicate':(/linkedin\.com\/in\/korywhite/i.test(href)?'kory-linkedin':(/\/assets\/kory-white[^"'\s]*\.pdf/i.test(href)?'kory-resume':(/\/fractional-cro\b/i.test(href)?'hire-cro':(isTool?'tool':''))))));
    if(onCard){
      // Card link → separate !!! email (keep underlying kind in label)
      notify('cro-card-click', kind || href || (a.textContent||'').slice(0,40), { fromCard: true, croCard: true, source: 'cro-card', note: kind || '' });
      return;
    }
    if(kind) notify(kind, href||(a.textContent||'').slice(0,40)); // CRO-ish links outside the card → digest
    else trackClick(href, (a.textContent||'').trim());            // every other human link click
  }, true);

  // (2) fractional-CRO lead form -> emails Kory
  window.pulseCroLead=function(e,form){
    e.preventDefault();
    var st=form.querySelector('.cro-lead-status'), btn=form.querySelector('button[type=submit]'), o=btn?btn.textContent:'';
    function get(n){ var el=form.elements[n]; return el?(el.value||'').trim():''; }
    var d={name:get('name'),email:get('email'),company:get('company'),message:get('message'),page:location.pathname};
    if(!d.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)){ if(st)st.textContent='Please add your name and a valid email.'; return false; }
    if(btn){ btn.disabled=true; btn.textContent='Sending…'; } if(st)st.textContent='';
    fetch('/.netlify/functions/pulse-cro-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
      .then(function(r){return r.json();}).then(function(j){
        if(j&&(j.ok||j.stored)){ form.innerHTML='<div style="font-size:0.98rem;font-weight:800;padding:10px 0;">&#10003; Thanks'+(d.name?', '+d.name.split(' ')[0]:'')+' &mdash; your note is on its way to Kory. He will be in touch shortly.</div>'; }
        else{ if(st)st.textContent='Something went wrong - reach Kory via LinkedIn.'; if(btn){btn.disabled=false;btn.textContent=o;} }
      }).catch(function(){ if(st)st.textContent='Network issue - please try again.'; if(btn){btn.disabled=false;btn.textContent=o;} });
    return false;
  };

  // (3) credit line + schema — STATIC pages only (answer pages already have .op-byline)
  function build(){
    if(document.querySelector('.op-byline')) return;
    if(!document.querySelector('.pulse-curator-credit')){
      var c=document.createElement('div'); c.className='pulse-curator-credit';
      c.setAttribute('style','text-align:center;margin:28px auto 18px;padding:16px;max-width:1100px;font:600 13.5px/1.55 \'Plus Jakarta Sans\',system-ui,sans-serif;color:#8a8a92;border-top:1px solid rgba(25,35,20,.08)');
      c.innerHTML='<a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" data-pulse-click="curator-photo" title="Kory White on LinkedIn" style="line-height:0"><img src="/assets/kory-white.jpg" alt="Kory White, Chief Revenue Officer" loading="lazy" style="width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:8px;border:1px solid rgba(0,0,0,.1)"></a><span style="color:#C8821E;font-weight:500">Curated by</span> <a href="/assets/kory-white-resume.pdf" target="_blank" rel="noopener" data-pulse-click="kory-title" title="Kory White — Chief Revenue Officer (1-page CRO profile, PDF)" style="color:#C8821E;text-decoration:none;font-weight:400">Chief Revenue Officer</a> <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" data-pulse-click="curator" style="color:#171E14;text-decoration:none;font-weight:400">Kory White</a> &middot; <a href="https://crosyndicate.com/" target="_blank" rel="noopener" data-pulse-click="cro-syndicate" style="color:#C8821E;text-decoration:none;font-weight:400">CRO Syndicate</a>';
      document.body.appendChild(c);
    }
    if(!document.getElementById('kory-cro-schema')){
      var s=document.createElement('script'); s.type='application/ld+json'; s.id='kory-cro-schema';
      s.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Person","name":"Kory White","jobTitle":"Chief Revenue Officer","description":"Chief Revenue Officer with 25 years scaling revenue organizations. Operator behind PULSE RevOps; fractional CRO via CRO Syndicate.","url":"https://www.linkedin.com/in/korywhite","image":"https://pulserevops.com/assets/kory-white.jpg","worksFor":{"@type":"Organization","name":"CRO Syndicate","url":"https://www.crosyndicate.com"},"knowsAbout":["Fractional CRO","Revenue Operations","Go-To-Market","Sales Leadership"],"sameAs":["https://www.linkedin.com/in/korywhite","https://www.crosyndicate.com"]});
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
