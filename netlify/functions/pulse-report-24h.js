// pulse-report-24h — emails the owner a full-day rollup (crawlers + conversions).
const stats = require('./_stats');

exports.handler = async () => {
  try {
    const a = await stats.readRange(24);
    const conv = a.leads + a.clicks + a.toolSaves;
    const lines = [
      'PULSE - last 24 hours (rolling, UTC)',
      '',
      'Crawlers: ' + a.botTotal + ' total',
      '  ' + stats.botBreakdown(a.bots),
      '',
      'Conversions: ' + conv + '  (fractional-CRO leads ' + a.leads + ', CRO/LinkedIn clicks ' + a.clicks + ', tool saves ' + a.toolSaves + ')',
    ];
    const via = await stats.sendOwner('PULSE 24h: ' + a.botTotal + ' crawlers, ' + conv + ' conversions', lines);
    return { statusCode: 200, body: JSON.stringify({ ok: true, via, botTotal: a.botTotal, conv }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};

// 00:05 UTC daily (just after the 12h fires at 00:00).
exports.config = { schedule: '5 0 * * *' };
