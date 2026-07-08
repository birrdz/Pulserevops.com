const fs=require("fs");
const p="C:/Users/koryj/website/_scrub_button_server.js";
let s=fs.readFileSync(p,"utf8");
const old=`  const factor1Pass = !!(result.passedGate || result.status === 'ready' || result.status === 'certified');
  const rubric13 = score >= 13 && factor1Pass;`;
const neu=`  const rbFinal = result.rubric || rubricSignOff(id, finalBody);
  const rubric13 = !!(rbFinal && rbFinal.pass);
  const factor1Pass = !!(result.passedGate || result.status === 'ready' || result.status === 'certified' || rubric13);`;
if(!s.includes(old)){ console.error("anchor missing for rubric13"); process.exit(1);} 
s=s.replace(old,neu);
const oldCert=`        await certify(id, 13, finalBody, { via: 'generate', rubric: result.rubric, title: question });`;
const neuCert=`        await certify(id, 13, finalBody, { via: 'generate', rubric: rbFinal, title: question });`;
if(!s.includes(oldCert)){ console.error("certify anchor missing"); process.exit(1);} 
s=s.replace(oldCert,neuCert);
s=s.replace("// build ONE new entry — full scrub pipeline (factor 1), then queue for scrubber (factor 2)","// build ONE new entry — full scrub pipeline; 13/13 rubric pass → certify() (no scrub re-queue)");
fs.writeFileSync(p,s);
console.log("patched generateOne rubric.pass");
