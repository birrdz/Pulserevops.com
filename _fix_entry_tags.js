const fs = require('fs');
const files = fs.readdirSync('.').filter((f) => /^_write_[a-z0-9]+\.js$/i.test(f) && f !== '_write_lib.js');
let n = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  s = s.replace(/(let entry = \{[\s\S]*?)\n(\s*)tags: entry\.tags,/m, '$1\n$2tags: TAGS,');
  if (s !== orig) {
    fs.writeFileSync(file, s);
    n++;
    console.log('fixed', file);
  }
}
console.log('done', n);
