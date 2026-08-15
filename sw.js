/* Smart Calculator — Service Worker
 * Purpose: fire real OS notifications for due To-Do tasks even when the
 * app's tab/window isn't open in the foreground, using:
 *   1. IndexedDB (readable by the SW, unlike localStorage) as a mirror
 *      of the page's todo list, kept in sync via postMessage whenever
 *      the page saves todos.
 *   2. The Periodic Background Sync API to periodically wake this SW
 *      and check for due tasks.
 *
 * Honest limits (same spirit as the rest of the app):
 * - Periodic Background Sync only exists on Chromium browsers, and only
 *   fires for a site the user has installed to their home screen (PWA)
 *   with reasonable "site engagement". The browser — not this code —
 *   decides the actual interval; it is a best-effort minimum, not a
 *   guarantee, and can be hours apart if the phone/app is rarely used.
 * - iOS Safari does not support Periodic Background Sync at all as of
 *   this writing. On iPhone, reminders still only fire reliably while
 *   the app tab is open in the foreground.
 * - This is NOT push-from-server. No data leaves the device. It is
 *   purely "let the browser occasionally wake this script to check a
 *   locally stored list".
 */

const DB_NAME = "smartcalc_todo_sw_db";
const STORE = "todos";
const META_STORE = "meta";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putTodos(todos) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    const store = tx.objectStore(STORE);
    (todos || []).forEach((t) => { if (t && t.id) store.put(t); });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getTodos() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function markNotified(ids, when) {
  if (!ids.length) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    ids.forEach((id) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const t = getReq.result;
        if (t) { t.notifiedAt = when; store.put(t); }
      };
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
    const tx = db.transaction(META_STORE, "readonly");
    const req = tx.objectStore(META_STORE).get(key);
    req.onsuccess = () => resolve(req.result === undefined ? fallback : req.result);
    req.onerror = () => reject(req.error);
  });
}

function dueTimestamp(t) {
  if (!t.dueDate) return null;
  const time = t.dueTime || "23:59";
  const ts = new Date(`${t.dueDate}T${time}:00`).getTime();
  return isNaN(ts) ? null : ts;
}

async function checkAndNotify() {
  const [todos, titles] = await Promise.all([
    getTodos(),
    getMeta("titles", { due: "Task due", overdue: "Task overdue" })
  ]);
  const now = Date.now();
  const notifiedIds = [];

  for (const t of todos) {
    if (t.done || t.notifiedAt) continue;
    const ts = dueTimestamp(t);
    if (ts === null || ts > now) continue;
    const overdueByADay = now - ts > 24 * 60 * 60 * 1000;
    try {
      await self.registration.showNotification(
        overdueByADay ? titles.overdue : titles.due,
        {
          body: t.text,
          tag: t.id,
          icon: "icon-192.png",
          badge: "icon-192.png",
          data: { todoId: t.id }
        }
      );
    } catch (e) { /* notifications not permitted / unsupported here */ }
    notifiedIds.push(t.id);
  }

  if (notifiedIds.length) {
    const when = new Date().toISOString();
    await markNotified(notifiedIds, when);
    const clientsList = await self.clients.matchAll({ type: "window" });
    clientsList.forEach((c) => c.postMessage({ type: "TODOS_NOTIFIED", ids: notifiedIds, when }));
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// The page calls postMessage with this whenever it saves todos, so the
// SW's own copy (in IndexedDB) stays current even though it can't read
// the page's localStorage directly.
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SYNC_TODOS") {
    event.waitUntil(putTodos(msg.todos || []));
  } else if (msg.type === "SYNC_TITLES") {
    event.waitUntil(setMeta("titles", msg.titles));
  } else if (msg.type === "CHECK_NOW") {
    event.waitUntil(checkAndNotify());
  }
});

// Fired by the browser on its own schedule (best-effort, Chromium-only,
// only for installed/home-screen apps) — this is what lets a reminder
// fire without the app being open at all.
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-todos") {
    event.waitUntil(checkAndNotify());
  }
});

// One-off Background Sync fallback (fires once when connectivity/battery
// allow, shortly after being requested) for browsers/situations where
// periodic sync isn't available.
self.addEventListener("sync", (event) => {
  if (event.tag === "check-todos-once") {
    event.waitUntil(checkAndNotify());
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of clientsList) {
      if ("focus" in c) return c.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow("./index.html");
  })());
});
