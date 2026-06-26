// Global gap-fill email monitor. Watches the TOTAL campaign count (all lanes —
// DeepSeek + Claude) and fires the single consolidated status email every time
// 10 more entries are published. Survives writer relaunches. Run in background.
const fs = require('fs');
const { execSync } = require('child_process');
// 🔒 KILL SWITCH (owner 2026-06-26 PM: "cancel all automated emails"). Exit immediately
// if the flag exists so a relaunch can't resume the email loop. Delete flag to re-enable.
if (fs.existsSync('C:/Users/koryj/website/_emails_off.flag')) { console.log('[email] monitor disabled by _emails_off.flag — exiting'); process.exit(0); }
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const BASELINE = 19851;
const LOG = 'C:/Users/koryj/website/_email_monitor.out.log';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const logln = (s) => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const fire = () => { try { execSync('node _campaign_status_email.js', { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 60000 }); return true; } catch (e) { logln('[email] fire ERR ' + e.message); return false; } };
// race any promise against a timeout so one hung blob fetch can't freeze the loop forever
const withTimeout = (p, ms, tag) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout ' + tag)), ms))]);

(async () => {
  let last = -1, lastFireTs = 0;
  const TIME_FALLBACK = 20 * 60 * 1000; // never go silent > 20 min
  logln('[email] monitor started');
  for (;;) {
    let W = -1;
    try { const i = await withTimeout(store.get('_index.json', { type: 'json', consistency: 'strong' }), 30000, 'index'); W = Math.max(0, i.entries.length - BASELINE); }
    catch (e) { logln('[email] index read failed: ' + e.message); }
    const now = Date.now();
    const bucket = W >= 0 ? Math.floor(W / 10) : last;
    // fire on a new +10 bucket, or as a heartbeat every 20 min even if the read failed
    const due = (last === -1) || (W >= 0 && bucket > last) || (now - lastFireTs > TIME_FALLBACK);
    if (due) { const ok = fire(); last = Math.max(last, bucket); lastFireTs = now; logln('[email] fired ok=' + ok + ' W=' + W + ' bucket=' + bucket); }
    await sleep(90000); // check every 90s
  }
})();
