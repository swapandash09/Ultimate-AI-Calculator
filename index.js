/**
 * Cloud Functions for Smart Calculator push alerts.
 *   notifyNewOrder  - runs the moment a customer's order is written to Firestore "orders"
 *   sendDueTodos    - runs every minute and pushes to-dos whose time has come
 * Both send to every phone registered in the "pushTokens" collection.
 */
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// >>> Set this to your Firestore database location (Firebase Console > Firestore Database,
// >>> shown at the top of the Data tab), e.g. "asia-south1" for Mumbai, "us-central1", "nam5"...
const REGION = "asia-south1";

async function pushToAll(data) {
  const snap = await db.collection("pushTokens").get();
  const tokens = snap.docs.map((d) => d.id);
  if (!tokens.length) return { sent: 0, removed: 0 };
  let sent = 0;
  const dead = [];
  for (let i = 0; i < tokens.length; i += 500) {
    const chunk = tokens.slice(i, i + 500);
    const res = await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      data, // data-only: firebase-messaging-sw.js builds the notification itself
      webpush: { headers: { Urgency: "high", TTL: "86400" } },
    });
    res.responses.forEach((r, idx) => {
      if (r.success) { sent++; return; }
      const code = r.error && r.error.code;
      if (code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token" ||
          code === "messaging/invalid-argument") dead.push(chunk[idx]);
    });
  }
  await Promise.all(dead.map((t) => db.collection("pushTokens").doc(t).delete().catch(() => {})));
  return { sent, removed: dead.length };
}

exports.notifyNewOrder = onDocumentCreated(
  { document: "orders/{orderId}", region: REGION },
  async (event) => {
    const o = event.data && event.data.data();
    if (!o) return;
    const name = String(o.customerName || "Customer").slice(0, 40);
    const n = Array.isArray(o.items) ? o.items.length : 0;
    const total = Number(o.total) || 0;
    await pushToAll({
      title: `New order · ${name}`,
      body: `₹${total.toLocaleString("en-IN")} · ${n} item${n === 1 ? "" : "s"}`,
      url: "./?open=orders",
      tag: "order-" + event.params.orderId,
    });
  }
);

exports.sendDueTodos = onSchedule(
  { schedule: "every 1 minutes", region: REGION, timeZone: "Asia/Kolkata" },
  async () => {
    const snap = await db.collection("todoReminders")
      .where("dueAt", "<=", admin.firestore.Timestamp.now())
      .limit(50)
      .get();
    if (snap.empty) return;
    const texts = snap.docs.map((d) => d.get("text") || "Task due");
    await pushToAll({
      title: texts.length === 1 ? "To-Do due" : `${texts.length} tasks due`,
      body: texts.slice(0, 3).join(" · "),
      url: "./",
      tag: "todo-due",
    });
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
);
