// st0073-style economy hour (~1,500–1,700 words). Used by economy-st-hour-from-topic.js

function hourTraining(cfg) {
  const agendaBlocks = cfg.blocks
    .map(
      (b) =>
        `### ${b.title} (${b.tStart}–${b.tEnd}, ${b.min} minutes)\n\n${b.body}`
    )
    .join('\n\n');
  const sumMin = cfg.blocks.reduce((s, b) => s + b.min, 0);

  return `# ${cfg.h1}

**${cfg.subtitle}**

## Why Run This Session

${cfg.why}

## What Reps Will Walk Out With

${cfg.walkout.map((w) => `- ${w}`).join('\n')}

## Who Should Be in the Room

${cfg.who}

## Before the Meeting (Manager Prep — 15 Minutes)

${cfg.prep.map((p, i) => `${i + 1}. ${p}`).join('\n')}

\`\`\`mermaid
flowchart TD
${cfg.mermaid}
\`\`\`

## The 60-Minute Agenda

This session runs 0:00 to 1:00. The agenda blocks below sum to exactly **${sumMin} minutes**.

${agendaBlocks}

**Agenda check:** ${cfg.blocks.map((b) => b.min).join(' + ')} = ${sumMin} minutes.**

## Worksheet / Artifact

${cfg.worksheet}

## How to Use This With the Buyer

${cfg.buyerUse.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Manager Coaching Notes

${cfg.coaching.map((c) => `- ${c}`).join('\n')}

## The Bottom Line

${cfg.bottomLine}`;
}

module.exports = { hourTraining };
