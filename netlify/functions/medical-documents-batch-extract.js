'use strict';

const { extractMedicalDocument, mimeForFilename } = require('./lib/medical-document-extract-lib');

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ ok: false, error: 'POST only' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok: false, error: 'bad json' }) };
  }

  const filename = String(body.filename || 'document').slice(0, 200);
  const mimeType = body.mimeType || mimeForFilename(filename);
  const base64 = body.base64 ? String(body.base64).replace(/\s/g, '') : '';
  const textFallback = body.text ? String(body.text) : '';

  if (!base64 && !textFallback) {
    return {
      statusCode: 400,
      headers: cors(),
      body: JSON.stringify({ ok: false, error: 'base64 or text required' }),
    };
  }

  try {
    const result = await extractMedicalDocument({
      filename,
      mimeType,
      base64: base64 || undefined,
      textFallback: textFallback || undefined,
    });
    return {
      statusCode: 200,
      headers: { ...cors(), 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: cors(),
      body: JSON.stringify({ ok: false, error: String(e.message || e), filename }),
    };
  }
};
