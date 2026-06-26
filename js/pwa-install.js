/* PULSE PWA install widget — homepage + sticky floating prompt.
 *
 * Behavior:
 *   • Registers /sw.js on first load.
 *   • Captures `beforeinstallprompt` (Chrome/Edge/Android) and exposes it.
 *   • Provides window.pulseInstall() any CTA can call to trigger the
 *     native install dialog (Android Chrome) or show iOS instructions
 *     (Add to Home Screen via Share menu).
 *   • Auto-hides the floating pill once the app is already installed
 *     (display-mode: standalone) or after the user dismisses it.
 *   • Detects iOS Safari (no beforeinstallprompt) and shows step-by-step
 *     Add-to-Home-Screen sheet.
 *
 * Triggers (any of these work as install CTAs anywhere on the page):
 *   <button data-pulse-install>Install the app</button>
 *   <a href="#" data-pulse-install>Install for phone/desktop</a>
 *
 * Status flags set on body (CSS can target):
 *   body.pulse-can-install      — beforeinstallprompt fired
 *   body.pulse-already-installed — already running as installed PWA
 *   body.pulse-ios              — iOS Safari (manual install path)
 */
(function(){
  'use strict';

  var deferredPrompt = null;
  var LS_DISMISSED = 'pulse.install.dismissed';
  var LS_INSTALLED = 'pulse.install.confirmed'; // remembers prior install (desktop + mobile)

  // ── Detect environment ──────────────────────────────────────────────
  var ua = (navigator.userAgent || '').toLowerCase();
  var isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  // "Already installed" if: running standalone now OR we previously saw an
  // appinstalled event on this device. Persisted so the install CTA stays
  // hidden on subsequent visits to a regular browser tab on desktop too.
  var hasPriorInstall = false;
  try { hasPriorInstall = localStorage.getItem(LS_INSTALLED) === '1'; } catch(_e){}
  if (isStandalone || hasPriorInstall) document.body && document.body.classList.add('pulse-already-installed');
  if (isIOS && !isStandalone && !hasPriorInstall) document.body && document.body.classList.add('pulse-ios');

  // Chrome desktop API to detect installed related apps (when available)
  if (navigator.getInstalledRelatedApps) {
    try {
      navigator.getInstalledRelatedApps().then(function(apps){
        if (apps && apps.length) {
          try { localStorage.setItem(LS_INSTALLED, '1'); } catch(_e){}
          document.body && document.body.classList.add('pulse-already-installed');
          hidePill();
        }
      }).catch(function(){});
    } catch(_e){}
  }

  // ── Ensure a <link rel="manifest"> exists ──────────────────────────
  // Answer pages + some pillar pages don't hard-code the manifest link;
  // without it the browser won't offer "Install". Inject it if absent.
  try {
    if (!document.querySelector('link[rel="manifest"]')) {
      var ml = document.createElement('link');
      ml.rel = 'manifest'; ml.href = '/manifest.json';
      (document.head || document.documentElement).appendChild(ml);
    }
  } catch(_e){}

  // ── Register service worker (PWA prerequisite on Android/desktop) ──
  if ('serviceWorker' in navigator && !isStandalone) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js').catch(function(){ /* ignore */ });
    });
  }

  // ── Capture deferred install prompt ────────────────────────────────
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    document.body && document.body.classList.add('pulse-can-install');
    // Update any existing CTAs to read "Install the app" now that we know
    // a real prompt is available.
    var ctas = document.querySelectorAll('[data-pulse-install]');
    ctas.forEach(function(el){ el.hidden = false; });
    maybeShowPill();
  });

  window.addEventListener('appinstalled', function(){
    try { localStorage.setItem(LS_INSTALLED, '1'); } catch(_e){}
    document.body && document.body.classList.add('pulse-already-installed');
    document.body && document.body.classList.remove('pulse-can-install');
    deferredPrompt = null;
    hidePill();
    trackInstall('beforeinstallprompt-accepted');
  });

  // Detect "already-installed" on every load (PWA opened from home screen,
  // standalone display-mode, iOS .standalone). Track once per session.
  try {
    var INSTALL_TRACK_LS = 'pulse.install.tracked';
    if (isStandalone && !sessionStorage.getItem(INSTALL_TRACK_LS)) {
      sessionStorage.setItem(INSTALL_TRACK_LS, '1');
      trackInstall('standalone-launch');
    }
  } catch(_e){}

  function trackInstall(source){
    var platform = isIOS ? 'ios' : (/android/.test(ua) ? 'android' : 'desktop');
    try {
      fetch('/.netlify/functions/pulse-install-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ platform: platform, source: location.pathname + ' · ' + source }),
      }).catch(function(){});
    } catch(_e){}
  }

  // ── Floating pill (mobile-friendly, dismissible) ────────────────────
  var pillEl = null;
  function maybeShowPill(){
    if (isStandalone) return;
    try { if (localStorage.getItem(LS_DISMISSED) === '1') return; } catch(_e){}
    if (!deferredPrompt && !isIOS) return; // nothing actionable
    if (pillEl) return;
    pillEl = document.createElement('div');
    pillEl.className = 'pulse-install-pill';
    pillEl.innerHTML = '<button class="pip-main" type="button" data-pulse-install>' +
      '<span class="pip-ico">📲</span>' +
      '<span class="pip-label">Install Pulse</span>' +
      '<span class="pip-sub">' + (isIOS ? 'Add to Home Screen' : 'One-tap install') + '</span>' +
      '</button>' +
      '<button class="pip-close" type="button" aria-label="Dismiss">×</button>';
    document.body.appendChild(pillEl);
    pillEl.querySelector('.pip-close').addEventListener('click', function(e){
      e.stopPropagation();
      try { localStorage.setItem(LS_DISMISSED, '1'); } catch(_e){}
      hidePill();
    });
  }
  function hidePill(){
    if (pillEl && pillEl.parentNode) pillEl.parentNode.removeChild(pillEl);
    pillEl = null;
  }

  // ── iOS Add-to-Home-Screen sheet ────────────────────────────────────
  function showIOSSheet(){
    if (document.querySelector('.pulse-ios-sheet')) return;
    var sheet = document.createElement('div');
    sheet.className = 'pulse-ios-sheet';
    sheet.innerHTML =
      '<div class="pis-card">' +
        '<h3>Install Pulse on iPhone</h3>' +
        '<p>Add the Pulse app to your home screen in 3 taps. No App Store needed.</p>' +
        '<ol>' +
          '<li>Tap the <strong>Share</strong> button <span class="pis-share">⎙</span> at the bottom of Safari.</li>' +
          '<li>Scroll and tap <strong>Add to Home Screen</strong> <span class="pis-plus">⊕</span>.</li>' +
          '<li>Tap <strong>Add</strong> in the top-right.</li>' +
        '</ol>' +
        '<button class="pis-close" type="button">Got it</button>' +
      '</div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function(e){ if (e.target === sheet) document.body.removeChild(sheet); });
    sheet.querySelector('.pis-close').addEventListener('click', function(){ document.body.removeChild(sheet); });
  }

  // ── Programmatic install entrypoint ─────────────────────────────────
  window.pulseInstall = function(){
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){
        deferredPrompt = null;
        document.body && document.body.classList.remove('pulse-can-install');
        hidePill();
      });
      return;
    }
    if (isIOS) { showIOSSheet(); return; }
    // Fallback (other browsers without beforeinstallprompt): explain how to
    // install via the browser menu.
    showIOSSheet();
  };

  // ── Delegated click handler for any [data-pulse-install] CTA ────────
  document.addEventListener('click', function(e){
    var trig = e.target && e.target.closest('[data-pulse-install]');
    if (!trig) return;
    e.preventDefault();
    window.pulseInstall();
  });

  // ── Styles ──────────────────────────────────────────────────────────
  var css = `
.pulse-install-pill{position:fixed;left:14px;bottom:14px;z-index:9998;display:flex;align-items:stretch;gap:0;background:#0F1019;border:1px solid rgba(255,107,48,.4);border-radius:14px;box-shadow:0 10px 32px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.18);max-width:calc(100% - 28px);overflow:hidden;font-family:'Plus Jakarta Sans',system-ui,sans-serif;animation:pulseInstallSlide .35s ease-out}
@keyframes pulseInstallSlide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.pulse-install-pill .pip-main{display:flex;align-items:center;gap:10px;padding:10px 14px;background:transparent;border:none;color:#EEEEF5;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent}
.pulse-install-pill .pip-ico{font-size:22px;flex-shrink:0}
.pulse-install-pill .pip-label{display:block;font-size:13px;font-weight:800;color:#FFD7A8;letter-spacing:.02em;line-height:1}
.pulse-install-pill .pip-sub{display:block;font-size:10.5px;font-weight:600;color:#8A8BA6;letter-spacing:.04em;line-height:1.2;margin-top:3px}
.pulse-install-pill .pip-main:hover{background:rgba(255,107,48,.08)}
.pulse-install-pill .pip-main > span{display:flex;flex-direction:column;align-items:flex-start}
.pulse-install-pill .pip-close{padding:0 12px;background:transparent;border:none;border-left:1px solid rgba(255,255,255,.06);color:#8A8BA6;font-size:18px;cursor:pointer;line-height:1;-webkit-tap-highlight-color:transparent}
.pulse-install-pill .pip-close:hover{color:#EEEEF5;background:rgba(255,255,255,.04)}
body.pulse-already-installed .pulse-install-pill{display:none}

.pulse-ios-sheet{position:fixed;inset:0;z-index:10000;background:rgba(9,9,15,.82);backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center;padding:0;animation:pisFade .25s ease-out}
@media(min-width:600px){.pulse-ios-sheet{align-items:center;padding:20px}}
@keyframes pisFade{from{opacity:0}to{opacity:1}}
.pulse-ios-sheet .pis-card{background:#161622;border:1px solid rgba(255,107,48,.32);border-top-left-radius:18px;border-top-right-radius:18px;padding:24px 22px 32px;max-width:420px;width:100%;color:#EEEEF5;font-family:'Plus Jakarta Sans',system-ui,sans-serif;box-shadow:0 -24px 64px rgba(0,0,0,.6)}
@media(min-width:600px){.pulse-ios-sheet .pis-card{border-radius:18px}}
.pulse-ios-sheet h3{font-size:22px;font-weight:900;letter-spacing:-.4px;margin:0 0 8px;color:#FFB870}
.pulse-ios-sheet p{font-size:14px;line-height:1.5;color:#A5A6BD;margin:0 0 18px}
.pulse-ios-sheet ol{padding-left:22px;margin:0 0 22px;color:#EEEEF5;font-size:14.5px;line-height:1.6}
.pulse-ios-sheet ol li{margin:0 0 10px}
.pulse-ios-sheet .pis-share,.pulse-ios-sheet .pis-plus{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:rgba(255,107,48,.15);border:1px solid rgba(255,107,48,.32);border-radius:6px;color:#FFB870;font-size:14px;font-weight:700;margin-left:4px;vertical-align:middle}
.pulse-ios-sheet .pis-close{display:block;width:100%;padding:14px;background:#FF6B30;border:none;border-radius:12px;color:#0a0e14;font:800 15px 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.pulse-ios-sheet .pis-close:hover{transform:translateY(-1px)}
`;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── On iOS, show the pill after a short delay (no prompt event to trigger it) ──
  if (isIOS && !isStandalone) {
    setTimeout(maybeShowPill, 4000);
  }
})();
