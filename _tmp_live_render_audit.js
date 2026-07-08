'use strict';
const https = require('https');
const fs = require('fs');
const vm = require('vm');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

const src = fs.readFileSync('netlify/functions/pulse-machine-entry.js', 'utf8');
const prelude = src.slice(src.indexOf('function escHtml'), src.indexOf('function findRelated'));
const ctx = { SITE: 'https://pulserevops.com', console };
vm.createContext(ctx);
vm.runInContext(prelude, ctx);

async function auditLive(id) {
  const url = id.startsWith('q')
    ? `https://pulserevops.com/knowledge/${id}`
    : `https://pulserevops.com/aquariums/${id}`;
  const html = await fetch(url);
  const bodyMatch = html.match(/<div class="body">([\s\S]*?)<\/div>\s*<div class="entry-sources"/);
  const body = bodyMatch ? bodyMatch[1] : html;

  const boxIdx = body.search(/<div class="direct-answer-box"/i);
  const boxEnd = ctx.directAnswerBoxEndPos(body);
  const afterDa = ctx.afterDirectAnswerPos(body);
  const croPos = body.search(/class="cro-ad cro-ad-card"/);
  const croMobPos = body.search(/class="cro-mob-card"/);

  let boxInner = '';
  if (boxIdx >= 0 && boxEnd > boxIdx) boxInner = body.slice(boxIdx, boxEnd);
  const proseLen = boxInner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/Direct Answer/gi, '').trim().length;
  const croInsideBox = boxInner && /cro-(ad|mob)/.test(boxInner);

  const hero = (body.match(/<figure class="entry-cover"[\s\S]*?<\/figure>/) || [''])[0];
  const mermWrap = (body.match(/<div class="mermaid-wrap"/g) || []).length;
  const rawMerm = (body.match(/flowchart TD/g) || []).length;

  console.log(`\n=== LIVE ${id} ===`);
  console.log('url:', url);
  console.log('DA box start:', boxIdx, 'boxEnd:', boxEnd, 'afterDa:', afterDa);
  console.log('DA prose chars:', proseLen, 'CRO inside box:', croInsideBox);
  console.log('CRO desktop pos:', croPos, 'mobile pos:', croMobPos, 'afterDa pos:', afterDa);
  if (croPos >= 0 && afterDa >= 0) {
    console.log('CRO placement:', croPos < afterDa ? 'BEFORE end of DA (BUG)' : croPos === afterDa ? 'correct (at box end)' : 'after DA');
  }
  console.log('hero present:', !!hero, hero.slice(0, 120).replace(/\s+/g, ' '));
  console.log('mermaid wraps:', mermWrap, 'raw flowchart TD:', rawMerm);
  if (boxIdx >= 0) {
    console.log('box snippet:', body.slice(boxIdx, Math.min(boxIdx + 800, boxEnd > 0 ? boxEnd + 50 : boxIdx + 800)).replace(/\s+/g, ' ').slice(0, 700));
    if (boxEnd > 0) {
      console.log('box end context:', body.slice(Math.max(0, boxEnd - 120), boxEnd + 120).replace(/\s+/g, ' '));
    }
  } else {
    console.log('NO direct-answer-box in body');
  }
  const h2s = [...body.matchAll(/<h2[^>]*>([^<]*)<\/h2>/g)].slice(0, 6).map((m) => m[1].trim());
  console.log('first h2s:', h2s);
  const rawMermBlocks = [...body.matchAll(/(?<!<div class="mermaid">)(flowchart TD[\s\S]{20,200})/g)].slice(0, 2);
  if (rawMermBlocks.length) console.log('raw mermaid leak:', rawMermBlocks.map((m) => m[0].slice(0, 80)));
}

(async () => {
  for (const id of process.argv.slice(2).length ? process.argv.slice(2) : ['aq1160', 'aq1158', 'q11133']) {
    await auditLive(id);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
