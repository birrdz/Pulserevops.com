// Industry KPIs topic face review — all bank cards in one room, keep 320 bank for future.
// Thin launcher → _gp_topic_batch_review.js with TOPIC_PILLAR=ik.
'use strict';
process.env.TOPIC_PILLAR = 'ik';
process.env.TOPIC_BANK = process.env.TOPIC_BANK || '320';
process.env.TOPIC_PAGE = process.env.TOPIC_PAGE || process.env.TOPIC_BANK || '320';
process.env.GP_TOPIC_PORT = process.env.GP_TOPIC_PORT || '8917';
require('./_gp_topic_batch_review.js');
