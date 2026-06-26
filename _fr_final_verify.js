const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
const norm = s => (s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();

(async () => {
  const manifest = require('./_fr_batch_manifest.json');
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter(e=>e&&e.id).map(e=>e.id));
  console.log('Total library index entries:', idx.entries.length);

  let missing=[], titleFails=[], wordFails=[], thin=[];
  let checked=0;
  for (const it of manifest.items) {
    if (!inIndex.has(it.id)) missing.push(it.id+'(idx)');
    let rec; try { rec = await store.get('answers/'+it.id+'.json', { type:'json' }); } catch(e){}
    if (!rec) { missing.push(it.id+'(blob)'); continue; }
    checked++;
    if (norm(rec.question) !== norm(it.title)) titleFails.push(`${it.id}: blob="${rec.question}" | manifest="${it.title}"`);
    const words = (rec.answer||'').replace(/<[^>]+>/g,' ').replace(/[#*|`>-]/g,' ').split(/\s+/).filter(Boolean).length;
    if (words < 1100) wordFails.push(`${it.id}(${words}w)`);
    if (words < 1200) thin.push(`${it.id}(${words}w)`);
  }
  // internal dup
  const seen={}; let dups=[];
  for (const it of manifest.items){ const k=norm(it.title); if(seen[k]) dups.push(`${it.id}==${seen[k]}`); else seen[k]=it.id; }

  console.log('\n=== FINAL VERIFICATION (fr0624-fr0823) ===');
  console.log('Manifest items      :', manifest.items.length);
  console.log('Found in blob       :', checked);
  console.log('Missing             :', missing.length, missing.join(', '));
  console.log('Title mismatches    :', titleFails.length);
  titleFails.forEach(x=>console.log('   '+x));
  console.log('Under 1100 words    :', wordFails.length, wordFails.join(', '));
  console.log('Under 1200 (thin)   :', thin.length, thin.join(', '));
  console.log('Internal dup titles :', dups.length, dups.join(', '));
  const pass = missing.length===0 && titleFails.length===0 && wordFails.length===0 && dups.length===0;
  console.log('\nRESULT:', pass ? 'ALL 200 PASS — 0 missing, 0 mismatch, 0 sub-1100, 0 dups' : 'ISSUES ABOVE');
})().catch(e=>{ console.error('ERR', e.message); process.exit(1); });
