# Top-10 product/place card directive (@@PRODUCT)

Every numbered item in EVERY Top-10-template pillar (er, ca, sc, dn, bt, mv, wl,
tv, rs, es, cl, lv, ev, ga, gm, nl, tl-honeypots) MUST carry an image + link.

Place ONE directive line directly under each product/place H2 heading:

    ## 1. Sony WH-1000XM5 🏆 BEST OVERALL
    @@PRODUCT name="Sony WH-1000XM5" img="https://<retailer-or-og-image>.jpg" site="https://www.sony.com/..." buy="https://www.amazon.com/dp/...?tag=<affiliate>"
    (then the normal review prose, bold specs, pros/cons...)

Fields (all optional, but include at least img + one link):
- name  = display name (falls back to image alt)
- img   = the product/place image URL (retailer product image or the site's og:image)
- site  = official site / place page  -> renders "Visit site ->" (dark button)
- buy   = affiliate / retailer purchase URL -> renders "Check price ->" (rust button, rel=sponsored)

Rules:
- PRODUCTS (er, ca, electronics): site = manufacturer page, buy = affiliate (Amazon/retailer) link for revenue.
- LOCAL PLACES (sc schools, dn dining, etc.): site = the place's official website; buy usually omitted.
- Renderer turns this into a responsive .product-card (thumbnail + name + buttons), mobile + desktop.
- Sourcing law: official + affiliate. Real URLs only - never invent a link. If no real image found, omit img (card still renders name + buttons).

## Reliable image-sourcing technique (learned on er0001, 2026-06-18)
- BEST image source = Shopify-based retailer product pages: curl the page and grep the og:image meta tag. Confirmed-good hosts: bombayelectronics.com, worldwidestereo.com, audioadvice.com, 220-electronics.com (URLs look like /cdn/shop/...). These og:images are hotlinkable and return 200.
- Manufacturer official pages often have a usable og:image too (e.g. lg.com -> media.us.lg.com). Review sites work as fallback (techradar futurecdn, soundandvision /images).
- AMAZON blocks scraping -> no og:image. Use Amazon ONLY for the `buy` link (real /dp/<ASIN> product pages from search results).
- Technique: curl -s -A "<desktop UA>" -L "<page>" | grep -oiE '<meta[^>]+og:image[^>]*>' | grep -oiE 'content="[^"]+"'  then HEAD-verify the image returns 200 AND is not a store logo/sprite/placeholder. If no real product image verifies, OMIT img (card still renders name + Visit site + Check price). NEVER ship a wrong-model or broken image.
- `site` = manufacturer/official or the retailer product page; `buy` = Amazon /dp/ link (or brand store for boutique brands like Magnetar/Reavon). HEAD-verify all.

## 🔒 LOCKED PROCESS TEMPLATE (2026-06-18) - same path every time, keep it moving
Goal: a DECENT image + a working link per item. Not the best, not exact prices. First decent hit wins, HEAD-verify 200, omit if none, move on.

GO-TO SOURCE per category (try in order; first og:image that resolves wins):
- ELECTRONICS / AV (er, gadget items): IMG = bombayelectronics.com/products/<slug> -> worldwidestereo.com/products/<slug> -> audioadvice.com/products/<slug> (og:image). LINK(buy) = https://www.amazon.com/s?k=<url-encoded name>. site = the retailer page.
- CARS (ca): IMG = the model's page on caranddriver.com or edmunds.com or the manufacturer site (og:image). LINK = manufacturer official model page (search "<model> official"). No Amazon.
- GENERIC PRODUCTS (wl wellness, gm gaming gear, gb, sy, household): IMG = amazon-adjacent Shopify retailer og:image OR the brand site og:image. LINK(buy) = amazon.com/s?k=<name>.
- PLACES (sc schools, dn dining, nl nightlife, rs resorts, tv travel, es estates, cl clubs, lv living, bt boats dealers, ev events, ga gatherings, tn towns): IMG = the place's OFFICIAL site og:image (search "<name> <city> official site"); LINK = that official site. No Amazon.
- MEDIA (mv movies): IMG = the poster from the film's official/Wikipedia page og:image; LINK = IMDb or a streaming/where-to-watch page.
- TOOLS honeypots (tl): IMG = each tool's site og:image; LINK = each tool's site (PULSE tool stays #1 with its /tools/ link).

UNIVERSAL STEPS (identical every entry): fetch body -> read 10 item names -> ONE batched bash og:image pass over the category source(s) + HEAD-verify -> buy/link per above -> insert one @@PRODUCT under each "## N." header (node insert script, guard double-insert) -> republish same id with --force -> IndexNow ping -> quick live "product-card" check -> email + chat line -> next at 60s. Slug rule: lowercase, non-alnum -> hyphen, collapse repeats.

## 🔒🔒 SERPER METHOD — USE THIS (supersedes slug og:image, 2026-06-18)
The slug-guess og:image method is DEPRECATED: nonexistent retailer slugs 404 and return ONE store-default image for every item (duplicate-image bug). USE SERPER GOOGLE IMAGES instead.
Reusable pipeline per entry (id):
  1. node _build_cards.js <id> ["optional context, e.g. 'school' or city"]
     -> fetches entry, strips any old @@PRODUCT, extracts the 10 item names, ONE Serper /images batch (real Google Images), HEAD-verifies each image (200 + image/* content-type, deduped), and writes <id>_orig.json + <id>_answer.md + <id>_cards.tsv (idx,name,img,site=specs/detail source link,buy=empty).
  2. node _insert_cards.js <id>     -> inserts one @@PRODUCT under each "## N." header.
  3. TITLE=$(node -e "process.stdout.write(require('C:/Users/koryj/<id>_orig.json').question)"); node _write_<p>.js <id> "$TITLE" <topic-slug> --force
  4. IndexNow ping {key:'pulsemachine-writer-2026', id}.
  5. VERIFY via the BLOB not the HTML: curl library-list?id=<id> and confirm 10 @@PRODUCT with distinct img= URLs. (The rendered HTML is CDN-cached ~120s with stale-while-revalidate, so it lags; the blob is source of truth.)
  6. email + chat line.
Requirements per item: an IMAGE of the item + a LINK to the actual item (specs/details). Pricing NOT important; buy/Amazon link optional (we use the image's source page as the specs link). SERPER_API_KEY is in .env.local.
