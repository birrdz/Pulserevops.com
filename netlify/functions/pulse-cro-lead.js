// pulse-cro-lead — "Reach out for fractional CRO help" form. Emails Kory the
// prospect's info (name/email/company/message) and stores the lead in a blob.
let getStore=null; try{ getStore=require('@netlify/blobs').getStore; }catch(e){}
const RECIPIENT='kory.white@crosyndicate.com';
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
  const company=String(b.company||'').slice(0,160).trim();
  const message=String(b.message||'').slice(0,2000).trim();
  const page=String(b.page||'').slice(0,300);
  if(!name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400,{ok:false,reason:'name and valid email required'});

  // store the lead (best-effort)
  try{ const s=store(); if(s){ await s.setJSON('cro-leads/'+Date.now()+'.json',{name,email,company,message,page,ts:Date.now()}); } }catch(e){}
  try{ await require('./_stats').bump({leads:1}); }catch(e){}

  const subject=`🟢 Fractional CRO lead: ${name}${company?(' ('+company+')'):''}`;
  const html=`<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171E14">
    <h2 style="color:#8E1B1B;margin:0 0 10px">New fractional CRO lead</h2>
    <p><strong>Name:</strong> ${esc(name)}<br>
    <strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a><br>
    <strong>Company:</strong> ${esc(company)||'(not given)'}<br>
    <strong>From page:</strong> ${esc(page)||'(n/a)'}<br>
    <strong>Time:</strong> ${new Date().toUTCString()}</p>
    <p><strong>Message:</strong><br>${esc(message)||'(none)'}</p>
    <p style="color:#8a8ba0;font-size:12px">Submitted via the "Reach out for fractional CRO help" box on pulserevops.com.</p></div>`;

  const pmToken=process.env.POSTMARK_SERVER_TOKEN||process.env.POSTMARK_API_KEY;
  const resendKey=process.env.RESEND_API_KEY||process.env.resendapikey||process.env.RESENDAPIKEY;
  const fromEmail=process.env.ALERT_FROM_EMAIL||process.env.alert_from_email||'onboarding@resend.dev';
  try{
    if(pmToken){
      const r=await fetch('https://api.postmarkapp.com/email',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json','X-Postmark-Server-Token':pmToken},body:JSON.stringify({From:fromEmail,To:RECIPIENT,ReplyTo:email,Subject:subject,HtmlBody:html,MessageStream:'outbound'})});
      return json(200,{ok:r.ok,provider:'postmark'});
    }
    if(resendKey){
      const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey,'Content-Type':'application/json'},body:JSON.stringify({from:fromEmail,to:[RECIPIENT],reply_to:email,subject,html})});
      return json(200,{ok:r.ok,provider:'resend'});
    }
    return json(200,{ok:true,stored:true,reason:'no mail provider — lead stored'});
  }catch(e){ return json(200,{ok:false,error:String(e.message||e)}); }
};
