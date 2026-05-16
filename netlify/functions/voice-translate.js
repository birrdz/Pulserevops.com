// voice-translate — POST { id, target_voice } → returns the entry rewritten in
// the target voice. Preserves length, structure, mermaid, tables, sources.
// target_voice ∈ ["operator", "between", "layman"]
// Triggered by the 3-button voice switcher on per-entry pages.

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

const VOICE_RULES = {
  operator: `OPERATOR-GRADE voice — CRO-to-CRO, M&A-banker-to-CFO. Dense vocabulary expected: cRPO, NRR, ACV, ARPU, GM compression, multi-cloud egress, attach-rate, FedRAMP, sovereign cloud, EBITDA leverage, S&M efficiency. Reader is a senior B2B operator who reads 10-Ks for breakfast. Use named figures, named vendors, named exec-team commentary. No explanations of basic terms — they already know.`,

  between: `IN-BETWEEN voice — written for the MIDDLE of the bell curve plus a band on either side. Inclusive: the reader could be a smart-but-not-tech-industry small business owner, a curious retail investor, a sales rep transitioning to leadership, OR an early-career professional. Use plain everyday language. Short clear sentences. Translate every dense term. Define EVERY acronym on first use even if "everyone knows it." Keep all named numbers, named companies, and named executives — those are facts. Avoid MBA-speak ("synergies", "value prop", "leverage" as a verb). Write the way a smart friend at a dinner party would explain the topic — substance preserved, jargon translated, facts intact, tone warm-not-condescending.

CRITICAL JARGON EXPANSION RULES:
- ON FIRST USE of any acronym, spell it out inline in parentheses: "ARR (Annual Recurring Revenue)", "NRR (Net Revenue Retention)", "cRPO (current Remaining Performance Obligations)", "ACV (Annual Contract Value)", "TAM (Total Addressable Market)", "OTE (On-Target Earnings)", "SIEM (Security Information and Event Management)", "APM (Application Performance Monitoring)", "RUM (Real User Monitoring)", "CSM (Customer Service Management or Customer Success Management — context-dependent)", "IRM (Integrated Risk Management)", "ITSM (IT Service Management)", "HRSD (HR Service Delivery)", "SDR (Sales Development Representative)", "AE (Account Executive)", "CRO (Chief Revenue Officer)", "RIF (Reduction In Force / layoff)", "GTM (Go-To-Market)", "MQL (Marketing Qualified Lead)", "SQL (Sales Qualified Lead)", "FCF (Free Cash Flow)", "GM (Gross Margin)", "S&M (Sales & Marketing)", "R&D (Research & Development)", "FY (Fiscal Year)", "PE (Private Equity)", "M&A (Mergers & Acquisitions)", "SaaS (Software-as-a-Service)", "PLG (Product-Led Growth)", "iPaaS (Integration Platform-as-a-Service)", "RPA (Robotic Process Automation)", "LLM (Large Language Model)", "RAG (Retrieval-Augmented Generation)", "MCP (Model Context Protocol)", "FedRAMP (Federal Risk and Authorization Management Program)", "DPDP (Digital Personal Data Protection)", "EU (European Union)", "DoD (Department of Defense)", "DKIM (DomainKeys Identified Mail)", "SPF (Sender Policy Framework)", "DMARC (Domain-based Message Authentication, Reporting & Conformance)", "RPO (Remaining Performance Obligations)", "ARR/MRR (Annual/Monthly Recurring Revenue)", "NPS (Net Promoter Score)", "ROI (Return On Investment)", "TCO (Total Cost of Ownership)", "ETL/ELT (Extract-Transform-Load / Extract-Load-Transform)", "BPMN (Business Process Model and Notation)", "ITIL (Information Technology Infrastructure Library)", "GRC (Governance, Risk, and Compliance)", "API (Application Programming Interface)", "DC (Data Center)", "GPU (Graphics Processing Unit)", "GTM (Go-To-Market)", "PMF (Product-Market Fit)", "ICP (Ideal Customer Profile).
- After first use, the bare acronym is fine.
- Do NOT skip the expansion just because "everyone knows it." Assume reader is a smart business person who hasn't worked in B2B SaaS.

GLOSSARY SECTION REQUIREMENT:
- AT THE END of every entry, AFTER Tags + Sources, ADD a "## Definitions" section
- Format: bullet list — "**ACRONYM** — Full Name. One-sentence plain-English explanation."
- Include EVERY acronym/jargon term that appeared in the entry (5-15 terms typical)
- Examples:
  - **NRR** — Net Revenue Retention. Whether existing customers spend more or less over time, expressed as a percentage. Above 100% means existing customers grow.
  - **cRPO** — current Remaining Performance Obligations. The portion of contracted-but-not-yet-recognized revenue expected to convert to revenue in the next 12 months. A leading indicator of near-term revenue.`,

  layman: `LAYMAN voice — plain English for someone who has NEVER worked in B2B SaaS. NO jargon at all. Replace every technical term with how a small-business owner would say it: "consumption pricing" → "you pay only for what you use", "net revenue retention" → "whether existing customers spend more or less over time", "FedRAMP" → "a U.S. government security stamp of approval". Keep ALL the named companies and ALL the named numbers — those are facts, not jargon. Use everyday words and short sentences. CRITICAL: same length as original, same number of bullets, same tables, same mermaid diagrams, same sources. Just different vocabulary.`,
};

const PRESERVE_RULES = `
ABSOLUTE PRESERVATION RULES (these apply to every voice):
- KEEP the same number of sections (Direct Answer, sub-sections, Bottom Line, Tags, Sources)
- KEEP the same number of bullets per section (do not collapse or expand)
- KEEP all markdown tables — translate the column headers and cell text into the target voice but keep the same rows + columns
- KEEP all mermaid blocks — translate the node labels into the target voice but keep the same graph structure (same nodes, same edges, same direction)
- KEEP all named companies (Snowflake, ServiceNow, Salesforce, Microsoft, etc.) — these are facts
- KEEP all named numbers ($13B, 30% attach, 76% margin, etc.) — these are facts
- KEEP all named people (Bill McDermott, Frank Slootman, etc.) — these are facts
- KEEP all source URLs unchanged
- KEEP cross-link references (q1610, q1612, etc.) — these are navigation
- TARGET LENGTH: within ±15% of the original markdown character count
- DO NOT add disclaimers like "in plain English" or "translated for clarity"
- OUTPUT ONLY the translated markdown — no preamble, no commentary

The goal is a true VOICE TRANSLATION — same content, same depth, same visuals, only the vocabulary changes.`;

function callClaude(apiKey, question, answer, target_voice) {
  const voiceRule = VOICE_RULES[target_voice] || VOICE_RULES.between;
  const SYSTEM = `You translate B2B / SaaS / RevOps library entries between three voice registers without losing content. Today's task: translate to the ${target_voice.toUpperCase()} voice.

${voiceRule}

${PRESERVE_RULES}`;

  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Question: ${question}\n\nOriginal answer (markdown):\n${answer}\n\nTranslate the above answer into the ${target_voice.toUpperCase()} voice per the rules. Output ONLY the translated markdown.`,
    }],
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 45000,
    }, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body), raw: body }); }
        catch (e) { resolve({ status: res.statusCode, data: null, raw: body }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'ANTHROPIC_API_KEY not set' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: 'bad json' }; }

  let { id, target_voice, question, answer } = body;
  target_voice = (target_voice || 'between').toLowerCase();
  if (!VOICE_RULES[target_voice]) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'target_voice must be operator|between|layman' }) };
  }

  if (id && (!question || !answer)) {
    const store = initStore();
    if (!store) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'blob store unavailable' }) };
    }
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry) {
        return { statusCode: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: false, reason: 'entry not found' }) };
      }
      question = entry.question;
      answer = entry.answer;
    } catch (e) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'blob read error: ' + e.message }) };
    }
  }

  if (!answer || !String(answer).trim()) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'no answer text' }) };
  }

  try {
    const r = await callClaude(apiKey, question || '', answer, target_voice);
    if (r.status !== 200) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'claude error', status: r.status, raw: r.raw.slice(0, 200) }) };
    }
    const text = r.data?.content?.[0]?.text || '';
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
      body: JSON.stringify({ ok: true, voice: target_voice, answer: text.trim() }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
