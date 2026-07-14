// PILLAR SALES TRAINING FACE/TOPS — fresh room (new URL).
// Titles = live ST Q&As only. Images = sales training / generic training / library OK.
// Bank = all ST Q&As (~775) + ~320 future = 1095.
'use strict';
process.env.TOPIC_PILLAR = 'st';
process.env.TOPIC_BANK = '1095';
process.env.TOPIC_PAGE = '1095';
process.env.GP_TOPIC_PORT = '8922';
process.env.GP_TOPIC_FRESH = '0'; // keep approved/bank state — new URL only
require('./_gp_topic_batch_review.js');
