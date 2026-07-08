const fs = require('fs');
const p = 'C:/Users/koryj/website/_scrub_button_server.js';
let s = fs.readFileSync(p, 'utf8');
const needle = `    if (result.status === 'certified') {
      writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
      if (!out.steps.includes('rubric-signoff')) out.steps.push('rubric-signoff');
      if (!out.steps.includes('cc-signoff')) out.steps.push('cc-signoff');
      return Object.assign(out, { status: 'certified', score: result.score });
    }`;
const repl = `    if (result.status === 'certified') {
      writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
      removeRejectFix(id);
      await loadIndex();
      if (!out.steps.includes('rubric-signoff')) out.steps.push('rubric-signoff');
      if (!out.steps.includes('cc-signoff')) out.steps.push('cc-signoff');
      return Object.assign(out, { status: 'certified', score: result.score });
    }`;
if (!s.includes(needle)) { console.error('scrubOne certified block not found'); process.exit(1);} 
s = s.replace(needle, repl);
fs.writeFileSync(p, s);
console.log('patched scrubOne certified loadIndex');
