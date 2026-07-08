// Pillar image-fix progress email — every 5 min, clickable https links.
require('./_ranking_master_progress_email_run').runEmail(
  (process.argv.find(a => a.startsWith('--pillar=')) || '').split('=')[1] || process.argv[2] || 'ce'
);
