// One-shot: wire prepareEntryForPublish into all _write_*.js publish paths.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const files = fs.readdirSync(ROOT).filter((f) => /^_write_[a-z0-9]+\.js$/i.test(f) && f !== '_write_lib.js');

let patched = 0;
for (const file of files) {
  const fp = path.join(ROOT, file);
  let src = fs.readFileSync(fp, 'utf8');
  if (src.includes('prepareEntryForPublish')) {
    console.log('skip (already wired)', file);
    continue;
  }

  const titleVar = /\bconst QUESTION = process\.argv\[3\]/.test(src) ? 'QUESTION' : 'TITLE';

  // Add or extend _write_lib require
  if (src.includes("require('./_write_lib')")) {
    src = src.replace(
      /const \{ prepareBodyForGrade \} = require\('\.\/_write_lib'\);/,
      "const { prepareBodyForGrade, prepareEntryForPublish } = require('./_write_lib');"
    );
    if (!src.includes('prepareEntryForPublish')) {
      src = src.replace(
        /require\('\.\/_write_lib'\);/,
        "const { prepareEntryForPublish } = require('./_write_lib');"
      );
    }
  } else {
    const insertAfter = src.match(/^const fs = require\('fs'\);\r?\n/m);
    if (insertAfter) {
      src = src.replace(
        /^const fs = require\('fs'\);\r?\n/m,
        "const fs = require('fs');\nconst { prepareEntryForPublish } = require('./_write_lib');\n"
      );
    }
  }

  // const entry -> let entry (first occurrence in publish block)
  src = src.replace(/\bconst entry = \{/, 'let entry = {');

  // Insert SEO stamp before answers blob write
  const setPat = /(\r?\n)([ \t]*)await store\.setJSON\(`answers\/\$\{ID\}\.json`, entry\);/;
  if (!setPat.test(src)) {
    console.log('WARN no setJSON pattern', file);
    continue;
  }
  src = src.replace(
    setPat,
    `$1$2entry = prepareEntryForPublish(ID, ${titleVar}, entry);$1$2await store.setJSON(\`answers/\${ID}.json\`, entry);`
  );

  // Index rows: prefer stamped tags
  src = src.replace(/tags: TAGS,/g, 'tags: entry.tags,');

  fs.writeFileSync(fp, src);
  patched++;
  console.log('patched', file);
}

console.log(`\nDone: ${patched}/${files.length} writers wired.`);
