/* 20 Hours to Mastery: offline support. Bump happens automatically on each build. */
const CACHE = "twenty-hours-94a7cab8f4";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon.svg", "icons/favicon-32.png", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fonts/bebas-neue-latin-400-normal.woff2", "fonts/bowlby-one-latin-400-normal.woff2", "fonts/fraunces-latin-700-normal.woff2", "fonts/rubik-latin-400-normal.woff2", "fonts/rubik-latin-500-normal.woff2", "fonts/rubik-latin-700-normal.woff2", "fonts/rubik-latin-800-italic.woff2", "fonts/vt323-latin-400-normal.woff2"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    // Page: try the network for updates, fall back to the saved copy offline.
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("index.html", copy)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
