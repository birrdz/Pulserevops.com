// _claude_chat.js — claudeChat(messages, opts): a drop-in replacement for dsChat that runs the
// local Claude Code CLI headless (Max-plan auth, NOT a pay-as-you-go API key — per the
// Anthropic=Max-plan-only law). Used by the SEO back-end (one Claude Code) so the spider's
// reground costs nothing per token. Front-end publish stays on DeepSeek. (4444-locked rule.)
const { spawn } = require('child_process');
const fs = require('fs');
// Resolve the Claude Code CLI robustly: CLAUDE_BIN env → newest installed version (the version
// folder bumps on every auto-update, so never pin one) → last-known default.
function resolveClaudeBin() {
  if (process.env.CLAUDE_BIN && fs.existsSync(process.env.CLAUDE_BIN)) return process.env.CLAUDE_BIN;
  const base = 'C:/Users/koryj/AppData/Local/Packages/Claude_pzs8sxrjxfjjc/LocalCache/Roaming/Claude/claude-code';
  try {
    const vers = fs.readdirSync(base)
      .filter(v => fs.existsSync(base + '/' + v + '/claude.exe'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (vers.length) return base + '/' + vers[vers.length - 1] + '/claude.exe';
  } catch (e) {}
  return base + '/2.1.187/claude.exe';
}
const CLAUDE = resolveClaudeBin();
function claudeChat(messages, opts = {}) {
  return new Promise((resolve, reject) => {
    const system = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const user   = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');
    const args = ['-p', user, '--output-format', 'text'];
    if (opts.model) args.push('--model', opts.model);
    if (system) args.push('--append-system-prompt', system);
    const p = spawn(CLAUDE, args, { windowsHide: true });
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
module.exports = { claudeChat, CLAUDE_BIN: CLAUDE };
