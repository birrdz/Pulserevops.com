// _v2_redbox_merge.js — merge slip-scan + final-gate failures into needs-review (red box)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify([...new Set(a)].sort()));

const NR = WD + '/_v2_needs_review.json';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';

const extra = ['cg0914', 'cg0843']; // final-gate slips still in publish ledger
let slipIds = [];
try {
  const slip = JSON.parse(fs.readFileSync(WD + '/_v2_slip_scan_result.json', 'utf8'));
  slipIds = (slip.main && slip.main.slipIds) || [];
} catch (e) {}

const review = new Set(readArr(NR));
const approved = new Set(readArr(AP));
const cc = new Set(readArr(CC));
let added = 0;
for (const id of [...slipIds, ...extra]) {
  if (!id) continue;
  if (!review.has(id)) { review.add(id); added++; }
  approved.delete(id);
  cc.delete(id);
}
writeArr(NR, [...review]);
writeArr(AP, [...approved]);
writeArr(CC, [...cc]);
console.log(JSON.stringify({
  needsReview: review.size,
  newlyAdded: added,
  removedFromApproved: slipIds.filter(id => readArr(AP).indexOf(id) === -1).length,
  approved: approved.size,
  ccApproved: cc.size,
}, null, 2));
