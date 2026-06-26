const fs = require('fs');
const j = JSON.parse(fs.readFileSync('C:/Users/koryj/website/lab/_liblist_t229.json', 'utf8'));
const entries = j.entries;
const wants = ['wedding','event','party','photo booth','catering','floral','flower','balloon','planner','photography','bounce house','candy','dessert','rental','face paint','mobile bar'];
const cands = entries.filter(function (e) {
  if (!/^q[0-9]+$/.test(e.id)) return false;
  if (!/start a .* business/i.test(e.question || '')) return false;
  const q = (e.question || '').toLowerCase();
  return wants.some(function (w) { return q.indexOf(w) !== -1; });
});
cands.forEach(function (e) { console.log(e.id + '  qs=' + e.quality_score + '  ' + (e.question || '')); });
