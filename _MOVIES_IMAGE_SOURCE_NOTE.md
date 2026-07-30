# 🎬 Movies pillar (`mv`) — use the movie database API for images

**Owner note, 2026-07-30:** movie pages must pull their images from the online movie
database, not from stock photography.

## The keys already exist — nothing is wired to them yet

Both are already set in Netlify env (verified 2026-07-30):

| key | service | what it gives you |
|---|---|---|
| `tmdb_api_key` | **TMDB** (themoviedb.org) | official posters, backdrops, stills, cast photos |
| `omdb_api_key` | OMDb | poster URL + metadata, thinner than TMDB |

**Current state: `grep -c tmdb` across `_page_finisher.js` and `new/_drip.js` returns 0.**
Neither machine knows these keys exist, so `mv` pages currently get generic Pexels stock —
a random cinema seat photo instead of the actual film's poster.

## Why TMDB is the right source for this pillar

A Top-10 movie page names ten specific films. Stock photography can never show *those* films;
TMDB has the real poster and backdrop for each one, keyed by title. Same principle as
franchise pages needing real company logos: when the page names a specific thing, the image
has to be that thing.

TMDB is free for this use, has no aggressive rate limit, and returns high-resolution art
(`w1280` / `original`), so it also satisfies the HD/sharpness law without upscaling.

## Shape of the wiring when it gets built

1. Extract the film title per ranked item (`## N. <Film Title>`) — the same title-parse the
   Top-10 work already does for per-item image queries.
2. `GET https://api.themoviedb.org/3/search/movie?query=<title>&api_key=<tmdb_api_key>`
3. Take `poster_path` (portrait, best for a ranked item card) or `backdrop_path` (16:9, best
   for the hero/face card).
4. Build the URL: `https://image.tmdb.org/t/p/w1280<path>`
5. Push through the normal image choke point (`putQaAsset` → blob `qa-bin/<id>-bN.jpg`) so
   the white/blank/auto-focus standards and the DOM receipt still apply.
6. Fall back to the existing ladder only when TMDB has no match.

**Do NOT generate movie posters.** A generated "poster" for a real film is a fabricated
studio asset — the same class of mistake as the fake logo. Real poster or generic imagery,
never an invented one.

## Related

- Franchise pages have the same requirement with company logos — see the fr discussion in
  `_MORNING_NOTE_2026-07-30.md`.
- Other image keys sitting unused in Netlify env: `Huggingface_api_key`, `Aihorde_api_key`,
  `Leonardo_api_key`, `Replicate_api_key` (all generative), plus `Pexels_Api_Key`.
