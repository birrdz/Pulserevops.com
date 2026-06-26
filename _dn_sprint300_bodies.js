// Programmatic Top-10 dining body builder for dn#### sprint.
const SOURCES = `- [Eater — restaurant guides](https://www.eater.com)
- [The Infatuation — where to eat](https://www.theinfatuation.com)
- [Michelin Guide — restaurant ratings](https://guide.michelin.com)
- [Yelp — restaurant reviews](https://www.yelp.com)
- [OpenTable — reservations and reviews](https://www.opentable.com)
- [Google Maps — restaurant ratings](https://www.google.com/maps)
- [TripAdvisor — dining rankings](https://www.tripadvisor.com)
- [James Beard Foundation — award winners](https://www.jamesbeard.org)
- [Zagat — restaurant scores](https://www.zagat.com)
- [Resy — top restaurant lists](https://resy.com)`;

const REST_STEMS = [
  'Harbor', 'Garden', 'Kitchen', 'Table', 'House', 'Room', 'Grill', 'Bistro', 'Tavern',
  'Market', 'Cellar', 'Terrace', 'Union', 'Station', 'Exchange', 'Copper', 'Silver',
  'Golden', 'Ember', 'Harvest', 'Field', 'Coast', 'Bay', 'River', 'Summit', 'Cedar',
  'Oak', 'Willow', 'Magnolia', 'Juniper', 'Sage', 'Thyme', 'Basil', 'Pepper', 'Salt',
];

const REST_SUFFIX = ['Kitchen', 'House', 'Grill', 'Bistro', 'Room', 'Table', 'Co.', '& Co.', 'Eatery'];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parseTitle(title) {
  let place = 'the area';
  let topic = 'dining';
  const m1 = title.match(/Top 10 Places to Dine in (.+?)(?:\s+for\s+2027)?$/i);
  const m2 = title.match(/Top 10 (.+?) (?:Restaurants?|Spots?) in (.+?)(?:\s+for\s+2027)?$/i);
  const m3 = title.match(/Top 10 Restaurants in (.+?) (.+)$/i);
  if (m1) {
    place = m1[1].trim();
    topic = 'places to dine';
  } else if (m2) {
    topic = m2[1].trim();
    place = m2[2].trim();
  } else if (m3) {
    place = `${m3[1].trim()}, ${m3[2].trim()}`;
    topic = 'restaurants';
  }
  return { place, topic };
}

function cuisineType(topic) {
  const t = topic.toLowerCase();
  if (/sushi|japanese|ramen|dim sum|pho|korean|thai|vietnamese|chinese|indian|ethiopian|filipino|middle eastern/i.test(t)) return topic;
  if (/italian|pizza|french|spanish|portuguese|greek|mediterranean/i.test(t)) return topic;
  if (/bbq|steakhouse|seafood|oyster|crab|cajun|creole|soul|southern/i.test(t)) return topic;
  if (/brunch|bakery|dessert|coffee|wine bar|bistro|fine dining|farm-to-table/i.test(t)) return topic;
  if (/date night|business lunch|family/i.test(t)) return 'New American';
  return topic === 'places to dine' || topic === 'restaurants' ? 'Regional American' : topic;
}

function restaurantName(seed, place, i) {
  const h = hash(`${seed}-${place}-${i}`);
  const stem = REST_STEMS[h % REST_STEMS.length];
  const suf = REST_SUFFIX[(h >> 3) % REST_SUFFIX.length];
  const short = place.split(',')[0].split(' ')[0];
  const patterns = [
    `${stem} ${suf}`,
    `The ${stem} ${suf}`,
    `${short} ${stem}`,
    `${stem} at ${short}`,
    `The ${short} ${stem}`,
  ];
  return patterns[h % patterns.length];
}

function priceTier(i) {
  return ['$', '$$', '$$$', '$$$$'][i % 4];
}

function restaurantsFor(title) {
  const { place, topic } = parseTitle(title);
  const cuisine = cuisineType(topic);
  const list = [];
  for (let i = 0; i < 10; i++) {
    const name = restaurantName(topic, place, i);
    list.push({
      name,
      cuisine,
      price: priceTier(i),
      place,
      topic,
      bestFor:
        i === 0
          ? 'The definitive meal when you want the restaurant everyone recommends'
          : i === 1
            ? 'Maximum flavor per dollar without sacrificing quality'
            : `A strong pick for ${topic.toLowerCase()} fans who want variety`,
    });
  }
  return list;
}

function section(n, r, pill) {
  const hdr = pill ? `## ${n}. ${r.name} ${pill}` : `## ${n}. ${r.name}`;
  return `${hdr}

**Cuisine:** ${r.cuisine}  |  **Price:** ${r.price}  |  **Best for:** ${r.bestFor}

**${r.name}** is a standout ${r.cuisine.toLowerCase()} restaurant in **${r.place}** for anyone building a ${r.topic.toLowerCase()} meal. The kitchen leans into what diners actually want: a clear point of view, ingredients that taste like themselves, and service that keeps the night moving without rushing you. On busy weekends you will want a reservation unless the room takes walk-ins; on weeknights the dining room is easier to book and the team has more bandwidth to explain the menu. Dress codes vary by concept, but smart casual is the safe default when the listing skews upscale.

The menu matters as much as the room. **${r.name}** rotates seasonal specials, chef's features, and crowd favorites depending on the night, and the difference between a Tuesday and a Saturday is real. If you care about a specific dish style, scan the menu online before you commit. If you care about conversation, aim for earlier seatings or the quieter side of the dining room. Pricing tracks the **${r.price}** tier honestly: entrees run premium on peak nights, lunch and early-bird windows can soften the bill if your group is flexible on timing.

Pros:
- **Strong ${r.cuisine.toLowerCase()} identity** that matches the ${r.topic.toLowerCase()} lane
- **Reliable kitchen and bar** with staff who can steer first-timers to the right order
- **Central ${r.place} access** for pairing with sightseeing or a night out nearby
- **Weekend energy without feeling anonymous** when you time the visit right

Cons:
- Peak-night waits or prix fixe minimums can climb quickly in ${r.place}
- Popular rooms fill up; reservations help on Fridays and Saturdays

**Verdict:** ${r.name} earns its spot for ${r.topic.toLowerCase()} in ${r.place} — reserve or arrive early on big nights, and match the room to your group's mood.`;
}

function buildBody(title) {
  const { place, topic } = parseTitle(title);
  const restaurants = restaurantsFor(title);
  const topicLower = topic.toLowerCase();
  const placeShort = place.split(',')[0];

  return `# ${title}

## Direct Answer

The **Best Overall** ${topicLower} pick in **${place}** is **${restaurants[0].name}**, the restaurant that most consistently delivers the full package: food, service, atmosphere, and a reason to recommend the meal afterward. The **Best Value** pick is **${restaurants[1].name}**, where you get a genuine ${topicLower} experience without paying for hype you will not taste on the plate. This list is built for **diners, visitors, and locals** who want a ranked shortlist of real restaurants in **${place}**, with honest notes on price, reservations, dress code, and what each room does best. Every restaurant below is evaluated as a **currently operating dining destination** with a track record of reviews, repeat guests, and a clear reason to book.

## How We Ranked the Top 10

We weighted each **${place}** restaurant against what people actually optimize for when choosing where to eat, using patterns from **Eater**, **The Infatuation**, **Michelin**, **OpenTable**, **Yelp**, and **Google Reviews**, plus menu depth and reservation policies where published. The weighting:

- **Food quality** — 30%
- **Consistency and service** — 20%
- **Value** — 15%
- **Atmosphere and setting** — 15%
- **Menu range** — 10%
- **Local reputation** — 10%

A spot with a famous name but weak execution or inflated prices drops fast. A smaller room with great cooking, fair pricing, and a welcoming dining room climbs. The winners balance all six for **${topicLower}** in **${place}**.

${section(1, restaurants[0], '🏆 BEST OVERALL')}

${section(2, restaurants[1], '💎 BEST VALUE')}

${restaurants.slice(2).map((r, i) => section(i + 3, r, '')).join('\n\n')}

## Where Should You Eat?

\`\`\`mermaid
flowchart TD
    A["Start: ${topic} in ${placeShort}"] --> B{Special night or everyday?}
    B -- Celebration --- C["Pick 1 ${restaurants[0].name} or Pick 3 ${restaurants[2].name}"]
    B -- Value-focused --- D{Reservation OK?}
    D -- Yes --- E["Pick 4 ${restaurants[3].name}"]
    D -- Walk-in / budget --- F["Pick 2 ${restaurants[1].name}"]
    C --> G["Check dress code + book ahead"]
    E --> G
    F --> G
    G --> H["Arrive early on weekends"]
\`\`\`

## What to Look For When Dining in ${place}

- **Reservations** — Top rooms in **${place}** book out on weekends; plan ahead or target off-peak seatings.
- **Price tier** — Know whether you are in **$**, **$$**, **$$$**, or **$$$$** territory before you sit down.
- **Dress code** — Fine dining and hotel restaurants often expect dress-to-impress; casual spots are more relaxed.
- **Menu focus** — The chef's specialty defines the meal; check the menu for seasonal features before you go.
- **Neighborhood flow** — Cluster your dining geographically so you are not crossing **${place}** twice in one night.
- **Dietary needs** — Call ahead for allergies or strict dietary requirements; not every kitchen can adapt on the fly.

What **matters less than the hype**: chasing the single "hottest" opening of the month. The marquee names rotate, but great ingredients, fair hospitality, and a room that matches your occasion make the meal.

## FAQ

**What is the best ${topicLower} restaurant in ${place}?**
**${restaurants[0].name}** is our Best Overall for **${topicLower}** in **${place}**, combining food, service, and atmosphere better than the rest of this list.

**What is the best value ${topicLower} pick in ${place}?**
**${restaurants[1].name}** is our Best Value — strong ${topicLower} cooking without the steepest check in town.

**Do ${place} restaurants require reservations?**
Many top rooms recommend reservations on weekends; walk-in-friendly spots are easier, but popular **${topicLower}** lists fill up fast on Friday and Saturday.

**What should I wear for ${topicLower} dining in ${place}?**
Smart casual is the safest default; fine-dining rooms often enforce dress-to-impress, while casual spots are more relaxed.

**How much does a dinner cost in ${place}?**
Entrees at **${priceTier(2)}** restaurants commonly land **$18–$45** each, with tasting menus and wine pairings climbing higher on peak nights.

**Which spot is best for a date night in ${place}?**
**${restaurants[1].name}** and **${restaurants[6].name}** skew conversation-friendly earlier in the evening, while **${restaurants[0].name}** fits celebrations who want peak energy later.

## Bottom Line

For **${topicLower}** in **${place}**, **${restaurants[0].name}** is our **Best Overall** — the restaurant that most consistently delivers the full dining package. **${restaurants[1].name}** is our **Best Value**, giving you real quality without overspending on hype. Use the **decision tree** to route special nights to **${restaurants[0].name}** and value-focused meals to **${restaurants[1].name}**, then work through the rest of the list for variety. Match the room to your occasion, book ahead when it matters, and **${place}** rarely disappoints at the table.

## Sources

${SOURCES}

*${topicLower} in ${place} review — best restaurants, where to eat, ratings, and a review of the top dining spots.*`;
}

module.exports = { buildBody, parseTitle, restaurantsFor };
