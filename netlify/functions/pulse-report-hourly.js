// pulse-report-hourly — emails the owner the prior hour's crawler + conversion counts.
const stats = require('./_stats');

exports.handler = async () => {
  try {
    const prev = new Date(Date.now() - 3600e3);
    const hk = stats.hourKey(prev);
    const a = await stats.readHour(hk);
    const conv = a.leads + a.clicks + a.toolSaves;
    const lines = [
      'PULSE - last hour (' + hk + ':00 UTC)',
      '',
      'Crawlers: ' + a.botTotal + ' total',
      '  ' + stats.botBreakdown(a.bots),
      '',
      'Conversions: ' + conv + '  (fractional-CRO leads ' + a.leads + ', CRO/LinkedIn clicks ' + a.clicks + ', tool saves ' + a.toolSaves + ')',
    ];
    const via = await stats.sendOwner('PULSE hourly: ' + a.botTotal + ' crawlers, ' + conv + ' conversions', lines);
    return { statusCode: 200, body: JSON.stringify({ ok: true, via, hour: hk, botTotal: a.botTotal, conv }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};

// Top of every hour (UTC).
exports.config = { schedule: '0 * * * *' };
