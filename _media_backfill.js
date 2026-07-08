// SITE-WIDE MEDIA BACKFILL — bakes 3+ media images into old entries that only have 1 (or none),
// inserting a topical image between content blocks. 5 parallel "Pollinator" workers. Idempotent:
// re-running skips anything already at >=3 images. Progress → _media_backfill_progress.json.
const fs = require('fs');
for (const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });

const WORKERS = parseInt(process.env.MEDIA_WORKERS || '5', 10);
const MEDIA_MIN = 3, MEDIA_MAX = 10;
const PROG = '_media_backfill_progress.json';

function pillarOf(id){ const m=String(id).match(/^([a-z]+)\d+/i); return m?m[1].toLowerCase():'q'; }
function countImages(b){ return (String(b).match(/!\[[^\]]*\]\([^)]+\)/g)||[]).length; }
const TOPICAL = { ca:'automobile car vehicle', bt:'boat yacht marine', aq:'planted aquarium fish tank', er:'consumer electronics product', dn:'restaurant food dining', nl:'nightlife bar lounge', tn:'town city skyline', sc:'school campus', mv:'cinema film', tv:'television home theater', rs:'luxury resort hotel', cl:'cologne fragrance bottle', lv:'luxury vacation travel', ev:'event celebration', ga:'board game gathering', gm:'video gaming setup', wl:'wellness spa retreat', fr:'franchise storefront', co:'collectible memorabilia', sy:'fashion outfit style', cr:'chesapeake crabbing', fs:'fishing boat water', pt:'pet animal', tk:'software dashboard workspace', ik:'business analytics chart', bo:'commercial real estate', ai:'AI automation abstract', gp:'go to market strategy office', ra:'revenue operations office', bs:'business book desk', st:'sales training workshop', ce:'news media pop culture', q:'business professional office', cg:'coaching mentorship office', sw:'software application screen', hf:'high school football stadium', tc:'telecom cell tower network' };
function pollUrl(text, pillar, seedStr){ const lane=TOPICAL[pillar]||'professional editorial photography'; const prompt=('high quality editorial '+lane+' photograph illustrating '+String(text).slice(0,80)+', realistic magazine style, warm light, no text, no watermark').slice(0,280); let h=0; for(const c of String(seedStr||text)) h=(h*31+c.charCodeAt(0))>>>0; return 'https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt)+'?width=1200&height=675&nologo=true&model=flux&seed='+(h%100000); }

// insert (MEDIA_MIN - current) topical images between content headings; returns new body or null if no change
function addMedia(id, question, body){
  const n = countImages(body);
  if (n >= MEDIA_MIN) return null;
  const pillar = pillarOf(id);
  const alt = String(question||id).replace(/[\[\]"]/g,'').slice(0,66);
  const lines = String(body).split('\n');
  const skip = /^#{2,3}\s+(FAQ|Sources|Related|Direct\s+Answer)/i;
  const targets = [];
  for (let i=0;i<lines.length;i++){ if (/^#{2,3}\s+\S/.test(lines[i]) && !skip.test(lines[i])) targets.push(i); }
  const want = Math.min(Math.max((MEDIA_MIN+1) - n, 0), MEDIA_MAX - n, targets.length);
  if (want <= 0) return null;
  const picks = targets.slice(0, want).map(idx => { const sect=lines[idx].replace(/^#{2,3}\s+/,'').replace(/[\[\]"]/g,'').slice(0,56); return { idx, sect, url: pollUrl(sect+' '+(question||''), pillar, id+sect) }; });
  picks.sort((a,b)=>b.idx-a.idx).forEach(p => { lines.splice(p.idx+1, 0, '', '!['+alt+' — '+p.sect+']('+p.url+')', ''); });
  return lines.join('\n');
}

let done=0, skipped=0, changed=0, errors=0, total=0, started=Date.now();
function saveProg(extra){ try{ fs.writeFileSync(PROG, JSON.stringify(Object.assign({ done, skipped, changed, errors, total, workers:WORKERS, startedAt:started, updatedAt:Date.now() }, extra||{}))); }catch(e){} }

(async()=>{
  const idx = await store.get('_index.json', { type:'json', consistency:'strong' });
  const ids = (idx.entries||[]).filter(e=>e&&e.id&&/^[a-z]{1,3}\d+$/i.test(e.id)).map(e=>({id:e.id,q:e.question}));
  total = ids.length;
  let cursor = parseInt(process.env.START_AT || '0', 10);   // RESUME: skip the already-filled prefix
  done = cursor; skipped = cursor;                          // count the skipped prefix as done
  console.log('[media-backfill] '+total+' entries · '+WORKERS+' workers · start@'+cursor+' · target '+MEDIA_MIN+'-'+MEDIA_MAX+' media each');
  async function worker(w){
    while(cursor < ids.length){
      const item = ids[cursor++];
      try{
        const e = await store.get('answers/'+item.id+'.json', { type:'json' }).catch(()=>null);
        if(!e || !e.answer){ done++; continue; }
        const nb = addMedia(item.id, e.q || e.question, e.answer);
        if(!nb){ skipped++; done++; continue; }
        await store.setJSON('answers/'+item.id+'.json', Object.assign({}, e, { answer:nb, media_backfilled_at:new Date().toISOString() }));
        changed++; done++;
      }catch(err){ errors++; done++; }
      if(done % 50 === 0){ const rate=(done/((Date.now()-started)/1000)).toFixed(1); console.log('[media-backfill] '+done+'/'+total+' · +'+changed+' filled · '+skipped+' already-ok · '+rate+'/s'); saveProg(); }
      await new Promise(r=>setTimeout(r, 120));   // gentle pace per worker
    }
  }
  await Promise.all(Array.from({length:WORKERS}, (_,w)=>worker(w)));
  saveProg({ finishedAt: Date.now() });
  console.log('[media-backfill] DONE · '+changed+' filled · '+skipped+' already had 3+ · '+errors+' errors of '+total);
})().catch(e=>{ console.error('[media-backfill] FATAL', e.message); process.exit(1); });
