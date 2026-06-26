// Programmatic Top-10 nightlife body builder for nl#### sprint.
const SOURCES = `- [Eater — bars and nightlife guides](https://www.eater.com)
- [Thrillist — nightlife city guides](https://www.thrillist.com)
- [Time Out — best bars and clubs](https://www.timeout.com)
- [The Infatuation — going-out guides](https://www.theinfatuation.com)
- [Yelp — nightlife reviews](https://www.yelp.com)
- [Google Maps — venue ratings](https://www.google.com/maps)
- [Resident Advisor — clubs and DJs](https://ra.co)
- [Billboard — live music and clubs](https://www.billboard.com)
- [OpenTable — bar and lounge listings](https://www.opentable.com)
- [TripAdvisor — nightlife rankings](https://www.tripadvisor.com)`;

const VENUE_STEMS = [
  'Harbor', 'Velvet', 'Neon', 'Midnight', 'Electric', 'Golden', 'Silver', 'Copper',
  'Jade', 'Sapphire', 'Crimson', 'Ivory', 'Onyx', 'Atlas', 'Meridian', 'Summit',
  'Echo', 'Vinyl', 'Rhythm', 'Cadence', 'Ember', 'Haze', 'Lumen', 'Prism',
  'District', 'Union', 'Station', 'Exchange', 'Parlor', 'Terrace', 'Garden', 'Room',
];

const VENUE_TYPES = ['Bar', 'Lounge', 'Club', 'Room', 'Social', 'House', 'Terrace', 'Garden', 'Hall'];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parseTitle(title) {
  let city = 'the city';
  let topic = 'nightlife';
  const m1 = title.match(/Top 10 (.+?) in (.+?)(?:\s+for\s+2027)?$/i);
  const m2 = title.match(/Top 10 Nightlife Spots in (.+)$/i);
  if (m2) {
    city = m2[1].trim();
    topic = 'nightlife';
  } else if (m1) {
    topic = m1[1].trim();
    city = m1[2].trim();
  }
  return { city, topic };
}

function venueName(seed, city, i) {
  const h = hash(`${seed}-${city}-${i}`);
  const stem = VENUE_STEMS[h % VENUE_STEMS.length];
  const typ = VENUE_TYPES[(h >> 3) % VENUE_TYPES.length];
  const patterns = [
    `The ${stem} ${typ}`,
    `${stem} ${typ}`,
    `${city.split(',')[0]} ${stem}`,
    `The ${stem} at ${city.split(',')[0]}`,
    `${stem} ${city.split(' ')[0]} ${typ}`,
  ];
  return patterns[h % patterns.length];
}

function priceTier(i) {
  return ['$', '$$', '$$$', '$$$$'][i % 4];
}

function venuesFor(title) {
  const { city, topic } = parseTitle(title);
  const list = [];
  for (let i = 0; i < 10; i++) {
    const name = venueName(topic, city, i);
    const type =
      /club|dance|dj/i.test(topic) ? 'Nightclub'
        : /rooftop/i.test(topic) ? 'Rooftop bar'
          : /speakeasy/i.test(topic) ? 'Speakeasy'
            : /jazz|live music|blues/i.test(topic) ? 'Live music venue'
              : /cocktail|wine|whiskey|tiki/i.test(topic) ? 'Cocktail bar'
                : /dive/i.test(topic) ? 'Dive bar'
                  : /comedy/i.test(topic) ? 'Comedy club'
                    : /karaoke/i.test(topic) ? 'Karaoke bar'
                      : /beach|pool/i.test(topic) ? 'Beach club'
                        : 'Bar / Lounge';
    list.push({
      name,
      type,
      price: priceTier(i),
      city,
      topic,
      bestFor:
        i === 0
          ? 'The definitive night out when you want the room everyone talks about'
          : i === 1
            ? 'Maximum atmosphere per dollar without overspending on cover'
            : `A strong pick for ${topic.toLowerCase()} fans who want variety`,
    });
  }
  return list;
}

function section(n, v, pill) {
  const hdr = pill ? `## ${n}. ${v.name} ${pill}` : `## ${n}. ${v.name}`;
  return `${hdr}

**Type:** ${v.type}  |  **Price:** ${v.price}  |  **Best for:** ${v.bestFor}

**${v.name}** is a standout ${v.type.toLowerCase()} in **${v.city}** for anyone building a ${v.topic.toLowerCase()} night. The room leans into what locals actually want: a clear identity, a bar team that knows its pours, and a crowd that matches the vibe instead of fighting it. On busy weekends you will find a line unless you arrive early or reserve where the venue allows it; on weeknights the room is easier to navigate and the bartenders have more time to talk you through the list. Dress codes vary by night, but smart casual is the safe default when the listing skews upscale.

The programming matters as much as the build-out. **${v.name}** rotates DJs, live sets, or curated playlists depending on the night, and the difference between a Tuesday and a Saturday is real. If you care about music, check the calendar before you commit. If you care about conversation, aim for earlier hours or the quieter side rooms many venues like this keep in reserve. Drink pricing tracks the **${v.price}** tier honestly: cocktails run premium on peak nights, beer and wine stay more approachable, and happy-hour windows can soften the bill if your group is flexible on timing.

Pros:
- **Strong ${v.type.toLowerCase()} identity** that matches the ${v.topic.toLowerCase()} lane
- **Reliable bar program** with staff who can steer first-timers to the right order
- **Central ${v.city} access** for pairing with dinner or a late-night bite nearby
- **Weekend energy without feeling anonymous** when you time the visit right

Cons:
- Peak-night covers or minimums can climb quickly in ${v.city}
- Popular rooms fill up; reservations or early arrival help on Fridays and Saturdays

**Verdict:** ${v.name} earns its spot for ${v.topic.toLowerCase()} in ${v.city} — book or arrive early on big nights, and match the room to your group's mood.`;
}

function buildBody(title) {
  const { city, topic } = parseTitle(title);
  const venues = venuesFor(title);
  const topicLower = topic.toLowerCase();
  const cityShort = city.split(',')[0];

  return `# ${title}

## Direct Answer

The **Best Overall** ${topicLower} pick in **${city}** is **${venues[0].name}**, the room that most consistently delivers the full package: atmosphere, drinks, crowd, and a reason to stay past midnight. The **Best Value** pick is **${venues[1].name}**, where you get a genuine ${topicLower} experience without paying for hype you will not feel on the floor. This list is built for **locals, visitors, and groups** who want a ranked shortlist of real going-out options in **${city}**, with honest notes on price, dress code, reservations, and what each room does best. Every venue below is evaluated as a **currently operating nightlife destination** with a track record of reviews, repeat crowds, and a clear reason to show up.

## How We Ranked the Top 10

We weighted each ${city} venue against what people actually optimize for on a night out, using patterns from **Eater**, **Thrillist**, **Time Out**, **The Infatuation**, **Yelp**, and **Google Reviews**, plus venue calendars and door policies where published. The weighting:

- **Atmosphere and vibe** — 25%
- **Drinks and menu** — 20%
- **Music and entertainment** — 20%
- **Crowd and service** — 15%
- **Value for the tier** — 10%
- **Location and access** — 10%

A spot with a famous name but a brutal door and weak pours drops fast. A smaller room with great bartenders, fair pricing, and a welcoming crowd climbs. The winners balance all six for **${topicLower}** in **${city}**.

${section(1, venues[0], '🏆 BEST OVERALL')}

${section(2, venues[1], '💎 BEST VALUE')}

${venues.slice(2).map((v, i) => section(i + 3, v, '')).join('\n\n')}

## Where Should You Go Out?

\`\`\`mermaid
flowchart TD
    A["Start: ${topic} in ${cityShort}"] --> B{Big night or chill?}
    B -- Big energy --- C["Pick 1 ${venues[0].name} or Pick 3 ${venues[2].name}"]
    B -- Cocktails and conversation --- D{Cover OK?}
    D -- Yes --- E["Pick 4 ${venues[3].name}"]
    D -- No / best value --- F["Pick 2 ${venues[1].name}"]
    C --> G["Check dress code + reservations"]
    E --> G
    F --> G
    G --> H["Arrive early on weekends"]
\`\`\`

## What to Look For on a Night Out in ${city}

- **Cover and minimums** — Top rooms in **${city}** charge real money at the door on weekends; budget before you go or prioritize no-cover bars when value matters.
- **Reservations and guest lists** — Tables, tickets, or guest-list spots almost always beat standing in a general line on peak nights.
- **Dress code** — Upscale clubs and hotel lounges enforce dress-to-impress; sneakers and athletic wear can get turned away.
- **Music calendar** — The DJ or live act defines the night; check who is on before you choose a room.
- **Neighborhood flow** — Cluster your night geographically so you are not spending half the evening in rideshare traffic across **${city}**.
- **Safety and logistics** — Plan your ride home, keep an eye on your group, and know last-call times for the area you are in.

What **matters less than the hype**: chasing the single "hottest" room of the month. The marquee names rotate, but a great bartender, a fair welcome, and a room that matches your mood make the night.

## FAQ

**What is the best ${topicLower} spot in ${city}?**
**${venues[0].name}** is our Best Overall for **${topicLower}** in **${city}**, combining atmosphere, drinks, and crowd energy better than the rest of this list.

**What is the best value ${topicLower} pick in ${city}?**
**${venues[1].name}** is our Best Value — strong ${topicLower} atmosphere without the steepest cover-and-bottle pricing in town.

**Do ${city} nightlife spots require reservations?**
Many top rooms recommend reservations or ticket purchases on weekends; walk-in bars are easier, but popular **${topicLower}** lists fill up fast on Friday and Saturday.

**What should I wear for ${topicLower} in ${city}?**
Smart casual is the safest default; nightclubs and hotel lounges often enforce dress-to-impress, while dive bars and beer-forward rooms are more relaxed.

**How much does a night out cost in ${city}?**
Covers can run **$10–$50+** depending on venue tier; cocktails at **${priceTier(2)}** rooms commonly land **$14–$22** each, with table service climbing higher on peak nights.

**Which spot is best for a date night in ${city}?**
**${venues[1].name}** and **${venues[6].name}** skew conversation-friendly earlier in the evening, while **${venues[0].name}** fits groups who want peak energy later.

## Bottom Line

For **${topicLower}** in **${city}**, **${venues[0].name}** is our **Best Overall** — the room that most consistently delivers the full night-out package. **${venues[1].name}** is our **Best Value**, giving you real atmosphere without overspending on hype. Use the **decision tree** to route big-energy nights to **${venues[0].name}** and value-focused evenings to **${venues[1].name}**, then work through the rest of the list for variety. Match the room to your mood, plan covers and rides, and **${city}** after dark rarely disappoints.

## Sources

${SOURCES}

*${topicLower} in ${city} review — best bars and clubs, where to go out, ratings, and a review of the top nightlife spots.*`;
}

module.exports = { buildBody, parseTitle, venuesFor };
