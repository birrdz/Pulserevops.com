// IndexNow ping for q#### — delegates to indexnow-ping-entry (shared st/ik logic).

const { pingIndexNowEntry, HOST } = require('./indexnow-ping-entry');

async function pingIndexNowQ(id, store) {
  if (!id || !/^q\d+$/.test(id)) {
    return { ok: false, reason: 'bad id' };
  }
  return pingIndexNowEntry(id, store);
}

module.exports = { pingIndexNowQ, HOST };
