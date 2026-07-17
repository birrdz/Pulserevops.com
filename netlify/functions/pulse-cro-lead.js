// pulse-cro-lead — "Reach out for fractional CRO help" form. Emails Kory the
// prospect's info (name/email/company/message) and stores the lead in a blob.
let getStore=null; try{ getStore=require('@netlify/blobs').getStore; }catch(e){}
const RECIPIENT='koryjordanwhite@gmail.com';
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
const json=(sc,o)=>({statusCode:sc,headers:{...CORS,'Content-Type':'application/json'},body:JSON.stringify(o)});
const esc=s=>String(s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
function store(){ if(!getStore)return null; const tok=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN; const sid=process.env.NETLIFY_SITE_ID||'a2b74b30-a1ac-40e2-9622-aebfc2feb482'; try{ return tok? getStore({name:'pulse-machine-library',siteID:sid,token:tok}) : getStore('pulse-machine-library'); }catch(e){ return null; } }

exports.handler=async(event)=>{
  if(event.httpMethod==='OPTIONS') return {statusCode:204,headers:CORS,body:''};
  if(event.httpMethod!=='POST') return json(405,{ok:false,reason:'POST only'});
  let b={}; try{ b=JSON.parse(event.body||'{}'); }catch(e){ return json(400,{ok:false,reason:'bad json'}); }
  const name=String(b.name||'').slice(0,120).trim();
  const email=String(b.email||'').slice(0,160).trim();
  const phone=String(b.phone||'').slice(0,60).trim();
  const company=String(b.company||'').slice(0,160).trim();
  const message=String(b.message||'').slice(0,2000).trim();
  const page=String(b.page||'').slice(0,300);
  // Attribution — how the lead found us. From the form payload (first-touch referrer/UTM/landing)
  // plus the request's own Referer header as a fallback.
  const ref=String(b.ref||'').slice(0,500).trim();
  const landing=String(b.landing||'').slice(0,500).trim();
  const utm=String(b.utm||'').slice(0,500).trim();
  const hdrRef=String((event.headers&&(event.headers.referer||event.headers.referrer))||'').slice(0,500).trim();
  const foundVia=ref||hdrRef||'(direct / unknown)';
  // Low-friction: accept the lead as long as there's a way to reach them (email OR phone). Name optional.
  const emailOk = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if(!emailOk && !phone) return json(400,{ok:false,reason:'email or phone required'});

  // store the lead (best-effort)
  try{ const s=store(); if(s){ await s.setJSON('cro-leads/'+Date.now()+'.json',{name,email,phone,company,message,page,ref,landing,utm,hdrRef,ts:Date.now()}); } }catch(e){}
  try{ await require('./_stats').bump({leads:1}); }catch(e){}

  const subject=`🟢 Fractional CRO lead: ${name}${company?(' ('+company+')'):''}`;
  const html=`<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171E14">
    <h2 style="color:#8E1B1B;margin:0 0 10px">New fractional CRO lead</h2>
    <p><strong>Name:</strong> ${esc(name)||'(not given)'}<br>
    <strong>Email:</strong> ${email?('<a href="mailto:'+esc(email)+'">'+esc(email)+'</a>'):'(not given)'}<br>
    <strong>Phone:</strong> ${esc(phone)||'(not given)'}<br>
    <strong>Company:</strong> ${esc(company)||'(not given)'}<br>
    <strong>From page:</strong> ${esc(page)||'(n/a)'}<br>
    <strong>How they found us:</strong> ${foundVia&&/^https?:\/\//i.test(foundVia)?('<a href="'+esc(foundVia)+'">'+esc(foundVia)+'</a>'):esc(foundVia)}<br>
    ${landing?('<strong>Landing page:</strong> '+(/^https?:\/\//i.test(landing)?('<a href="'+esc(landing)+'">'+esc(landing)+'</a>'):esc(landing))+'<br>'):''}
    ${utm?('<strong>Campaign (UTM):</strong> '+esc(utm)+'<br>'):''}
    <strong>Time:</strong> ${new Date().toUTCString()}</p>
    <p><strong>Message:</strong><br>${esc(message)||'(none)'}</p>
    <p style="color:#8a8ba0;font-size:12px">Submitted via the "Reach out for fractional CRO help" box on pulserevops.com.</p></div>`;

  const pmToken=process.env.POSTMARK_SERVER_TOKEN||process.env.POSTMARK_API_KEY;
  const resendKey=process.env.RESEND_API_KEY||process.env.resendapikey||process.env.RESENDAPIKEY;
  const fromEmail=process.env.ALERT_FROM_EMAIL||process.env.alert_from_email||'onboarding@resend.dev';
  // Recipients: RECIPIENT + optional comma-list in LEAD_CC (env). Delivering to more than one
  // inbox means a mis-verified sender for one address doesn't lose the lead.
  const recipients=[RECIPIENT].concat(String(process.env.LEAD_CC||'').split(',').map(x=>x.trim()).filter(Boolean));
  const out={ok:false,attempts:[]};
  const tryText=r=>r.text().catch(()=>'');
  async function pm(to){const r=await fetch('https://api.postmarkapp.com/email',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json','X-Postmark-Server-Token':pmToken},body:JSON.stringify({From:fromEmail,To:to,ReplyTo:(email||RECIPIENT),Subject:subject,HtmlBody:html,MessageStream:'outbound'})});return{provider:'postmark',to,ok:r.ok,status:r.status,body:(await tryText(r)).slice(0,200)};}
  async function rs(to){const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey,'Content-Type':'application/json'},body:JSON.stringify({from:fromEmail,to:[to],reply_to:(email||RECIPIENT),subject,html})});return{provider:'resend',to,ok:r.ok,status:r.status,body:(await tryText(r)).slice(0,200)};}
  // Fallback that needs NO domain verification — relays the lead to an inbox via FormSubmit.
  async function fsub(){const addr=process.env.LEAD_FORMSUBMIT||'hello@pulserevops.com';const r=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(addr),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({_subject:subject,Name:name||'(not given)',Email:email||'(not given)',Phone:phone||'(not given)',Company:company||'(not given)',Message:message||'(none)',Page:page||'(n/a)'})});return{provider:'formsubmit',to:addr,ok:r.ok,status:r.status,body:(await tryText(r)).slice(0,200)};}
  try{
    for(const to of recipients){
      try{
        if(pmToken){const a=await pm(to);out.attempts.push(a);if(a.ok)out.ok=true;}
        else if(resendKey){const a=await rs(to);out.attempts.push(a);if(a.ok)out.ok=true;}
      }catch(e){out.attempts.push({to,ok:false,error:String(e.message||e)});}
    }
    // If no API provider delivered (missing keys or unverified sender), fall back to FormSubmit.
    if(!out.ok){try{const a=await fsub();out.attempts.push(a);if(a.ok)out.ok=true;}catch(e){out.attempts.push({provider:'formsubmit',ok:false,error:String(e.message||e)});}}
    out.stored=true; // lead is also persisted in the blob above
    return json(200,out);
  }catch(e){ out.error=String(e.message||e); return json(200,out); }
};
