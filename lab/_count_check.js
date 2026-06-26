// Word count check for q9691 baseline and q9677 target
const Module = require('module');
const origLoad = Module._load;
Module._load = function(req, parent, isMain) {
  if (req === '@netlify/blobs') return { getStore: () => ({ setJSON: async()=>{}, get: async()=>null }) };
  if (req === './polish-helper') return { runPolish: async () => {} };
  return origLoad.call(this, req, parent, isMain);
};

function loadModule(path) {
  const fs = require('fs');
  let s = fs.readFileSync(path, 'utf8');
  s = s.replace(/main\(\)\.catch[\s\S]*$/m, '');
  // Evaluate in an isolated function scope and return the v9 string
  const wrapped = '(function(){ ' + s + '; return { tldr, core, src, num, counter, links }; })()';
  return eval(wrapped);
}

['./lab/rewrite-q9691-deep.js', './lab/rewrite-q9677-deep.js'].forEach(p => {
  try {
    const m = loadModule(p);
    const v9 = m.tldr + m.core + m.src + m.num + m.counter + m.links;
    const w = v9.split(/\s+/).filter(Boolean).length;
    console.log(p, 'v9 raw words:', w);
    console.log('  tldr:', m.tldr.split(/\s+/).filter(Boolean).length);
    console.log('  core:', m.core.split(/\s+/).filter(Boolean).length);
    console.log('  src:', m.src.split(/\s+/).filter(Boolean).length);
    console.log('  num:', m.num.split(/\s+/).filter(Boolean).length);
    console.log('  counter:', m.counter.split(/\s+/).filter(Boolean).length);
    console.log('  links:', m.links.split(/\s+/).filter(Boolean).length);
  } catch(e) {
    console.log(p, 'ERROR', e.message);
  }
});
