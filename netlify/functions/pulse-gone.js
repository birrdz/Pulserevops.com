// pulse-gone — universal 410 Gone fallback for URL paths that used to exist
// and should be permanently de-indexed. 410 tells Google to drop the URL
// from the index much faster than 404 (which implies "might return later").
//
// Wired in netlify.toml as the destination for legacy directory stubs:
//   /reps/*, /cities/*, /teams/*, /emails/*, /feedback/*, /vibes/*,
//   /fresh, /hr, /10, /feed.xml
//
// Always returns 410 with a tiny noindex HTML page that links back to /.

exports.handler = async () => {
  return {
    statusCode: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
    body:
      '<!doctype html><html><head>' +
      '<meta charset="utf-8">' +
      '<title>410 Gone · PULSE RevOps</title>' +
      '<meta name="robots" content="noindex, nofollow">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<link rel="stylesheet" href="/assets/pulse-tan.css"><link rel="stylesheet" href="/css/pulse-jet-sides.css"></head><body style="background:#09090F;color:#EEEEF5;font-family:system-ui,-apple-system,sans-serif;padding:48px;max-width:560px;margin:0 auto;line-height:1.6;">' +
      '<h1 style="color:#FF6B30;font-size:32px;margin-bottom:8px;">410 Gone</h1>' +
      '<p style="color:#8A8BA6;font-size:14px;margin-bottom:24px;">This URL is no longer in service and will not return.</p>' +
      '<p><a href="/" style="color:#FF6B30;text-decoration:none;font-weight:700;">← Back to the library</a></p>' +
      '</body></html>',
  };
};
