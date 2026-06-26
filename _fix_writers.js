const fs = require('fs');
const P = { '_write_tn.js':'tn', '_write_sc.js':'sc', '_write_nl.js':'nl', '_write_dn.js':'dn', '_write_bt.js':'bt' };
const find = '/^ca\\d+$/';
for (const [f, pre] of Object.entries(P)) {
  let s = fs.readFileSync(f, 'utf8');
  s = s.split(find).join('/^' + pre + '\\d+$/');
  fs.writeFileSync(f, s);
  console.log(f, s.includes(find) ? 'STILL HAS ca' : ('fixed -> ' + pre));
}
