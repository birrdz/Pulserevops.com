/* pulse-edit.js — OWNER-ONLY long-press title editing on the live homepage (owner 2026-07-17).
 * Unlock once by visiting  https://pulserevops.com/?edit=YOUR_SECRET  (stored in this browser only).
 * Then HOLD any card 5s → edit its dressing (title) → saves to the real Q&A via the secret-gated function.
 * A visitor without the secret sees nothing and can change nothing (the function enforces it server-side). */
(function () {
  var KEY = 'pulse_edit_secret', HOLD = 5000;
  try { var u = new URL(location.href); var e = u.searchParams.get('edit'); if (e) { localStorage.setItem(KEY, e); u.searchParams.delete('edit'); history.replaceState(null, '', u.toString()); } } catch (_) {}
  var secret = null; try { secret = localStorage.getItem(KEY); } catch (_) {}
  if (!secret) return;                       // not the owner → do nothing at all

  var timer = null, holding = null, suppress = false;
  function toast(msg, ok) { var t = document.createElement('div'); t.textContent = msg; t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;background:' + (ok ? '#123b1e' : '#5a0d0d') + ';color:#fff;padding:10px 18px;border-radius:10px;font:600 14px system-ui;box-shadow:0 6px 24px rgba(0,0,0,.5)'; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2800); }
  function tileFrom(el) { return el && el.closest ? el.closest('a.mm[href^="/knowledge/"]') : null; }
  function idOf(a) { var m = (a.getAttribute('href') || '').match(/\/knowledge\/([a-zA-Z0-9_-]+)/); return m ? m[1] : null; }
  function titleOf(a) { var tx = a.querySelector('.mm-txt, .mm-menu-t, .mm-hire-t'); return (tx ? tx.textContent : (a.getAttribute('aria-label') || a.textContent || '')).replace(/\s+/g, ' ').trim().slice(0, 160); }

  function startHold(e) { var a = tileFrom(e.target); if (!a) return; holding = a; a.style.outline = '3px dashed #e8c874'; a.style.outlineOffset = '-3px'; timer = setTimeout(function () { timer = null; a.style.outline = ''; openEdit(a); }, HOLD); }
  function cancelHold() { if (timer) { clearTimeout(timer); timer = null; } if (holding) { holding.style.outline = ''; holding = null; } }

  function openEdit(a) {
    suppress = true; var id = idOf(a); if (!id) { toast('no id on this tile', false); return; }
    var cur = titleOf(a);
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(6,7,11,.86);display:flex;align-items:center;justify-content:center;padding:20px';
    box.innerHTML = '<div style="background:#12151c;border:1px solid #e8c874;border-radius:14px;padding:20px;max-width:640px;width:100%;color:#eee;font:400 15px system-ui;box-shadow:0 12px 40px rgba(0,0,0,.6)">'
      + '<div style="color:#e8c874;font-weight:800;margin-bottom:6px">Edit dressing (title)</div>'
      + '<div style="font-size:12px;color:#9aa2ad;margin-bottom:8px">' + id + ' — this updates the real Q&amp;A page title/H1</div>'
      + '<textarea id="pe-t" style="width:100%;box-sizing:border-box;font-size:17px;font-weight:700;padding:10px;border-radius:8px;border:1px solid #444;background:#0c0f14;color:#fff;min-height:74px;line-height:1.3;font-family:inherit"></textarea>'
      + '<div style="margin-top:12px;display:flex;gap:8px"><button id="pe-save" style="background:#3a1d55;border:1px solid #c88bf0;color:#fff;font-weight:800;padding:9px 20px;border-radius:8px;cursor:pointer">Save</button><button id="pe-cancel" style="background:#222;border:1px solid #555;color:#ccc;padding:9px 16px;border-radius:8px;cursor:pointer">Cancel</button></div></div>';
    document.body.appendChild(box);
    var ta = box.querySelector('#pe-t'); ta.value = cur; ta.focus();
    box.querySelector('#pe-cancel').onclick = function () { box.remove(); };
    box.addEventListener('click', function (ev) { if (ev.target === box) box.remove(); });
    box.querySelector('#pe-save').onclick = function () {
      var t = ta.value.replace(/\s+/g, ' ').trim(); if (t.length < 8) { toast('title too short', false); return; }
      var sb = box.querySelector('#pe-save'); sb.textContent = 'saving…'; sb.disabled = true;
      fetch('/.netlify/functions/pulse-title-edit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: id, title: t, secret: secret }) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          if (j && j.ok) { toast('✓ dressing updated live', true); box.remove(); var tx = a.querySelector('.mm-txt, .mm-menu-t, .mm-hire-t'); try { if (tx) tx.textContent = t; } catch (_) {} }
          else { toast('✕ ' + ((j && j.error) || 'failed — wrong secret?'), false); sb.textContent = 'Save'; sb.disabled = false; }
        }).catch(function () { toast('✕ network error', false); sb.textContent = 'Save'; sb.disabled = false; });
    };
  }

  document.addEventListener('pointerdown', startHold, true);
  document.addEventListener('pointerup', cancelHold, true);
  document.addEventListener('pointercancel', cancelHold, true);
  window.addEventListener('blur', cancelHold);
  document.addEventListener('scroll', cancelHold, true);
  document.addEventListener('click', function (e) { if (suppress) { suppress = false; var a = tileFrom(e.target); if (a) { e.preventDefault(); e.stopPropagation(); } } }, true);

  function hint() { var h = document.createElement('div'); h.textContent = '✍️ edit mode — hold a card 5s to edit its title'; h.style.cssText = 'position:fixed;top:8px;right:8px;z-index:99998;background:#241d10;border:1px solid #e8c874;color:#ffe;font:600 11px system-ui;padding:5px 10px;border-radius:8px;opacity:.85'; document.body.appendChild(h); setTimeout(function () { h.style.transition = 'opacity .6s'; h.style.opacity = '0'; setTimeout(function(){h.remove();}, 700); }, 6000); }
  if (document.body) hint(); else document.addEventListener('DOMContentLoaded', hint);
})();
