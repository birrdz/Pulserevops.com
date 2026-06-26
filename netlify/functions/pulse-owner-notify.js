// pulse-owner-notify — fire-and-forget owner email for the content loop.
// POST { key:'pulsemachine-writer-2026', subject, message }
const RECIPIENT='koryjordanwhite@gmail.com';
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
exports.handler=async(event)=>{
  if(event.httpMethod==='OPTIONS')return{statusCode:204,headers:CORS,body:''};
  let b={};try{b=JSON.parse(event.body||'{}');}catch(e){}
  if(b.key!=='pulsemachine-writer-2026')return{statusCode:401,headers:CORS,body:JSON.stringify({ok:false})};
  const subject=String(b.subject||'PULSE update').slice(0,160);
  const message=String(b.message||'').slice(0,4000);
  const html='<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171E14">'+message.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>';
  const pmToken=process.env.POSTMARK_SERVER_TOKEN||process.env.POSTMARK_API_KEY;
  const resendKey=process.env.RESEND_API_KEY||process.env.resendapikey||process.env.RESENDAPIKEY;
  const fromEmail=process.env.ALERT_FROM_EMAIL||process.env.alert_from_email||'onboarding@resend.dev';
  try{
    if(pmToken){const r=await fetch('https://api.postmarkapp.com/email',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json','X-Postmark-Server-Token':pmToken},body:JSON.stringify({From:fromEmail,To:RECIPIENT,Subject:subject,HtmlBody:html,MessageStream:'outbound'})});return{statusCode:200,headers:CORS,body:JSON.stringify({ok:r.ok,provider:'postmark'})};}
    if(resendKey){const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey,'Content-Type':'application/json'},body:JSON.stringify({from:fromEmail,to:[RECIPIENT],subject,html})});return{statusCode:200,headers:CORS,body:JSON.stringify({ok:r.ok,provider:'resend'})};}
    return{statusCode:200,headers:CORS,body:JSON.stringify({ok:false,reason:'no provider'})};
  }catch(e){return{statusCode:200,headers:CORS,body:JSON.stringify({ok:false,error:String(e.message||e)})};}
};
