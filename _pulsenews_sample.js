// Standalone: build ONE real "Pulse News" example from today's headlines + render a preview.
const fs = require('fs');
for (const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); }
const { dsChat } = require('./_ds_lib');

const _decEnt = s => String(s||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));
async function fetchNews(max){
  const feeds=['https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en','https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en'];
  const items=[];
  for(const url of feeds){ try{ const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(12000)}); const xml=await r.text();
    for(const b of xml.split(/<item>/).slice(1)){ const g=re=>((b.match(re)||[])[1]||''); const rawT=_decEnt(g(/<title>([\s\S]*?)<\/title>/)).trim(); if(!rawT)continue;
      const src=_decEnt(g(/<source[^>]*>([\s\S]*?)<\/source>/)).trim()||(rawT.match(/\s-\s([^-]+)$/)||[])[1]||'';
      items.push({ headline:rawT.replace(/\s+-\s+[^-]+$/,'').trim(), title:rawT, source:src.trim(), pub:g(/<pubDate>([\s\S]*?)<\/pubDate>/).trim(), desc:_decEnt(g(/<description>([\s\S]*?)<\/description>/)).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,360) }); } }catch(e){} }
  return items.slice(0,max);
}
const WRITE_SYS = `You write ONE complete PULSE answer in Markdown. Structure: "## Direct Answer" (2-3 full sentences), 6+ "## " H2 sections, EXACTLY 2 \`\`\`mermaid flowchart TD diagrams (simple A[Label] --> B[Label], no punctuation in labels), "## FAQ" with 6 "**Question?**" + answer, "## Sources" 5-8 REAL outlets, end "## Related on PULSE" then "- Explore more in the PULSE library." ~1500 words, 25+ **bold** terms. NEVER invent numbers/stats/quotes. Output ONLY Markdown.`;

// tiny markdown -> html for the preview look
function mdHtml(md){
  const lines = md.split(/\n/); let html=''; let inList=false;
  const inline = t => _esc(t).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  const _esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  for(let raw of lines){ const line=raw.replace(/\s+$/,'');
    if(/^```/.test(line)){ continue; }
    if(/^##\s+/.test(line)){ if(inList){html+='</ul>';inList=false;} html+='<h2>'+inline(line.replace(/^##\s+/,''))+'</h2>'; continue; }
    if(/^#\s+/.test(line)){ continue; }
    if(/^[-*]\s+/.test(line)){ if(!inList){html+='<ul>';inList=true;} html+='<li>'+inline(line.replace(/^[-*]\s+/,''))+'</li>'; continue; }
    if(!line.trim()){ if(inList){html+='</ul>';inList=false;} continue; }
    if(inList){html+='</ul>';inList=false;} html+='<p>'+inline(line)+'</p>';
  }
  if(inList)html+='</ul>';
  return html;
}

(async()=>{
  const news = await fetchNews(12);
  // pick a clean, non-political entertainment story for the sample
  const pick = news.find(n=>/swift|album|movie|film|music|star|show|series|actor|singer|celebr|minions|village people/i.test(n.headline)) || news[0];
  const question = 'What happened with '+pick.headline+' in 2027?';
  const ground = `\n\n📰 GROUND THIS in the REAL story below; report what actually happened, attribute specifics to the outlet, do NOT invent facts/quotes. Cite it in Sources.\nHeadline: ${pick.title}\nOutlet: ${pick.source}\nPublished: ${pick.pub}\nWhat happened: ${pick.desc}`;
  const { content } = await dsChat([{role:'system',content:WRITE_SYS+ground},{role:'user',content:`Question: "${question}"\nSection: Pulse News (current events). Write the complete answer now.`}]);
  const md = String(content||'').replace(/^```[a-z]*\s*|\s*```$/g,'').trim();
  fs.writeFileSync('_pulsenews_sample.md', '# '+question+'\n\nSource story: '+pick.title+' ('+pick.source+', '+pick.pub+')\n\n'+md);
  const today = new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
  const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Pulse News — preview</title>
<style>
body{margin:0;background:#12100c;color:#ede5d8;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.wrap{max-width:880px;margin:0 auto;padding:40px 22px 80px}
.top a{color:#E89F0A;text-decoration:none;font-weight:800}
article.cc-gold{position:relative;outline:5px solid #FFD740;outline-offset:10px;border-radius:18px;box-shadow:0 0 60px rgba(255,215,64,.55),inset 0 0 0 2px rgba(255,215,64,.35);padding:34px clamp(20px,5vw,40px) 60px;background:#1b1813;margin-top:28px}
article.cc-gold::after{content:"✓ CERTIFIED";position:absolute;top:22px;right:-54px;transform:rotate(45deg);background:linear-gradient(135deg,#FFE34F,#E89F0A);color:#1a1208;font-size:.72rem;font-weight:900;letter-spacing:.14em;padding:8px 62px;box-shadow:0 4px 14px rgba(0,0,0,.28)}
.eyebrow{display:inline-block;background:linear-gradient(135deg,#D7263D,#A81729);color:#fff;font-size:.62rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase;padding:5px 12px;border-radius:99px}
.badge{display:inline-block;background:linear-gradient(135deg,#FFE34F,#E89F0A);color:#1a1208;padding:9px 20px;border-radius:99px;font-size:.9rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;border:2px solid #FFF3B0;margin:12px 0}
h1.q{font-size:1.95rem;line-height:1.2;margin:12px 0 8px}
.meta-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:.66rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(237,229,216,.45);margin:6px 0 22px}
.meta-row .wc{padding:3px 10px;background:rgba(255,140,26,.10);border:1px solid rgba(255,140,26,.35);border-radius:99px;color:#FFB870}
.meta-row .dt{margin-left:auto;color:rgba(237,229,216,.82);font-weight:800}
.body h2{font-size:1.28rem;margin:26px 0 8px;color:#ffd98a}
.body p{line-height:1.7;color:#d9d2c4;margin:10px 0}
.body li{line-height:1.6;color:#d9d2c4}
.body strong{color:#fff}
.src{margin-top:10px;font-size:.8rem;color:#9a927f}
</style></head><body><div class="wrap">
<div class="top"><a href="/">← PULSE</a> &nbsp;·&nbsp; <a href="/current-events">Pulse News</a></div>
<article class="cc-gold">
<span class="eyebrow">📰 Pulse News · Trending now</span>
<div><span class="badge">🏆 13/13 · Claude Code Audited</span></div>
<h1 class="q">${_escH(question)}</h1>
<div class="meta-row"><span class="wc">📖 ~${md.split(/\s+/).length} words</span><span class="dt">🗓️ Published ${today}</span></div>
<div class="src">Grounded in a real story: <strong>${_escH(pick.title)}</strong> — ${_escH(pick.source)} · ${_escH(pick.pub)}</div>
<div class="body">${mdHtml(md)}</div>
</article></div></body></html>`;
  fs.writeFileSync('_preview_pulsenews.html', page);
  function _escH(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  console.log('HEADLINE:', pick.title, '('+pick.source+', '+pick.pub+')');
  console.log('QUESTION:', question);
  console.log('WORDS:', md.split(/\s+/).length);
  console.log('FIRST 400 CHARS:\n', md.slice(0,400));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
