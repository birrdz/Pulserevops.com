// ============================================================================
// DROP-IN for the LIVE renderer (netlify/functions/pulse-machine-entry.js)
// Adds the rotating CRO Syndicate ad mid-answer: after Top-10 item #3, or ~30%
// through a regular Q&A. Operates on the ALREADY-RENDERED answer HTML, so the
// body-escaping issue does not apply (this is exactly what the approved
// previews did). 5 variations, red/white, deterministically spread by id.
//
// HOW TO INSTALL (2 steps):
//   1) Paste the whole `insertCroAd` function (below) into pulse-machine-entry.js.
//   2) Find where the answer body is emitted, e.g.:
//          <div class="body">${renderedAnswer}</div>
//      and change it to:
//          <div class="body">${insertCroAd(renderedAnswer, entry.id)}</div>
//   3) Deploy.
//
// Click targets: face/photo -> LinkedIn · name -> Calendly · Book button ->
// Calendly · "CRO Syndicate" -> crosyndicate.com · "1-page CRO profile" -> resume.
// ============================================================================

function insertCroAd(html, id) {
  if (!html || /class="cro-ad/.test(html)) return html; // idempotent
  const R = '#C8112B', RD = '#A50E23';
  const LI = 'https://www.linkedin.com/in/korywhite';
  const CAL = 'https://calendly.com/korywhiterevops';
  const SYND = 'https://crosyndicate.com/';
  const RESUME = '/assets/kory-white-cro-1page.pdf';
  const PIC = '/assets/kory-white.jpg';
  const F = "font-family:'Plus Jakarta Sans',system-ui,sans-serif;";
  const WBTN = 'background:#fff;color:' + R + ';font-weight:800;text-decoration:none;border-radius:9px;';
  const WLINK = 'color:#fff;font-weight:800;text-decoration:underline;';
  const EYE = 'font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.85);';
  const photo = (w, b) => '<a href="' + LI + '" target="_blank" rel="noopener" data-pulse-click="curator-photo" aria-label="Kory White on LinkedIn"><img src="' + PIC + '" alt="Kory White, Fractional CRO" loading="lazy" style="width:' + w + 'px;height:' + w + 'px;border-radius:50%;object-fit:cover;display:block;border:' + b + 'px solid #fff;"></a>';
  const name = '<a href="' + CAL + '" target="_blank" rel="noopener" data-pulse-click="hire-cro" style="' + WLINK + '">Kory White</a>';
  const synd = '<a href="' + SYND + '" target="_blank" rel="noopener" data-pulse-click="cro-syndicate" style="' + WLINK + '">CRO Syndicate</a>';
  const book = (pad, fs, nw) => '<a href="' + CAL + '" target="_blank" rel="noopener" data-pulse-click="hire-cro" style="display:inline-block;' + (nw ? 'white-space:nowrap;' : '') + WBTN + 'font-size:' + fs + 'px;padding:' + pad + ';">Book a 20-minute call &rarr;</a>';

  const V = [
    '<aside class="cro-ad cro-ad-1" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:16px;margin:30px 0;padding:18px 20px;border-radius:14px;background:' + R + ';color:#fff;' + F + '"><div style="flex:0 0 auto;">' + photo(74, 2) + '</div><div style="flex:1;min-width:0;"><div style="' + EYE + 'margin-bottom:5px;">Sponsored &middot; Fractional CRO</div><div style="font-size:17px;font-weight:800;line-height:1.3;">Need a proven operator who has actually carried the number?</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">' + name + ' &mdash; Fractional Chief Revenue Officer and proven revenue operator &mdash; takes a limited number of engagements through ' + synd + '.</div><div style="margin-top:10px;">' + book('9px 18px', 13.5, false) + '</div></div></aside>',
    '<aside class="cro-ad cro-ad-2" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:13px;margin:28px 0;padding:14px 17px;border-radius:10px;background:' + R + ';color:#fff;' + F + '"><div style="flex:0 0 auto;">' + photo(46, 2) + '</div><div style="font-size:14px;line-height:1.45;flex:1;">Hire a <strong>proven fractional CRO</strong> &mdash; skip the 9-month search. ' + name + ', builder &amp; scaler, via ' + synd + '.</div>' + book('8px 15px', 13, true) + '</aside>',
    '<aside class="cro-ad cro-ad-3" aria-label="Sponsored — Fractional CRO" style="margin:30px 0;padding:24px;border-radius:16px;background:' + R + ';color:#fff;text-align:center;' + F + '"><div style="' + EYE + 'margin-bottom:10px;">Sponsored &middot; CRO Syndicate</div><div style="font-size:18px;font-weight:700;line-height:1.45;max-width:560px;margin:0 auto;">&ldquo;The kind of operator who fixes a broken forecast in weeks instead of quarters.&rdquo;</div><div style="display:inline-flex;align-items:center;gap:10px;margin-top:14px;">' + photo(40, 2) + '<span style="font-size:13.5px;text-align:left;">' + name + '<br><span style="color:rgba(255,255,255,0.9);font-weight:700;">Proven Fractional CRO &middot; builder &amp; scaler</span></span></div><div style="margin-top:14px;">' + book('9px 20px', 13.5, false) + '</div></aside>',
    '<aside class="cro-ad cro-ad-4" aria-label="Sponsored — Fractional CRO" style="margin:30px 0;padding:20px 22px;border-radius:14px;background:' + R + ';color:#fff;border:1px solid ' + RD + ';' + F + '"><div style="' + EYE + 'margin-bottom:6px;">Sponsored &middot; Fractional CRO</div><div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;"><div style="flex:1;min-width:240px;"><div style="font-size:18px;font-weight:800;line-height:1.3;">Pipeline flat? Forecast you can&rsquo;t trust?</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">Talk to ' + name + ' &mdash; a sitting-CRO operator and proven scaler &mdash; this week, via ' + synd + '. Engagements start in days, not months.</div></div>' + book('11px 20px', 13.5, true) + '</div></aside>',
    '<aside class="cro-ad cro-ad-5" aria-label="Sponsored — Fractional CRO" style="display:flex;align-items:center;gap:16px;margin:30px 0;padding:18px 20px;border-radius:14px;background:' + R + ';color:#fff;' + F + '"><div style="flex:1;min-width:0;"><div style="' + EYE + 'margin-bottom:5px;">Sponsored &middot; Fractional CRO</div><div style="font-size:17px;font-weight:800;line-height:1.3;">A $0&ndash;$200M revenue builder, on your team part-time.</div><div style="font-size:14px;color:rgba(255,255,255,0.92);margin-top:4px;line-height:1.5;">' + name + ' &mdash; proven operator, builder &amp; scaler &mdash; available through ' + synd + '.</div><div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;"><a href="' + RESUME + '" target="_blank" rel="noopener" data-pulse-click="kory-resume" style="display:inline-block;border:1.5px solid #fff;color:#fff;font-weight:800;font-size:13px;padding:8px 15px;border-radius:9px;text-decoration:none;">&#128196; 1-page CRO profile</a>' + book('9px 16px', 13, false) + '</div></div><div style="flex:0 0 auto;">' + photo(74, 2) + '</div></aside>'
  ];

  // deterministic "random" spread by id -> stable variation per entry
  let h = 0; const s = String(id || ''); for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0;
  const ad = '\n' + V[h % V.length] + '\n';

  // Top-10: insert before the 4th numbered tool heading (<h2 id="4-...">)
  const numbered = [...html.matchAll(/<h2[^>]*\bid="(\d+)-[^"]*"/g)];
  if (numbered.length >= 4) {
    const four = numbered.find(m => m[1] === '4') || numbered[3];
    return html.slice(0, four.index) + ad + html.slice(four.index);
  }
  // Regular Q&A: insert before the heading nearest 30% of the way down
  const heads = [...html.matchAll(/<h2\b[^>]*>/g)];
  if (heads.length >= 2) {
    const idx = Math.min(heads.length - 1, Math.max(1, Math.round(0.3 * heads.length)));
    return html.slice(0, heads[idx].index) + ad + html.slice(heads[idx].index);
  }
  return html; // too short — leave as-is
}

module.exports = { insertCroAd };
