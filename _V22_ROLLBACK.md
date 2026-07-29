# ⏪ ROLLBACK CARD — TOP_LIST v2.2 lane

**Save point:** commit `868b4e24`, tag `v22-savepoint`, branch `claude/fix-it-all-handoff`
**Created:** 2026-07-29

## First, the thing that matters most

**No content was ever written.** Zero blobs, zero entries, zero deploys. Everything the
v2.2 work touched is *code*, and every v2.2 code path is gated behind:

```js
data-template="TOP_LIST" data-version="v2"
```

No body on the site carries that stamp. **So today's behaviour is identical to before the
v2.2 work started** — the machines cannot enter a v2.2 path because there is nothing to enter it on.
If something looks wrong right now, v2.2 is not the cause.

## ⚠️ Do NOT roll back to the last commit before this one

`04f43b3b` predates this session's machine work that you confirmed was working well:

- rank-anchored image placement (one image per `#` ranking — the Corvette/Mustang fix)
- 6 → 11 body image slots
- the premium RUNGS ladder in `_page_finisher.js`
- hub pause-after-N, premium engine default, cross-pillar under-12 counts, reset-pillar
- drip images-only default, ≥12/13 targeting, white-image rejection, auto-focus crop

Reverting to `04f43b3b` throws all of that away too. `868b4e24` is the point that has the
good machine work **and** the v2.2 lane sitting inert on top of it.

## Level 1 — turn v2.2 off without touching anything (safest)

Nothing to do. It is already off. It only activates on bodies stamped `data-version="v2"`,
and none exist. Stop here unless you actually want the code gone.

## Level 2 — remove only the v2.2 lane, keep all the good machine work

```bash
cd /c/Users/koryj/website
git checkout 868b4e24 -- new/publish_core.js new/content_gate.js _ranking_top10_gold_template.js
git apply -R <(git show 868b4e24 -- new/publish_core.js new/content_gate.js _ranking_top10_gold_template.js)
```

Simpler and safer in practice — just delete the additive files and the three guarded blocks:

```bash
rm -f _top10_v2_template.js _top10_v2_emit.js _top10_v2_dryrun.js \
      _top10_v2_dryrun_blobs.js _top10_v2_proof.js GOLDEN_TEMPLATE_TOP10_SKELETON.html
```

The three modified files then self-disable: `_ranking_top10_gold_template.js` soft-requires
the v2 module inside a `try/catch` and sets `V2 = null` when it is missing, so the dispatch
is skipped and the v1 path runs exactly as before. `content_gate.js` and `publish_core.js`
keep their guarded blocks but can never enter them.

## Level 3 — full return to the save point

```bash
cd /c/Users/koryj/website
git checkout v22-savepoint -- .
```

Or to inspect what changed before deciding:

```bash
git diff v22-savepoint -- new/publish_core.js
git show 868b4e24 --stat
```

## What is safe to run right now

| Machine | Behaviour today |
|---|---|
| Kory's Multihub / crews | **v1, unchanged.** Premium RUNGS ladder untouched. Will NOT produce v2.2 pages. |
| The Drip | **Unchanged.** v2.2 image-fill path exists but no v2.2 body can trigger it. |
| Gate | **Unchanged** for all ~28,500 entries. TOP_LIST-v2 branch is unreachable. |

## Still not wired (deliberately)

1. **Emitter → write path.** Nothing publishes v2.2 yet. The crews cannot produce it.
2. **Force-reformat setting.** Crews currently skip pages already at gate, so a 13/13 **v1**
   Top-10 would be skipped rather than reformatted. Owner wants those rewritten.
3. **2nd mermaid generation.** v1 carries 1, v2.2 needs 2 unique (DeepSeek, text lane).
4. **Hero image.** v1 bans a top hero so 92% of Top-10s have none. Claude never places images
   (IMAGE_PLACEMENT_LAW) — this must come through the sanctioned crew/drip image path.
