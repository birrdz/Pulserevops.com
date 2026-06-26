// Unit smoke tests for Image LAW grader + audit (no network).
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');

const cover = '![cover](https://images.example.com/photo.jpg)\n\n';
const weakCover = '![cover](https://pulserevops.com/img/auto/q1234.svg)\n\n';
const productLine = '@@PRODUCT name="Widget Pro" img="https://images.example.com/w.jpg" site="https://example.com"\n';

function top10Body(opts = {}) {
  const c = opts.cover === false ? '' : opts.weakCover ? weakCover : cover;
  const withImg = opts.productImgs !== false;
  let b = c + '## Direct Answer\n\nFoo.\n\n';
  for (let i = 1; i <= 10; i++) {
    b += `## ${i}. Product ${i}${i === 1 ? ' 🏆 BEST OVERALL' : i === 2 ? ' 💎 BEST VALUE' : ''}\n`;
    if (withImg) b += productLine.replace('Widget Pro', `Product ${i}`).replace('/w.jpg', `/p${i}.jpg`);
    b += '\n**Verdict:** ok\n\n';
  }
  b += '## FAQ\n**Q?**\nA.\n\n## Sources\n- [A](https://a.com)\n'.repeat(6);
  return b;
}

function essayBody(opts = {}) {
  const c = opts.noCover ? '' : opts.weakCover ? weakCover : cover;
  return (
    c +
    '## Direct Answer\n\nFoo bar baz.\n\n## Section\n\n' +
    'word '.repeat(1200) +
    '\n\n## FAQ\n**Q?**\nA.\n\n## Sources\n- [A](https://a.com)\n'.repeat(6)
  );
}

let pass = 0;
let fail = 0;

function assert(label, cond) {
  if (cond) {
    pass++;
    console.log('PASS', label);
  } else {
    fail++;
    console.error('FAIL', label);
  }
}

// Top-10 without images
const t0 = top10Body({ cover: false, productImgs: false });
const a0 = auditImages('er0001', t0);
const g0 = gradeEntry('er0001', t0);
assert('top10 no images: audit not compliant', !a0.compliant);
assert('top10 no images: grade < 10', g0.score < 10);
assert('top10 no images: missing images_law', g0.missing.includes('images_law'));

// Top-10 with 11 images
const t1 = top10Body();
const a1 = auditImages('er0001', t1);
const g1 = gradeEntry('er0001', t1);
assert('top10 with 11: audit compliant', a1.compliant);
assert('top10 with 11: images_law pass', g1.criteria.images_law);

// Essay without cover
const e0 = essayBody({ noCover: true });
const ae0 = auditImages('ra0001', e0);
const ge0 = gradeEntry('ra0001', e0);
assert('essay no cover: audit not compliant', !ae0.compliant);
assert('essay no cover: grade < 10', ge0.score < 10);

// Essay with DDG-style cover
const e1 = essayBody();
const ae1 = auditImages('ra0001', e1);
const ge1 = gradeEntry('ra0001', e1);
assert('essay with cover: audit compliant', ae1.compliant);
assert('essay with cover: images_law pass', ge1.criteria.images_law);

// Weak cover fails
const e2 = essayBody({ weakCover: true });
const ae2 = auditImages('q0001', e2);
assert('essay weak cover: not compliant', !ae2.compliant);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
