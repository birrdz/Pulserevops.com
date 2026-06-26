const fs=require('fs');
const base=fs.readFileSync('_write_ca.js','utf8');
const P=[['tn','towns','town'],['sc','schools','school'],['nl','nightlife','nightlife'],['dn','dining','dining'],['bt','boats','boat']];
for(const [pre,route,tag] of P){
  let s=base;
  s=s.replace(/\/\^ca\d\+\$\//g, '/^'+pre+'\d+$/');
  s=s.replace(/_write_ca\.js <ca####>/g, '_write_'+pre+'.js <'+pre+'####>');
  s=s.replace(/usage: node _write_ca\.js/g, 'usage: node _write_'+pre+'.js');
  s=s.replace(/const BASE_TAGS = \[[^\]]*\];/, "const BASE_TAGS = ['"+tag+"', 'top-10', 'best-of-2027', '"+route+"'];");
  s=s.replace(/cars\/\$\{ID\}/g, route+'/${ID}');
  s=s.replace(/Cars pillar — ca####/g, route+' pillar — '+pre+'####');
  fs.writeFileSync('_write_'+pre+'.js', s);
  console.log('wrote _write_'+pre+'.js');
}
