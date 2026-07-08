// one-shot: move the geo batch (tl19194..tl21193) to the FRONT of _cro_ds_queue.json
// so the writer publishes the owner-requested MD/DMV/DE/DC pages next.
const fs = require('fs');
const f = 'C:/Users/koryj/website/_cro_ds_queue.json';
const q = JSON.parse(fs.readFileSync(f, 'utf8'));
const isGeo = it => { const m = String(it.id).match(/^tl(\d+)$/); return m && +m[1] >= 19194 && +m[1] <= 21193; };
const geo = q.filter(isGeo), rest = q.filter(it => !isGeo(it));
const out = geo.concat(rest);
fs.writeFileSync(f, JSON.stringify(out, null, 1));
console.log('geo to front: ' + geo.length + ' geo + ' + rest.length + ' rest = ' + out.length);
console.log('front: ' + out[0].id + ' .. ' + out[geo.length - 1].id + ' | next-after: ' + out[geo.length].id);
