// Send one-off progress email via pulse-progress-notify → koryjordanwhite@gmail.com
// Usage: node _email_progress.js "Subject" "<p>html body</p>"
const { sendProgressEmail } = require('./_progress_email');

const subject = process.argv[2] || 'PULSE progress update';
const html = process.argv[3] || '<p>Progress update from PULSE agent.</p>';

(async () => {
  const r = await sendProgressEmail(subject, html);
  console.log(JSON.stringify(r, null, 2));
  if (!r.ok) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
