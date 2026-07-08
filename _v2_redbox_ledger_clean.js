// _v2_redbox_ledger_clean.js — dedupe: in needs-review → remove from approved + cc
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const review = new Set(readArr(WD + '/_v2_needs_review.json'));
const extra = ['cg0914', 'cg0843', 'gp0491'];
for (const id of extra) review.add(id);
const approved = readArr(WD + '/_v2_approved.json').filter(id => !review.has(id));
const cc = readArr(WD + '/_v2_cc_approved.json').filter(id => !review.has(id));
fs.writeFileSync(WD + '/_v2_needs_review.json', JSON.stringify([...review].sort()));
fs.writeFileSync(WD + '/_v2_approved.json', JSON.stringify(approved));
fs.writeFileSync(WD + '/_v2_cc_approved.json', JSON.stringify(cc));
console.log(JSON.stringify({ needsReview: review.size, approved: approved.length, ccApproved: cc.length }, null, 2));
