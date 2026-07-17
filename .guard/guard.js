// .guard/guard.js — BATON GUARD (PreToolUse hook). Node (python not installed on this box; identical logic).
// Reads the tool call on stdin, enforces LAW-BATON, prints a PreToolUse permission decision on stdout.
// Rules (owner spec 2026-07-16):
//  a. BLOCK Bash with loops/xargs/find -exec/python|node|powershell/globs/write-vectors that touch image output dirs.
//  b. BLOCK any Read/Bash/Edit/Write touching .guard/secret.key or _receipts/ contents. CC may never open these.
//  c. ALLOW a Write/Edit into an image dir ONLY IF a pending receipt matches dest_path AND sha256(content).
//     On success MOVE the receipt to _receipts/used/ (single use, ever).
//  d. One image write per tool call (Write writes one file; multi-file Bash write vectors are blocked by a).
//  e. Every blocked attempt is appended to _receipts/violations.log with the attempted command/path.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WD = 'C:/Users/koryj/website';
const IMG_DIRS = [path.resolve(WD, 'new/output'), path.resolve(WD, 'assets/qa')];
const SECRET = path.resolve(WD, '.guard/secret.key');
const PENDING = path.resolve(WD, '_receipts/pending');
const USED = path.resolve(WD, '_receipts/used');
const VIOL = path.resolve(WD, '_receipts/violations.log');

function norm(p) { try { return path.resolve(String(p || '')); } catch (e) { return String(p || ''); } }
function inImgDir(p) { const n = norm(p); return IMG_DIRS.some(d => n === d || n.startsWith(d + path.sep)); }
function touchesProtected(s) { const x = String(s || '').replace(/\\/g, '/').toLowerCase(); return x.includes('secret.key') || x.includes('.guard') || x.includes('_receipts'); }
function refsImgDir(cmd) { const x = String(cmd || '').replace(/\\/g, '/').toLowerCase(); return x.includes('new/output') || x.includes('assets/qa'); }

function logViol(reason, attempt) { try { fs.mkdirSync(path.dirname(VIOL), { recursive: true }); fs.appendFileSync(VIOL, new Date().toISOString() + ' | ' + reason + ' | ' + String(attempt || '').slice(0, 500) + '\n'); } catch (e) {} }
function out(obj) { process.stdout.write(JSON.stringify(obj)); process.exit(0); }
function deny(reason, attempt) { logViol(reason, attempt); out({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: 'LAW-BATON: ' + reason }, systemMessage: '⛔ BATON GUARD BLOCKED — ' + reason }); }
function allow() { out({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow' } }); }

function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function verifyReceipt(destPath, content) {
  let secret; try { secret = fs.readFileSync(SECRET); } catch (e) { return null; }
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(String(content), 'utf8');
  const sha = sha256(bytes);
  const dn = norm(destPath);
  let files = []; try { files = fs.readdirSync(PENDING).filter(f => f.endsWith('.json')); } catch (e) {}
  for (const f of files) {
    let r; try { r = JSON.parse(fs.readFileSync(path.join(PENDING, f), 'utf8')); } catch (e) { continue; }
    if (norm(r.dest_path) !== dn) continue;
    if (r.source_image_sha256 !== sha) continue;
    const payload = [r.entry_id, r.slot_id, r.source_image_sha256, r.dest_path, r.timestamp, r.nonce].join('|');
    const expect = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    let good = false; try { good = crypto.timingSafeEqual(Buffer.from(String(r.sig || ''), 'hex'), Buffer.from(expect, 'hex')); } catch (e) { good = false; }
    if (good) return path.join(PENDING, f);
  }
  return null;
}

function main() {
  let raw = ''; try { raw = fs.readFileSync(0, 'utf8'); } catch (e) {}
  let data = {}; try { data = JSON.parse(raw || '{}'); } catch (e) { return allow(); }
  const tool = data.tool_name || '';
  const ti = data.tool_input || {};

  // RULE b — never open the secret or receipts
  if (tool === 'Read' || tool === 'Edit' || tool === 'Write') {
    if (touchesProtected(ti.file_path || ti.path || '')) return deny('CC may never open .guard/secret.key or _receipts/', ti.file_path || ti.path);
  }
  if (tool === 'Bash') {
    const cmd = ti.command || '';
    if (touchesProtected(cmd)) return deny('CC may never open .guard/secret.key or _receipts/', cmd);
    // RULE a + d — batch/script/write vectors touching image output dirs
    if (refsImgDir(cmd)) {
      const low = cmd.toLowerCase();
      const batch = /\b(for|while|xargs)\b/.test(low) || (low.includes('find ') && low.includes('-exec'));
      const writey = /\b(cp|mv|tee|dd|rsync|install|curl|wget|node|python|python3|powershell|pwsh|copy|move|out-file|set-content|add-content)\b/.test(low) || cmd.includes('>') || cmd.includes('*');
      if (batch || writey) return deny('Bash batch/script/write into an image output dir is forbidden — images come only from the picker + a receipt', cmd);
    }
  }

  // RULE c — Write/Edit into an image dir needs a matching, single-use pending receipt
  if (tool === 'Write' || tool === 'Edit') {
    const fp = ti.file_path || '';
    if (inImgDir(fp)) {
      const content = (ti.content != null) ? ti.content : null;
      if (content == null) return deny('image writes must be a single full-content Write backed by a receipt (Edit cannot be verified)', fp);
      const receipt = verifyReceipt(fp, content);
      if (!receipt) return deny('no valid pending receipt for this image write (dest_path + sha256 must match a picker receipt)', fp);
      try { fs.mkdirSync(USED, { recursive: true }); fs.renameSync(receipt, path.join(USED, path.basename(receipt))); } catch (e) {}
      return allow();
    }
  }

  return allow();
}
main();
