# PULSE SEO Spider — Auto-Fix Rule Map (owner 2026-06-29)
Goal: every yellow/red on /seo drives to 0 autonomously. Two engines:
A) AUTOHEAL deterministic fixers (_seo_autoheal.js, every 15m) — no writer needed.
B) REGROUND to V2 (DeepSeek/Claude) — one regen fixes thin+faq+mermaid+v2+image together.

| issue | rule | engine |
|---|---|---|
| long_titles      | shorten <title> to <=65 (word boundary)+" | Pulse"; keep full question as H1 | A (renderer) |
| duplicate_titles | change trailing year to "in 2028" (orig stays 2027) so the dup is unique + fresher | A (blob/index) |
| duplicate_h1     | follows title fix | A |
| short_titles     | append " in 2028" to clear the 30-char floor + add the year | A (blob/index) |
| missing_canonical| emit <link rel=canonical> = canonical /knowledge/<id> | A (renderer) |
| missing_schema   | emit JSON-LD (Article/FAQPage) | A (renderer) |
| images_missing_alt| alt = entry title | A (renderer/blob) |
| insecure_link_pages| rewrite http:// -> https:// in body links | A (blob) |
| broken_4xx_5xx (internal)| strip dead internal links / 301 to canonical | A (blob + netlify) |
| broken_external  | strip dead external link (keep anchor) or swap to web.archive.org | A (blob) |
| non_indexable    | drop intentional (derby/canonicalised) from sitemap; un-noindex real pages | A |
| low_inlinks / orphan_pages | inject "## Related on PULSE" sibling cross-links | A (blob) |
| thin_content     | reground -> ~2x words | B (reground V2) |
| missing_faq      | reground -> adds ## FAQ | B |
| missing_mermaid  | reground -> adds 2 mermaids | B |
| missing_v2       | reground -> V2 cards | B |
| pages_no_image   | DDG/cover image lane + reground top image | B / DDG |
| redirects_3xx    | EXCLUDED — intentional canonical trailing-slash | n/a |
