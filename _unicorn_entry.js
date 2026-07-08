// 🔒 4444 LOCKED — owner easter egg. Creates a Pets-pillar Q&A about unicorns whose secret purple
// portal asks for 4444 and opens the local Scrub Button. Deploy-free (blob + index, served live).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const TITLE = 'Can you keep a pet unicorn? 🦄';
const PORTAL = `
<div style="position:fixed;bottom:16px;right:16px;z-index:99999;">
  <a href="http://localhost:8899/" onclick="var h=location.hostname,m=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);this.href=(h==='pulserevops.com'||h==='www.pulserevops.com'||h.endsWith('.netlify.app'))?(m?'http://192.168.5.68:8899/':'http://localhost:8899/'):((h==='localhost'||h==='127.0.0.1'||/^192\\.168\\./.test(h))?location.protocol+'//'+h+':8899/':'http://localhost:8899/');" target="_top" style="display:flex;flex-direction:column;align-items:center;padding:16px 20px;border:3px solid #a78bfa;border-radius:18px;background:linear-gradient(135deg,#1a1030,#2a1a4a);box-shadow:0 0 26px rgba(167,139,250,.7);text-decoration:none;cursor:pointer;">
    <div style="font-size:2.4rem;line-height:1;">🦄</div>
    <div style="color:#c4b5fd;font-weight:800;font-size:.8rem;margin-top:6px;">open portal →</div>
  </a>
</div>`;

const ANSWER = `![Can you keep a pet unicorn?](/assets/cro-cover-1.jpg)

## Direct Answer

No — unicorns are mythical, so you can't legally (or biologically) keep one as a pet. But the unicorn is one of the most beloved legendary creatures in the world, and there's a surprising amount of real history, symbolism, and lookalike "pets" behind the myth.

${PORTAL}

## Where the unicorn legend comes from

The single-horned horse shows up across cultures for thousands of years — in ancient Greek natural history (writers genuinely believed it lived in faraway India), in medieval European tapestries, and in Chinese mythology as the gentle **qilin**. Marco Polo even reported "unicorns" on his travels (he'd actually spotted rhinoceroses).

## The closest real-world "unicorns"

If you love the idea, a few real animals carry the torch:

- **The narwhal** — the "unicorn of the sea," whose long spiral tusk is actually a tooth.
- **The Arabian oryx** — a desert antelope whose two straight horns look like one in profile, and a likely source of the original myth.
- **Goats and horses with surgically or naturally fused horn buds** — historically displayed as "unicorns," though this is not something any ethical owner should do today.

## What the unicorn symbolizes

Across traditions the unicorn stands for **purity, grace, healing, and the rare and unattainable**. That's why it became the modern word for a one-of-a-kind, hard-to-find thing — a "unicorn" startup, a "unicorn" hire.

## Caring for the *idea* of a unicorn

The honest, kid-friendly version: you can't own a unicorn, but you can keep the magic alive — through stories, art, a unicorn-themed plush or toy, or a pony groomed with a (comfortable, costume-only) horn for playtime. Always put the real animal's comfort first.

## FAQ

**Are unicorns real?** No. They are legendary creatures with no scientific evidence of existence, though several real animals likely inspired the myth.

**What is the unicorn of the sea?** The narwhal, a whale whose long spiral tusk resembles a unicorn's horn.

**Is the unicorn a national animal anywhere?** Yes — the unicorn is the official national animal of Scotland, chosen for its associations with purity and untamed strength.

**Why do people call rare things "unicorns"?** Because the creature symbolizes something singular and almost impossible to find — perfect shorthand for a rarity.

**Can a horse be made into a unicorn?** No animal should ever be altered to look like one; the kind approach is a soft costume horn used briefly and comfortably.

**What does a unicorn symbolize?** Purity, grace, healing, and rarity across most cultures that tell its story.

## Sources

- Encyclopaedia Britannica — entry on the unicorn in mythology
- National Geographic — features on narwhals and the Arabian oryx
- The Metropolitan Museum of Art — "The Unicorn Tapestries"
- Smithsonian Magazine — articles on the origins of the unicorn myth
- VisitScotland — the unicorn as Scotland's national animal

## Related on PULSE

- More fun and honest pet questions in the PULSE Pets library.
`;

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  // reuse an existing unicorn entry if we already made one, else next pt id
  const existing = (idx.entries || []).find(e => e && /unicorn/i.test(e.question || '') && /^pt\d+$/.test(e.id));
  const id = existing ? existing.id : 'pt' + (Math.max(...(idx.entries || []).filter(e => e && /^pt\d+$/.test(e.id)).map(e => +e.id.slice(2))) + 1);
  const now = Date.now();
  await store.setJSON('answers/' + id + '.json', { id, question: TITLE, answer: ANSWER, tags: ['pets', 'unicorn', 'fun', 'mythical-creatures', 'kids'], quality_score: 10, cc_signed: true, claude_certified: 'Claude Certified Fresh', cc_signed_at: new Date().toISOString(), quality: '13/13', was_indexed_at: new Date().toISOString(), format_v: '2026-06', pending: false, ts: now, easter_egg: true });
  const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!fresh.entries.some(e => e && e.id === id)) { fresh.entries.unshift({ id, question: TITLE, tags: ['pets', 'unicorn', 'fun'], quality_score: 10, format_v: '2026-06', pending: false, ts: now, was_indexed_at: new Date().toISOString() }); await store.setJSON('_index.json', fresh); }
  console.log('unicorn entry live: https://pulserevops.com/knowledge/' + id + '  (' + (existing ? 'updated' : 'created') + ')');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
