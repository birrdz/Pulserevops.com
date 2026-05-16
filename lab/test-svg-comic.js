// Prototype: Claude generates a 3-panel SVG comic-strip per entry that
// explains the SPECIFIC content of the answer (not generic stockpiled art).
// Output: writes lab/test-svg-comic.html for visual review.

const fs = require('fs');
const path = require('path');
const https = require('https');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) { console.error('ANTHROPIC_API_KEY required'); process.exit(1); }

const ENTRY_ID = process.argv[2] || 'q1843';
const entryPath = path.join(__dirname, 'cheap-100', ENTRY_ID + '.json');
if (!fs.existsSync(entryPath)) { console.error('entry not found:', entryPath); process.exit(1); }
const entry = JSON.parse(fs.readFileSync(entryPath, 'utf8'));

const SYSTEM = `You are an animated SVG cartoonist. Read a B2B/RevOps Q&A entry and output a 3-panel ANIMATED comic-strip SVG that explains the SPECIFIC content of the answer in motion-cartoon form.

CRITICAL CONSTRAINTS:
- Output ONLY valid inline SVG markup, nothing else (no preamble, no markdown fences)
- Single <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg"> root
- 3 panels arranged horizontally, each ~290 wide × ~280 tall, with thin black borders + small panel numbers (1,2,3)
- Use simple flat-color cartoon style: bold strokes, friendly shapes, exaggerated expressions
- Each panel illustrates ONE specific fact, number, or claim from the answer (cite real numbers from the answer like "$300-600M", "92-94% retention", company names, etc.)
- Use real labels/text from the answer in speech bubbles, signs, charts INSIDE the panels — make it specific
- Color palette: brand orange (#E8710A), dark surface (#1A2025), white text on dark, charcoal lines (#222), accent green (#22c55e) for good/yes, accent red (#ef4444) for bad/no
- DO NOT use external images, fonts, or hrefs — pure SVG primitives only
- Minimum font-size 11

ANIMATION REQUIREMENTS (this is critical — output MUST move):
- Use <animate> and <animateTransform> elements (SMIL animation) — works inline without JS or CSS
- Sequence reveal: Panel 1 fades in opacity 0→1 over 0.5s starting at 0s, Panel 2 at 2s, Panel 3 at 4s. After 7s, restart by setting begin="0s;loop.end+1s" or use repeatCount="indefinite" on a sequencing chain
- At least 3 distinct moving elements per panel: arrows that draw themselves (stroke-dasharray + stroke-dashoffset animation), bars that grow (width animation 0→target), numbers that count up (animate text content via discrete values), characters that wiggle (rotate +/-3deg cycle), pulsing circles (r animation), shaking warning signs
- Use values="..." with semicolon-separated keyframes and dur="..." for smooth animations
- ALL animations should loop with repeatCount="indefinite" so the comic keeps playing
- Stagger animation begin times so panels feel like a story unfolding, not all moving at once

PANEL STRUCTURE:
- Panel 1: Set up the situation/problem from the answer (animated entrance of the actor/setting)
- Panel 2: Show the key tension or numbers (animated bars growing, arrows drawing, numbers ticking)
- Panel 3: Show the conclusion or outcome from the bottom line (animated reveal of the answer/checkmark/dollar return)`;

function callClaude(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 120000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve(JSON.parse(buf)); }
        catch (e) { reject(new Error('parse fail: ' + buf.slice(0, 400))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body); req.end();
  });
}

(async () => {
  console.log('Generating SVG comic for', ENTRY_ID, '—', entry.question);
  const t0 = Date.now();
  const resp = await callClaude({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Question: ${entry.question}\n\nAnswer (markdown):\n${entry.answer}\n\nGenerate the 3-panel SVG comic-strip now.`,
    }],
  });
  const elapsed = Date.now() - t0;
  let svg = resp?.content?.[0]?.text?.trim() || '';
  console.log('Got', svg.length, 'chars of SVG in', elapsed, 'ms');
  // Strip markdown fences if Claude wraps output
  svg = svg.replace(/^```(?:xml|svg|html)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  if (!svg.startsWith('<svg')) {
    console.error('Bad output (first 300):', svg.slice(0, 300));
    process.exit(1);
  }
  const outHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SVG Comic Test — ${entry.id} — ${entry.question.slice(0, 60).replace(/[<>]/g, '')}</title>
  <style>
    body { background: #111518; color: #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif; padding: 2rem; max-width: 1100px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #E8710A; font-size: 1.4rem; margin-bottom: 0.5rem; }
    .meta { color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .comic-frame { background: #1A2025; border: 1px solid #242C32; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
    .comic-frame svg { width: 100%; height: auto; max-width: 900px; display: block; margin: 0 auto; }
    .ans { background: #0f1316; border: 1px solid #242C32; border-radius: 8px; padding: 1rem; font-size: 0.85rem; max-height: 280px; overflow-y: auto; }
    pre { white-space: pre-wrap; font-family: inherit; }
    .stats { color: #94a3b8; font-size: 0.8rem; margin-top: 1rem; padding: 0.5rem 0; border-top: 1px solid #242C32; }
  </style>
</head>
<body>
  <h1>${entry.id} — ${entry.question}</h1>
  <div class="meta">SVG comic-strip test • Generated by Claude Haiku 4.5 in ${elapsed}ms • ${svg.length} chars</div>
  <div class="comic-frame">
    ${svg}
  </div>
  <div class="ans">
    <strong>Source answer (first 1500 chars):</strong>
    <pre>${entry.answer.slice(0, 1500).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre>
  </div>
  <div class="stats">Test file at: lab/test-svg-comic.html</div>
</body>
</html>`;
  const outPath = path.join(__dirname, 'test-svg-comic.html');
  fs.writeFileSync(outPath, outHtml, 'utf8');
  console.log('Wrote', outPath);
  console.log('Open in browser to review');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
