We're going to work on **Type One**, which lives on **this computer**. Type One is a website called **pulserevops.com** (everyone just calls it **PULSE**). I'm going to explain it like you're brand new, then tell you exactly what to do. Read all of this before you touch anything.

## What PULSE is (the simple version)
PULSE is a giant free library on the internet. Right now it has about **10,700 answer pages** spread across **30 "pillars"** (a pillar is just a topic bucket — like Cars, Schools, Boats, Wellness, Sales Trainings, Tools, etc.). Each answer page answers ONE question really well (a "Q&A"). The whole point: be the best, most trustworthy free answer library on the internet so people keep coming back. The motto is **"We add value."**

The owner is **Kory White** — a 25-year revenue operator and a **Fractional Chief Revenue Officer (CRO)** who works through a firm called **CRO Syndicate**. PULSE is his. It is BOTH an authority library AND, quietly, a way for people to discover Kory's fractional-CRO services (more on that below).

## How the website is built (so you don't break it)
- It's hosted on **Netlify**. The site folder is `C:\Users\koryj\website`.
- The answer pages are NOT separate files. They live as **JSON "blobs"** in Netlify Blobs storage. There's a master list at `_index.json` and each answer at `answers/<id>.json`. **Blob writes go live instantly — no deploy needed.**
- A single **renderer function** turns each blob into an HTML page: `netlify/functions/pulse-machine-entry.js`. Changing this file changes how EVERY answer page looks, and it **needs a deploy** to take effect.
- The homepage is `index.html`. Each pillar has a landing page (`cars.html`, `schools.html`, `tools.html`, etc.) that all share `/css/pillar-page.css` + `/js/pillar-page.js`.
- **Every page id has a 1–2 letter prefix + digits** that tells you the pillar: q=Knowledge, st=Sales Trainings, ik=Industry KPIs, tk=Tech Stacks, bs=Book Summaries, er=Electronic Reviews, ra=Revenue Architecture, gp=GTM Playbooks, fr=Franchises, ca=Cars, tn=Towns, sc=Schools, nl=Nightlife, dn=Dining, bt=Boats, mv=Movies, wl=Wellness, tv=Travel, rs=Resorts, es=Estates, cl=Clubs, lv=Living, ev=Events, sy=Style, ga=Gatherings, gm=Gaming, sk=Skills, sp=Speeches, **tl=Tools**. (Sports lives under q#### ids with sports tags.)

## How to deploy (when you change CODE or STATIC files — not needed for blob content)
Deploys are **pre-approved**. From the `website` folder:
```
export NETLIFY_AUTH_TOKEN="$(grep -E '^NETLIFY_AUTH_TOKEN=' .env.local | cut -d= -f2- | tr -d '"'\''\r' | tr -d ' ')"
npx --yes netlify-cli@latest deploy --prod --site=a2b74b30-a1ac-40e2-9622-aebfc2feb482
node -e "require('fs').writeFileSync('.last-deploy-ts', String(Date.now()))"
```
After deploying, you can ping a page to search engines: POST `{key:'pulsemachine-writer-2026', id:'<id>'}` to `/.netlify/functions/pulse-indexnow-target`.

## CRITICAL machine quirk (you WILL trip on this)
The **Write tool does NOT persist files to disk on this PC** (sandbox overlay). To create a file that survives, use the **PowerShell tool with a single-quoted here-string** + `Set-Content -Encoding utf8`, OR the **Bash tool with a quoted heredoc** (`cat > file <<'EOF'`). When you use a single-quoted PowerShell here-string, a literal apostrophe must be doubled (`''`) — BUT then verify the saved file has only SINGLE apostrophes (a past bug wrote `it''s` and `White''s` literally and broke rendering + showed `&#39;`). Always `grep "''"` after writing and fix any doubles.

## How we write content (the big rule: LOCKED TEMPLATES)
Every pillar has a **LOCKED template** (a fixed skeleton). You must follow it exactly. Only the passcode **4444** can change a locked template. Key ones:
- **Knowledge Q&A (q####):** template `q11133`. NO TL;DR. 1,200-word minimum. 2+ mermaid diagrams. Researched, real names/citations. Frame around **current 2027 RevOps events** (acquisitions, layoffs, pricing changes), not timeless principles.
- **Sales Trainings (st####):** template `st213` — 6 numbered H2 sections w/ time allocations, Direct Answer, 2 mermaids, verbatim scripts, FAQ, Sources.
- **Industry KPIs (ik####):** template `ik0035` — 8 H2 sections, keeps a TL;DR, **1,200-word hard floor** (grader floor 1,500).
- **Tech Stacks (tk####):** template `tk0197`.
- **Book Summaries (bs####):** template `bs0001`.
- **Electronic Reviews / Cars / all Top-10 pillars (er/ca/etc.):** Top-10 ranking, 🏆 BEST OVERALL + 💎 BEST VALUE markers, ≥1,800 words, FAQ, Sources.
- **Revenue Architecture (ra####) + GTM Playbooks (gp####):** template `q12243`.
- **Franchises (fr####):** template `fr0001`.

## Universal content LAWS (apply to EVERY entry, every pillar)
1. **FAQ on every answer** — written as `**Bold question?**` lines (NOT `### question`; the grader only counts the bold form). Usually 4 pairs.
2. **Visible timestamps** — "Published <date>" + "Updated <date>" + matching JSON-LD `datePublished`/`dateModified`.
3. **Review-keyword mirror** — every entry injects "<topic> review / reviews / rating / review 2027" keywords (SEO only, NO fake ratings).
4. **Zero duplicates sitewide** — unique normalized title; same year + same topic = dup (different year is OK).
5. **Question text** — starts capitalized, typo-free, correct acronym casing (RevOps/SaaS/GTM/AI/KPI), terminal punctuation.
6. **Visitor questions = HIGHEST priority** — a question dropped in `_visitor_priority.json`/`queue.json` jumps the queue; fix it, write it on the locked template, publish, resume prior work.
7. **NEVER use AI-tell words:** delve, tapestry, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value/potential, "needless to say", "it's worth noting", "it's important to note". Use a hyphen "-", never an em dash.
8. **Quality bar** — entries are "done" only at the locked template's full quality. Writer scripts refuse to publish below the grader floor.

## Operating LAWS (how you work)
- **LOCKED LAW — AFK = keep moving:** When owner goes AFK, **do not stop work**. Continue all queued projects (turtle, pillar SEO, sprints). Rule: `.cursor/rules/afk-keep-moving.mdc`.
- **LOCKED LAW — 15-minute progress emails:** Every active workflow (batch, sprint, backfill, SEO, agent session) **must email koryjordanwhite@gmail.com at least every 15 minutes** until complete, plus start/complete/error. Use `createBatchProgressReporter` from `progress-email.js` (15-min timer on by default) or `node _status_email_loop.js` for site-wide sessions. Cursor rule: `.cursor/rules/batch-progress-email.mdc`.
- **Local preview before Netlify deploys** when feasible (spin up a local server, send the owner the localhost URL), then deploy. Deploys themselves are pre-approved.
- **Agent waves:** when mass-producing, spawn small waves (~6 agents), each writes its `.md` file write-only via PowerShell, then the orchestrator commits sequentially (so `_index.json` doesn't get a write-race). Keep waves ≤15 to avoid rate-limits.
- **NEW LAW — optimize for desktop AND mobile** on everything we build. It's fine to render something differently on one if it formats better there. This is a rule, not a preference.
- **Don't re-litigate strategy.** PULSE is a permanent autonomous authority library (the North Star), now WITH a quiet Kory/CRO Syndicate lead-gen layer on top.

## PULSE TOOLS pillar — read this carefully (it's special)
`/tools` (id prefix **tl####**) is the **Tools** pillar. It is a set of **"honeypots."** A honeypot = a long-tail operator question whose **#1 answer is one of PULSE's own free tools**, with the SAME tool reused across many industries (just swap the industry). It's 200 entries across **4 honeypot types**:
1. **Rep Scheduling** (tl0001–10, tl0061–100 = 50): "How many people should I schedule at my [business]?" → Top-10 with **PULSE Rep Scheduling Matrix #1** linking `/tools/rep-scheduling`. Method: agree a daily gross-profit-per-rep target → divide each location/day's gross profit by it → place shifts where receipts ring. Spec `_TL_SCHED_SPEC2.md`, exemplar `_SCHED_EXEMPLAR.md`.
2. **Recruiting Calculator** (tl0011–60 = 50): "How many reps do I need to hire for my [industry]?" → Top-10 with **PULSE Recruiting Calculator #1** → `/tools/recruiting-calculator`. Spec `_TL_RECRUIT_SPEC2.md`.
3. **Fractional CRO** (tl0101–150 = 50): "How do I know if I need a fractional CRO / cost / vs full-time / for my [industry]?" — NOT a Top-10. Editorial "look-what-we-found" page recommending **CRO Syndicate (logo + link) first, then Kory (photo + LinkedIn) second**, with a **"Reach out for fractional CRO help" lead form**. Spec `_FCRO_SPEC2.md`. Writer `_write_fcro.js` (light gate, bypasses the Top-10 grader).
4. **Pulse Check Matrix** (tl0151–200 = 50): "How do I get reps to sell the full product line / build a rep scorecard?" → Top-10 with **PULSE Pulse Check Matrix #1** → `/tools/pulse-check`. Spec `_PCHECK_SPEC2.md`.

Writers: `_write_tl.js` (Top-10 honeypots, tag `tools`), `_write_fcro.js` (fractional CRO). The Top-10 honeypots are graded by the electronicreview ruleset (10 numbered items, BEST OVERALL + BEST VALUE, 4 FAQ, Sources, ≥1,800 words). Each new honeypot type follows: pick a PULSE tool, make it #1 with a link, write the method, then 9 real third-party tools, then swap the industry to scale.

## The Kory White / CRO Syndicate lead-gen layer (live on the whole site)
- **Operator byline** under the question on every answer: "Curated by **Kory White** · Fractional CRO, **CRO Syndicate**" (Kory→LinkedIn, CRO Syndicate→contact page).
- **Footer credit** on every answer + injected on every static page via `/js/pulse-lead-track.js`: "PULSE is built by Kory White — Fractional CRO via CRO Syndicate."
- **Ad card** (CRO Syndicate maroon-red + white, real logo) above FAQ/Sources on every NON-fractional-CRO answer.
- **Lead form** ("Reach out for fractional CRO help") on every fractional-CRO page → emails Kory the prospect's info via `pulse-cro-lead.js`.
- **Click tracking:** ANY click to Kory's LinkedIn (`linkedin.com/in/korywhite`) or **`https://crosyndicate.com/contact-us/`** emails Kory (one per visitor/click-type/session) via `pulse-click-notify.js`.
- **SEO:** every page carries `Person` schema (Kory) with `worksFor` → CRO Syndicate, so Google links "Kory White" ↔ "CRO Syndicate" ↔ the site.
- **All CRO Syndicate links point to `https://crosyndicate.com/contact-us/`.** Email is wired through Resend/Postmark (`RESEND_API_KEY`), recipient hardcoded.

## Look & feel (current branding — keep consistent)
- **Whole site background is tan `#EBE9DE`** (white cards for contrast). The dashboard app stays dark on purpose.
- Main accent orange is shifting to the **new logo's rust tone** (~`#C0531F`) — the old bright orange was `#E25C29`.
- **New main logo = the lighthouse** ("PULSE / We add Value") → `pulse-logo.png`, `icon-192/512.png`, `apple-touch-icon.png`, `pulse-og.png` (source kept at `assets/pulse-logo-source.png`).
- **Design language: the lighthouse's orange/white diagonal stripes.** We're stamping that stripe motif onto each pillar's signature element — striped school flag (`pulse-schools-logo.svg` is the first proof), striped trophy for Sports, stripes on the Cars car, stripes on the Trainings chart, etc. Roll this across all ~30 pillar logos.
- Answer-page top shows the pillar's landing banner full-width; the question is large; pillar filter chips show **real per-pillar counts** + **green-highlight any pillar with new entries in the last 24h** (`pulse-pillar-counts.js`).
- The `kjw2222` Locker (3 letters + 4 digits) cloud-saves tool inputs across devices (`pulse-tool-save.js`).

## Helper backends added this era
`pulse-tool-save` (locker cloud-save), `pulse-click-notify` (lead-click emails), `pulse-cro-lead` (lead-form emails), `pulse-pillar-counts` (chip counts + 24h-new), `pulse-indexnow-target` (SEO ping). Memory index lives at `C:\Users\koryj\.claude\projects\C--Users-koryj\memory\MEMORY.md` — read it.

## YOUR FIRST TASK (do this now, then loop)
1. **Randomly pick ONE pillar.** Write **exactly one new Q&A** for it, following that pillar's LOCKED template and every universal law above (FAQ, timestamps, no banned words, no duplicates, researched, 2027 framing for Knowledge). Publish it with the pillar's writer script and ping it for indexing.
2. **Then jump to a RANDOM DIFFERENT pillar** and write one there. Keep rotating — one entry, random pillar, repeat. Smallest/most-neglected pillars first when in doubt.
3. Before drafting, do a dedup check (unique normalized title sitewide).
4. Email the owner a progress note ~every 15 minutes while you work.

---
**(Append below this line any new rules, laws, or tasks over time — this is a living command.)**

### 2026-06-23 — LOCKED: AFK = keep everything moving
- Owner AFK / bye / ttyl **does not pause work**. Continue turtle, pillar SEO, sprints, deploys.
- Rule: `.cursor/rules/afk-keep-moving.mdc` | Status emails: `--active` (real progress, not idle break)

### 2026-06-23 — LOCKED: Publish 12/12 → Turtle → Move On
- **Mantra:** publish full 12/12 text → **never wait for DDG turtle** → move on to next entry/project.
- Spec: `_publish_12_12_move_on.md` | Rule: `.cursor/rules/ship-first-q-st.mdc`
- Turtle worker: `node _ddg_turtle_backfill.js` (background, deferred-first)
- 2-min economy cron **OFF** in `netlify.toml` (deploy to apply)

### 2026-06-23 — LOCKED: Ship-first q + st (text now, DDG images later)
- **q#### and st####**: write full 12/12 text content, **publish + IndexNow immediately**, **do not wait** for DDG/cover images.
- Stamp `images_deferred_at`; backfill async via `node _qa_topimg_backfill.js q st`.
- Rule: `.cursor/rules/ship-first-q-st.mdc`. Top-10 pillars unchanged (image-pipeline-law at publish).
- **Every active workflow** emails **koryjordanwhite@gmail.com every 15 minutes** until done (start + complete/error too).
- Implementation: `netlify/functions/lib/progress-email.js` (`createBatchProgressReporter`, default `timeIntervalMs = 900000`).
- Site-wide aggregator: `node _status_email_loop.js` (background loop).
- Workspace rule: `.cursor/rules/batch-progress-email.mdc` (`alwaysApply: true`).

### 2026-06-22 — LOCKED: Coaching pillar (`cg####`) = 1:1 Top-10 + Q&A
- **Pulse Coaching** is a **combo pillar**: half **Top-10 rankings** (like `er`/`ca`), half **operator Q&A** (manager coaching questions).
- **Ratio 1:1** — alternate or keep equal mix; no long runs of one kind only.
- **Top-10 `cg####`:** image-pipeline-law at publish (not ship-first). **Q&A `cg####`:** `_CG_SPEC.md` gold format (not `q####` ship-first).
- Rule: `.cursor/rules/coaching-pillar-mix.mdc` | Hub: `https://pulserevops.com/coaching`
- Examples: Top-10 — "Top 10 Sales Coaching Drills for SDRs"; Q&A — "How do I coach a rep in a slump?"
