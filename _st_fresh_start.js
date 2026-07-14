'use strict';
/** Fresh Sales Trainings face review — wipe prior bank/approvals and restart room. */
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const STATE = path.join(WD, '_st_topic_review_state.json');
const STAGE = path.join(WD, 'assets', 'qa', '_st_topic_stage');

const fresh = {
  approved: {},
  trashed: {},
  usedPhotos: {},
  usedHashes: {},
  usedAHashes: [],
  zoomQueue: {},
  bank: [],
  cursor: 0,
  batch: null,
};

fs.writeFileSync(STATE, JSON.stringify(fresh, null, 2));
console.log('cleared', STATE);

// Clear staged preview frames so old mismatched cards don't linger
try {
  for (const n of fs.readdirSync(STAGE)) {
    if (/\.(jpe?g|png|webp)$/i.test(n)) {
      try {
        fs.unlinkSync(path.join(STAGE, n));
      } catch (e) {}
    }
  }
  console.log('cleared stage', STAGE);
} catch (e) {
  console.log('no stage dir yet');
}
