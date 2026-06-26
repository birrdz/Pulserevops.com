// One-off: publish the first 20 Graphics entries (gb0001-gb0020) by invoking
// _write_gb.js per item via execFile (no shell quoting issues). Each item:
// [id, title, category-slug, ~22-25 word description]. Assets must already exist
// at graphics/assets/<id>.svg (they do). Run: node _publish_gb.js
const { execFileSync } = require('child_process');

const ITEMS = [
  ['gb0001','RevOps Leader — LinkedIn Banner','linkedin-banner',"A dark, on-brand LinkedIn cover for revenue leaders — \"Build the revenue engine\" with a pulse-line motif. A simple way to signal that you run RevOps."],
  ['gb0002','Fractional CRO — LinkedIn Banner','linkedin-banner',"LinkedIn cover for fractional CROs: \"Sales strategy, systems and pipeline — without the full-time hire.\" Put your consulting offer at the top of your profile."],
  ['gb0003','“Pipeline Cures All” — LinkedIn Banner','linkedin-banner',"A bold quote cover for sales pros — \"Pipeline cures all\" in the Pulse accent gradient. A confident LinkedIn banner that states your whole philosophy."],
  ['gb0004','Sales Hiring — LinkedIn Banner','linkedin-banner',"A recruiting banner for sales orgs — \"We're hiring closers: join a team that runs on pipeline, not pressure.\" Use it on your profile while hiring."],
  ['gb0005','Quarterly Business Review — Title Slide','slide',"A clean 16:9 title slide for your QBR deck — \"Quarterly Business Review,\" Revenue, Pipeline, Forecast. Open your quarterly review on a polished, on-brand note."],
  ['gb0006','Pipeline Review — Section Divider Slide','slide',"A 16:9 section-divider slide — an oversized \"02\" with a \"Pipeline Review\" headline. Use it to transition cleanly between the chapters of your deck."],
  ['gb0007','Sales Kickoff 2027 — Title Slide','slide',"A high-energy 16:9 sales-kickoff title slide — a giant \"2027\" with \"One team. One number.\" Set the tone for your annual sales meeting."],
  ['gb0008','Thank You — Closing Slide','slide',"A 16:9 closing slide — \"Thank you.\" with a pulse line that flatlines into a dot and a \"Questions?\" prompt. End any presentation cleanly."],
  ['gb0009','The RevOps Funnel — Infographic','infographic',"A portrait infographic of the revenue funnel — Awareness, Pipeline, Close, Expansion — as four labeled bands. Reuse it in decks or posts to explain how RevOps works."],
  ['gb0010','5 Stages of a Healthy Pipeline — Infographic','infographic',"A numbered portrait infographic of the five pipeline stages: Prospect, Qualify, Propose, Negotiate, Close. Drop it into onboarding decks or a sales-process explainer."],
  ['gb0011','The Sales Cycle: Lead to Closed-Won — Infographic','infographic',"A five-step flow from Lead to Closed-Won — with Discovery, Demo and Proposal — as a clean vertical diagram. Map your sales process for reps or buyers."],
  ['gb0012','“Revenue Is a Lagging Indicator of Trust” — Quote Card','quote-card',"A square social quote card — \"Revenue is a lagging indicator of trust.\" A shareable LinkedIn or Instagram graphic that reframes how teams think about selling."],
  ['gb0013','“Pipeline Cures All” — Quote Card','quote-card',"A punchy square quote card — \"Pipeline cures all.\" The simplest, truest line in sales, sized for social posts and slide pull-quotes."],
  ['gb0014','“Sell the Problem, Not the Product” — Quote Card','quote-card',"A square quote card — \"Sell the problem, not the product.\" A discovery-selling reminder you can post, pin, or drop into a coaching deck."],
  ['gb0015','“Always Be Closing” — Sales Floor Poster','wall-art',"A bold printable poster — \"Always Be Closing\" stacked in the Pulse accent gradient. Print it for the sales floor or your home office to keep the energy up."],
  ['gb0016','Activity to Revenue — Motivational Print','wall-art',"A printable motivational poster — \"Activity, Pipeline, Revenue\" — the cause-and-effect chain of selling. Hang it where your reps will see it every morning."],
  ['gb0017','Sales Funnel — Icon / Clip Art','clip-art',"A clean sales-funnel icon in the Pulse accent gradient on a dark tile. Drop it into slides, docs, or diagrams wherever you need a quick funnel mark."],
  ['gb0018','Revenue Gauge (KPI) — Icon / Clip Art','clip-art',"A semicircular KPI gauge icon with the needle in the \"good\" zone. Use it in dashboards, scorecards, or slides to show revenue performance at a glance."],
  ['gb0019','Pipeline Stages — Icon / Clip Art','clip-art',"A row of five accent chevrons representing pipeline stages. A simple clip-art mark for process diagrams, slide bullets, or section headers in a sales deck."],
  ['gb0020','“It’s in the CRM, I Swear” — Sales Meme','meme',"A clean vector sales meme — \"Where's the deal?\" over \"It's in the CRM, I swear\" and a flatlining pipeline monitor. Light humor for sales Slack channels."],
];

const results = [];
for (const [id, title, cat, desc] of ITEMS) {
  try {
    const out = execFileSync('node', ['_write_gb.js', id, title, cat, desc], { encoding: 'utf8' });
    const last = out.trim().split('\n').pop();
    let j = null; try { j = JSON.parse(last); } catch (_) {}
    results.push(id + ': ' + (j && j.ok ? ('OK ' + j.size + ' indexnow=' + (j.indexnow && (j.indexnow.ok || (j.indexnow.indexnow && j.indexnow.indexnow.ok)) ? 'y' : JSON.stringify(j.indexnow && j.indexnow.reason || 'n'))) : ('UNKNOWN ' + last.slice(0,120))));
  } catch (e) {
    results.push(id + ': FAIL ' + String(e.stderr || e.message || e).slice(0, 200));
  }
}
console.log(results.join('\n'));
