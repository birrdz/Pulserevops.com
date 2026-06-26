/* PULSE — save-to-my-content client widget.
 * Injected on every answer page via pulse-machine-entry.js.
 *
 * UX:
 *   • First-time visitor sees a sticky bottom-right "Save with a 4-digit code"
 *     pill that pulses gently. Tap it → modal sells the feature + lets them
 *     pick a code (or use an existing one).
 *   • Returning visitor (code in localStorage) sees a "Save to my content"
 *     button. Tap → instant save + toast "Saved to passcode 1234".
 *   • If already saved, button reads "Saved ✓ · Remove?". Tap → un-save.
 *   • Link to /my-content always available in the pill once code is set.
 *
 * Storage:
 *   localStorage.pulse.code = "1234"     // the user's chosen 4-digit code
 *   localStorage.pulse.saved.<id> = 1    // local mirror of saved IDs for
 *                                           instant button state on revisit
 */
(function(){
  'use strict';

  // ── Detect entry id from URL: /knowledge/q1234 → q1234 ────────────
  function detectEntryId(){
    var m = location.pathname.match(/\/(?:knowledge|sales-trainings|industry-kpis|tech-stacks|graphics|sales-book-summaries|electronic-reviews|revenue-architecture|go-to-market-playbooks)\/([a-z0-9_-]+)/i);
    return m ? m[1] : null;
  }
  function detectEntryQuestion(){
    var el = document.querySelector('h1, [data-q-title]');
    if (el) return el.textContent.trim().slice(0, 320);
    var t = document.title.replace(/\s*[·—|].*$/, '').trim();
    return t.slice(0, 320);
  }

  var ENTRY_ID = detectEntryId();
  if (!ENTRY_ID) return; // not an entry page — bail
  var ENTRY_Q  = detectEntryQuestion();

  var LS_CODE  = 'pulse.code';
  var LS_SAVED = 'pulse.saved.' + ENTRY_ID;

  // Identity is now the signed-in Clerk account (initials + 4-digit code
  // removed 2026-06-15). The Clerk user id namespaces each person's saved list.
  function getCode(){
    try {
      if (window.pulseAuth && window.pulseAuth.isSignedIn() && window.Clerk && window.Clerk.user) {
        return 'clerk_' + window.Clerk.user.id;
      }
    } catch(_e){}
    return '';
  }
  function setCode(c){ try { localStorage.setItem(LS_CODE, c); } catch(_e){} }
  function clearCode(){ try { localStorage.removeItem(LS_CODE); } catch(_e){} }
  function markSaved(b){ try { if (b) localStorage.setItem(LS_SAVED, '1'); else localStorage.removeItem(LS_SAVED); } catch(_e){} }
  function isSaved(){ try { return localStorage.getItem(LS_SAVED) === '1'; } catch(_e){ return false; } }

  // ── Styles (scoped to .pulse-save-* to avoid clashing with entry CSS) ──
  var css = `
.pulse-save-pill{position:fixed;right:14px;bottom:18px;z-index:9999;display:flex;align-items:center;gap:8px;padding:12px 16px;background:#FF6B30;color:#0a0e14;border:none;border-radius:99px;font:800 14px/1.1 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 24px rgba(255,107,48,.35),0 0 0 1px rgba(0,0,0,.12);transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;max-width:calc(100% - 28px)}
.pulse-save-pill:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(255,107,48,.45),0 0 0 1px rgba(0,0,0,.12)}
.pulse-save-pill.saved{background:#22C55E}
.pulse-save-pill.pulse-wiggle{animation:pulseWiggle 2.4s ease-in-out 1s 2}
@keyframes pulseWiggle{0%,100%{transform:translateY(0)}25%{transform:translateY(-4px)}50%{transform:translateY(0)}75%{transform:translateY(-2px)}}
.pulse-save-link{display:block;margin-top:6px;font-size:10.5px;font-weight:700;text-align:center;opacity:.85;color:inherit;text-decoration:underline}
.pulse-save-link:hover{opacity:1}
.pulse-save-modal{position:fixed;inset:0;z-index:10000;background:rgba(9,9,15,.78);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:psmFade .2s ease-out}
@keyframes psmFade{from{opacity:0}to{opacity:1}}
.pulse-save-card{background:#161622;border:1px solid rgba(255,107,48,.32);border-radius:18px;padding:28px 24px 24px;max-width:380px;width:100%;color:#EEEEF5;font-family:'Plus Jakarta Sans',system-ui,sans-serif;box-shadow:0 24px 64px rgba(0,0,0,.6)}
.pulse-save-card h3{font-size:20px;font-weight:900;letter-spacing:-.4px;margin:0 0 8px;color:#FFB870}
.pulse-save-card p{font-size:13.5px;line-height:1.55;color:#A5A6BD;margin:0 0 14px}
.pulse-save-card .why{background:rgba(255,107,48,.08);border:1px solid rgba(255,107,48,.22);border-radius:10px;padding:10px 12px;font-size:12px;color:#FFB870;margin:0 0 16px;line-height:1.5}
.pulse-save-card .why strong{color:#FFD1B0}
.pulse-save-input{width:100%;font:800 28px/1.1 'JetBrains Mono',monospace;letter-spacing:.4em;text-align:center;padding:14px 16px;background:#09090F;border:2px solid rgba(255,255,255,.10);border-radius:12px;color:#EEEEF5;outline:none;margin:0 0 14px;text-indent:.4em}
.pulse-save-input:focus{border-color:#FF6B30;box-shadow:0 0 0 3px rgba(255,107,48,.18)}
.pulse-save-input::placeholder{color:#55566A;letter-spacing:.3em}
.pulse-save-actions{display:flex;gap:8px}
.pulse-save-btn{flex:1;padding:13px 16px;border-radius:10px;border:none;font:800 14px 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;transition:transform .12s;-webkit-tap-highlight-color:transparent}
.pulse-save-btn.primary{background:#FF6B30;color:#0a0e14}
.pulse-save-btn.secondary{background:rgba(255,255,255,.06);color:#A5A6BD;border:1px solid rgba(255,255,255,.08)}
.pulse-save-btn:hover{transform:translateY(-1px)}
.pulse-save-toast{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:10001;background:#0F1019;border:1px solid rgba(34,197,94,.4);color:#4ADE80;padding:10px 16px;border-radius:99px;font:800 12.5px/1 'Plus Jakarta Sans',system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);opacity:0;transition:opacity .2s,transform .2s}
.pulse-save-toast.show{opacity:1;transform:translateX(-50%) translateY(-4px)}
@media (max-width:520px){
  .pulse-save-pill{right:12px;bottom:14px;padding:11px 14px;font-size:13px}
  .pulse-save-card{padding:22px 18px 20px}
}
`;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── DOM bits ──────────────────────────────────────────────────────
  var pill = document.createElement('button');
  pill.className = 'pulse-save-pill pulse-wiggle';
  pill.type = 'button';
  document.body.appendChild(pill);

  function renderPill(){
    var signedIn = !!(window.pulseAuth && window.pulseAuth.isSignedIn());
    if (!signedIn || !getCode()) {
      pill.innerHTML = '<span>💾 Sign in to save</span>';
      pill.className = 'pulse-save-pill pulse-wiggle';
      return;
    }
    if (isSaved()) {
      pill.innerHTML = '<span>✓ Saved to your content</span><a class="pulse-save-link" href="/my-content" onclick="event.stopPropagation()">View my content →</a>';
      pill.classList.remove('pulse-wiggle');
      pill.classList.add('saved');
    } else {
      pill.innerHTML = '<span>💾 Save to my content</span>';
      pill.classList.remove('pulse-wiggle','saved');
    }
  }
  renderPill();
  // Re-render whenever Clerk auth state resolves / changes (sign in / out).
  (function hookAuth(){
    if (window.pulseAuth && window.pulseAuth.onChange) { window.pulseAuth.onChange(function(){ renderPill(); }); }
    else { setTimeout(hookAuth, 300); }
  })();

  function toast(msg, color){
    var t = document.createElement('div');
    t.className = 'pulse-save-toast';
    t.style.borderColor = color || 'rgba(34,197,94,.4)';
    t.style.color = color ? color : '#4ADE80';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ try { document.body.removeChild(t); } catch(_e){} }, 220); }, 2400);
  }

  function api(method, path, body){
    var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    return fetch('/.netlify/functions/pulse-my-content' + (path || ''), opts).then(function(r){ return r.json().catch(function(){ return { ok: false }; }); });
  }

  function showCodeModal(){
    var existing = document.querySelector('.pulse-save-modal');
    if (existing) return;
    var modal = document.createElement('div');
    modal.className = 'pulse-save-modal';
    var card = document.createElement('div');
    card.className = 'pulse-save-card';
    var hasCode = !!getCode();
    card.innerHTML =
      '<h3>' + (hasCode ? 'Switch your passcode' : 'Pick your initials + 4-digit passcode') + '</h3>' +
      '<p>' + (hasCode ? 'Already using <strong>' + getCode() + '</strong>. Enter a different code below or cancel.' : 'No login. No email. <strong>3 letters + 4 numbers</strong> — your initials + any 4-digit number (e.g. <code>KJW0514</code>). Use the same code on your phone and laptop to see the same list.') + '</p>' +
      '<div class="why"><strong>Why a passcode?</strong> Zero friction. You can save this answer right now and find it later on any device. Forget the code? Pick a new one — it just starts a new list.</div>' +
      '<input class="pulse-save-input" type="text" pattern="[A-Za-z]{3}\\d{4}" maxlength="7" placeholder="KJW0514" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase;" autofocus />' +
      '<div class="pulse-save-actions">' +
        '<button class="pulse-save-btn secondary" data-act="cancel">Cancel</button>' +
        '<button class="pulse-save-btn primary" data-act="save">Save with this code</button>' +
      '</div>';
    modal.appendChild(card);
    document.body.appendChild(modal);
    var input = card.querySelector('.pulse-save-input');
    input.focus();
    // Allow only [A-Z] + digits; auto-uppercase the letters; cap at 7 chars.
    input.addEventListener('input', function(){
      var v = (input.value || '').toUpperCase();
      // Keep only letters in positions 0-2 and digits in positions 3-6
      var letters = (v.match(/[A-Z]/g) || []).slice(0, 3).join('');
      var digits  = (v.match(/\d/g)    || []).slice(0, 4).join('');
      input.value = (letters + digits).slice(0, 7);
    });
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); card.querySelector('[data-act="save"]').click(); }
    });
    function close(){ try { document.body.removeChild(modal); } catch(_e){} }
    modal.addEventListener('click', function(e){ if (e.target === modal) close(); });
    card.querySelector('[data-act="cancel"]').onclick = close;
    card.querySelector('[data-act="save"]').onclick = function(){
      var code = (input.value || '').trim().toUpperCase();
      if (!/^[A-Z]{3}\d{4}$/.test(code)) { input.style.borderColor = '#ff5577'; toast('Need 3 letters + 4 digits (e.g. KJW0514)', '#ff5577'); return; }
      setCode(code);
      close();
      doSave(); // auto-save the current entry after picking a code
    };
  }

  function doSave(){
    var code = getCode();
    if (!code) { if (window.pulseAuth) window.pulseAuth.openSignIn(); return; }
    pill.disabled = true;
    api('POST', '', { code: code, action: 'add', id: ENTRY_ID, question: ENTRY_Q, tags: [] })
      .then(function(r){
        pill.disabled = false;
        if (r && r.ok) {
          markSaved(true);
          renderPill();
          toast('Saved to your content ✓');
        } else {
          toast('Save failed — try again', '#ff5577');
        }
      })
      .catch(function(){ pill.disabled = false; toast('Save failed — try again', '#ff5577'); });
  }
  function doRemove(){
    var code = getCode();
    if (!code) return;
    pill.disabled = true;
    api('POST', '', { code: code, action: 'remove', id: ENTRY_ID })
      .then(function(r){
        pill.disabled = false;
        if (r && r.ok) {
          markSaved(false);
          renderPill();
          toast('Removed from ' + code, '#FCD34D');
        } else {
          toast('Remove failed', '#ff5577');
        }
      })
      .catch(function(){ pill.disabled = false; toast('Remove failed', '#ff5577'); });
  }

  pill.addEventListener('click', function(e){
    // Ignore clicks on the inner "View my content" link
    if (e.target && e.target.classList && e.target.classList.contains('pulse-save-link')) return;
    if (!(window.pulseAuth && window.pulseAuth.isSignedIn())) { if (window.pulseAuth) window.pulseAuth.openSignIn(); return; }
    if (isSaved()) doRemove(); else doSave();
  });

  // Delegated handler: any other element marked with data-save-trigger
  // (e.g. an inline "Save to my content" button) routes through the same
  // account-gated save flow as the floating pill.
  document.addEventListener('click', function(e){
    var trig = e.target && e.target.closest('[data-save-trigger]');
    if (!trig) return;
    e.preventDefault();
    if (!(window.pulseAuth && window.pulseAuth.isSignedIn())) { if (window.pulseAuth) window.pulseAuth.openSignIn(); return; }
    if (isSaved()) doRemove(); else doSave();
  });
})();
