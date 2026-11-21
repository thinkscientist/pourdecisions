# Stroll

A phone-first web app for finding coffee, food and drinks within a short walk, in **San Francisco** (the 31 Oct – 3 Nov 2026 trip guide) **Birmingham, UK** (40 places from Time Out and Visit Birmingham guides) **St Albans, UK** (28 places from olive, Harden's and bar guides) and **Shoreditch, London** (50 places from Time Out, The Infatuation, olive and London x London), with a live map, "what's closest" sorting and a list of places you've visited.

## What it does

- **Four cities.** Tap the city name in the title row ("COFFEE & FOOD / SAN FRANCISCO ⇆") to move to the next city (San Francisco → Birmingham → St Albans → Shoreditch); if your location is in one of them, the app switches to it. The map, list and Plan show the current city; open/closed uses that city's local time; walking times start from you, or from SoMa, New Street, St Albans City or Shoreditch High Street station. Each city has its own radius for "you're here", and the nearest one wins.

- **Nearby.** A map, plus a list sorted by walking time from you (or from your SoMa base until you share your location). Each row shows the area and whether the place is open right now, in San Francisco time. You can filter by Coffee, Eat and Drink, and search by name, area or dish.
- **Plan.** Your own list. Tap **+ Add** on any place in Nearby to add it. Plan shows what's still to go, nearest first, each with a **Been** button, and underneath, where you've been and when. You can also mark a place as been from its details page without planning it first.
- **Place details.** Photos from the venue's own website (18 places), what it is, what to order, warnings, hours for each trip day, the nearest train station and the address. **Walk** opens Google Maps walking directions and **Transit** opens public transport directions.
- **Public transport.** BART, Muni Metro (including the Central Subway), Caltrain at 4th & King, and the cable car ends are on the map as small square badges. Tap one for its lines and walking time; the train button on the map hides them.
- **Works like an app.** Add it to your home screen. It keeps working on patchy signal.

The look follows a small San Francisco design system; see [DESIGN.md](DESIGN.md).

## Notes on the data

- **Birmingham** (`data-birmingham.js`): 26 restaurants, 12 cafés and bakeries and 2 bars from Time Out's best restaurants (Sep 2025) and best coffee (2024) lists, Visit Birmingham's independent coffee list (2024) and bar guides, gathered 14 Nov 2026, plus Opheem. The guides give no opening hours, so none are shown. Three pins (670 Grams, Harborne Kitchen, Perro) mark the street rather than the door and have a dashed outline. Six picks were left out because they couldn't be placed reliably.
- **St Albans** (`data-stalbans.js`): 13 restaurants, 6 cafés and 9 pubs and bars from olive magazine's best restaurants in St Albans (June 2026), Harden's, DesignMyNight's best bars, A Friend Abroad's coffee spots (2025) and pub guides, gathered 21 Nov 2026. No opening hours. Walking times start from St Albans City station. Sucker Punch is pinned to its street, not its door. Left out: Thompson (closed October 2025), Per Tutti and No Nuisance (couldn't be placed reliably).
- **Shoreditch** (`data-shoreditch.js`): 27 restaurants, 8 cafés and 15 bars from Time Out's best Shoreditch restaurants (Jan 2026) and bars (Sep 2026), The Infatuation's best Shoreditch bars (Jul 2025), olive's Shoreditch guide (Aug 2026) and London x London's café guide (Sep 2026), gathered 21 Nov 2026. Eight restaurants have Time Out's opening hours, shown for the next seven days; the rest show none. Cycene is pinned to its street. Left out: Tayēr + Elementary (closed after a fire), Look Mum No Hands (shows as vacant), Attendant (its Great Eastern Street address now has a different café) and Osteria Angelina (couldn't be placed).

- Hours, dishes and warnings come from the trip guide. Where the guide gives no hours, the app shows none rather than guessing.
- Pin positions come from OpenStreetMap data. Five places the guide gives only a neighbourhood for, and that the map data didn't have (Piglet & Co, Restaurant Naides, Dingles, Abacá, Fikscue), were confirmed against restaurant listings on 30 October 2026. If a pin ever can only mark a neighbourhood, add its id to `APPROX` in `data.js` and it gets a dashed outline.
- Your plan and ticks are stored on your phone, in the browser's storage for this site. Clearing the browser's site data erases them, so use "Copy list" on the Plan tab if you want a backup.
- To preview a trip day before you go, add `?now=2026-10-31T10:30` to the URL. It sets the clock to that San Francisco time, and the title row says "Preview" so you know.

## Running it

It's a static site with no build step: `index.html`, `app.css`, `app.js` and `data.js`, plus MapLibre GL in `vendor/`, which draws the map.

- Locally: `python3 -m http.server`, then open http://localhost:8000.
- On your phone: it needs to be served over HTTPS so that location works. Any static host will do: GitHub Pages, Netlify, Cloudflare Pages or Vercel.

The map is [OpenFreeMap](https://openfreemap.org): free vector tiles with no key or account, built from OpenStreetMap data. The app recolours it with its own design tokens. Map data © OpenStreetMap contributors, © OpenMapTiles.

## Licence

The app's code is released under the [MIT licence](LICENSE). That covers the code only. The venue information in `data.js` is drawn from a third-party trip guide, the venue photos belong to the venues (they load from their own websites), and MapLibre GL JS in `vendor/` keeps its own BSD licence. The app isn't affiliated with any venue; to have a photo or listing removed, open an issue.
