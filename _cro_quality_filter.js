// Drop the active geo band (tl19194..tl21193) from the quality reground queue so the
// reground lane and the geo writer never fight over the same id. Keeps oldest-first order.
const fs = require('fs');
const f = 'C:/Users/koryj/website/_cro_quality_queue.json';
const q = JSON.parse(fs.readFileSync(f, 'utf8'));
const keep = q.filter(it => { const n = +String(it.id).slice(2); return n < 19194; });
fs.writeFileSync(f, JSON.stringify(keep, null, 1));
console.log('quality queue: ' + q.length + ' -> ' + keep.length + ' (dropped geo-band ids >=19194)');
console.log('band: ' + keep[0].id + ' .. ' + keep[keep.length - 1].id);
