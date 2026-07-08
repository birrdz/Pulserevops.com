const fs=require("fs");
const p="C:/Users/koryj/website/_CROSSOVER.md";
let s=fs.readFileSync(p,"utf8");
const line="- **2026-07-05 (4444):** Owner rule **13/13 → auto certify()** in generateOne (no scrub re-queue); **ce0022** live - https://pulserevops.com/knowledge/ce0022 - on /recent + /current-events.";
const newLine="- **2026-07-05 LATEST (4444):** generateOne **rubricPass 13/13 → certify()** (not queueNewEntryForScrubber); **ce0022** certified `pending=false` `quality_score=13` in `_index.json` — https://pulserevops.com/knowledge/ce0022 — verified `newOnly=1` + `pillar=ce` API.";
if(s.includes(line)) s=s.replace(line,newLine);
else if(!s.includes("2026-07-05 LATEST (4444)")){
  s=s.replace(/(\#\# .*READ FIRST\r?\n\r?\n)/,"$1"+newLine+"\r\n\r\n");
}
fs.writeFileSync(p,s);
console.log("updated crossover");
