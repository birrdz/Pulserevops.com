const fs=require("fs"); const WD="C:/Users/koryj/website";
for (const l of fs.readFileSync(WD+"/.env.local","utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const { getStore } = require("@netlify/blobs");
const store = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get("answers/ce0022.json", { type: "json", consistency: "strong" });
  console.log(JSON.stringify({ cc_signed: e.cc_signed, claude_certified: e.claude_certified, was_indexed_at: e.was_indexed_at }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
