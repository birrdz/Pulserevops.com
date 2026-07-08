// _cro_strip_lib.js — one canonical CRO card at RENDER time (pulse-machine-entry insertCroAd).
// Blobs must NOT carry CRO markdown/HTML or pages show doubles.
const { stripAds } = require('./_cro_ad_inject');

const CARD_IMG = /!\[[^\]]*\]\([^)]*(?:catbox\.moe|wsrv\.nl|cro-syndicate|kory-white)[^)]*\)/i;
const LINK_ROW = /calendly\.com\/korywhiterevops|linkedin\.com\/in\/korywhite|crosyndicate\.com/i;
const TEXT_AD = /💼.*CRO Syndicate · Fractional CRO|Reach Kory White, Fractional CRO/i;

function countCroInBody(body) {
  const b = String(body || '');
  let n = 0;
  n += (b.match(/<aside class=["']cro-ad/gi) || []).length;
  n += (b.match(CARD_IMG) || []).length;
  if (LINK_ROW.test(b) && /Reach Kory White|Book a Quick Call|CRO Syndicate/i.test(b)) n += 1;
  return n;
}

function stripAllCroFromBody(body) {
  if (!body) return body;
  let b = stripAds(String(body));
  b = b.split('\n').filter(l => {
    const s = l.trim();
    if (!s) return true;
    if (CARD_IMG.test(s)) return false;
    if (TEXT_AD.test(s)) return false;
    if (/Reach Kory White, Fractional CRO/i.test(s)) return false;
    if (/kory-white\.jpg/i.test(s)) return false;
    return true;
  }).join('\n');
  return b.replace(/\n{3,}/g, '\n\n').trim();
}

function stripRenderedCro(html) {
  if (!html) return html;
  let h = String(html);
  h = h.replace(/\n*<aside class=["']cro-ad[\s\S]*?<\/aside>\n*/gi, '\n');
  h = h.replace(/\n*<figure class=["']entry-graphic["'][\s\S]*?(?:calendly\.com\/korywhiterevops|cro-syndicate-card|kory-white\.jpg|usgv65|files\.catbox)[\s\S]*?<\/figure>\n*/gi, '\n');
  h = h.replace(/\n*<p>\s*(?:<strong>\s*)?Reach Kory White, Fractional CRO[\s\S]*?<\/p>\n*/gi, '\n');
  h = h.replace(/\n*<p>\s*💼[\s\S]*?<\/p>\n*/gi, '\n');
  return h.replace(/\n{3,}/g, '\n\n');
}

module.exports = { stripAllCroFromBody, stripRenderedCro, countCroInBody };
