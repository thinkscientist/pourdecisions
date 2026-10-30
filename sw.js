// Pour Decisions service worker: keeps the app usable on patchy signal.
// App files: served from cache, refreshed in the background.
// Map: tiles, fonts and icons are cached as you browse, so areas you've already looked at
// still draw offline. The style file is refreshed in the background so tile versions stay current.
const APP = "pd-app-v14";
const TILES = "pd-tiles-v2";
const TILE_LIMIT = 1500;
const SHELL = [
  "./", "index.html", "app.css", "app.js", "data.js",
  "vendor/maplibre-gl.js", "vendor/maplibre-gl.css", "manifest.webmanifest",
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

  if (url.hostname === "tiles.openfreemap.org" && !url.pathname.startsWith("/styles/")) {
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
  const isMapStyle = url.hostname === "tiles.openfreemap.org";
  if (!sameOrigin && !isFont && !isMapStyle) return;

  e.respondWith(caches.open(APP).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: sameOrigin && url.pathname.endsWith("/") });
    const fresh = fetch(req).then((res) => {
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || fresh;
  }));
});
