'use strict';
/**
 * IMAGE HARD BANS — single choke point (owner 2026-07-13).
 *
 * These are NOT suggestions. NOT env-togglable. NOT “unless fixer stage”.
 * Agents and scripts MUST require('./_image_hard_bans') and refuse banned URLs.
 *
 * BANNED FOREVER as face / top / product / section image:
 *   - image.pollinations.ai / pollinations / “pollinator” live URLs
 *   - /pulse-og.svg · /pulse-og.jpg · /pulse-og.png · pulse brand OG cards
 *   - pulse-logo / brand-card placeholders
 *
 * Override: ONLY if sim/OWNER_IMG_BYPASS.json exists with { "code": "4444", "at": ISO }
 * written in the same session the owner typed 4444. Expire after 2h. No IMG_* env keys.
 */
const fs = require('fs');
const path = require('path');

const BYPASS_F = path.join(__dirname, 'sim', 'OWNER_IMG_BYPASS.json');

const BANNED_URL_RE =
  /pollinations\.ai|image\.pollinations|\/\/pollinations\b|pulse-og(\.svg|\.jpg|\.jpeg|\.png)?(\?|$)|\/pulse-og\b|pulse-logo|brand.?card|og-preview|cro-cover-\d|no-?image|placeholder\.(svg|png|jpg)/i;

const BANNED_PROVIDERS = new Set([
  'pollinations',
  'pollinator',
  'cloudflare',
  'huggingface',
  'grok',
  'ddg',
]);

function ownerImgBypassActive() {
  try {
    const j = JSON.parse(fs.readFileSync(BYPASS_F, 'utf8'));
    if (!j || String(j.code) !== '4444') return false;
    const at = Date.parse(j.at);
    if (!Number.isFinite(at)) return false;
    if (Date.now() - at > 2 * 3600 * 1000) return false; // 2h max
    return true;
  } catch (e) {
    return false;
  }
}

function isBannedImageUrl(u) {
  if (ownerImgBypassActive()) return false;
  const s = String(u || '').trim();
  if (!s) return false;
  return BANNED_URL_RE.test(s);
}

function isBannedProvider(name) {
  if (ownerImgBypassActive()) return false;
  return BANNED_PROVIDERS.has(String(name || '').toLowerCase().trim());
}

/** Throw if URL is banned — call before every assign/stamp/publish. */
function assertAllowedImageUrl(u, ctx) {
  if (isBannedImageUrl(u)) {
    throw new Error(
      'IMAGE HARD BAN blocked ' +
        String(ctx || 'assign') +
        ': ' +
        String(u || '').slice(0, 120) +
        ' — Pexels/self-host only (need OWNER_IMG_BYPASS + 4444 to override)'
    );
  }
  return true;
}

/** True = treat as missing/weak so Fixer must replace. */
function mustReplaceImageUrl(u) {
  const s = String(u || '').trim();
  if (!s) return true;
  return isBannedImageUrl(s);
}

/** Strip banned live URLs from markdown body (leave alt, drop src → empty so stage refills). */
function scrubBannedUrlsFromBody(body) {
  let b = String(body || '');
  b = b.replace(/!\[[^\]]*\]\(([^)\s]+)\)/g, (full, url) => {
    if (isBannedImageUrl(url)) return ''; // drop live banned; refill later
    return full;
  });
  b = b.replace(/(@@PRODUCT[^\n]*\simg=")([^"]+)(")/gi, (full, a, url, c) => {
    if (isBannedImageUrl(url)) return a + c.replace(/^"/, '""'); // empty img=
    return full;
  });
  // cleaner empty img=
  b = b.replace(/(@@PRODUCT[^\n]*\simg=")(")/gi, '$1$2');
  return b;
}

module.exports = {
  BANNED_URL_RE,
  BANNED_PROVIDERS,
  isBannedImageUrl,
  isBannedProvider,
  assertAllowedImageUrl,
  mustReplaceImageUrl,
  scrubBannedUrlsFromBody,
  ownerImgBypassActive,
  BYPASS_F,
};
