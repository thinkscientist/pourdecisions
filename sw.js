// Pour Decisions service worker: keeps the app usable on patchy signal.
// App files: served from cache, refreshed in the background.
// Map tiles: cached as you browse, so areas you've already looked at still draw offline.
const APP = "pd-app-v3";
const TILES = "pd-tiles-v1";
const TILE_LIMIT = 600;
const SHELL = [
  "./", "index.html", "app.css", "app.js", "data.js",
  "vendor/leaflet.js", "vendor/leaflet.css", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(APP).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k !== APP && k !== TILES).map((k) => caches.delete(k)),
  )).then(() => self.clients.claim()));
});

async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - TILE_LIMIT; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.hostname === "tile.openstreetmap.org") {
    e.respondWith(caches.open(TILES).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") { c.put(req, res.clone()); trimTiles(); }
      return res;
    }));
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return;

  e.respondWith(caches.open(APP).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: sameOrigin && url.pathname.endsWith("/") });
    const fresh = fetch(req).then((res) => {
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || fresh;
  }));
});
