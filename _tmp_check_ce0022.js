const fs=require("fs"); const WD="C:/Users/koryj/website";
for (const l of fs.readFileSync(WD+"/.env.local","utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const { getStore } = require("@netlify/blobs");
const store = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get("answers/ce0022.json", { type: "json", consistency: "strong" });
  const idx = await store.get("_index.json", { type: "json", consistency: "strong" });
  const ent = (idx.entries || []).find(x => x && x.id === "ce0022");
  console.log(JSON.stringify({ pending: e && e.pending, quality_score: e && e.quality_score, cc_signed: e && e.cc_signed, ts: e && e.ts, index: ent }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
