// ============================================================================
// _cro_ad_md.js — CRO Syndicate CARD as a clickable markdown IMAGE, baked into
// answer bodies (new + backfill). DEPLOY-FREE: the LIVE renderer turns
// `[![alt](img)](link)` into `<figure class="entry-graphic"><a href=link><img></a></figure>`
// — a full-width, clickable image — exactly like the product/DDG images.
//
// Image: owner's cro_syndicate_card_v2.png, hosted on catbox + proxied/resized
// through wsrv.nl (cache + webp) for speed and resilience (same proxy the product
// images use). Whole card is clickable -> Calendly ("Quick Call").
//
// POSITION: bottom of Top-10 item #3 (before "## 4."); ~30% down a regular Q&A.
// Idempotent via the unique image id in the URL. Replaces the older text ad.
// ============================================================================

const IMG  = 'https://wsrv.nl/?url=files.catbox.moe/usgv65.png&w=1280&output=webp';
const CAL  = 'https://calendly.com/korywhiterevops';        // Book a call / Calendly
const LI   = 'https://www.linkedin.com/in/korywhite';       // Kory White on LinkedIn
const CS   = 'https://crosyndicate.com/';                   // CRO Syndicate
const MARK = 'usgv65';                                  // idempotency marker (unique image id)
const ALT  = 'CRO Syndicate — Need a fractional Chief Revenue Officer? CRO Syndicate connects you with vetted fractional and interim revenue leaders. Kory White, Fractional CRO · 25 yrs · $0 to $200M scaled.';

// Owner directive (2026-06-27): the poster IMAGE (the whole-card / "unlock" click)
// goes to Calendly only. The three text links keep their OWN distinct targets:
//   • 📅 Book a Quick Call -> Calendly
//   • 💼 Kory on LinkedIn  -> LinkedIn
//   • 🏢 CRO Syndicate     -> crosyndicate.com
function adLine() {
  return `[![${ALT}](${IMG})](${CAL})\n\n`
       + `**Reach Kory White, Fractional CRO:** [📅 Book a Quick Call](${CAL}) `
       + `· [💼 Kory on LinkedIn](${LI}) · [🏢 CRO Syndicate](${CS})`;
}

// Insert the clickable card image. Returns the body with the card, or unchanged.
function insertCroAdMd(body, id) {
  if (!body) return body;
  // NOTE: no `includes(MARK)` early-return — idempotency comes from strip-then-add
  // below (stripping any existing card then re-adding yields the same result whether
  // or not a card was present). The early-return broke re-styling/re-imaging because
  // a body that already had THIS image would never pick up a new row/image swap.
  // Strip ANY prior CRO card so we never stack (old image-id usgv65, new ad67lt,
  // or a future swap) — match the card by its shape, not its image id:
  //   • card image:   [![…](…catbox/wsrv…)](…calendly…)   (image linked to Calendly)
  //   • booking row:   **👉 [Book a NN-minute call with Kory White …](…)** · …
  //   • legacy text ad: 💼 … "CRO Syndicate · Fractional CRO"
  // card image — linked OR unlinked (matches the catbox/wsrv image either way)
  const CARD_IMG  = /!\[[^\]]*\]\([^)]*(?:catbox\.moe|wsrv\.nl)[^)]*\)/i;
  // link row — match by the card's URLs (robust to any label wording), since these
  // only ever appear in the CRO card, never in answer body text.
  const LINK_ROW  = /calendly\.com\/korywhiterevops|linkedin\.com\/in\/korywhite|crosyndicate\.com/i;
  const TEXT_AD   = /💼.*CRO Syndicate · Fractional CRO/;
  let lines = body.split('\n').filter(l => !CARD_IMG.test(l) && !LINK_ROW.test(l) && !TEXT_AD.test(l));
  const ad = adLine();
  const joined = lines.join('\n');

  // Top-10: before "## 4." (bottom of item #3)
  const isTop10 = /^##\s*10\.\s/m.test(joined) || /🏆|BEST OVERALL/i.test(joined);
  if (isTop10) {
    const i4 = lines.findIndex(l => /^##\s*4\.\s/.test(l));
    if (i4 > 0) { lines.splice(i4, 0, '', ad, ''); return lines.join('\n'); }
  }
  // Regular Q&A: before the ## heading nearest 30% down
  const heads = lines.map((l, i) => (/^##\s+/.test(l) ? i : -1)).filter(i => i >= 0);
  if (heads.length >= 2) {
    const at = heads[Math.min(heads.length - 1, Math.max(1, Math.round(0.3 * heads.length)))];
    lines.splice(at, 0, '', ad, ''); return lines.join('\n');
  }
  return body; // too short — leave as-is
}

module.exports = { insertCroAdMd, MARK };
