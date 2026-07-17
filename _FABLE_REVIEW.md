# Kory's Fixer — problem brief for Fable (2026-07-15)

## The situation in plain English
- Library = **35,823 entries**. Score histogram: **score 10 → 32,404 entries**, score 13 → 1,800, score <10 → 1,359.
- The 32,404 at exactly **score 10 are a stale/default stamp** — they were NOT truly verified by this pipeline. The panel counts `score >= 10` as "certified" → shows ~93% certified. **That number is wrong.** Kory's standard: everything must be run through the fixer, so it should read **~0% certified** until processed.
- Suspected core failure: the fixer runs on **Claude Code (Max plan)**. When Max weekly usage runs out, the agent calls **fail silently** — the fixer logs a skip and *looks* busy but publishes nothing. Matches "1,000 looked done, nothing changed / only ~200 done all day."
- There IS an `ANTHROPIC_API_KEY` in `.env.local`, but the API account has **no money**, so if the CLI ever used it, calls would just 402-fail (no charge). Kory wants **Max plan only, never pay-as-you-go**.
- Open question: **go back to DeepSeek** (the older, more reliable engine — fails loudly on balance, no usage cliff) vs stay on Claude Max (better prose, silent usage cliff)?

## KEY CODE

### 1) How the fixer picks its writer — `sim_transform.js` `writeChat()`
```js
async function writeChat(messages) {
  // DS_ONLY/NO_CLAUDE=1 → DeepSeek only. CLAUDE_ONLY/NO_DS=1 → Claude Code only. Else Claude first, DS fallback.
  const dsOnly = process.env.DS_ONLY === '1' || process.env.NO_CLAUDE === '1';
  const claudeOnly = process.env.CLAUDE_ONLY === '1' || process.env.NO_DS === '1';
  if (!dsOnly) {
    try {
      const r = await claudeChat(messages, { timeoutMs: 180000 });
      const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || '';
      if (t && t.length > 200) return t;
    } catch (e) {}          // <-- Claude failure (incl. "out of usage") is SWALLOWED here
    if (claudeOnly) return '';   // <-- CLAUDE_ONLY: returns EMPTY on failure → entry silently not fixed
  }
  if (claudeOnly) return '';
  try { const r = await dsChat(messages, { max_tokens: 8000, temperature: 0.8 }); return (r && r.content) || ''; } catch (e) { return ''; }
}
```
**Note the silent-failure path:** with `CLAUDE_ONLY=1`, if Claude is out of usage the call throws, gets caught, and returns `''`. The fixer then treats the entry as a failed write — "looks like it's doing it but isn't."

### 2) How Claude is invoked — `_claude_chat.js` (Max-plan CLI, spawns claude.exe)
```js
const { spawn } = require('child_process');
const CLAUDE = resolveClaudeBin();   // newest installed claude.exe (Claude Code CLI)
function claudeChat(messages, opts = {}) {
  return new Promise((resolve, reject) => {
    const system = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const user   = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');
    const args = ['-p', user, '--output-format', 'text'];
    if (opts.model) args.push('--model', opts.model);
    if (system) args.push('--append-system-prompt', system);
    const p = spawn(CLAUDE, args, { windowsHide: true });   // <-- inherits process.env, incl. ANTHROPIC_API_KEY
    let out = '', err = '';
    const to = setTimeout(() => { try { p.kill(); } catch (e) {} reject(new Error('claude timeout')); }, opts.timeoutMs || 300000);
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('error', e => { clearTimeout(to); reject(e); });
    p.on('close', code => {
      clearTimeout(to);
      const text = String(out || '').trim();
      if (code === 0 && text) resolve({ content: text, usage: null });
      else reject(new Error('claude exit ' + code + ' ' + String(err).slice(0, 200)));
    });
    p.stdin.end();
  });
}
```
**Hardening option:** spawn with a cleaned env (`delete env.ANTHROPIC_API_KEY`) so the CLI can ONLY use the Max login, never the empty API account.

### 3) Why everything is "score 10" — `sim_transform.js` `stampIqPass()`
```js
async function stampIqPass(id) {
  const score = 10;   // <-- HARD-CODED. On a content-gate pass it stamps 10 regardless of real rubric.
  // ...writes quality_score:10 to answers/<id>.json AND _index.json...
}
```
Images are PAUSED (`IMAGE_APPLY_PAUSED=1`), and the gate WAIVES all image points in simMode, so a content-only entry can never exceed ~10-11. **That's why 32,404 sit at exactly 10** and nothing reaches 13 without images.

### 4) The panel's "certified" count — `fixer_panel.js` `scopeList()`
```js
for (const e of es) {
  const p = pOf(e.id); if (!p || !PNAMES[p]) continue;
  byP[p] = (byP[p] || 0) + 1;
  if (typeof e.quality_score === 'number' && e.quality_score >= 10) certified++;  // <-- counts the fake 10s
}
```
`certified` counts `score >= 10` → 33k → the misleading "93% certified." Should instead count only entries THIS fixer actually verified (a real ledger), so it starts ~0 and climbs truthfully.

## The two questions for Fable
1. **Engine:** DeepSeek (reliable, loud failures, needs balance) vs Claude Max (better prose, silent usage-cliff that fakes progress)? Lean is DeepSeek for a 35k grind.
2. **"Certified" definition:** what counts as done while images are paused (max reachable ~10)? Options: (a) treat 10 = content-certified and label it honestly, (b) un-pause images so 13 is reachable, (c) count only fixer-verified entries in a ledger starting from 0.
