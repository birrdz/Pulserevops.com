const fs=require("fs"); const WD="C:/Users/koryj/website";
for (const l of fs.readFileSync(WD+"/.env.local","utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const { getStore } = require("@netlify/blobs");
const store = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const id = process.argv[2] || "ce0022";
(async () => {
  const cur = await store.get("answers/"+id+".json", { type: "json", consistency: "strong" });
  if (!cur || !cur.answer) throw new Error("no blob");
  let body = cur.answer;
  body = body.replace(/!\[[^\]]*\]\([^)]*kory-white\.jpg[^)]*\)\s*\n?/gi, "");
  body = body.replace(/\]\(assets\//g, "](/assets/");
  const now = Date.now();
  await store.setJSON("answers/"+id+".json", Object.assign({}, cur, { answer: body, updated_at: new Date().toISOString(), cover_src: cur.cover_src || "flux" }));
  console.log(JSON.stringify({ ok: true, id, fixed: true }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
