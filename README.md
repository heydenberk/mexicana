# Mexicana: a historical atlas of Mexico

**Live:** https://heydenberk.com/mexicana/

An interactive atlas of Mexican history from the Spanish conquest (1519) to the present: events, routes and
territories plotted on real terrain (hillshaded relief, rivers, coastlines, modern borders for reference),
not on scans of period maps.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # validates the data, type-checks, and writes a static site to dist/
```

No backend and no API keys. Relief comes from the free [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)
(Terrarium encoding), map fonts from [OpenFreeMap](https://openfreemap.org/), and everything else is bundled.

## Status

All twelve eras are built (about 620 features), each fact-checked after it was written and then compared with the
book the atlas accompanies, Paul Gillingham's *Mexico: A 500-Year History* (2025). Each era's panel lists the
chapters to read alongside it (`reading` in `data/eras.json`). See
[`UNCERTAIN.md`](UNCERTAIN.md) for the judgment calls.

## Using it

- Pick an era on the timeline slider, in the list, or with the [ / ] keys. The map fits to the era.
- **Search** (the box at the top of the panel, or press /) looks through every era's titles, places, descriptions and
  mapping notes, ignoring accents (`queretaro` finds Querétaro). Pick a result, or press Enter for the first one, to
  jump to its era and fly to it.
- Step through the era's events in date order with the ‹ › buttons under the timeline or the ← / → keys. Each step
  flies to the event and shows its details in a card beside it (on narrow screens, in place of the bottom
  sheet), framing the event in the part of the map the card leaves clear. The card can be shrunk to its title with −.
- **This era / Up to this era** switches between the selected era only and everything up to it (earlier eras faded).
- Click anything for its date, explanation, mapping confidence and sources. Overlapping features are listed as “Also here”.
- Toggles: **historical features** (switch the history off to see the land and the modern map on their own; picking an
  event brings it back), modern borders, rivers and lakes, landform names, **modern states & cities** (off by default: today's state
  names and cities, in slate grey so they don't read as history), 3D terrain. The **Legend** button explains the symbols.
- The URL keeps the era, mode and selected feature (`#era=conquest&f=e1-otumba`), so views can be bookmarked.

## Flashcards and quiz

**Live:** https://heydenberk.com/mexicana/quiz/ (also linked from the atlas header)

Each era has a deck of cards drawn from Gillingham's book: the events, people, terms, numbers and arguments a reader
should remember, not only the ones that can be mapped. Both modes use the same cards.

- **Flashcards** (`#study` for all eras, `#study=reform` for one). Recall the answer, reveal it, and grade yourself:
  Again, Hard, Good or Easy (keys 1–4; Space reveals, then means Good). Scheduling is Anki-style spaced repetition: new
  cards go through short learning steps (1 and 10 minutes), then come back after a day, and each success stretches the
  interval by the card's ease. New cards come core cards first, then the rest; a session across all eras takes one
  from each era in turn, so the whole outline builds up from the first day. New cards are limited per day (20 by
  default, changeable on the home screen), and a button at the end of a session lets you learn more.
- **Quiz** (`#era=reform`). Ten cards drawn at random from the era: up to three where you place a pin on the map (within
  100 km counts, unless the card sets its own tolerance), the rest multiple choice with the card's distractors. After
  each answer the event is drawn on the map in the atlas's own style, with a link to it in the atlas. A missed question
  goes into the flashcards, due now.

Progress and best scores are kept in the browser's local storage only (`mexicana-study` and `mexicana-quiz-best`).
**Clear saved progress**, at the foot of the home screen, deletes both.

## States and cities quiz

**Live:** https://heydenberk.com/mexicana/places/ (linked from the quiz's front page)

A map quiz on modern Mexico, apart from the history. The front page shows the map with every state and state capital
named, to study from; during a quiz the names are hidden.

- **States**: find each of the 32 states by clicking it (the map fills in green and red as you go); name a highlighted
  state from four neighbours; and name each state's capital (the wrong options include the state's largest other
  city, such as Tijuana for Baja California).
- **Cities**: 20 at a time from the 79 in the reference layer (every state capital and every city of 100,000 or more,
  less three that Natural Earth gets wrong or that are part of Mexico City): place a pin within 50 km, name a marked
  city from four nearby, or say which state a city is in.

Right answers move on by themselves; a wrong one waits so you can look at the map. At the end you can retry just the
ones you missed. Best scores are kept in local storage (`mexicana-places-best`). The states come from
`data/reference/mexico-states.geojson`, made by `npm run build:reference`.

## Editing the history

All historical content is in `data/`, which you can edit without touching code. In dev the page reloads when you save.

- `data/eras.json` lists the twelve eras: id, title, years, the GeoJSON `file` (or `null` while unbuilt), the
  `bbox` the map fits to, a short `summary`, and `reading`, the book chapters to read alongside it.
- `data/eras/NN-name.geojson` holds one era's features. Each feature's `properties`:

| property | required | notes |
|---|---|---|
| `id` | yes | unique across all eras |
| `era` | yes | must match the era id in `eras.json` |
| `title` | yes | `label` (optional) is a shorter name for the map |
| `date` or `start`/`end` | yes | `1519`, `1519-11` or `1519-11-08`: give only the precision the sources support |
| `type` | yes | `battle`, `city`, `route`, `boundary`, `uprising`, `economic`, `political` |
| `description` | yes | 2–4 sentences on why it matters |
| `confidence` | yes | `precise`, `approximate`, `schematic` (drawn solid, dashed, dotted) |
| `sources` | yes | list of `{ "citation": "...", "url": "..." }` (url optional) |
| `note` | | mapping caveats, shown in the details card |
| `modern_place` | | modern name used by `npm run check:places` to verify a point's coordinates |
| `clip` | | `"land"` clips a polygon to the modern coastline, so you can draw it roughly over the sea |
| `exclude` | | ids of polygons to cut out of this one (e.g. unconquered enclaves) |
| `directional` | | `false` for routes drawn without arrows (e.g. causeways) |
| `style` | | `{ "color": "#hex" }`, or `{ "fill": "water" }` for historical lakes |
| `derived` | | geometry generated by a script (see below) |
| `from_states` | | with `derived`, the modern states a territory is drawn from (see below) |

Routes are `LineString`s drawn in the direction of travel. Territories are `Polygon`s or `MultiPolygon`s.

### Cards

`data/cards/NN-name.json` (the same basename as the era's GeoJSON) holds that era's deck:

```json
{
  "era": "reform",
  "cards": [
    { "id": "reform-ayutla-alvarez", "prompt": "…?", "answer": "Juan Álvarez",
      "distractors": ["wrong", "wrong", "wrong"], "explanation": "…", "chapter": 11, "core": true, "feature": "e7-…" },
    { "id": "reform-9", "kind": "where", "prompt": "Where is …?", "answer": "Querétaro, north-west of Mexico City",
      "explanation": "…", "feature": "e7-…" }
  ]
}
```

- `answer` is the back of the flashcard and the right option in the quiz; the three `distractors` are the quiz's wrong
  options. Keep them the same kind and length as the answer so that nothing gives it away.
- `chapter` is the book chapter the fact comes from (0 is the Introduction, 22 the Epilogue). `core` marks the cards
  that matter most, which are studied first. `feature` (optional) is an atlas feature of the era, shown on the map once
  the card is answered and linked in the atlas.
- A `where` card's answer is its feature's point, so `feature` must be a `Point` that is not `schematic` and lies
  inside the era's `bbox`. `tolerance_km` (default 100) changes how close counts as right in the quiz.
- Ids are permanent: progress is stored by card id, so renaming one restarts that card. Each id starts with the era id.
- Every card was written from the book and then checked against it by a second reader. `npm run validate` checks the
  structure.

### Checks

- `npm run validate`: schema check of every era file and card deck (runs automatically before `npm run build`).
- `npm run check:places` (`-- --file=07` for one era): geocodes every point that has a `modern_place` with OpenStreetMap Nominatim and
  flags any more than 5 km from the stored coordinate. A flag means look again, not that the point is
  wrong: a battlefield can lie well outside the town it is named after.
- `npm test`: unit tests for date parsing and formatting.

### Treaty lines and derived boundaries

The Adams–Onís (1819), Guadalupe Hidalgo (1848) and Gadsden (1853) lines, and the territories that depend on
them (Mexico 1821, the Texas claim, the Nueces Strip, the Mexican Cession, the Gadsden Purchase, Central
America), are built from the treaty texts by `scripts/derive-boundaries.mjs`. Where a treaty follows a river or
a line that is still a modern boundary, it uses Natural Earth geometry. Features marked `"derived": true` get
their geometry rewritten when you run:

```sh
npm run build:reference          # download Natural Earth and rebuild data/reference/
node scripts/derive-boundaries.mjs
```

To hand-edit one of these geometries, remove its `derived` flag first.

### Territories drawn from modern states

Many colonial and later units (intendancies, provinces, zones of control) correspond roughly to groups of modern
states, which mostly descend from them. A feature with `"derived": true` and a `from_states` list of Natural
Earth state names (Mexican and US states, Guatemalan departments, Belizean districts) is drawn as the union of
those states by:

```sh
npm run derive:states
```

The modern lines are only a stand-in, so these features are marked approximate or schematic and their `note`
says which states they use.

## Reference layers

`data/reference/` holds the faint modern layers, all from [Natural Earth](https://www.naturalearthdata.com/)
1:10m (public domain): land, lakes, rivers, country and state borders, state names, and cities. It also has a small
hand-made file of landform and sea labels (`physiography.geojson`). Rebuild them with `npm run build:reference`.

`mexico-states.geojson` holds Mexico's 32 states as polygons, for the states and cities quiz.

The cities are every Mexican state capital and every Mexican city of 100,000 or more, the capitals and main cities of
the US states that were once New Spain or Mexico (and Louisiana), and the Central American and Caribbean capitals.
`scripts/build-reference.mjs` corrects Natural Earth's mistakes in Mexico (missing accents, a misspelt Navojoa, a
village given half a million people) and moves a few city points that sit off-centre. Check them against
OpenStreetMap with `npm run check:places -- --cities`.

## Accuracy

Every feature cites at least one source. Each era had an independent fact-checking pass over its dates, claims,
coordinates and citations. Point coordinates are checked against OpenStreetMap. Historical territories are
deliberately simple and marked approximate or schematic. Open questions are listed in
[`UNCERTAIN.md`](UNCERTAIN.md).

## Stack

Vite + TypeScript + [MapLibre GL JS](https://maplibre.org/) 5. Layout works on laptops and on tablets in either orientation;
under 820 px wide the panel becomes a bottom sheet.
