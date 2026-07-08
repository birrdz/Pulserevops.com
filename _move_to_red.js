// _move_to_red — move the whole scrub population OUT of green into red (owner 4444). Any id that's in
// the cook queue (i.e. queued to be re-scrubbed) is removed from _v2_approved (green) so it shows RED
// until it genuinely re-certifies to 12/13. Backs up green first. Reversible.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const AP = WD + '/_v2_approved.json', COOKQ = WD + '/_scrub_cook_queue.json', QUEUE = WD + '/_scrub_button_queue.json';
const rd = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) || []; } catch (e) { return []; } };
const ap = rd(AP), cook = rd(COOKQ), q = rd(QUEUE);
const red = new Set([...cook, ...q]);
fs.writeFileSync(WD + '/_v2_approved.pre_red.json', JSON.stringify(ap));   // backup
const apNew = ap.filter(id => !red.has(id));
fs.writeFileSync(AP, JSON.stringify(apNew));
console.log('[move-to-red] green ' + ap.length + ' -> ' + apNew.length + '  ·  red(to-scrub) ' + red.size);
