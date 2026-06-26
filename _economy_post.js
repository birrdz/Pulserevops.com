// Economy-mode Q&A: min viable blob write (~800+ chars + mermaid). One topic per run.
const https = require('https');

const question =
  'How do you use Claude to extract and map unstructured call notes to CRM custom objects?';

const answer = `## Direct Answer

Use Claude as a **structured extraction layer** between raw call notes (Gong, Chorus, manual notes, Slack) and your CRM custom objects — not as a blind sync. Export or paste the note, run a fixed JSON schema prompt that names every target custom field, validate the output, then upsert via your CRM API (Salesforce, HubSpot, etc.) only after a human or rules check on high-risk fields.

**Workflow:** (1) Define a field map: note section → CRM object.field. (2) Store a versioned extraction prompt with examples. (3) Batch notes through Claude with \`temperature: 0\` and strict JSON output. (4) Route low-confidence extractions to a RevOps review queue. (5) Log source note ID on every CRM write for audit.

\`\`\`mermaid
flowchart LR
  A[Call notes] --> B[Claude JSON extract]
  B --> C{Schema valid?}
  C -->|no| D[RevOps review]
  C -->|yes| E[CRM upsert]
  D --> E
\`\`\`

## Practical tips

- **Custom objects:** map one note type to one object (e.g. \`Call_Insight__c\`) with child lookups to Account/Opportunity — avoid stuffing everything on Activity.
- **Hallucination guard:** require verbatim quotes for claims that affect forecast fields (next step, amount, close date).
- **Idempotency:** hash the note + model version; skip re-write if unchanged.
- **No native integration limit:** this pattern works when dialer ↔ CRM sync is weak — you own the middleware.

## Bottom line

Claude turns messy notes into **repeatable, field-level CRM data** when you treat extraction as a governed pipeline, not a one-off paste. Start with 5–10 high-value custom fields, prove accuracy, then expand.`;

function post(num) {
  const id = 'q' + num;
  const payload = JSON.stringify({
    key: 'pulsemachine-writer-2026',
    id,
    question,
    answer,
    tags: ['revops', 'claude', 'crm', 'call-notes', 'ai-automation'],
    sources: ['Salesforce/HubSpot custom object API docs', 'Anthropic structured output guidance'],
    lab_run: 'economy-mode',
  });
  const req = https.request(
    {
      hostname: 'pulserevops.com',
      path: '/.netlify/functions/pulse-blob-writer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    },
    (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        console.log(id, res.statusCode, body);
        if (res.statusCode === 409 && num < 99999) post(num + 1);
      });
    }
  );
  req.on('error', (e) => console.error(e.message));
  req.write(payload);
  req.end();
}

post(9700);
