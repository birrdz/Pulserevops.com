// RECONCILE HEARTBEAT (rule, 2026-06-26): the shared _index.json gets clobbered by
// concurrent writers (runner + image lanes + copy agents), so the build-status bar
// oscillates. This loop rebuilds the index from the race-safe answer blobs every 45s,
// keeping total (and the progress bar) accurate + monotonic in near-real-time.
const { execSync } = require('child_process');
const PREFIXES = 'q st ik tk gb bs er ra gp fr ca co aq hf tn sc nl dn bt mv wl dr tv rs es cl lv ev sy ga gm sk sp ai bo cd cg pt sw';
let pass = 0;
(async () => {
  for (;;) {
    pass++;
    try {
      execSync('node -r ./_loadenv.js _index_reconcile_any.js ' + PREFIXES, { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 540000 });
      console.log('[recon-hb] pass ' + pass + ' ok ' + new Date().toISOString());
    } catch (e) { console.log('[recon-hb] pass ' + pass + ' err ' + (e.message || e)); }
    await new Promise(r => setTimeout(r, 30000));
  }
})();
