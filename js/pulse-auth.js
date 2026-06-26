/*
 * PULSE auth — Clerk (vanilla JS) integration for the static site.
 * Loads ClerkJS from the Clerk CDN with the publishable key, renders a
 * Sign In button (signed out) or the user avatar menu (signed in) into any
 * element marked [data-pulse-auth-slot], and exposes window.pulseAuth with a
 * requireAuth() gate used to lock Save / Export / Print behind an account.
 *
 * Publishable key is public by design (it ships in client JS). The secret
 * key is NEVER referenced here — it lives only in Netlify env + .env.local
 * for server-side session verification.
 */
(function () {
  var PUB_KEY = 'pk_test_a2V5LWJlZGJ1Zy00OS5jbGVyay5hY2NvdW50cy5kZXYk';
  var FRONTEND_API = 'key-bedbug-49.clerk.accounts.dev';
  var CLERK_SRC = 'https://' + FRONTEND_API + '/npm/@clerk/clerk-js@5/dist/clerk.browser.js';

  var listeners = [];
  var ready = false;

  // Inject the ClerkJS script once (idempotent across pages that include this).
  function loadClerk() {
    if (window.__pulseClerkLoading) return;
    window.__pulseClerkLoading = true;
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-clerk-publishable-key', PUB_KEY);
    s.src = CLERK_SRC;
    s.addEventListener('load', initClerk);
    s.addEventListener('error', function () {
      console.warn('[pulse-auth] ClerkJS failed to load');
    });
    document.head.appendChild(s);
  }

  function initClerk() {
    if (!window.Clerk) return;
    window.Clerk.load({}).then(function () {
      ready = true;
      render();
      // Re-render whenever auth state changes (sign in / out).
      window.Clerk.addListener(function () { render(); fire(); });
      fire();
    }).catch(function (e) { console.warn('[pulse-auth] Clerk.load failed', e); });
  }

  function render() {
    var slots = document.querySelectorAll('[data-pulse-auth-slot]');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      slot.innerHTML = '';
      if (window.Clerk && window.Clerk.user) {
        var mount = document.createElement('div');
        mount.className = 'pulse-userbtn';
        slot.appendChild(mount);
        try {
          window.Clerk.mountUserButton(mount, {
            afterSignOutUrl: (location.pathname || '/'),
            appearance: { variables: { colorPrimary: '#FF6B30' } }
          });
        } catch (e) {}
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pulse-auth-btn';
        btn.textContent = 'Sign In';
        btn.addEventListener('click', function () { openSignIn(); });
        slot.appendChild(btn);
      }
    }
  }

  function openSignIn() {
    if (window.Clerk) {
      window.Clerk.openSignIn({ appearance: { variables: { colorPrimary: '#FF6B30' } } });
    }
  }
  function openSignUp() {
    if (window.Clerk) {
      window.Clerk.openSignUp({ appearance: { variables: { colorPrimary: '#FF6B30' } } });
    }
  }

  function fire() { for (var i = 0; i < listeners.length; i++) { try { listeners[i](isSignedIn()); } catch (e) {} } }
  function isSignedIn() { return !!(window.Clerk && window.Clerk.user); }

  window.pulseAuth = {
    isReady: function () { return ready; },
    isSignedIn: isSignedIn,
    user: function () { return window.Clerk ? window.Clerk.user : null; },
    openSignIn: openSignIn,
    openSignUp: openSignUp,
    onChange: function (fn) { if (typeof fn === 'function') { listeners.push(fn); if (ready) try { fn(isSignedIn()); } catch (e) {} } },
    // Gate an action behind an account. If signed in, run fn(); otherwise
    // open the sign-in modal and return false (action is blocked).
    requireAuth: function (fn, opts) {
      opts = opts || {};
      if (isSignedIn()) { if (typeof fn === 'function') fn(); return true; }
      openSignIn();
      return false;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadClerk);
  } else {
    loadClerk();
  }
})();
