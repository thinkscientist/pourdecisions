# Pour Decisions

A phone-first web app for walking around San Francisco, 31 Oct – 3 Nov 2026. It covers the coffee shops and restaurants from the trip guide, with a live map, "what's closest" sorting and a list of places you've visited.

## What it does

- **Nearby.** A map, plus a list sorted by walking time from you (or from your SoMa base until you share your location). Each row shows the area and whether the place is open right now, in San Francisco time. You can filter by Coffee, Eat and Drink, and search by name, area or dish.
- **Plan.** Your own list. Tap **+ Add** on any place in Nearby to add it. Plan shows what's still to go, nearest first, each with a **Been** button, and underneath, where you've been and when. You can also mark a place as been from its details page without planning it first.
- **Place details.** What it is, what to order, warnings, hours for each trip day and the address. **Walk** opens Google Maps walking directions.
- **Works like an app.** Add it to your home screen. It keeps working on patchy signal.

The look follows a small San Francisco design system; see [DESIGN.md](DESIGN.md).

## Notes on the data

- Hours, dishes and warnings come from the trip guide. Where the guide gives no hours, the app shows none rather than guessing.
- Pin positions come from OpenStreetMap data. For five places the guide gives only a neighbourhood and the map data has no match (Piglet & Co, Restaurant Naides, Dingles, Abacá, Fikscue). Their pins have a dashed outline and mark the neighbourhood only. **Walk** still finds the exact spot, because it uses the guide's own Google Maps search.
- Your plan and ticks are stored on your phone, in the browser's storage for this site. Clearing the browser's site data erases them, so use "Copy list" on the Plan tab if you want a backup.
- To preview a trip day before you go, add `?now=2026-10-31T10:30` to the URL. It sets the clock to that San Francisco time.

## Running it

It's a static site with no build step: `index.html`, `app.css`, `app.js` and `data.js`, plus MapLibre GL in `vendor/`, which draws the map.

- Locally: `python3 -m http.server`, then open http://localhost:8000.
- On your phone: it needs to be served over HTTPS so that location works. Any static host will do: GitHub Pages, Netlify, Cloudflare Pages or Vercel.

The map is [OpenFreeMap](https://openfreemap.org): free vector tiles with no key or account, built from OpenStreetMap data. The app recolours it with its own design tokens. Map data © OpenStreetMap contributors, © OpenMapTiles.
