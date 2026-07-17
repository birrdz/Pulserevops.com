#!/usr/bin/env python3
# .guard/guard.py - BATON GUARD (PreToolUse hook). Enforces LAW-BATON on every tool call.
# Reads the tool call as JSON on stdin, prints a PreToolUse permission decision on stdout.
# Rules (owner spec 2026-07-16):
#  a. BLOCK Bash w/ loops (for/while)/xargs/find -exec/python|node|powershell/globs/write-vectors touching image output dirs.
#  b. BLOCK any Read/Bash/Edit/Write touching .guard/secret.key or _receipts/ contents. CC may never open these.
#  c. ALLOW a Write/Edit into an image dir ONLY IF a pending receipt matches dest_path AND sha256(content).
#     On success MOVE the receipt to _receipts/used/ (single use, ever).
#  d. One image write per tool call.
#  e. Every blocked attempt is appended to _receipts/violations.log with the attempted command/path.
import sys, os, json, time, glob, hashlib, hmac

WD = "C:/Users/koryj/website"
IMG_DIRS = [os.path.normcase(os.path.abspath(os.path.join(WD, "new/output"))),
            os.path.normcase(os.path.abspath(os.path.join(WD, "assets/qa")))]
SECRET = os.path.join(WD, ".guard", "secret.key")
PENDING = os.path.join(WD, "_receipts", "pending")
USED = os.path.join(WD, "_receipts", "used")
VIOL = os.path.join(WD, "_receipts", "violations.log")

def norm(p):
    try: return os.path.normcase(os.path.abspath(str(p or "")))
    except Exception: return str(p or "")

def in_img_dir(p):
    n = norm(p)
    return any(n == d or n.startswith(d + os.sep) for d in IMG_DIRS)

def touches_protected(s):
    x = str(s or "").replace("\\", "/").lower()
    return ("secret.key" in x) or (".guard" in x) or ("_receipts" in x)

def refs_img_dir(cmd):
    x = str(cmd or "").replace("\\", "/").lower()
    return ("new/output" in x) or ("assets/qa" in x)

def log_viol(reason, attempt):
    try:
        os.makedirs(os.path.dirname(VIOL), exist_ok=True)
        with open(VIOL, "a", encoding="utf-8") as f:
            f.write("%s | %s | %s\n" % (time.strftime("%Y-%m-%dT%H:%M:%S"), reason, str(attempt or "")[:500]))
    except Exception: pass

def out(obj):
    sys.stdout.write(json.dumps(obj)); sys.exit(0)

def deny(reason, attempt):
    log_viol(reason, attempt)
    out({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny",
         "permissionDecisionReason": "LAW-BATON: " + reason},
         "systemMessage": "⛔ BATON GUARD BLOCKED - " + reason})

def allow():
    out({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow"}})

def verify_receipt(dest_path, content):
    try:
        with open(SECRET, "rb") as f: secret = f.read().strip()
    except Exception: return None
    body = content.encode("utf-8") if isinstance(content, str) else bytes(content)
    sha = hashlib.sha256(body).hexdigest()
    dn = norm(dest_path)
    for rf in glob.glob(os.path.join(PENDING, "*.json")):
        try:
            with open(rf, "r", encoding="utf-8") as f: r = json.load(f)
        except Exception: continue
        if norm(r.get("dest_path", "")) != dn: continue
        if r.get("source_image_sha256", "") != sha: continue
        payload = "|".join([str(r.get(k, "")) for k in ("entry_id", "slot_id", "source_image_sha256", "dest_path", "timestamp", "nonce")])
        expect = hmac.new(secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if hmac.compare_digest(str(r.get("sig", "")), expect):
            return rf
    return None

def main():
    try: data = json.loads(sys.stdin.read() or "{}")
    except Exception: return allow()
    tool = data.get("tool_name", "")
    ti = data.get("tool_input", {}) or {}

    # RULE b - never open the secret or receipts
    if tool in ("Read", "Edit", "Write"):
        if touches_protected(ti.get("file_path", "") or ti.get("path", "")):
            return deny("CC may never open .guard/secret.key or _receipts/", ti.get("file_path", "") or ti.get("path", ""))
    if tool == "Bash":
        cmd = ti.get("command", "")
        if touches_protected(cmd):
            return deny("CC may never open .guard/secret.key or _receipts/", cmd)
        # RULE a + d - batch/script/write vectors touching image output dirs
        if refs_img_dir(cmd):
            low = cmd.lower()
            batch = any(w in low.split() for w in ("for", "while", "xargs")) or ("find " in low and "-exec" in low)
            writey = any(w in low.split() for w in ("cp", "mv", "tee", "dd", "rsync", "install", "curl", "wget", "node", "python", "python3", "powershell", "pwsh", "copy", "move")) or (">" in cmd) or ("*" in cmd)
            if batch or writey:
                return deny("Bash batch/script/write into an image output dir is forbidden - images come only from the picker + a receipt", cmd)

    # RULE c - Write/Edit into an image dir needs a matching single-use pending receipt
    if tool in ("Write", "Edit"):
        fp = ti.get("file_path", "") or ""
        if in_img_dir(fp):
            content = ti.get("content", None)
            if content is None:
                return deny("image writes must be a single full-content Write backed by a receipt (Edit cannot be verified)", fp)
            rf = verify_receipt(fp, content)
            if rf is None:
                return deny("no valid pending receipt for this image write (dest_path + sha256 must match a picker receipt)", fp)
            try:
                os.makedirs(USED, exist_ok=True)
                os.replace(rf, os.path.join(USED, os.path.basename(rf)))
            except Exception: pass
            return allow()

    return allow()

main()
