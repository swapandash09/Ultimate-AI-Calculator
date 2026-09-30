/* Push handler for background alerts (new orders + to-do reminders).
   Lives NEXT TO index.html (same folder). It is registered with its own scope, so the
   existing sw.js keeps working untouched. No Firebase config is needed in this file. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const BASE = new URL("./", self.location).href;

self.addEventListener("push", (event) => {
  let p = {};
  try { p = event.data ? event.data.json() : {}; } catch (e) { p = { data: { body: event.data ? event.data.text() : "" } }; }
  const d = Object.assign({}, p.notification || {}, p.data || {});
  const title = d.title || "Smart Calculator";
  event.waitUntil((async () => {
    // If the app is open on screen it already shows its own chime / popup - don't double up.
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (wins.some(c => c.visibilityState === "visible" && c.url.startsWith(BASE))) return;
    await self.registration.showNotification(title, {
      body: d.body || "",
      tag: d.tag || undefined,
      renotify: !!d.tag,
      icon: d.icon || (BASE + "icon-192.png"),
      badge: BASE + "icon-192.png",
      vibrate: [200, 100, 200, 100, 200],
      data: { url: d.url || "./" }
    });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "./", BASE).href;
  const wantsOrders = /[?&]open=orders\b/.test(url);
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of wins) {
      if (c.url.startsWith(BASE) && "focus" in c) {
        if (wantsOrders) c.postMessage({ type: "OPEN_ORDERS" });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
