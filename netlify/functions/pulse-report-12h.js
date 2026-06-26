// pulse-report-12h — emails the owner a 12-hour rollup (crawlers + conversions). Halfway-through-day check.
const stats = require('./_stats');

exports.handler = async () => {
  try {
    const a = await stats.readRange(12);
    const conv = a.leads + a.clicks + a.toolSaves;
    const lines = [
      'PULSE - last 12 hours (rolling, UTC)',
      '',
      'Crawlers: ' + a.botTotal + ' total',
      '  ' + stats.botBreakdown(a.bots),
      '',
      'Conversions: ' + conv + '  (fractional-CRO leads ' + a.leads + ', CRO/LinkedIn clicks ' + a.clicks + ', tool saves ' + a.toolSaves + ')',
    ];
    const via = await stats.sendOwner('PULSE 12h: ' + a.botTotal + ' crawlers, ' + conv + ' conversions', lines);
    return { statusCode: 200, body: JSON.stringify({ ok: true, via, botTotal: a.botTotal, conv }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};

// 00:00 and 12:00 UTC.
exports.config = { schedule: '0 0,12 * * *' };
