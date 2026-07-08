/* PULSE lead-signal + brand presence + fractional-CRO lead form handler.
   Loaded on every page (static + answer). Credit/schema injection is skipped on
   answer pages (they already render .op-byline server-side). */
(function(){
  // (1) click -> email owner (one alert per click-type per session)
  function notify(kind,label){
    // Tool clicks dedup per-tool (kind+slug) so EVERY distinct PULSE-tool link
    // accessed in a session emails the owner; other kinds dedup once per session.
    try{ var k='pclk_'+kind+(kind==='tool'?('_'+String(label||'').replace(/[^a-z0-9]/gi,'').slice(0,48)):''); if(sessionStorage.getItem(k)) return; sessionStorage.setItem(k,'1'); }catch(e){}
    try{
      var payload=JSON.stringify({kind:kind,label:(label||'').slice(0,200),page:(location.pathname+location.search),url:location.href,title:document.title});
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
    var a=e.target && e.target.closest ? e.target.closest('a') : null; if(!a) return;
    var href=a.getAttribute('href')||'';
    // PULSE Tool link = a /tools/<slug> destination (NOT /tools/tl#### answers, NOT the /tools hub)
    // or any anchor the renderer marked with the tool-cta highlight class.
    var isTool=(a.className&&/\btool-cta\b/.test(a.className))||/^\/tools\/(?!tl\d)[a-z0-9-]+/i.test(href)||/pulserevops\.com\/tools\/(?!tl\d)[a-z0-9-]+/i.test(href);
    var kind=a.getAttribute('data-pulse-click') || (/calendly\.com\/korywhiterevops/i.test(href)?'kory-calendly':(/crosyndicate\.com/i.test(href)?'cro-syndicate':(/linkedin\.com\/in\/korywhite/i.test(href)?'kory-linkedin':(/\/assets\/kory-white[^"'\s]*\.pdf/i.test(href)?'kory-resume':(/\/fractional-cro\b/i.test(href)?'hire-cro':(isTool?'tool':''))))));
    if(kind) notify(kind, href||(a.textContent||'').slice(0,40)); // CRO card + tagged links (already tracked)
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
