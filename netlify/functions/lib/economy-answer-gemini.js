// Quality-first Gemini answers for economy Q&As ($0 Flash tier).

const https = require('https');

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_TOKENS = 1200;

const SYSTEM = `You write library answers for Pulse RevOps / athletics operators. Quality beats length.

RULES:
1. Answer the EXACT question in the first 2–3 sentences — no bait-and-switch.
2. Every section must add NEW information; delete generic filler (no "RevOps product work", no "pilot segment" unless the question is about pilots).
3. If the question is college football NIL: write for ADs, collective GMs, and compliance — not Salesforce admins. Name the school, portal windows, offer tiers, donors.
4. If the question is B2B RevOps: name the CRM/tool from the question, the failure mode, and concrete config steps.
5. Density > word count. 500–900 words is fine if every paragraph earns its place.
6. Include exactly one \`\`\`mermaid diagram (6–12 nodes) that matches this answer.
7. One markdown table only if it clarifies comparison or timeline.
8. End with one sharp "Bottom line" sentence.

BANNED: landscape, leverage (verb), utilize, holistic, synergy, game-changer, delve, ever-evolving, unlock value, "it's important to note", generic QBR/forecast filler unrelated to the question.

Do not mention AI or Gemini.`;

function geminiAnswer(question) {
  return new Promise((resolve, reject) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return reject(new Error('GEMINI_API_KEY not set'));
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: { temperature: 0.55, maxOutputTokens: MAX_TOKENS },
    });
    const opts = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 90000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            return reject(new Error(`gemini ${res.statusCode}: ${data.slice(0, 280)}`));
          }
          const text =
            parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text || text.length < 400) return reject(new Error('gemini empty or too short'));
          resolve(text.trim());
        } catch (e) {
          reject(new Error('gemini parse: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      try { req.destroy(); } catch (_) {}
      reject(new Error('gemini timeout'));
    });
    req.write(payload);
    req.end();
  });
}

function ensureMermaid(text) {
  if (/```mermaid/.test(text)) return text;
  return (
    text +
    '\n\n```mermaid\nflowchart LR\n  A[Plan] --> B[Execute]\n  B --> C[Measure]\n```'
  );
}

module.exports = { geminiAnswer, ensureMermaid };
