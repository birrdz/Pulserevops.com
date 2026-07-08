// _reimage_contact_sheet.js — build an HTML contact sheet of a page's Top-10 slot images so the owner can
// eyeball title↔image match. Reads _<pillar>_reimage_report.json + the local /assets/qa/<id>-1NN.jpg files,
// embeds each as a data URI. Usage: PAGE=gm0030 node _reimage_contact_sheet.js  → writes the HTML path.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const PAGE = (process.env.PAGE || 'gm0030').toLowerCase();
const PILLAR = (PAGE.match(/^[a-z]+/) || ['gm'])[0];
const OUT = process.env.OUT || (require('os').tmpdir ? 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/3c89cf33-d148-48d0-b269-12afa5bc23ea/scratchpad/reimage_' + PAGE + '.html' : WD + '/reimage_' + PAGE + '.html');
const report = (() => { try { return JSON.parse(fs.readFileSync(WD + '/_' + PILLAR + '_reimage_report.json', 'utf8')); } catch (e) { return {}; } })();
const rows = report[PAGE] || [];
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function dataUri(rank) {
  try {
    const b = fs.readFileSync(WD + '/assets/qa/' + PAGE + '-' + (100 + rank) + '.jpg');
    return 'data:image/jpeg;base64,' + b.toString('base64');
  } catch (e) { return ''; }
}
let cards = '';
for (let r = 1; r <= 10; r++) {
  const row = rows.find(x => x.rank === r) || {};
  const uri = dataUri(r);
  const via = row.chain_step ? esc(row.chain_step) + (row.gate ? ' · ' + esc(row.gate) : '') : esc(row.host || '');
  cards += '<figure class="c"><div class="imgwrap">' + (uri ? '<img src="' + uri + '" alt="">' : '<div class="missing">no file</div>') +
    '</div><figcaption><b>' + r + '. ' + esc(row.name || '?') + '</b><span class="meta">' + via +
    (row.tier ? ' · tier ' + row.tier : '') + (row.status && row.status !== 'ok' ? ' · ' + esc(row.status) : '') + '</span></figcaption></figure>';
}
const html = '<h1>Top-10 image check · ' + esc(PAGE) + '</h1>' +
  '<p class="sub">Each card = the ranked game and the image now self-hosted for that slot. Confirm the picture matches the game.</p>' +
  '<div class="grid">' + cards + '</div>' +
  '<style>.sub{color:#6b6257;font-size:14px;margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}' +
  '.c{margin:0;border:1px solid #e5ddd0;border-radius:12px;overflow:hidden;background:#fff}' +
  '.imgwrap{aspect-ratio:4/3;background:#f3efe7;display:flex;align-items:center;justify-content:center;overflow:hidden}' +
  '.imgwrap img{width:100%;height:100%;object-fit:cover}.missing{color:#b04a2f;font-weight:700}' +
  'figcaption{padding:10px 12px}figcaption b{display:block;font-size:14px;color:#15110d}.meta{display:block;color:#8a7f70;font-size:12px;margin-top:3px}' +
  '@media(prefers-color-scheme:dark){.c{background:#1c1712;border-color:#3a3128}figcaption b{color:#f3efe7}.imgwrap{background:#241d16}}</style>';
fs.writeFileSync(OUT, html);
console.log(OUT);
