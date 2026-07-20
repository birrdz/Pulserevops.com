/* pulse-ambient.js — site-wide LOW-VOLUME 80s synth ambience (owner 2026-07-03).
 * Procedural Web Audio (no audio files, no copyright, ~5KB): a warm pad + soft bass + bright arp that
 * plays gentle synthwave chord progressions and GRADUALLY CROSSFADES to a new "song" every ~75s.
 * Autoplay-safe: the AudioContext only starts on the first user gesture (browser requirement). A small
 * fixed ♪ / 🔇 toggle (bottom-right) mutes/unmutes; the choice is remembered across pages (localStorage).
 * Pauses when the tab is hidden. Default ON at low volume; honors a saved mute + prefers-reduced-motion. */
(function () {
  if (window.__pulseAmbient) return; window.__pulseAmbient = true;
  var KEY = 'pulseAudio';                                  // 'on' | 'off'
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  var reduce = false; try { reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var wantOn = saved ? saved === 'on' : !reduce;           // default on unless muted before / reduced-motion

  // ---- 80s "songs": root freq (Hz), tempo, chord progression (semitone sets), arp pattern ----
  var SONGS = [
    { name: 'Neon Drive',   bpm: 98,  root: 220.00, prog: [[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]], arp: [0,1,2,1,0,2,1,2] },   // A minor  i-VI-III-VII
    { name: 'Midnight Mall', bpm: 86, root: 174.61, prog: [[0,3,7],[5,8,12],[-4,0,3],[3,7,10]], arp: [0,2,1,2,0,1,2,1] },   // F minor, dreamy
    { name: 'Chrome Sunset', bpm: 108, root: 246.94, prog: [[0,4,7],[-3,0,4],[2,5,9],[-5,-1,2]], arp: [0,1,2,1,2,1,0,1] },  // B major-ish, brighter
    { name: 'Afterglow',    bpm: 78,  root: 196.00, prog: [[0,3,7],[-5,-2,2],[-4,0,3],[-2,2,5]], arp: [0,2,1,0,2,1,2,0] }   // G minor, slow
  ];

  var ctx, master, delay, delaySend, timer, ui;
  var songIdx = 0, chordIdx = 0, bar = 0, step = 0, nextTime = 0, barsInSong = 0, curChord = null;
  var LOOK = 0.12, STEPS = 8, VOL = 0.09, BARS_PER_SONG = 20;  // 0.12s lookahead; 8 eighths/bar; ~50-65s/song
  var hz = function (root, semi) { return root * Math.pow(2, semi / 12); };

  function ensureCtx() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.0; master.connect(ctx.destination);
    // spacious synthwave echo (The Midnight vibe): a feedback delay send for the arp + lead
    delay = ctx.createDelay(1.0); delay.delayTime.value = 0.46;
    var fb = ctx.createGain(); fb.gain.value = 0.33;
    var wet = ctx.createGain(); wet.gain.value = 0.5;
    delaySend = ctx.createGain(); delaySend.gain.value = 1.0;
    delaySend.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
  }

  // one enveloped voice; send=route to the echo, attack=slow for lead pads
  function voice(type, freq, t, dur, peak, filterHz, filterQ, send, attack) {
    var o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    var g = ctx.createGain();
    var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterHz || 1400; f.Q.value = filterQ || 4;
    o.connect(f); f.connect(g); g.connect(master); if (send && delaySend) g.connect(delaySend);
    var a = attack || Math.min(0.04, dur * 0.2);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function scheduleBar(t) {
    var s = SONGS[songIdx], chord = s.prog[chordIdx % s.prog.length]; curChord = chord;
    var beat = 60 / s.bpm, barLen = beat * 4;
    // PAD — sustained detuned chord across the whole bar
    for (var i = 0; i < chord.length; i++) {
      var base = hz(s.root, chord[i]);
      for (var d = -1; d <= 1; d++) {                       // 3 slightly detuned saws per note = warm 80s pad
        var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = base; o.detune.value = d * 7;
        var g = ctx.createGain(); var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 3;
        o.connect(f); f.connect(g); g.connect(master);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + barLen * 0.28);
        g.gain.linearRampToValueAtTime(0.0001, t + barLen);
        o.start(t); o.stop(t + barLen + 0.05);
      }
    }
    // BASS — root an octave down, soft, per bar
    voice('triangle', hz(s.root, chord[0] - 12), t, barLen * 0.95, 0.16, 500, 2);
    // LEAD — one warm sustained top-note per bar with slow attack, sent to the echo (The Midnight-style)
    voice('sawtooth', hz(s.root, chord[chord.length - 1] + 12), t, barLen * 0.9, 0.045, 1600, 3, true, barLen * 0.3);
  }

  function scheduler() {
    try {
    var s = SONGS[songIdx], beat = 60 / s.bpm, stepLen = beat / 2;
    while (nextTime < ctx.currentTime + LOOK) {
      if (step === 0) {                                     // ── new bar ──
        // GRADUAL song change: fade the current song DOWN over its last bar, switch, fade the next UP.
        if (barsInSong >= BARS_PER_SONG) {
          songIdx = (songIdx + 1) % SONGS.length; chordIdx = 0; barsInSong = 0;
          s = SONGS[songIdx]; beat = 60 / s.bpm; stepLen = beat / 2;
          master.gain.setTargetAtTime(VOL, nextTime, 2.2);               // ease the new song in
        } else if (barsInSong === BARS_PER_SONG - 1) {
          master.gain.setTargetAtTime(VOL * 0.22, nextTime, beat * 1.8); // ease the current song out
        }
        scheduleBar(nextTime);
        chordIdx++; barsInSong++; bar++;
      }
      // ARP — one bright short note per eighth over the CURRENT bar's chord, sent through the echo
      var chord = curChord || s.prog[0];
      var pat = s.arp[step % s.arp.length];
      var note = chord[pat % chord.length] + (pat >= chord.length ? 12 : 0) + 12;
      voice('square', hz(s.root, note), nextTime, stepLen * 0.9, 0.045, 2200, 6, true);
      nextTime += stepLen; step = (step + 1) % STEPS;
    }
    } catch (e) { if (timer) { clearInterval(timer); timer = null; } }
  }

  function play() {
    try {
      ensureCtx(); if (ctx.state === 'suspended') ctx.resume();
      if (!timer) { nextTime = ctx.currentTime + 0.1; timer = setInterval(scheduler, 25); }
      master.gain.setTargetAtTime(VOL, ctx.currentTime, 1.2);
      setBtn(true); try { localStorage.setItem(KEY, 'on'); } catch (e) {}
    } catch (e) {}
  }
  function stop() {
    if (ctx && master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
    if (timer) { clearInterval(timer); timer = null; }
    setBtn(false); try { localStorage.setItem(KEY, 'off'); } catch (e) {}
  }
  function setBtn(on) { if (ui) { ui.textContent = on ? '♪' : '🔇'; ui.title = on ? '80s ambience — click to mute' : 'Muted — click for 80s ambience'; ui.style.opacity = on ? '0.85' : '0.5'; } }

  function mkBtn() {
    ui = document.createElement('button');
    ui.setAttribute('aria-label', 'Toggle background music');
    ui.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:2147483000;width:38px;height:38px;border-radius:50%;border:1px solid rgba(246,192,73,.5);background:rgba(10,11,15,.72);color:#EAC15C;font-size:16px;cursor:pointer;backdrop-filter:blur(4px);box-shadow:0 2px 10px rgba(0,0,0,.4);transition:opacity .2s,transform .12s;line-height:1';
    ui.onmouseenter = function () { ui.style.transform = 'scale(1.08)'; };
    ui.onmouseleave = function () { ui.style.transform = 'scale(1)'; };
    ui.onclick = function (e) { e.stopPropagation(); (timer ? stop : play)(); };
    (document.body || document.documentElement).appendChild(ui);
    setBtn(false);
  }

  function armFirstGesture() {
    var go = function () { document.removeEventListener('pointerdown', go); document.removeEventListener('keydown', go); document.removeEventListener('scroll', go); if (wantOn) play(); };
    document.addEventListener('pointerdown', go, { passive: true });
    document.addEventListener('keydown', go, { passive: true });
    document.addEventListener('scroll', go, { passive: true });
  }

  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) { if (ctx.state === 'running') ctx.suspend(); }
    else if (timer && ctx.state === 'suspended') ctx.resume();
  });

  function loadSiteScripts() {
    ['/js/pulse-face-img.js', '/js/pulse-home-mosaic.js?v=neon-trim-20260720b', '/js/pulse-idle-scroll.js', '/js/pulse-endless-loop.js', '/js/pulse-mosaic-endless.js'].forEach(function (src) {
      if (document.querySelector('script[src="' + src + '"]')) return;
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      document.head.appendChild(s);
    });
  }

  function init() { mkBtn(); armFirstGesture(); loadSiteScripts(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
