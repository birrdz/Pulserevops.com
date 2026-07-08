// _ds_concurrency_probe.js — measure DeepSeek per-call latency and whether concurrency scales.
// If N concurrent calls all finish in ~1-call time => headroom (raise V2C_DS_CONC).
// If they finish in ~N*single time => DeepSeek is rate-shaping the key (more workers won't help).
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
process.env.DS_DAILY_CAP = '1000000'; // override AFTER load (match the running engine) so the probe isn't paused by the $15 file cap
const { dsChat } = require('./_ds_lib');

const msgs = [
  { role: 'system', content: 'Reply with one short sentence.' },
  { role: 'user', content: 'In one sentence, what is revenue operations?' },
];
async function timeOne() {
  const t = process.hrtime.bigint();
  try { await dsChat(msgs, { temperature: 0.4, max_tokens: 60 }); }
  catch (e) { return { ms: -1, err: String(e.message || e).slice(0, 80) }; }
  return { ms: Number(process.hrtime.bigint() - t) / 1e6 };
}
async function burst(n) {
  const t = process.hrtime.bigint();
  const rs = await Promise.all(Array.from({ length: n }, timeOne));
  const wall = Number(process.hrtime.bigint() - t) / 1e6;
  const ok = rs.filter(r => r.ms > 0);
  const errs = rs.filter(r => r.ms < 0);
  const avg = ok.length ? Math.round(ok.reduce((a, b) => a + b.ms, 0) / ok.length) : 0;
  return { n, wall: Math.round(wall), avg, ok: ok.length, err: errs.length, sampleErr: errs[0]?.err };
}
(async () => {
  console.log('warming up (1 call)...');
  console.log('single:', await burst(1));
  console.log('8 concurrent:', await burst(8));
  console.log('16 concurrent:', await burst(16));
  console.log('\nRead: if 8/16 wall ≈ single wall => headroom. If wall grows ~linearly => key is throttled.');
})();
