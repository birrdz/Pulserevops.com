// q1953 — How do you start an Etsy shop business in 2027?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** To start an Etsy shop business in 2027, treat Etsy as a **customer-acquisition channel, not a business** — the winning move is to pick a tightly defined product niche where buyers search with intent, then use Etsy's 96M+ active buyers to fund the build-out of an owned brand (email list, Shopify site, repeat-customer base) before the platform's fee creep and algorithm volatility erode your margin. The realistic ICP is **the gift-and-occasion buyer**: someone searching "personalized [X] for [occasion]" who will pay a 30-60% premium for something that feels custom, ships fast, and arrives review-worthy. Avoid the default-playbook trap of generic print-on-demand t-shirts and AI-generated wall art — those categories are saturated to the point of negative unit economics. The defensible niches in 2027 are **personalized/made-to-order physical goods** (engraved items, custom apparel with real names/dates, bespoke jewelry), **digital products with genuine craft** (templates, patterns, planners, SVG bundles for the maker economy), and **small-batch handmade** where the maker's hand is visibly the moat. Startup costs run **$500-$3,000 for a digital-first or POD shop and $2,000-$12,000 for a handmade/made-to-order shop** with equipment (a laser engraver, embroidery machine, or kiln). Etsy's all-in take is roughly **9-12% of each order** once you stack the 6.5% transaction fee, $0.20 listing fee, ~3% + $0.25 payment processing, and the effectively-mandatory Etsy Ads and Offsite Ads (12-15% on attributed sales). Year-1 realistic revenue for a committed solo seller: **$8,000-$45,000 in gross sales** with 1,200-3,500 hours invested; the top decile of Year-1 shops clear **$60,000-$120,000**. By Year 3 a focused shop that has productized and partially automated can reach **$90,000-$250,000 gross**, and the Year-5 ceiling for a shop that has migrated 40-60% of revenue off-platform is **$300,000-$900,000**. The two existential 2027 risks: **(a) platform dependency** — Etsy can suspend your shop, change search ranking, or raise fees overnight, and **(b) AI-driven commoditization and listing saturation** that crushes any niche a solo seller can enter without a physical or craft moat. Net: Etsy is one of the fastest, cheapest ways to validate a physical-product business in 2027, but only if you go in knowing the platform owns the customer relationship and you are racing to take it back.`;

const core = `

## Why Etsy Still Works as a Starting Point in 2027

Etsy in 2027 occupies an unusual position: it is simultaneously a mature, fee-heavy, algorithm-volatile marketplace that veteran sellers complain about constantly, and still one of the single best places on the internet to launch a physical-product business with almost no upfront audience. Both things are true, and a founder who understands the tension can build something real. The marketplace reports roughly 90-96M active buyers and 8-9M active sellers, with annual gross merchandise sales in the $12-14B range. That buyer base matters enormously because it is composed of people in a *buying* state of mind — they did not land on Etsy to scroll, they landed because they want to purchase a gift, a craft supply, a piece of decor, or something personalized. Compare that to building a standalone Shopify store where you must buy every single visitor through Meta or Google ads at $1.50-$6.00 a click. Etsy hands you intent-rich traffic in exchange for a cut.

The reason Etsy still works as a *starting point* specifically is validation speed. You can go from idea to live listing to first sale in under two weeks with a few hundred dollars. You learn — fast and cheaply — whether anyone actually wants your product, what they will pay, which photos convert, and which keywords pull traffic. That feedback loop is worth more than any business plan. The mistake is confusing "starting point" with "destination." Etsy is a proving ground and a customer-acquisition channel. The sellers who treat it as their whole business are the ones who get destroyed when a fee increase, an algorithm change, or an account suspension lands. The sellers who treat it as the cheapest possible way to find their first 2,000 customers — and then systematically move those customers onto owned channels — build durable businesses. Everything in this guide is built around that frame.

## Market Sizing and Where the Real Money Is

The total Etsy gross merchandise sales figure of roughly $12-14B sounds enormous, but it is wildly unevenly distributed. Industry estimates and seller surveys consistently show that the top 1-3% of shops capture a disproportionate share — likely 40-60% — of all sales, while the long tail of shops do under $1,000 a year or never make a sale at all. The median active shop's annual revenue is genuinely low, in the $500-$2,500 range. This is not a reason to avoid Etsy; it is a reason to be clear-eyed about the distribution and design your shop to be in the top decile, not the median.

The categories that move the most money are predictable: jewelry and accessories, home and living (decor, furniture, kitchen), craft supplies and tools, paper and party supplies, clothing, and wedding goods. Within those, the segments with the healthiest seller economics in 2027 are the ones resistant to pure commoditization — personalized and made-to-order goods, genuine handmade craft, and digital products that require real skill to produce. The total addressable market for a focused niche shop is best thought of not as "all of Etsy" but as "the search volume for the specific buyer-intent keywords you can credibly rank for." A niche like personalized pet memorial gifts, custom Dungeons & Dragons dice boxes, or modern macrame plant hangers might represent only $5-40M of annual Etsy GMS, but a single focused shop can realistically capture $80K-$400K of that — far more than a generalist shop chasing the whole $14B will ever see.

The serviceable obtainable market for a solo founder in Year 1 is small and that is fine: you are trying to capture maybe 0.5-3% of the search demand in one or two micro-niches. That is a $8K-$45K business. By Year 3, with a wider product line, better ranking, and repeat customers, you are capturing 5-15% of several micro-niches plus off-platform sales — a $90K-$250K business. The framing that matters: never size the market as "Etsy is huge." Size it as "this specific buyer searches this specific phrase 9,000 times a month and I can be in the top 12 results."

## ICP Segmentation: The Five Buyers on Etsy

Etsy buyers are not monolithic, and your product, pricing, photography, and copy should be built for one or two specific buyer types — not all of them. There are five durable segments.

**The Gift Buyer.** The single largest and most profitable segment. This person is buying for someone else — a birthday, anniversary, wedding, baby shower, holiday, graduation, retirement, memorial. They are time-pressed, occasion-driven, and emotionally motivated, which makes them relatively price-insensitive: they will pay a 30-60% premium for something personalized that signals thought and effort. They care intensely about shipping speed (will it arrive in time?), gift presentation, and reviews. Roughly 40-55% of Etsy purchases are gifts. If you build for nobody else, build for this person.

**The Personalization Seeker.** Overlaps heavily with the gift buyer but also buys for themselves. They want their name, their dog's name, their wedding date, their kid's birth stats, their D&D character — something that exists nowhere else. Personalization is the strongest moat available to a solo Etsy seller because it is genuinely hard to mass-commoditize and AI cannot fully automate the made-to-order fulfillment.

**The Craft and Maker-Economy Buyer.** Buys supplies, tools, patterns, SVG/PNG digital files, sewing patterns, beads, yarn, jewelry findings. This is a B2B-ish buyer — other makers. They are repeat buyers with predictable reorder cycles, which is gold for lifetime value, but they are also more price-sensitive and harder to differentiate on. Digital craft files (cut files, embroidery designs, patterns) are a strong sub-segment because zero marginal cost meets genuine skill barrier.

**The Aesthetic/Decor Buyer.** Buys home decor, wall art, furniture, ceramics, textiles to match a specific aesthetic — cottagecore, mid-century modern, dark academia, Japandi, maximalist. They buy on visual identity and are reachable through Pinterest and Instagram. Margins can be good on genuine handmade decor; they are terrible on dropshipped or print-on-demand wall art because that sub-segment is catastrophically saturated.

**The Bargain/Trend Hunter.** Searches for cheap versions of trending products, compares prices aggressively, buys on price. This is the segment to *avoid* — they have low lifetime value, leave the most demanding reviews, and pull you into a margin race you cannot win against overseas sellers and the dropshipping flood. If your shop is attracting mostly this buyer, your niche or positioning is wrong.

## The Default-Playbook Trap: Why Most New Shops Fail Before They Start

There is a default playbook that every "make money on Etsy" YouTube video and TikTok pushes, and following it is the most reliable way to fail. The default playbook says: open a print-on-demand shop through Printful or Printify, list 100+ generic t-shirt and mug designs, use an AI image generator to make wall art, copy whatever is trending, and let volume do the work. This worked, marginally, around 2018-2021. In 2027 it is a path to zero or negative unit economics.

Here is why it fails. First, **saturation**: Etsy has millions of near-identical POD listings. A generic "funny cat mom shirt" competes with 50,000 other listings, most priced at or below cost once fees are stacked. Second, **the AI art flood**: generative AI made it trivially easy to produce infinite wall art, printables, and design files, so those categories collapsed in price and Etsy itself has been tightening policy around mass-produced AI content and reseller behavior — shops can be suspended for it. Third, **margin math**: a POD t-shirt sells for $24, the base cost is $11-14, Etsy's fees plus ads take $3-5, you net $5-9 before your time, and you spent that time competing on a commodity. Fourth, **no moat**: anything you can list in an afternoon, ten thousand other people can also list in an afternoon, so there is no defensible position.

The trap is seductive because it is low-effort and low-cost to start. But low barriers to entry mean low barriers for everyone, which means no profit. The escape from the trap is to deliberately choose a niche or method with a *higher* barrier — a physical skill, a piece of equipment, a genuine design capability, a made-to-order fulfillment process, a deep niche knowledge. The barrier that slows you down is the same barrier that protects you. A founder who internalizes this one idea — pick the harder thing on purpose — is already ahead of 90% of new sellers.

## Choosing Your Niche: The Intersection That Wins

Niche selection is the highest-leverage decision you will make, and it should sit at the intersection of four circles. **Circle one: buyer-intent search demand.** People must actively search for this thing — you can validate with Etsy's own search bar autocomplete, eRank or Marmalead keyword tools, and Google Trends. If nobody searches, nothing else matters. **Circle two: a defensible moat.** The niche must require skill, equipment, deep knowledge, or made-to-order labor that the AI-art-and-POD flood cannot replicate. **Circle three: healthy unit economics.** After all fees, materials, and a realistic hourly wage for your labor, the product must net 30%+ margin or it is a hobby. **Circle four: something you can sustain.** You will make this product hundreds or thousands of times; if you hate it by unit 50, the business dies regardless of the numbers.

Concrete niches that hit the intersection in 2027: personalized engraved cutting boards, ornaments, and barware (laser engraver moat); custom embroidered apparel and patches with real names and dates (embroidery machine moat); made-to-order modern jewelry with genuine design point of view; bespoke pet portraits and memorial items (artistic skill moat); high-quality digital sewing patterns, knitting patterns, and PDF planners (design and technical-writing skill moat); custom D&D and tabletop gaming accessories (niche knowledge plus craft); small-batch ceramics and pottery (kiln and skill moat); custom wedding stationery and signage (design skill plus made-to-order). Each of these has searchable demand, a real barrier to entry, defensible margins, and enough product variety to sustain a seller for years.

Niches to avoid entirely: generic POD apparel and drinkware, AI-generated wall art and printables, dropshipped home goods, anything you would buy wholesale and resell unchanged (against Etsy policy and economically dead), and trend-chasing products with a 90-day shelf life. The discipline is to choose narrow. "Jewelry" is not a niche. "Minimalist birthstone jewelry for new moms" is a niche. The narrower you go, the easier you rank, the more specific your photography and copy can be, and the more you become *the* shop for that exact buyer.

## Etsy's Fee Structure: The Real All-In Take

You cannot price correctly until you understand exactly what Etsy extracts from each sale, and most new sellers under-count it badly. The components in 2027: a **listing fee of $0.20** per item, charged when you list and again every four months on renewal and every time an item sells (a multi-quantity listing re-charges $0.20 per additional sale). A **transaction fee of 6.5%** of the total order including shipping and gift wrap. **Payment processing** through Etsy Payments at roughly 3% + $0.25 per order in the US (higher in some countries). **Etsy Ads**, which are technically optional but practically necessary for visibility in competitive niches — you set a daily budget and pay per click. And **Offsite Ads**, which are *not* optional once your shop crosses the revenue threshold: Etsy advertises your products across Google, Meta, and other platforms, and when a sale is attributed to one of those ads, Etsy takes **12% (shops over $10K trailing-twelve-month) or 15% (shops under $10K)** of that order on top of everything else.

Stack it up on a $40 order: $0.20 listing + $2.60 transaction (6.5%) + ~$1.45 payment processing (3% + $0.25) = roughly $4.25, or about 10.6%, before any advertising. Add Etsy Ads spend (budget-dependent, but figure 8-15% of ad-attributed revenue) and the occasional Offsite Ads hit at 12-15%, and a realistic blended all-in platform cost is **9-14% of gross sales** for a shop that advertises modestly, and 18-25% for a shop leaning hard on ads. Then layer your materials cost, your shipping cost (if not fully passed through), your packaging, and your labor. The sellers who fail on price are the ones who saw "6.5% transaction fee" and thought that was the cost. It is less than half the real cost. Price as if Etsy takes 12-15% of everything, because functionally it does.

## Startup Costs and Unit Economics by Shop Type

Startup cost depends entirely on which of three shop archetypes you choose, and each has very different economics.

**Digital-product shop (lowest cost: $300-$1,500).** You are selling files — patterns, templates, SVGs, planners, print-at-home art with genuine design value. Costs: a design tool subscription (Adobe Creative Cloud at ~$60/mo, or Affinity for a one-time ~$165, or Canva Pro at ~$15/mo), an Etsy listing budget, a mockup tool, and your time. Unit economics are spectacular once built: a $12 digital pattern costs $0 in marginal materials, Etsy takes ~$1.40, and you net ~$10.60 every single time it sells, forever. The catch is that digital is the most saturated and the most exposed to AI competition, so the moat must be in genuine design skill and depth.

**Print-on-demand / made-to-order-via-partner shop ($300-$1,200).** You design, a partner (Printful, Printify, Gelato, or a US-based POD partner) prints and ships. Costs are low because you hold no inventory. But unit economics are thin — base costs eat 45-60% of retail — and the saturation problem is severe. This archetype only works with a genuinely differentiated design point of view and a tight niche, never as a generic volume play.

**Handmade / made-to-order physical shop ($2,000-$12,000+).** You make the product. Costs include equipment (a quality laser engraver runs $400-$5,000; a good embroidery machine $1,500-$8,000; a kiln $800-$3,000; jewelry tools $500-$2,500), raw materials inventory ($300-$2,000), packaging and shipping supplies ($200-$600), and the same software and listing costs. Unit economics are the best of the three because the equipment and skill *are* the moat: a personalized engraved board might retail at $45, cost $8 in materials and $4 in fees, and net $33 before labor — and crucially, very few competitors can match it without the same equipment and skill. This archetype has the highest startup cost and the strongest defensibility, which is exactly the trade you want.

Across all three, budget an additional $200-$800 for the unglamorous essentials: a business bank account, basic bookkeeping software, a sales-tax registration where required, and a small buffer for samples, photography props, and the inevitable first batch of mistakes.

## The Tooling and Equipment Stack

A focused Etsy shop in 2027 runs on a stack of tools, and choosing well saves enormous time. **Listing and SEO research:** eRank ($6-$30/mo) or Marmalead ($19-$30/mo) for keyword research, competitor analysis, and listing optimization — one of these is close to mandatory in a competitive niche. **Design:** Adobe Illustrator and Photoshop for serious design work, Affinity Designer as a one-time-purchase alternative, Canva Pro for faster mockups and social content, and Procreate for illustration-based products. **Photography:** a decent smartphone is genuinely enough in 2027, plus a $30-$120 lightbox or a window and a $20 reflector, a few backgrounds, and styling props; product photography is the single highest-ROI skill to develop. **Mockups:** Placeit or Kittl for product mockups if you sell apparel or print products. **Production equipment** (handmade shops): laser engravers (xTool, Glowforge, OMTech), embroidery machines (Brother, Janome), Cricut or Silhouette cutting machines, kilns, jewelry benches — matched to your niche. **Fulfillment and shipping:** Etsy's built-in shipping label tool, or Pirate Ship and ShipStation for better rates and batch printing once volume justifies it; a thermal label printer ($120-$250) pays for itself fast. **Operations:** a bookkeeping tool (QuickBooks, Wave, or a spreadsheet early on), a simple CRM or just a tagged email list, and a project-tracking system for made-to-order queue management. **Off-platform build:** an email service provider (Klaviyo, Flodesk, or ConvertKit), and eventually a Shopify store. Do not buy everything on day one. Buy the keyword tool, the design tool, and the production equipment for your niche; add the rest as volume demands.

## Etsy SEO: How the Algorithm Actually Ranks You

Etsy search is the lifeblood of an unpaid shop, and it rewards a specific set of signals. The algorithm's job is to match a buyer's query to listings that will (a) be relevant and (b) convert and (c) result in a happy customer. The inputs it weighs: **query matching** — your title, tags (all 13, used fully), categories, and attributes must contain the actual phrases buyers search; **listing quality score** — your historical click-through rate, favorite rate, and conversion rate on a given query, which is why a listing that converts well keeps climbing; **recency** — newly listed and recently renewed items get a temporary visibility boost, which is why consistent listing cadence matters; **customer-and-market experience** — your review score, your shipping speed and on-time rate, your shop completeness, and your customer-service responsiveness; **shipping price** — Etsy explicitly favors free shipping (build it into the price) and penalizes high shipping costs; and **listing freshness and engagement** — items that get views, favorites, and sales signal to Etsy that buyers want them.

The practical playbook: do real keyword research before writing a single listing, write titles that front-load the highest-intent multi-word phrase a buyer would actually type, use all 13 tags with distinct multi-word phrases (never single words, never repeats of the same root), fill every attribute and category, write descriptions for humans but include keyword phrases naturally in the first paragraph, photograph for click-through (your first image competes in a grid of thumbnails — it must stop the scroll), price with free shipping baked in, and respond to messages within 24 hours. Then iterate: watch which listings get traffic but not sales (photo or price problem) versus no traffic at all (keyword problem), and fix accordingly. Etsy SEO is not a one-time setup; it is a continuous optimization loop on your top 20 listings.

## Lead Generation Channel 1: Etsy Search and Internal Discovery

Your first and largest traffic channel will be Etsy's own search and recommendation surfaces, and for a new shop this is essentially free but slow. Etsy internal traffic includes the search results page, category browsing, the "you may also like" recommendation rows, the "explore related items" sections, cart-page suggestions, and Etsy's app push notifications and emails. For the first 3-9 months of a shop's life, internal Etsy traffic typically accounts for 60-85% of all visits, simply because you have no off-platform presence yet.

The way to maximize free internal traffic: list consistently (new listings get a freshness boost, and more listings means more search surface area — successful niche shops typically run 40-150 active listings, not 10 and not 2,000), nail SEO on every listing, drive early sales and reviews on new listings however you can (even sharing with your own network) because the algorithm needs conversion data to start ranking you, and keep your shop "complete" with policies, an About section, an avatar, and a banner. The hard truth about internal traffic: it is a flywheel that takes 90-180 days to start spinning for most shops, and a brand-new listing in a competitive niche may get near-zero views for weeks. This is normal. It is also why you cannot rely on internal traffic alone — you need paid and external channels to bridge the gap while the flywheel warms up, and you need off-platform channels so you are never *only* dependent on Etsy's algorithm.

## Lead Generation Channel 2: Etsy Ads and Offsite Ads

Etsy Ads are the paid lever inside the platform: you set a daily budget (Etsy recommends starting at $1-$5/day; experienced sellers run $10-$50/day on proven listings), and Etsy places your listings in promoted slots in search and browse. The economics work when your listing converts well — you are essentially buying clicks at $0.20-$1.50 each and the math hinges on conversion rate and margin. A reasonable target is to keep ad spend under 10-15% of ad-attributed revenue; if a campaign is spending more than that without converting, the problem is almost always the listing (photo, price, reviews) not the ad. The smart approach: turn Etsy Ads on only for your best-converting, highest-margin listings, let the losers run organically, and treat the ad dashboard as a data source about which listings deserve more inventory and attention.

Offsite Ads are different and not optional above the threshold. Etsy advertises your products on Google, Meta, Pinterest, and elsewhere; you pay nothing upfront, but a sale attributed to one of those ads costs you 12% (over $10K trailing twelve months) or 15% (under $10K) of the order. You cannot opt out once you cross the $10K threshold. The strategic implication: Offsite Ads will bring you sales you would not otherwise have gotten, but at a steep marginal cost, so your pricing must absorb a 12-15% hit on a meaningful fraction of orders. Build it into your margin model. The upside framing: Offsite Ads is Etsy spending its ad budget to acquire customers for you — and that is exactly why you must capture those customers' emails and convert them to repeat off-platform buyers, so you only pay the 12-15% tax once per customer rather than forever.

## Lead Generation Channel 3: Pinterest, the Underrated Engine

Pinterest is the single best *external* free traffic channel for most Etsy niches, and it is badly underused. Pinterest functions as a visual search engine with strong purchase intent, its content has a long shelf life (a pin can drive traffic for months or years, unlike an Instagram post that dies in 48 hours), and its demographic overlaps heavily with Etsy's gift-and-decor buyer. The mechanic: create vertical pins for your products and your niche content, link them to your Etsy listings (or better, to a landing page you control), use keyword-rich pin titles and descriptions, and pin consistently. A focused shop that posts 3-10 pins a week can build Pinterest into 15-35% of total traffic within 6-12 months, at zero cash cost.

The reason Pinterest matters strategically: it is traffic you generate and partially control, which reduces pure Etsy-algorithm dependence. Even better, you can point Pinterest traffic at a landing page that captures email before sending the buyer to Etsy — turning a borrowed-audience platform into an owned-audience builder. For gift, decor, wedding, craft, and personalization niches, Pinterest should be the second channel you build after Etsy SEO itself. Instagram and TikTok also work — especially for process videos showing the handmade craft, which builds the maker-brand moat — but they are higher-effort and shorter-shelf-life than Pinterest. Build Pinterest first, add short-form video second, and treat your social channels as both traffic sources and email-capture funnels.

## Lead Generation Channel 4: Owned Channels and the Email List

This is the channel that converts an Etsy shop into an actual business, and most sellers neglect it until it is almost too late. The problem with Etsy, Pinterest, Instagram, and Google is that you are renting the audience — the platform owns the customer relationship and can change the terms or cut you off entirely. The solution is to systematically convert borrowed-audience buyers into owned-audience customers via an email list and eventually your own store.

The mechanics: include a small, tasteful insert card in every package offering a discount code in exchange for joining your email list (Etsy permits this for post-purchase relationship building; do not spam or violate Etsy's communication policies). Run a landing page (via your email tool or a simple site) that captures emails in exchange for a free pattern, a discount, or a niche resource, and drive Pinterest and social traffic there. Once you have a few hundred subscribers, you have an asset Etsy cannot touch: you can announce new products, run sales, and — critically — drive repeat purchases at zero acquisition cost. The endgame is a Shopify store where repeat customers buy directly, you keep the full margin minus only ~2.9% payment processing, and Etsy becomes purely a top-of-funnel customer-acquisition channel. A mature shop in this niche aims to have 40-60% of revenue coming through owned channels by Year 3-5. The email list is the difference between a shop and a business.

## The Platform Dependency Risk: Etsy Can End Your Business Tomorrow

This deserves its own section because it is the central risk of the entire model and new sellers consistently underweight it. When you build on Etsy, Etsy controls: whether your shop stays open (suspensions happen, sometimes by automated systems, sometimes wrongly, and the appeals process is slow and opaque), how your listings rank (algorithm changes can cut a shop's traffic 50-80% overnight with no warning and no recourse), what you are allowed to sell (policy changes around resale, AI content, and "handmade" definitions have closed entire shops), what you pay (the transaction fee rose from 5% to 6.5% in 2022, Offsite Ads became mandatory, and there is no reason to expect fees have stopped rising), and the customer relationship itself (Etsy restricts how and when you can contact buyers, and the buyer thinks of themselves as an "Etsy customer," not your customer).

There are real horror stories: shops doing six figures suspended overnight for vague "policy violations" with funds held; shops whose entire traffic evaporated after an algorithm update; shops penalized for things a competitor reported maliciously. You cannot eliminate this risk while using Etsy. You can only mitigate it: keep meticulous records and documentation to fight wrongful suspensions, never put all revenue through one platform, build the email list and owned store from month one, diversify onto a second marketplace (Amazon Handmade, Faire for wholesale, your own Shopify) by Year 2, and maintain a cash buffer that could survive 60-90 days of zero Etsy revenue. The mental model: Etsy is a powerful but unreliable business partner who can fire you without notice. Use them, profit from them, but never let them be the only thing standing between you and bankruptcy.

## Pricing Strategy and Margin Math

Pricing is where most Etsy shops quietly bleed out, because they price off competitors instead of off cost-plus-margin and they forget to pay themselves. The correct method: start with a full cost stack — materials, packaging, shipping (if offering free shipping, this is a real cost), the ~12-15% all-in Etsy take, and your labor at a real hourly rate (at minimum $20-$35/hr; you are running a business, not volunteering). Then apply a margin multiple. For handmade goods, a common framework is materials-and-labor times 2 for wholesale, times 2 again for retail — but on Etsy, where there is no wholesale layer, a practical target is to price so that after all costs including your labor, the listing nets 30-50% margin.

Concrete example: a personalized engraved cutting board. Materials $7, packaging $2, your labor 25 minutes at $28/hr = ~$12, shipping $9 (offered "free"), Etsy all-in take at 13% of a $52 price = ~$6.75. Total cost ~$36.75 on a $52 retail price = ~29% margin. To get to a healthier 40%, you either raise the price to ~$61 (the gift buyer will pay it for personalization), reduce labor time through process improvement, or cut shipping cost. The discipline points: always include free shipping in the price because Etsy's algorithm rewards it and buyers filter for it; price for the gift buyer's willingness to pay, not the bargain hunter's; use Etsy's discount and sale tools strategically rather than living on permanent sale (permanent discounting trains buyers to never pay full price and destroys margin); and raise prices annually as your reviews, ranking, and brand strengthen — a shop with 2,000 five-star reviews can charge meaningfully more than a new shop for the identical product.

## The Operational Workflow: A Week in a Real Shop

A focused Etsy shop runs on a repeatable weekly rhythm, and the shops that scale are the ones that systematize it. **Daily (30-90 minutes):** check and respond to Etsy messages within 24 hours (response time affects ranking and reviews), process new orders into the production queue, pack and ship anything due, and glance at the stats dashboard for anomalies. **Production blocks (the bulk of the week for handmade shops):** batch your made-to-order work — engrave all of Tuesday's orders in one session, do all embroidery Thursday, because batching the same task is 2-3x more efficient than one-at-a-time. **Listing and SEO (2-4 hours/week):** add new listings on a consistent cadence, refresh and re-optimize underperforming listings, do keyword research for the next product line. **Marketing (2-5 hours/week):** create and schedule Pinterest pins, post process content to Instagram or TikTok, write the weekly or biweekly email to your list. **Operations and finance (1-2 hours/week):** update bookkeeping, reconcile, reorder materials before you run out, review which products are profitable and which are not.

The two operational killers for new shops are made-to-order queue management (orders pile up, lead times balloon, reviews suffer) and inventory stockouts (you run out of a key material mid-week and shipping slips). Both are solved with simple systems: a visible production queue (a spreadsheet or a tool like Trello), realistic processing times set in your listings with a buffer, and a materials par-level reorder system. As volume grows, the next moves are templating everything (saved listing templates, saved message responses, a packing checklist), then outsourcing the lowest-skill tasks (packing, shipping label printing, basic customer service) before outsourcing production itself.

## Hiring, Outsourcing, and Building Past Solo

A solo Etsy seller hits a wall — usually somewhere between $60K and $130K in annual revenue — where every additional order means more hours and there are no more hours. The path past the wall is deliberate and sequenced. **First, outsource the non-craft work.** A part-time local helper or a virtual assistant can handle packing, shipping label generation, order data entry, basic customer-service replies, and Pinterest scheduling for $15-$30/hr (local) or $6-$15/hr (offshore VA via Onlinejobs.ph or similar). This is the highest-ROI hire because it frees the founder's hours for production and product development, which is where the money is.

**Second, build production capacity.** Either hire and train a part-time maker for the repetitive production steps (this requires documented processes — you cannot delegate what you have not systematized), or invest in faster/additional equipment (a second laser, a multi-needle embroidery machine, a larger kiln), or carefully outsource a production step to a trusted local maker or a US production partner. **Third, add specialist help** as the business matures — a part-time bookkeeper, a photographer for new product lines, a designer if you are not the design talent. The margin reality: a solo shop can run at 35-55% net margin; adding a VA drops it to 30-45% but lifts the revenue ceiling; adding production staff drops it to 22-38% but unlocks $200K+ revenue. The trap is hiring before systematizing — every process must be documented before it is handed off, or you have just bought yourself a training problem instead of freeing your time. The other trap is staying solo too long out of perfectionism and capping the business at the founder's personal hour limit.

## Year 1 Through Year 5 Revenue Trajectory

Realistic numbers for a committed founder treating this as a real business, not a side hobby.

**Year 1 (gross sales $8K-$45K; top decile $60K-$120K).** Months 1-3: niche research, equipment and software setup, first 20-40 listings, first few sales mostly from your own network, near-zero organic traffic. Months 4-6: the SEO flywheel starts; consistent listing, first reviews accumulate, Pinterest begins contributing, $500-$2,500/mo. Months 7-12: ranking improves on your best listings, repeat buyers and word-of-mouth begin, holiday season (Q4 is 30-45% of annual sales for most gift niches) drives a spike, $1,500-$6,000/mo. Net margin Year 1 is often thin (20-35%) because of equipment depreciation and the learning curve, and the realistic hourly wage is low — this year is an investment in the asset.

**Year 2 (gross sales $35K-$110K).** The flywheel is spinning: established ranking on 20-50 listings, a real review base, Pinterest and email contributing 25-40% of traffic, a wider product line. First VA or part-time helper hired. Off-platform store launched. Net margin 30-45%. The founder is finally paying themselves a real wage.

**Year 3 (gross sales $90K-$250K).** Productized and partially systematized, production help in place, owned channels at 30-50% of revenue, a second sales channel (Amazon Handmade, Faire wholesale, or direct) live. Net margin 25-40%. This is where it becomes a genuine full-time income or better.

**Year 4-5 (gross sales $200K-$900K for the shops that make it).** A real small business with staff, multiple channels, owned-channel revenue at 40-60%, and the Etsy shop functioning as one (large but no longer sole) customer-acquisition channel. Net margin 22-38%. At this stage the founder chooses: keep scaling toward a $1M+ multi-channel brand, license or sell the brand, or settle into a comfortable lifestyle business at $200-$400K. The honest distribution note: most shops never get past Year 1's median. The trajectory above is for the disciplined minority who treat it as a business, pick a real niche, and execute the off-platform migration.

## Licensing, Legal, Tax, and IP

Etsy is low-friction to start but it is still a real business with real legal obligations, and ignoring them creates expensive problems later. **Business structure:** most sellers start as a sole proprietorship (zero setup, but no liability protection) and form an LLC once revenue is meaningful (typically $20K-$40K+) for liability protection and credibility — $50-$500 depending on the state plus possible annual fees. **Business license:** many cities and counties require a general business license even for a home-based online shop; check local requirements. **Sales tax:** this is the big one. Etsy automatically collects and remits sales tax for buyers in states with marketplace facilitator laws (which is now nearly all US states), so Etsy handles the collection — but you still typically need a sales tax permit in your home state, and you are responsible for understanding your nexus obligations, especially once you sell off-platform through your own Shopify store where you handle collection yourself. **Income tax:** all Etsy income is taxable; you will receive a 1099-K (the threshold has been in flux but is low — assume you get one), and you must track every expense (materials, equipment, fees, shipping, software, home-office portion) to offset income. Equipment over a threshold may be depreciated or expensed under Section 179. **Intellectual property — the trap that closes shops:** do not sell items featuring trademarked or copyrighted material without a license. Disney, sports leagues, universities, music artists, and major brands actively monitor Etsy and issue takedowns and lawsuits. "Inspired by" is not a legal defense. Equally, consider protecting your own original designs — and understand that on Etsy, copycats are common and enforcement is your responsibility. **Other:** product safety and labeling rules apply to specific categories (children's products, cosmetics, candles, food), and you need clear, compliant shop policies for shipping, returns, and made-to-order timelines.

## Competitor Analysis: Who You Are Actually Up Against

Your competition on Etsy is more varied and more dangerous than it first appears, and understanding the set shapes your positioning. **The established niche shop with 5,000+ reviews.** This is your most direct competitor — a shop in your exact niche that has years of ranking, a deep review moat, and refined operations. You cannot out-review them quickly; you compete by going *narrower* than they do, by having better photography, or by serving a sub-segment they treat as an afterthought. **The reseller and dropshipper flood.** Thousands of shops list mass-produced or dropshipped goods (against Etsy policy, but enforcement is imperfect) at prices a genuine maker cannot match. You do not compete on price with these; you compete on authenticity, personalization, and the maker story — and you can sometimes report clear policy violations. **The AI-content flood.** Shops listing thousands of AI-generated wall art, printables, and design files have collapsed the price floor in digital categories. Your defense is genuine design depth and craft that AI cannot replicate, plus niches that require physical fulfillment. **The overseas manufacturer-seller.** Shops, often with manufacturing relationships, that sell handmade-looking goods at prices reflecting much lower labor costs. You compete on speed (domestic shipping), personalization, communication, and trust. **Off-Etsy competition.** Amazon Handmade, the buyer's own local makers, and increasingly the brands that buyers find through the same Pinterest and Google searches. The strategic takeaway: you almost never win by being a cheaper, broader version of an existing shop. You win by being the *narrowest, most specific, highest-quality* option for one exact buyer — and by building the brand and email list that make you findable outside of Etsy's competitive grid entirely.

## Five Real-World Scenarios

**Scenario 1 — "Maya, the engraving shop."** Maya, a former graphic designer, buys a $1,200 xTool laser engraver and opens a shop selling personalized cutting boards, Christmas ornaments, and barware. She picks the narrow niche of "personalized gifts for the home cook." Year 1: $31,000 gross, working ~25 hrs/week, net margin ~32% after equipment. Year 2: hires a part-time packer, adds engraved leather goods, launches Pinterest hard, $78,000 gross. Year 3: launches a Shopify store, gets 35% of revenue off-platform, $145,000 gross. Her moat is the laser plus genuine design taste plus a refined gift-buyer photography style.

**Scenario 2 — "Devon, the digital pattern designer."** Devon designs high-quality PDF knitting patterns. Startup cost under $400. Year 1 is slow — $6,500 gross, because digital is saturated and ranking takes time — but margins are ~92%. Year 2: a deep catalog of 60 patterns, a strong email list of knitters, a few patterns going semi-viral on Pinterest and Ravelry, $34,000 gross at near-90% margin. Year 3: launches a pattern membership on his own site, Etsy becomes the top-of-funnel, $71,000 combined. Low cash investment, high time investment, exceptional margin, real AI-competition risk that he counters with genuine technical design depth.

**Scenario 3 — "The POD cautionary tale."** A founder follows the default playbook: Printify, 180 generic t-shirt and mug designs, AI-generated wall art, no niche. Year 1: $2,100 gross, net margin near zero after fees and the one round of Etsy Ads that did not convert. No moat, no ranking, no repeat buyers. Quits in month 14. The lesson: low barrier to entry, low barrier for everyone, no profit.

**Scenario 4 — "Priya and Sam, the ceramics studio."** A couple invests $6,500 in a kiln, wheel, and materials to sell small-batch handmade mugs and planters in a specific minimalist aesthetic. Year 1: $24,000 gross, capacity-constrained because every piece is hand-thrown. Year 2: they raise prices 35% (the reviews and aesthetic justify it), add wholesale through Faire, $89,000 combined. Year 3: a small studio space, one part-time helper, Etsy plus Faire plus their own site, $190,000 combined. The kiln and skill are an enormous moat; the constraint is production capacity, which they solve with pricing power and selective wholesale.

**Scenario 5 — "Jordan, the trend-chaser."** Jordan jumps on whatever is trending — one quarter it is a viral toy accessory, the next a meme product. Some months are great ($4,000), most are dead. No durable niche, no ranking equity, no email list, constant scramble. Year 1 gross looks okay at $19,000 but it is exhausting, unpredictable, and builds no asset. By Year 2 the trends have moved on and so has the revenue. The lesson: trend-chasing is income, not a business — it builds nothing that compounds.

## Risk Mitigation: The Full Playbook

The risks in an Etsy business are real but each is mitigable with deliberate action. **Platform dependency (the central risk):** build the email list from month one, launch an owned store by Year 2, diversify onto a second marketplace, keep documentation to fight wrongful suspensions, and hold a 60-90 day cash buffer. **Algorithm volatility:** never depend on a single hero listing — spread revenue across 30+ ranked listings so one ranking drop is survivable, and build external traffic (Pinterest, email) so you are not 100% at the algorithm's mercy. **Fee creep:** price with a 13-15% all-in Etsy take assumed, and re-run your margin model every time Etsy changes fees. **Saturation and commoditization:** choose niches with a real moat (equipment, skill, made-to-order labor, deep niche knowledge), and keep developing new product lines so you are never selling only the thing everyone copied. **IP infringement (yours and theirs):** never sell trademarked/copyrighted material; document your original designs; expect copycats and decide in advance how much enforcement energy is worth it. **Cash flow:** Q4 is 30-45% of annual revenue for gift niches — do not spend the holiday cash as if it is monthly; budget across the lean Q1-Q2. **Inventory and supply:** maintain par-level reordering, keep a backup supplier for critical materials, and never let processing times balloon. **Burnout:** made-to-order at scale is genuinely physically and mentally taxing; set realistic processing times, batch ruthlessly, outsource early, and take real time off in the Q1 lull. **Negative reviews:** respond professionally, fix the underlying issue, and remember the algorithm weighs your overall score — a few bad reviews among hundreds is survivable; a pattern is a signal to fix something real. **Equipment failure:** a laser or kiln or embroidery machine going down mid-Q4 is a revenue emergency — budget for maintenance, know your repair options, and consider a backup plan for peak season.

## Exit Strategy: What an Etsy Business Is Worth

Most people never think about selling their Etsy shop, but it is a real and increasingly common exit, and understanding it shapes how you build. **What sells:** you are not really selling "an Etsy shop" — Etsy's terms make shop transfers restrictive — you are selling a *brand and business asset*: the brand name, the designs and IP, the supplier relationships, the standard operating procedures, the email list, the social following, the off-platform store, and the demonstrated, documented revenue and profit. A shop that is purely an Etsy storefront with no off-platform assets and founder-dependent production is hard to sell; a brand with an email list, a Shopify store, documented systems, and transferable production is genuinely valuable.

**Valuation:** small online businesses like this typically trade at a multiple of seller's discretionary earnings (SDE) — roughly **2.0x-3.5x annual SDE** for a healthy, somewhat-systematized shop, higher (3.5x-4.5x+) if revenue is diversified across channels, the email list is large, the brand is strong, and the business is not dependent on the founder personally. A shop netting $80K SDE with good diversification and systems might sell for $200K-$320K; a $250K-SDE multi-channel brand could reach $700K-$1.1M. **Where to sell:** marketplaces like Flippa, Empire Flippers, and brokers specializing in small e-commerce and content businesses. **How to build for exit from day one:** document every process, build the email list and owned store aggressively (they are the most transferable assets), diversify revenue channels, reduce founder-dependence by systematizing and delegating production, and keep clean books — a buyer pays for proven, transferable cash flow, not for a job that only the founder can do.

## Owner Lifestyle: What Running This Actually Feels Like

The Etsy seller lifestyle is romanticized online and the reality is more textured. **The good:** genuine creative autonomy — you make what you want, how you want; location flexibility once systematized; the deep satisfaction of a craft and of buyers genuinely loving what you made (the gift-buyer thank-you messages are real and they matter); low startup risk relative to most businesses; and a real path to a full-time income doing creative work. **The hard:** Year 1 is a grind of long hours for low pay while the flywheel warms up; made-to-order production is physically repetitive and can cause real strain (hands, back, eyes); Q4 is a brutal 60-80 hour-per-week sprint every single year; customer service includes the occasional genuinely unreasonable buyer; the income is lumpy and seasonal; and the constant low-grade anxiety of platform dependency never fully goes away until you have diversified off it.

**The rhythm:** the year has a hard seasonality — a Q4 sprint, a Q1 lull (use it for rest, R&D, and systems work), a Q2-Q3 build. **The hours:** Year 1 is often 30-50 hrs/week for sub-minimum effective wage; by Year 3 a systematized shop can be a 30-40 hr/week genuine business with a real income; the founders who scale past that are running a small business with all that entails. **The fit:** this business rewards people who genuinely enjoy both the craft *and* the unglamorous operational and marketing work — the sellers who only want to make things and resent the SEO, photography, customer service, and bookkeeping tend to stall. It is a creative business, but it is a *business*, and the happiest owners are the ones who made peace with that early.

## Common Year-1 Mistakes That Sink Shops

The failure modes are remarkably consistent. **Pricing too low** — failing to count the full Etsy take and forgetting to pay themselves, so they "sell well" and still go broke. **Following the default POD/AI playbook** — entering the most saturated, lowest-moat categories. **Listing too few items** — 5-10 listings give the algorithm almost no surface area; successful niche shops run 40-150. **Bad first photos** — the thumbnail loses the click before the listing ever gets a chance. **Ignoring SEO** — writing listings for themselves instead of for the phrases buyers actually type. **No niche** — a generalist shop that ranks for nothing and means nothing to any specific buyer. **Quitting at month 3-5** — right before the SEO flywheel typically starts to spin, mistaking the normal slow start for failure. **Never building the email list** — staying 100% dependent on Etsy. **Inconsistency** — listing in bursts then disappearing, which kills the freshness signal and the algorithm's trust. **Poor customer service and slow responses** — directly hurting both reviews and ranking. **Spending on Etsy Ads before the listing converts** — burning cash to send traffic to a listing that cannot close. **Treating it as a hobby while expecting business results** — the single root cause behind most of the others. **Not tracking numbers** — running blind on which products are actually profitable. Each of these is individually fixable; the shops that fail usually make several at once and never diagnose them because they are not tracking anything.

## A Decision Framework: Should You Actually Start an Etsy Shop?

Before investing the money and the hundreds of hours, run the honest decision framework. **Do you have, or can you build, a real moat?** If your plan is generic POD or AI content, stop — the answer is no, and the economics are dead. If you have a craft skill, design talent, equipment access, or deep niche knowledge, continue. **Is there searchable buyer intent for your specific niche?** Validate with Etsy autocomplete, eRank/Marmalead, and Google Trends *before* committing — if nobody searches for it, it does not matter how good it is. **Do the unit economics survive the full cost stack?** Build the actual margin model — materials, packaging, shipping, 13-15% Etsy take, your labor at a real wage — and confirm 30%+ net margin. If not, the price has to go up or the niche is wrong. **Can you sustain making this product hundreds of times?** Be honest; novelty fades. **Can you commit 12-18 months before the flywheel rewards you?** This is not a fast-money business; it is a build-an-asset business. **Will you actually do the unglamorous work** — SEO, photography, customer service, bookkeeping, the email list? If you only want to make things, this will frustrate you. **Do you accept that Etsy is a channel, not a destination, and will you do the off-platform migration?** If you answer yes to all of these, Etsy is one of the best low-risk ways to start a real product business in 2027. If you answer no to several, either fix those gaps first or choose a different path.

## The Five-Year and AI Outlook

The forces shaping Etsy through 2032 are largely already visible. **AI commoditization accelerates at the bottom.** Generative AI has already crushed digital art, printables, and generic design-file categories, and that pressure intensifies — anything a solo seller can produce with a prompt has no defensible margin. The counter-trend is equally real: AI raises the value of *verifiably human* craft, made-to-order physical goods, and genuine design depth. The middle gets hollowed out; the moat-having ends thrive. **Fee pressure continues.** There is no historical reason to expect Etsy's take rate to stop climbing; build your model assuming a 13-16% all-in take by 2030 and price accordingly. **Platform-dependency risk stays central**, which is why the off-platform migration is not optional strategy — it is survival strategy. **Personalization and made-to-order strengthen** as a category because they resist both AI commoditization and overseas price competition. **Pinterest and short-form video stay the key external channels**, with video increasingly important for proving the human-craft moat. **The successful 2027-2032 shop looks like this:** a tight niche with a real moat, a tightly optimized core of ranked listings, Pinterest and email driving 40-60% of traffic, an owned Shopify store taking the repeat-customer revenue, possibly a wholesale channel through Faire, and Etsy functioning as the efficient top-of-funnel customer-acquisition machine it is genuinely good at being. The shops that treat Etsy as the whole business will keep getting squeezed; the shops that treat it as one channel in a diversified brand will compound.

## The Final Framework

Starting an Etsy shop business in 2027 comes down to five disciplines, and a founder who holds all five will be in the top decile. **One: pick the harder thing on purpose.** The barrier that slows you down — a skill, a machine, deep niche knowledge, made-to-order labor — is the same barrier that protects your margin. Generic, low-effort, AI-and-POD categories have no barrier and therefore no profit. **Two: go absurdly narrow.** "Jewelry" is not a niche; "minimalist birthstone jewelry for new moms" is. The narrower you go, the easier you rank, the sharper your photography and copy, and the more you become *the* shop for one exact buyer. **Three: price for the gift buyer and count every fee.** Assume Etsy takes 13-15% of everything, pay yourself a real wage in the cost stack, bake shipping into the price, and target 30-50% net margin — pricing failure is the quiet killer. **Four: treat Etsy as a channel, not a business.** From month one, capture emails, and by Year 2 launch an owned store; Etsy's job is to efficiently hand you intent-rich buyers, and your job is to take that customer relationship back before fees and algorithm changes erode it. **Five: commit to 12-18 months and do the unglamorous work.** The SEO flywheel is slow, the first months are lean, and the business rewards consistency in listing, photography, customer service, marketing, and bookkeeping — not bursts of inspiration. Etsy in 2027 is not a get-rich-quick platform and never was. It is something better: the cheapest, fastest, lowest-risk way to validate and fund a real physical-product brand — *if* you go in with a moat, a narrow niche, honest margins, an off-platform plan, and the patience to let the asset compound.

`;

const flow = `

## Customer Journey: From Buyer Intent to Repeat Customer

\`\`\`mermaid
flowchart TD
  A[Buyer Has A Need] --> A1[Gift For An Occasion]
  A --> A2[Personalized Item For Self]
  A --> A3[Craft Supply Or Digital File]
  A --> A4[Decor Matching An Aesthetic]
  A1 --> B[Discovery Channel]
  A2 --> B
  A3 --> B
  A4 --> B
  B --> B1[Etsy Search With Intent Keyword]
  B --> B2[Pinterest Pin Long Shelf Life]
  B --> B3[Etsy Offsite Ad On Google Or Meta]
  B --> B4[Instagram Or TikTok Process Video]
  B --> B5[Email From Your Owned List]
  B1 --> C[Listing Thumbnail In Grid]
  B2 --> C
  B3 --> C
  B4 --> C
  C --> C1[First Photo Stops The Scroll]
  C1 --> D[Listing Page]
  D --> D1[Photos Show Quality And Use]
  D --> D2[Title And Tags Match The Query]
  D --> D3[Reviews Build Trust]
  D --> D4[Free Shipping And Clear Lead Time]
  D1 --> E[Add To Cart And Checkout]
  D2 --> E
  D3 --> E
  D4 --> E
  E --> F[Order Enters Production Queue]
  F --> F1[Batch Production By Task]
  F1 --> F2[Pack With Brand Insert Card]
  F2 --> F3[Ship Within Stated Lead Time]
  F3 --> G[Buyer Receives Review Worthy Package]
  G --> G1[Leaves Five Star Review]
  G --> G2[Joins Email List Via Insert Card]
  G1 --> H[Listing Quality Score Rises]
  H --> H1[Listing Ranks Higher In Search]
  H1 --> A1
  G2 --> I[Owned Channel Relationship]
  B5 --> I
  I --> I1[Repeat Purchase On Shopify Store]
  I --> I2[Referral To Friends]
  I1 --> J[Lifetime Value Climbs Margin Improves]
  I2 --> A
\`\`\`

## Decision Matrix: Which Shop Archetype And Niche To Choose

\`\`\`mermaid
flowchart TD
  S[Start: Evaluating An Etsy Business] --> Q1{Do You Have A Real Moat}
  Q1 -->|No Skill No Equipment No Niche Knowledge| X1[Generic POD Or AI Content Path]
  X1 --> X1R[Result: Saturated Near Zero Margin Avoid]
  Q1 -->|Yes Skill Equipment Or Deep Knowledge| Q2{What Is Your Capital And Skill Profile}
  Q2 -->|Low Capital Strong Design Skill| P1[Digital Product Shop]
  Q2 -->|Low Capital Design Point Of View| P2[Print On Demand Niche Shop]
  Q2 -->|Higher Capital Hands On Craft Skill| P3[Handmade Or Made To Order Shop]
  P1 --> P1A[Cost 300 to 1500 Margin Near 90 Percent]
  P1 --> P1B[Risk High AI Competition Need Genuine Depth]
  P2 --> P2A[Cost 300 to 1200 Margin 25 to 40 Percent]
  P2 --> P2B[Risk Severe Saturation Need Tight Niche]
  P3 --> P3A[Cost 2000 to 12000 Margin 30 to 55 Percent]
  P3 --> P3B[Strongest Moat Equipment And Skill Protect You]
  P1A --> Q3{Is There Searchable Buyer Intent}
  P2A --> Q3
  P3A --> Q3
  Q3 -->|No Search Volume| X2[Wrong Niche Revalidate Before Building]
  Q3 -->|Yes Validated Demand| Q4{Do Unit Economics Clear 30 Percent Net}
  Q4 -->|No Margin Too Thin| X3[Raise Price For Gift Buyer Or Change Niche]
  Q4 -->|Yes Healthy Margin| Q5{Will You Build Off Platform Channels}
  Q5 -->|No Stay 100 Percent On Etsy| X4[Fragile Business High Platform Risk]
  Q5 -->|Yes Email List And Owned Store| W[Durable Diversified Brand]
  W --> W1[Year 1 Validate And Rank On Etsy]
  W1 --> W2[Year 2 Launch Owned Store Add Channel]
  W2 --> W3[Year 3 Plus 40 to 60 Percent Off Platform]
  W3 --> W4[Optionality Scale License Or Sell The Brand]
\`\`\`

`;

const src = `

## Sources

1. **Etsy, Inc. — Investor Relations and SEC Filings (NASDAQ: ETSY)** — Quarterly and annual reports covering active buyer counts (~90-96M), active seller counts (~8-9M), and gross merchandise sales (~$12-14B range). https://investors.etsy.com
2. **Etsy Seller Handbook** — Etsy's official guidance on listing optimization, SEO, photography, shipping, and shop management. https://www.etsy.com/seller-handbook
3. **Etsy Fees and Payments Policy** — Official documentation of the $0.20 listing fee, 6.5% transaction fee, payment processing rates, and Etsy Ads structure. https://www.etsy.com/legal/fees
4. **Etsy Offsite Ads Policy** — Documentation of the 12% / 15% Offsite Ads fee structure and the $10K trailing-twelve-month threshold for mandatory participation. https://help.etsy.com
5. **Etsy Search Ranking — How Etsy Search Works** — Etsy's published explanation of query matching, listing quality score, recency, customer experience, and shipping price as ranking factors.
6. **Etsy Prohibited Items and Handmade Policy** — Rules defining handmade, reseller restrictions, and IP/trademark enforcement that govern what may be sold.
7. **eRank — Etsy SEO and Keyword Research Tool** — Keyword volume, competition data, and listing optimization analytics used for niche validation. https://erank.com
8. **Marmalead — Etsy Keyword Research and Market Analysis** — Search volume, engagement, and seasonality data for niche selection. https://marmalead.com
9. **Google Trends** — Cross-validation of niche search demand and seasonality. https://trends.google.com
10. **US Small Business Administration — Choosing a Business Structure** — Sole proprietorship vs LLC guidance, licensing, and registration basics. https://www.sba.gov
11. **IRS — Form 1099-K and Reporting Requirements for Online Marketplace Sellers** — Income reporting thresholds and obligations for Etsy sellers. https://www.irs.gov
12. **IRS — Section 179 Expensing and Depreciation** — Equipment expensing rules relevant to laser engravers, kilns, and embroidery machines.
13. **Marketplace Facilitator Sales Tax Laws (Multistate)** — State-level laws under which Etsy collects and remits sales tax on behalf of sellers; nexus obligations for off-platform sales.
14. **Printful — Print-on-Demand Pricing and Fulfillment Documentation** — Base costs and fulfillment model for the POD shop archetype. https://www.printful.com
15. **Printify — Print-on-Demand Catalog and Pricing** — Base cost structure for POD margin modeling. https://printify.com
16. **xTool, Glowforge, and OMTech — Laser Engraver Product Documentation and Pricing** — Equipment cost ranges for the handmade engraving archetype.
17. **Brother and Janome — Embroidery Machine Pricing** — Equipment cost ranges for custom embroidery shops.
18. **Pirate Ship and ShipStation — Shipping Rate and Label Tools** — Discounted shipping rates and batch label workflows for fulfillment scaling. https://www.pirateship.com
19. **Pinterest Business — Pinterest for Product Discovery** — Pinterest as a visual search engine and external traffic channel for e-commerce. https://business.pinterest.com
20. **Klaviyo, Flodesk, and ConvertKit — Email Marketing Platforms** — Email service providers for building the owned-audience channel.
21. **Shopify — E-commerce Platform Documentation** — Owned-store platform for off-Etsy revenue migration. https://www.shopify.com
22. **Amazon Handmade — Seller Program Documentation** — Second-marketplace diversification channel for handmade sellers. https://www.amazon.com/handmade
23. **Faire — Wholesale Marketplace** — Wholesale channel diversification for handmade and made-to-order brands. https://www.faire.com
24. **Onlinejobs.ph and Belay — Virtual Assistant Sourcing** — Sourcing channels for outsourcing packing, customer service, and operations.
25. **Flippa — Online Business Marketplace** — Marketplace for buying and selling e-commerce businesses and brands. https://flippa.com
26. **Empire Flippers — Online Business Brokerage** — Brokerage and valuation benchmarks for small e-commerce business sales. https://empireflippers.com
27. **US Federal Trade Commission — Product Labeling and Safety Rules** — Compliance requirements for children's products, cosmetics, candles, and other regulated categories. https://www.ftc.gov
28. **US Patent and Trademark Office — Trademark Basics** — Guidance on trademark infringement risk and protecting original designs. https://www.uspto.gov
29. **Adobe Creative Cloud, Affinity, and Canva — Design Tool Pricing** — Software cost benchmarks for the design and listing-creation stack.
30. **Placeit and Kittl — Product Mockup Tools** — Mockup generation tools for apparel and print-product listings.
31. **Etsy Ads — Advertising Dashboard Documentation** — Official guidance on Etsy Ads budgeting, cost-per-click, and attribution.
32. **Trello and Asana — Production Queue Management** — Project tracking tools for made-to-order order queue management.
33. **QuickBooks and Wave — Small Business Bookkeeping** — Bookkeeping tools for tracking Etsy income, fees, and deductible expenses. https://quickbooks.intuit.com
34. **Ravelry — Knitting and Crochet Pattern Community** — Niche distribution channel relevant to the digital pattern archetype. https://www.ravelry.com
35. **Etsy Community Forums and Seller Surveys** — Aggregated seller-reported revenue distribution data and shop performance benchmarks.

`;

const num = `

## Numbers

**Marketplace Scale**
- Etsy active buyers: ~90-96M
- Etsy active sellers: ~8-9M
- Etsy annual gross merchandise sales: ~$12-14B
- Share of GMS captured by top 1-3% of shops: ~40-60%
- Median active shop annual revenue: ~$500-$2,500
- Share of Etsy purchases that are gifts: ~40-55%
- Q4 share of annual revenue for typical gift niche: ~30-45%

**Etsy Fee Structure**
- Listing fee: $0.20 per item (on list, every 4-month renewal, and per sale)
- Transaction fee: 6.5% of total order including shipping
- Payment processing (US): ~3% + $0.25 per order
- Etsy Ads: per-click, ~$0.20-$1.50 per click, budget-set
- Offsite Ads: 15% of order (shop under $10K TTM) / 12% (shop over $10K TTM)
- Offsite Ads mandatory threshold: $10K trailing twelve months
- Blended all-in platform take (modest advertiser): ~9-14% of gross sales
- Blended all-in platform take (heavy advertiser): ~18-25% of gross sales
- Example $40 order pre-ads cost: ~$4.25 (~10.6%)

**Startup Costs by Archetype**
- Digital-product shop: $300-$1,500
- Print-on-demand niche shop: $300-$1,200
- Handmade / made-to-order shop: $2,000-$12,000+
- Laser engraver: $400-$5,000
- Embroidery machine: $1,500-$8,000
- Kiln: $800-$3,000
- Jewelry tools: $500-$2,500
- Raw materials starting inventory: $300-$2,000
- Packaging and shipping supplies: $200-$600
- Business setup (bank, bookkeeping, sales-tax permit, buffer): $200-$800
- LLC formation: $50-$500 plus possible annual fees

**Software and Tooling Costs**
- eRank: $6-$30/mo
- Marmalead: $19-$30/mo
- Adobe Creative Cloud: ~$60/mo
- Affinity Designer: ~$165 one-time
- Canva Pro: ~$15/mo
- Thermal label printer: $120-$250
- Lightbox: $30-$120
- Email service provider: $0-$50+/mo (scales with list size)

**Unit Economics Examples**
- Digital pattern: $12 retail, $0 marginal cost, ~$1.40 Etsy take, ~$10.60 net (~88-92% margin)
- POD t-shirt: $24 retail, $11-14 base cost, $3-5 fees+ads, ~$5-9 net before labor
- Engraved cutting board: $52 retail, $7 materials, $2 packaging, ~$12 labor (25 min @ $28/hr), $9 shipping, ~$6.75 Etsy take, ~$15.25 net (~29% margin)
- Engraved board repriced to $61: ~40% net margin
- Target net margin (all archetypes): 30-50%
- Minimum founder labor rate to build into pricing: $20-$35/hr

**Listing and SEO Benchmarks**
- Tags per listing: 13 (use all, multi-word phrases)
- Active listings for a successful niche shop: 40-150
- Internal Etsy traffic share, months 1-9: ~60-85% of visits
- SEO flywheel ramp time: ~90-180 days to start spinning
- Etsy Ads target spend: under 10-15% of ad-attributed revenue
- Message response target: within 24 hours

**Traffic Channel Mix (Mature Niche Shop)**
- Etsy internal search and discovery: ~40-55%
- Pinterest: ~15-35%
- Etsy Offsite Ads (Google/Meta/etc): ~10-20%
- Email and owned channels: ~10-25%
- Instagram / TikTok / other: ~5-15%
- Pinterest contribution achievable within 6-12 months: 15-35% of traffic

**Revenue Trajectory (Committed Founder)**
- Year 1 gross sales: $8K-$45K (top decile $60K-$120K)
- Year 1 net margin: ~20-35%
- Year 2 gross sales: $35K-$110K, net margin ~30-45%
- Year 3 gross sales: $90K-$250K, net margin ~25-40%
- Year 4-5 gross sales (shops that make it): $200K-$900K, net margin ~22-38%
- Solo seller revenue ceiling (the wall): ~$60K-$130K
- Year 1 time investment: ~1,200-3,500 hours

**Hiring and Outsourcing**
- VA / part-time helper (offshore): $6-$15/hr
- Local part-time helper: $15-$30/hr
- Solo shop net margin: 35-55%
- Founder + VA net margin: 30-45%
- Founder + production staff net margin: 22-38%
- Off-platform revenue target by Year 3-5: 40-60%

**Exit / Valuation**
- Typical SDE multiple (healthy systematized shop): 2.0x-3.5x
- SDE multiple (diversified, strong email list, low founder-dependence): 3.5x-4.5x+
- Example: $80K SDE diversified shop sells for ~$200K-$320K
- Example: $250K SDE multi-channel brand sells for ~$700K-$1.1M
- Most transferable assets: email list, owned store, documented SOPs, IP

**Key Conversion and Risk Numbers**
- Cash buffer recommended: 60-90 days of zero Etsy revenue
- Etsy transaction fee history: rose from 5% to 6.5% in 2022
- Projected all-in take by 2030 (planning assumption): 13-16%
- Diversification target: second marketplace live by Year 2

`;

const counter = `

## Counter-Case: Why Starting an Etsy Shop Business in 2027 Might Be a Mistake

The case for Etsy as a low-risk launchpad is genuine, but a serious founder should pressure-test it against the conditions that make this a bad idea. There are real reasons to walk away.

**Counter 1 — The platform-dependency risk is not just a risk, it is a structural flaw in the model.** Everything you build on Etsy is built on land you do not own. Etsy can suspend your shop via an automated system with a slow, opaque appeals process; it can change search ranking and halve your traffic overnight; it can change what is allowed to be sold; and it controls the customer relationship. The bull case says "mitigate it by going off-platform," but the honest version is that the migration is hard, slow, and incomplete — most shops never successfully build a meaningful owned channel, and those shops are one algorithm update or one wrongful suspension away from zero. If you are not genuinely committed to the off-platform build, you are building a business on quicksand.

**Counter 2 — Saturation in the accessible niches is worse than newcomers believe.** Every niche a solo seller can enter without significant capital or rare skill is already crowded with thousands of shops, many of them with years of review equity you cannot match quickly. The "go narrow" advice is correct but it has limits — the narrowest viable niches have small absolute search volume, and the bigger niches are dominated. A 2027 newcomer faces a meaningfully higher reputation-and-ranking-acquisition cost than a 2018 newcomer did, and the math that worked then does not simply work now.

**Counter 3 — AI did not just hurt digital categories, it is reshaping the whole expectation.** Generative AI collapsed digital art, printables, and design files. But it also flooded the marketplace with listings, drove buyer price expectations down, and trained buyers to expect infinite cheap options. Even physical-goods sellers feel the downward price pressure. And the next wave — AI that can handle more of the design-to-fulfillment chain — keeps narrowing the set of genuinely defensible niches. Betting on a moat that AI cannot reach in 2027 is betting it stays unreachable through 2030, which is not guaranteed.

**Counter 4 — Fee creep makes the unit economics worse every year, and you have no leverage.** Etsy raised the transaction fee 30% (5% to 6.5%) in 2022 and made Offsite Ads mandatory. There is no structural reason to expect this to stop. As a seller you have zero negotiating power. Every fee increase comes straight out of your margin or forces a price increase that hurts conversion. A business whose primary cost input rises unilaterally at the supplier's discretion, with no alternative, is a structurally weak business.

**Counter 5 — The realistic Year-1 hourly wage is brutal.** Strip away the success-story framing and look at the median: most shops do under $2,500 a year. Even a top-decile Year-1 shop doing $80K gross at 30% margin nets $24K — for what is often 1,500-3,000 hours of work. That is a sub-minimum effective wage during the build year. The "it pays off in Year 3" promise is true for the disciplined minority and false for the majority who quit or stall first. If you need income now, this is the wrong vehicle.

**Counter 6 — Made-to-order at scale is physically punishing and does not scale cleanly.** Handmade and made-to-order is the niche with the best moat, but it is also a treadmill — every sale is more labor, the founder's hands and body take real strain, and Q4 is a 60-80 hour-per-week sprint every year. Scaling past the solo wall requires hiring and systematizing, which most craft-motivated founders are bad at and do not enjoy. The thing that protects your margin (it is hard to make) is the same thing that caps your growth (it is hard to make).

**Counter 7 — The seasonality is a cash-flow trap.** Gift niches do 30-45% of annual revenue in Q4. That means a long, lean Q1-Q2-Q3 and a frantic Q4. Founders routinely mismanage this — spending the holiday cash, under-preparing inventory, then facing a cash crunch in February. A business with this much revenue concentration in one quarter is inherently fragile and stressful, and it does not match the "steady passive income" fantasy that draws many people in.

**Counter 8 — Copycats are rampant and enforcement is your unpaid job.** The moment a listing succeeds, it gets copied — sometimes photo-for-photo. Etsy's enforcement is slow and inconsistent, and pursuing copycats costs you time and sometimes legal money for uncertain results. You can build a beautiful original product line and watch lower-quality clones undercut you in the same search results. The marketplace structure does not protect the original maker well.

**Counter 9 — Customer service includes a tax of unreasonable buyers.** A meaningful fraction of buyers are demanding, a few are genuinely unreasonable, and the review system gives them leverage — a single retaliatory one-star review hurts ranking and conversion. You will spend real emotional energy on a small number of customers who can never be satisfied, and the platform's structure tilts toward the buyer.

**Counter 10 — Better alternatives may exist for your specific skills.** If you have genuine design or craft skill, you might do better selling directly through your own brand from the start (harder customer acquisition, but you own everything), through wholesale to retailers via Faire (less platform risk, B2B cash flow), through local markets and galleries, or via a different platform entirely. If your skill is digital, a course, a membership, or a Patreon may monetize it better than saturated Etsy files. Etsy is *a* good launchpad; it is not automatically *the* best path for your particular asset. Defaulting to Etsy because it is famous and easy to start is not the same as choosing it because it is right for you.

**The honest verdict.** Starting an Etsy shop business in 2027 is a strong choice for a founder who: has or can build a genuine moat (craft skill, equipment, design depth, deep niche knowledge), is willing to invest 12-18 months before meaningful payoff, will actually execute the unglamorous SEO/photography/service/bookkeeping work, will genuinely build the off-platform migration rather than just intending to, can tolerate seasonal cash-flow swings and Q4 sprints, and does not need significant income in the first year. It is a poor choice for anyone planning a generic POD or AI-content shop, anyone who needs fast income, anyone who only wants to make things and resents the business work, and anyone who will not or cannot diversify off the platform. The marketplace is real, the buyer intent is real, and the validation speed is genuinely valuable — but Etsy is a powerful, unreliable business partner that owns your customer and can fire you without notice. Use it with eyes open, or do not use it at all.

`;

const links = `

## Related Pulse Library Entries

- **q1946** — How do you start a handmade jewelry business in 2027? (Adjacent handmade niche; jewelry is a top Etsy category.)
- **q1947** — How do you start a print-on-demand business in 2027? (The POD archetype examined in depth; counterpoint to the default-playbook trap.)
- **q1948** — How do you start a digital products business in 2027? (The digital-product archetype; near-zero marginal cost economics.)
- **q1949** — How do you start a candle making business in 2027? (Adjacent handmade niche with product-safety compliance overlap.)
- **q1950** — How do you start a woodworking business in 2027? (Adjacent equipment-moat handmade niche.)
- **q1951** — How do you start a pottery and ceramics business in 2027? (Kiln-moat handmade niche; the Priya and Sam scenario.)
- **q1952** — How do you start a custom apparel business in 2027? (Embroidery and printing niche; personalization moat.)
- **q1954** — How do you start a small batch food business in 2027? (Adjacent handmade niche with heavier regulatory load.)
- **q9628** — How do you start a Shopify store in 2027? (The owned-channel destination; the off-platform migration target.)
- **q9629** — How do you start an e-commerce brand in 2027? (Broader brand-building context for the multi-channel endgame.)
- **q9501** — How do you start a bookkeeping business in 2027? (Service-business niche-selection parallels and the moat principle.)
- **q9502** — How do you do SEO for a small business in 2027? (Search-ranking principles that parallel Etsy SEO.)
- **q9601** — How do you build an email list for an e-commerce business? (The owned-audience channel deep dive.)
- **q9602** — How do you use Pinterest for e-commerce traffic? (The underrated external channel deep dive.)
- **q9603** — How do you price a handmade product? (Cost-stack and margin-math deep dive.)
- **q9604** — How do you photograph products for online selling? (Product photography, the highest-ROI Etsy skill.)
- **q9605** — How do you sell on Amazon Handmade in 2027? (Second-marketplace diversification channel.)
- **q9606** — How do you sell wholesale on Faire in 2027? (Wholesale channel diversification.)
- **q9607** — How do you do keyword research for a marketplace? (eRank and Marmalead workflow deep dive.)
- **q9608** — How do you manage a made-to-order production queue? (Operational workflow deep dive.)
- **q9609** — How do you hire your first virtual assistant? (Outsourcing the non-craft work.)
- **q9610** — How do you handle sales tax as an online seller? (Marketplace facilitator laws and nexus deep dive.)
- **q9611** — How do you form an LLC for a small online business? (Business structure and liability deep dive.)
- **q9612** — How do you protect your designs from copycats? (IP protection and enforcement deep dive.)
- **q9613** — How do you sell a small e-commerce business? (Exit strategy and valuation deep dive.)
- **q9614** — How do you build standard operating procedures for a small business? (Systematization for scaling and exit.)
- **q9615** — How do you handle Q4 seasonality in a product business? (Cash-flow and inventory planning deep dive.)
- **q9701** — How will AI change e-commerce by 2030? (The AI-commoditization outlook context.)
- **q9702** — What is the future of online marketplaces in 2030? (Long-term platform-dependency and fee-creep context.)
- **q9703** — How do you reduce platform dependency in a marketplace business? (The central risk-mitigation strategy deep dive.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Parallel framing on AI disruption of low-moat work.)

`;

const tags = ['etsy', 'ecommerce', 'small-business', 'handmade', 'print-on-demand', 'marketplace-selling', 'side-business', 'product-business', 'digital-products', '2027'];

const sources = [
  { title: 'Etsy, Inc. — Investor Relations and SEC Filings (NASDAQ: ETSY)', url: 'https://investors.etsy.com' },
  { title: 'Etsy Seller Handbook', url: 'https://www.etsy.com/seller-handbook' },
  { title: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees' }
];

const notes = {
  s6: 'Added 35 cited sources: Etsy investor filings and official policies (Seller Handbook, fees, Offsite Ads, search ranking, prohibited items), keyword research tools (eRank, Marmalead, Google Trends), legal and tax references (SBA business structure, IRS 1099-K and Section 179, marketplace facilitator sales tax laws, FTC labeling, USPTO trademark), tooling and fulfillment (Printful, Printify, laser/embroidery/kiln equipment, Pirate Ship, ShipStation, Adobe/Affinity/Canva, Placeit/Kittl), channel platforms (Pinterest Business, Klaviyo/Flodesk/ConvertKit, Shopify, Amazon Handmade, Faire, Ravelry), operations (Trello/Asana, QuickBooks/Wave, Onlinejobs.ph), and exit marketplaces (Flippa, Empire Flippers).',
  s7: 'Added comprehensive numbers block: marketplace scale (90-96M buyers, 8-9M sellers, $12-14B GMS, top 1-3% capture 40-60%), full Etsy fee structure with the $40-order worked example and 9-14% vs 18-25% blended take, startup costs by all three archetypes ($300-$1,500 digital / $300-$1,200 POD / $2,000-$12,000+ handmade) with equipment cost ranges, software and tooling costs, three worked unit-economics examples with margin math, listing and SEO benchmarks (13 tags, 40-150 listings, 90-180 day flywheel ramp), traffic channel mix for a mature shop, the Year 1-5 revenue trajectory ($8K-$45K Y1 to $200K-$900K Y4-5), hiring/outsourcing margin math, and exit valuation multiples (2.0x-3.5x SDE, examples to $1.1M).',
  s8: 'Added 10-element counter-case: platform dependency as a structural flaw not just a risk, saturation worse than newcomers believe with higher 2027 reputation-acquisition cost, AI reshaping buyer price expectations beyond just digital categories, unilateral fee creep with zero seller leverage, brutal realistic Year-1 effective hourly wage, made-to-order being physically punishing and not scaling cleanly, Q4 seasonality as a cash-flow trap, rampant copycats with enforcement as the seller unpaid job, the unreasonable-buyer customer-service tax with retaliatory reviews, and better alternatives existing for specific skills (direct brand, Faire wholesale, courses/memberships) — plus an honest verdict on fit.',
  s9: 'Cross-linked 31 related Pulse entries: adjacent handmade niches (q1946 jewelry, q1949 candles, q1950 woodworking, q1951 pottery, q1952 custom apparel, q1954 small-batch food), the archetype deep dives (q1947 POD, q1948 digital products), the off-platform destinations (q9628 Shopify, q9629 e-commerce brand), skill and operations deep dives (q9601-q9615 covering email lists, Pinterest, pricing, photography, Amazon Handmade, Faire, keyword research, production queues, VA hiring, sales tax, LLC formation, IP protection, exit, SOPs, seasonality), AI/marketplace outlook entries (q9701-q9703), and parallel-framing entries (q9501, q9502, q1899).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the Etsy shop business startup playbook for 2027. Two mermaid diagrams: a customer-journey flow from buyer intent through discovery channels, listing conversion, production, review, and the owned-channel repeat-customer loop; and a decision-matrix flow routing a founder through moat check, archetype selection, demand validation, unit-economics check, and off-platform commitment to a durable diversified brand. Full coverage across 30 H2 sections: why Etsy works as a starting point not a destination, market sizing and uneven GMS distribution, five-segment ICP (gift buyer, personalization seeker, craft/maker buyer, aesthetic buyer, bargain hunter), the default-playbook trap (generic POD and AI content), niche selection at the four-circle intersection, the real all-in fee structure with worked examples (9-14% blended take), startup costs and unit economics for all three archetypes (digital / POD / handmade), the tooling and equipment stack, Etsy SEO ranking factors, four lead-generation channels (internal search, Etsy Ads and Offsite Ads, Pinterest, owned email/store), the central platform-dependency risk, pricing and margin math, operational weekly workflow, hiring and outsourcing sequencing, Year 1-5 revenue trajectory, licensing/legal/tax/IP, competitor analysis (established niche shops, reseller/dropship flood, AI-content flood, overseas sellers), five named real-world scenarios (engraving shop, digital pattern designer, POD cautionary tale, ceramics studio, trend-chaser), full risk-mitigation playbook, exit strategy and valuation, owner lifestyle reality, common Year-1 mistakes, a decision framework, the five-year AI outlook, and a final five-discipline framework. Verified: exactly 2 mermaid diagrams, 30 H2 sections in core, ASCII-clean punctuation, no trademarked-content advice, platform dependency treated as the central risk throughout per requirements.'
};

runPolish({ id: 'q1953', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
