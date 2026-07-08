'use strict';
require('./_loadenv.js');
const fs = require('fs');
const vm = require('vm');
const { getStore } = require('@netlify/blobs');
const { RANKING_LIST_NO_TOP_HERO, isRankingListBody } = require('./_ranking_list_master_law');

const src = fs.readFileSync('netlify/functions/pulse-machine-entry.js', 'utf8');
const prelude = src.slice(src.indexOf('function escHtml'), src.indexOf('function findRelated'));
const ctx = { SITE: 'https://pulserevops.com', console };
vm.createContext(ctx);
vm.runInContext(prelude, ctx);

(async () => {
  const id = process.argv[2] || 'aq1160';
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  const body = ctx.stripBlobCro(e.answer || '');
  const rankingList = RANKING_LIST_NO_TOP_HERO && isRankingListBody(body, e.question);
  let bodyForMd = rankingList ? ctx.stripLeadingCoverMarkdown(body) : body;
  let html = ctx.wrapDirectAnswerGold(ctx.renderMd(bodyForMd, false, false));
  html = ctx.insertCroAd(ctx.moveMermaidToBottom(html), id);

  const rawLeak = /```mermaid/.test(html);
  const mermWrap = (html.match(/mermaid-wrap/g) || []).length;
  const croInBox = html.indexOf('cro-mob-card') < ctx.directAnswerBoxEndPos(html);
  console.log('id:', id, 'rankingList:', rankingList);
  console.log('mermaid-wrap:', mermWrap, 'raw ```mermaid leak:', rawLeak, 'cro inside box:', croInBox);
  if (rawLeak) {
    const p = html.indexOf('```mermaid');
    console.log('leak ctx:', html.slice(Math.max(0, p - 80), p + 120).replace(/\s+/g, ' '));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
