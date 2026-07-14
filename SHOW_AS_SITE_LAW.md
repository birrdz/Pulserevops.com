# SHOW AS SITE LAW

**Status: MANDATORY · NON-NEGOTIABLE.** Owner locked 2026-07-12.  
**Change only with owner passcode `4444`.**  
**Cursor rule:** `.cursor/rules/show-as-site-law.mdc`

## One line

**Show me things the way they are going to be on the site.**

## Why

Image / face approvals only work if the owner can read the **same title (with industry)** over the **same photo treatment** visitors will see on mosaic tiles. Fake admin cards hide the industry and ship wrong keeps.

## Live site shape (face mosaic)

From `index.html` `ftile` + `css/pulse-mosaic.css`:

| Layer | What |
|-------|------|
| Photo | `/assets/qa/{id}.jpg` · cover · **no baked title** |
| Pillar | `mm-cat` chip (e.g. REVENUE ARCHITECTURE) |
| Title | Yellow `h4` on bottom scrim = **full question** (industry is in the title) |

## Approval boards

Topic face rooms (`_gp_topic_batch_review.js` / ports 8914 / 8917 / 8918) must render **site-like `.mm` tiles** for each candidate. Vote buttons stay outside the tile.

## Scope

Applies to every owner-facing preview: face banks, top-internal spot checks, mosaic audits, “does this look right?” mocks. If it will be on the site, **preview it as the site**.
