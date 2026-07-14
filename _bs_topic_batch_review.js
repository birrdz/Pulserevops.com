// PILLAR BOOK SUMMARIES FACE/TOPS — use EXISTING approved Pexels inventory.
// Owner: already approved 1000+ images — do NOT pull/ask for more bank.
// Pexels inventory only. Never Pollinator.
'use strict';
process.env.TOPIC_PILLAR = 'bs';
process.env.TOPIC_BANK = '300'; // keep existing bank — no new fill past what owner already has
process.env.TOPIC_PAGE = '300';
process.env.GP_TOPIC_PORT = '8920';
process.env.TOPIC_INV_ONLY = '1'; // inventory first/only — no fresh approve marathon
require('./_gp_topic_batch_review.js');
