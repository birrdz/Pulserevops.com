// re-runnable: bake the current pollinator-cover default set into index.html <head> as window.PULSE_DEFAULTS
const fs=require('fs');
const data=fs.readFileSync('_defaults.json','utf8').trim();
let h=fs.readFileSync('index.html','utf8');
h=h.replace(/\n?<script>window\.PULSE_DEFAULTS=[\s\S]*?<\/script>/,'');   // drop any prior injection
const tag='\n<script>window.PULSE_DEFAULTS='+data+';</script>';
const i=h.indexOf('</head>');
h=h.slice(0,i)+tag+'\n'+h.slice(i);
fs.writeFileSync('index.html',h);
console.log('injected',JSON.parse(data).length,'defaults into index.html head');
