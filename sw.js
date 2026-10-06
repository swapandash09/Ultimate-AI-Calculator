/* Smart Calculator — Service Worker v2
 *
 * What it does:
 *  1. OFFLINE: pre-caches the app shell and runtime-caches the CDN libraries
 *     and fonts, so the app opens with no network (shop counters, bad signal).
 *     Pages are network-first (you always get the newest version when online),
 *     with the cached copy as fallback.
 *  2. REMINDERS (unchanged contract): mirrors the To-Do list into IndexedDB and
 *     notifies for due tasks via Periodic Background Sync / one-off Sync / CHECK_NOW.
 *  3. LOAN EMI REMINDERS (new): the page mirrors My Loans here (SYNC_LOANS); we notify
 *     the day before, on the due day, and every 3 days while overdue — only between
 *     8am and 9pm, once per stage per due date.
 *  4. SMART TAPS (fixed): notification taps now honour data.open ("orders" | "todo" |
 *     "loans"), focusing the open window and telling the page which screen to show,
 *     or opening the app on that screen if it was closed.
 *  5. APP BADGE: sets the home-screen badge to the number of things needing attention.
 *
 * Honest limits (same as before): Periodic Background Sync is Chromium-only and only for
 * installed apps; the browser decides the real interval. iOS has no periodic sync, so
 * there reminders fire while the app is open (the page sends CHECK_LOANS / CHECK_NOW).
 * Nothing here sends data off the device.
 */

const VERSION = "2.0.0";
const SHELL_CACHE = `smartcalc-shell-${VERSION}`;
const RUNTIME_CACHE = `smartcalc-runtime-${VERSION}`;
const RUNTIME_MAX_ENTRIES = 80;
const NAV_TIMEOUT_MS = 5000;
const SHELL_FILES = [
  "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png",
  "./icon-maskable-192.png", "./icon-maskable-512.png",
  "./icon-monochrome-512.png", "./apple-touch-icon.png"
];
const SHELL_PATHS = new Set(SHELL_FILES.map((f) => new URL(f, self.location.href).pathname));
// Cross-origin hosts safe to cache (static libs + fonts only — never APIs / Firebase).
const CACHEABLE_HOSTS = new Set([
  "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com"
]);

/* ---------------- IndexedDB (todos + loans + meta) ---------------- */
const DB_NAME = "smartcalc_todo_sw_db";
const STORE = "todos";
const LOAN_STORE = "loans";
const META_STORE = "meta";
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE);
      if (!db.objectStoreNames.contains(LOAN_STORE)) db.createObjectStore(LOAN_STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function replaceAll(storeName, rows) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
    (rows || []).forEach((r) => { if (r && r.id) store.put(r); });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}
function getAll(storeName) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const req = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}
const putTodos = (t) => replaceAll(STORE, t);
const getTodos = () => getAll(STORE);
const putLoans = (l) => replaceAll(LOAN_STORE, l);
const getLoans = () => getAll(LOAN_STORE);

async function markNotified(ids, when) {
  if (!ids.length) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    ids.forEach((id) => {
      const g = store.get(id);
      g.onsuccess = () => { const t = g.result; if (t) { t.notifiedAt = when; store.put(t); } };
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function setMeta(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readwrite");
    tx.objectStore(META_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getMeta(key, fallback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(META_STORE, "readonly").objectStore(META_STORE).get(key);
    req.onsuccess = () => resolve(req.result === undefined ? fallback : req.result);
    req.onerror = () => reject(req.error);
  });
}

/* ---------------- Reminder logic ---------------- */
function dueTimestamp(t) {
  if (!t.dueDate) return null;
  const ts = new Date(`${t.dueDate}T${t.dueTime || "23:59"}:00`).getTime();
  return isNaN(ts) ? null : ts;
}
function daysUntil(dateStr) {
  const d = new Date(dateStr); if (isNaN(d)) return null;
  d.setHours(0, 0, 0, 0);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
}
const inQuietHours = () => { const h = new Date().getHours(); return h < 8 || h >= 21; };
const inr = (n) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");

async function notifyTodos() {
  const [todos, titles] = await Promise.all([
    getTodos(), getMeta("titles", { due: "Task due", overdue: "Task overdue" })
  ]);
  const now = Date.now(), ids = [];
  for (const t of todos) {
    if (t.done || t.notifiedAt) continue;
    const ts = dueTimestamp(t);
    if (ts === null || ts > now) continue;
    const overdueByADay = now - ts > 86400000;
    try {
      await self.registration.showNotification(overdueByADay ? titles.overdue : titles.due, {
        body: t.text, tag: t.id, icon: "icon-192.png", badge: "icon-monochrome-512.png",
        vibrate: [200, 100, 200], data: { todoId: t.id, open: "todo" }
      });
    } catch (e) { /* not permitted here */ }
    ids.push(t.id);
  }
  if (ids.length) {
    const when = new Date().toISOString();
    await markNotified(ids, when);
    (await self.clients.matchAll({ type: "window" }))
      .forEach((c) => c.postMessage({ type: "TODOS_NOTIFIED", ids, when }));
  }
}

async function notifyLoans() {
  const [loans, titles, sent] = await Promise.all([
    getLoans(),
    getMeta("loanTitles", { soon: "EMI due soon", today: "EMI due today", overdue: "EMI overdue" }),
    getMeta("loanSent", {})
  ]);
  const quiet = inQuietHours();
  let changed = false;
  for (const l of loans) {
    if (l.status !== "active" || !l.nextDue) continue;
    const d = daysUntil(l.nextDue); if (d === null) continue;
    let stage = null, body = "";
    if (d === 1) { stage = "soon"; body = `${l.name} · ${inr(l.emi)} — due tomorrow`; }
    else if (d === 0) { stage = "today"; body = `${l.name} · ${inr(l.emi)} — due today`; }
    else if (d < 0) { stage = "overdue:" + Math.floor(Math.abs(d) / 3); body = `${l.name} · ${inr(l.emi)} — ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"} late`; }
    if (!stage || quiet) continue;
    const key = `${l.id}|${l.nextDue}|${stage}`;
    if (sent[key]) continue;
    try {
      await self.registration.showNotification(titles[stage.split(":")[0]] || "EMI reminder", {
        body, tag: "loan-" + l.id, renotify: true, icon: "icon-192.png", badge: "icon-monochrome-512.png",
        vibrate: [200, 100, 200], data: { open: "loans", loanId: l.id }
      });
      sent[key] = Date.now(); changed = true;
    } catch (e) { /* not permitted here */ }
  }
  // forget reminders older than 60 days so the record doesn't grow forever
  const cutoff = Date.now() - 60 * 86400000;
  Object.keys(sent).forEach((k) => { if (sent[k] < cutoff) { delete sent[k]; changed = true; } });
  if (changed) await setMeta("loanSent", sent);
}

async function updateBadge() {
  try {
    if (!self.navigator || !self.navigator.setAppBadge) return;
    const [todos, loans] = await Promise.all([getTodos(), getLoans()]);
    const now = Date.now();
    let n = todos.filter((t) => { const ts = dueTimestamp(t); return !t.done && ts !== null && ts <= now; }).length;
    n += loans.filter((l) => l.status === "active" && l.nextDue && daysUntil(l.nextDue) <= 0).length;
    if (n > 0) await self.navigator.setAppBadge(n); else await self.navigator.clearAppBadge();
  } catch (e) { /* badge API unsupported */ }
}

async function checkAndNotify() {
  try { await notifyTodos(); } catch (e) {}
  try { await notifyLoans(); } catch (e) {}
  await updateBadge();
}

/* ---------------- Install / activate / update ---------------- */
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // add individually so one missing file never blocks the whole install
    await Promise.all(SHELL_FILES.map((f) => cache.add(new Request(f, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const old = keys.filter((k) => k.startsWith("smartcalc-") && k !== SHELL_CACHE && k !== RUNTIME_CACHE);
    await Promise.all(old.map((k) => caches.delete(k)));
    await self.clients.claim();
    if (old.length) {
      (await self.clients.matchAll({ type: "window" }))
        .forEach((c) => c.postMessage({ type: "SW_UPDATED", version: VERSION }));
    }
  })());
});

/* ---------------- Fetch: offline support ---------------- */
async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
async function networkFirstNav(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), NAV_TIMEOUT_MS))
    ]);
    if (res && res.ok) cache.put("./index.html", res.clone());
    return res;
  } catch (e) {
    return (await cache.match("./index.html", { ignoreSearch: true })) ||
      new Response("<h1>Offline</h1><p>Open the app once online to enable offline use.</p>",
        { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch: false });
  const refresh = fetch(req).then((res) => {
    if (res && (res.ok || res.type === "opaque")) {
      cache.put(req, res.clone());
      if (cacheName === RUNTIME_CACHE) trimCache(RUNTIME_CACHE, RUNTIME_MAX_ENTRIES);
    }
    return res;
  }).catch(() => null);
  return hit || (await refresh) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.includes("fcm-push-scope") || url.pathname.endsWith("firebase-messaging-sw.js")) return;
  if (req.mode === "navigate" && url.origin === self.location.origin) {
    event.respondWith(networkFirstNav(req));
  } else if (url.origin === self.location.origin) {
    if (SHELL_PATHS.has(url.pathname)) event.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
  } else if (CACHEABLE_HOSTS.has(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
  }
});

/* ---------------- Messages from the page ---------------- */
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SYNC_TODOS") {
    event.waitUntil(putTodos(msg.todos || []).then(updateBadge));
  } else if (msg.type === "SYNC_TITLES") {
    event.waitUntil(setMeta("titles", msg.titles));
  } else if (msg.type === "SYNC_LOANS") {
    event.waitUntil((async () => {
      await putLoans(msg.loans || []);
      if (msg.titles) await setMeta("loanTitles", msg.titles);
      await updateBadge();
    })());
  } else if (msg.type === "CHECK_NOW") {
    event.waitUntil(checkAndNotify());
  } else if (msg.type === "CHECK_LOANS") {
    event.waitUntil(notifyLoans().then(updateBadge).catch(() => {}));
  } else if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* ---------------- Background triggers ---------------- */
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-todos") event.waitUntil(checkAndNotify());
});
self.addEventListener("sync", (event) => {
  if (event.tag === "check-todos-once") event.waitUntil(checkAndNotify());
});

/* ---------------- Notification tap: open the RIGHT screen ---------------- */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const open = data.open || (data.todoId ? "todo" : "");
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const target = wins.find((c) => c.visibilityState === "visible") || wins[0];
    if (target && "focus" in target) {
      await target.focus();
      if (open === "orders") target.postMessage({ type: "OPEN_ORDERS" });
      else if (open) target.postMessage({ type: "OPEN_MODE", mode: open });
      return;
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow("./index.html" + (open ? "?shortcut=" + encodeURIComponent(open) : ""));
    }
  })());
});
