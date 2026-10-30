# Pour Decisions

A phone-first web app for walking around San Francisco, 31 Oct – 3 Nov 2026. It covers the coffee shops and restaurants from the trip guide, with a live map, "what's closest" sorting and a list of places you've visited.

## What it does

- **Nearby.** A map, plus a list sorted by walking time from where you are. Before you have a GPS fix, or if you're not in SF yet, times are measured from the SoMa base. Every card shows whether the place is open right now, using the guide's hours and San Francisco time. Filters: Coffee / Eat / Drinks, Open now, Not been yet, Eater 38, and search by name, area or dish.
- **Plan.** The guide's four-day plan. Today's date is picked automatically. Each day shows its closures and events ("Watch out") and its stops with their hours for that day. The map highlights that day's stops.
- **Been there.** Tap the circle on any place to tick it off. The tab shows your progress by category and against the Eater 38, with time stamps. "Copy my list" copies it as text so you can back it up.
- **Place details.** What to order, why go, hours for each trip day, warnings (cash only, hours conflicts, closures). **Walk there** opens Google Maps with walking directions, and **Maps** opens the place in Google Maps.
- **Works like an app.** Use Add to Home Screen on iPhone or Install on Android to get a full-screen app. The app files are cached, and so are map tiles you've already viewed, so it still opens on patchy signal.

## Notes on the data

- All hours, dishes and warnings are taken from the guide. If the guide doesn't give a place's hours, the app says **Hours not listed** rather than guessing.
- Pins are placed using OpenStreetMap data. For five places the guide gives only a neighbourhood and the map data has no match (Piglet & Co, Restaurant Naides, Dingles, Abacá, Fikscue). Their pins have a dashed outline and mark the neighbourhood only. **Walk there** still finds the exact spot, because it uses the guide's own Google Maps search.
- Your ticks are stored on your phone, in the browser's storage for this site. Clearing the browser's site data erases them, so use "Copy my list" if you want a backup.
- To preview a trip day before you go, add `?now=2026-10-31T10:30` to the URL. It sets the clock to that San Francisco time.

## Running it

It's a static site with no build step: `index.html`, `app.css`, `app.js` and `data.js`, plus Leaflet in `vendor/`.

- Locally: `python3 -m http.server`, then open http://localhost:8000.
- On your phone: it needs to be served over HTTPS so that location works. Any static host will do: GitHub Pages, Netlify, Cloudflare Pages or Vercel.

Map tiles © OpenStreetMap contributors.
