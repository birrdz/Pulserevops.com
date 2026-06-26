// One-shot patcher: adds visitor-priority early-exit to every background fn.
const fs = require('fs');
const path = require('path');

const FUNCTIONS_DIR = path.join(__dirname, 'netlify', 'functions');
const files = fs.readdirSync(FUNCTIONS_DIR)
  .filter(f => /^pulse-.*-background\.js$/.test(f))
  .map(f => path.join(FUNCTIONS_DIR, f));

// Library and store-bootstrap pattern we'll piggyback on.
// We attempt to inject a defensive check that calls isVisitorPriorityActive
// against a transient @netlify/blobs getStore('pulse-machine-library') call.
// If the store can't be obtained, the check returns false (never blocking).

const PROBE = "/* visitor-priority-injected */";

const REQUIRE_LINE = "const { isVisitorPriorityActive } = require('./lib/visitor-priority');";

const GUARD = `
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}
`;

let patched = 0;
let skipped = 0;

for (const fp of files) {
  let src = fs.readFileSync(fp, 'utf8');

  if (src.indexOf(PROBE) !== -1) {
    skipped++;
    console.log('SKIP (already patched):', path.basename(fp));
    continue;
  }

  // 1. Ensure require line. Insert just before the first `exports.handler`.
  if (src.indexOf("require('./lib/visitor-priority')") === -1) {
    const handlerIdx = src.search(/exports\.handler\s*=\s*async/);
    if (handlerIdx === -1) {
      console.log('SKIP (no handler):', path.basename(fp));
      skipped++;
      continue;
    }
    src = src.slice(0, handlerIdx) + REQUIRE_LINE + '\n\n' + src.slice(handlerIdx);
  }

  // 2. Inject the guard at the top of the handler body. We look for the
  //    handler signature line and inject right after the opening brace.
  const handlerMatch = src.match(/(exports\.handler\s*=\s*async[^{]*\{)/);
  if (!handlerMatch) {
    console.log('SKIP (no handler-brace):', path.basename(fp));
    skipped++;
    continue;
  }
  const insertAt = handlerMatch.index + handlerMatch[0].length;
  src = src.slice(0, insertAt) + GUARD + src.slice(insertAt);

  fs.writeFileSync(fp, src, 'utf8');
  patched++;
  console.log('PATCHED:', path.basename(fp));
}

console.log(`\nDONE — patched=${patched} skipped=${skipped} of ${files.length}`);
