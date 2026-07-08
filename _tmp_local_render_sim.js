'use strict';
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('netlify/functions/pulse-machine-entry.js', 'utf8');
const prelude = src.slice(src.indexOf('function escHtml'), src.indexOf('function findRelated'));
const ctx = { SITE: 'https://pulserevops.com', console };
vm.createContext(ctx);
vm.runInContext(prelude, ctx);

const { RANKING_LIST_NO_TOP_HERO, isRankingListBody } = require('./_ranking_list_master_law');
ctx.RANKING_LIST_NO_TOP_HERO = RANKING_LIST_NO_TOP_HERO;
ctx.isRankingListBody = isRankingListBody;

// Minimal pipeline mirroring buildPage body render
function renderBody(body, id, question) {
  const croStripped = ctx.stripBlobCro(body || '');
  const rankingList = RANKING_LIST_NO_TOP_HERO && isRankingListBody(croStripped, question);
  let bodyForMd = croStripped;
  if (rankingList) bodyForMd = ctx.stripLeadingCoverMarkdown(croStripped);
  let html = ctx.wrapDirectAnswerGold(ctx.renderMd(bodyForMd, false, false));
  html = ctx.insertCroAd(ctx.moveMermaidToBottom(html), id);
  return html;
}

const sampleMd = `## Direct Answer

The best way to cycle a new tank in 2027 is the fishless cycling method using pure ammonia.

Cycling a new aquarium is the single most critical step before adding any fish.

## Why Cycling Matters

- Biological Filtration — Every aquarium relies on beneficial bacteria.

\`\`\`mermaid
flowchart TD
A[Start] --> B[End]
\`\`\`

## FAQ

**How long?** 2-4 weeks.

flowchart TD
A[Leaked] --> B[Raw]
`;

const html = renderBody(sampleMd, 'aq1160', 'Best way to cycle a new tank in 2027');
const boxEnd = ctx.directAnswerBoxEndPos(html);
const croMob = html.indexOf('cro-mob-card');
const croInside = croMob >= 0 && croMob < boxEnd;
const mermWrap = (html.match(/mermaid-wrap/g) || []).length;
const rawMerm = /(?<!<div class="mermaid">)flowchart TD/.test(html);

console.log('LOCAL SIMULATION');
console.log('boxEnd:', boxEnd, 'croMob:', croMob, 'cro inside box:', croInside);
console.log('mermaid wraps:', mermWrap, 'raw leak:', rawMerm);
console.log('snippet:', html.slice(0, 900).replace(/\s+/g, ' '));
