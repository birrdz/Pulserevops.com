'use strict';

const { geminiGenerate, stripJsonFence } = require('./gemini-flash-lite-lib');

const SYSTEM = `You are a medical document data extractor for operational / billing / records workflows.
Extract structured facts from the document. Return ONLY valid JSON matching this schema (no markdown fences):

{
  "document_type": "lab_report|imaging|discharge_summary|visit_note|prescription|pathology|insurance_eob|referral|other",
  "patient": { "name": "", "dob": "", "mrn": "", "sex": "" },
  "dates": { "service": "", "collection": "", "report": "" },
  "provider": { "facility": "", "physician": "", "npi": "" },
  "diagnoses": [{ "code": "", "description": "" }],
  "medications": [{ "name": "", "dose": "", "frequency": "", "route": "" }],
  "procedures": [{ "code": "", "description": "", "date": "" }],
  "lab_results": [{ "test": "", "value": "", "unit": "", "ref_range": "", "flag": "" }],
  "vitals": { "bp": "", "hr": "", "temp": "", "weight": "", "height": "" },
  "summary": "2-4 sentence clinical summary",
  "confidence": 0.0,
  "warnings": ["any OCR gaps, illegible sections, or missing critical fields"]
}

Rules:
- Use empty strings or empty arrays when unknown — never invent clinical values.
- Dates as ISO YYYY-MM-DD when possible.
- confidence is 0-1 reflecting extraction completeness.
- If the file is not a medical document, set document_type to "other" and explain in warnings.`;

function mimeForFilename(name) {
  const ext = String(name || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'tif' || ext === 'tiff') return 'image/tiff';
  if (ext === 'txt') return 'text/plain';
  return 'application/octet-stream';
}

function buildUserParts({ filename, mimeType, base64, textFallback }) {
  const parts = [];
  const label = 'Filename: ' + (filename || 'document');
  if (base64 && mimeType && mimeType !== 'text/plain') {
    parts.push({ text: label + '\nExtract all structured medical fields from this document.' });
    parts.push({ inlineData: { mimeType, data: base64 } });
  } else if (textFallback) {
    parts.push({
      text:
        label +
        '\n\nDocument text (may be incomplete OCR):\n' +
        String(textFallback).slice(0, 120000),
    });
  } else {
    throw new Error('no document content');
  }
  return parts;
}

async function extractMedicalDocument(opts) {
  opts = opts || {};
  const userParts = buildUserParts(opts);
  const { model, text } = await geminiGenerate({
    system: SYSTEM,
    userParts,
    timeoutMs: opts.timeoutMs || 120000,
  });
  let parsed;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch (e) {
    throw new Error('JSON parse failed: ' + e.message + ' · raw=' + text.slice(0, 120));
  }
  return {
    ok: true,
    model,
    filename: opts.filename || '',
    extracted_at: new Date().toISOString(),
    data: parsed,
  };
}

module.exports = {
  SYSTEM,
  mimeForFilename,
  buildUserParts,
  extractMedicalDocument,
};
