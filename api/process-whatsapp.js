import { db, admin } from "./_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success:false, message:"POST required" });

  try {
    const usersSnap = await db.ref("users").once("value");
    const users = usersSnap.val() || {};

    let count = 0;
    const tasks = [];

    Object.keys(users).forEach(uid => {
      const u = users[uid];
      if (u.whatsappConnected) {
        const p = db.ref(`earnings/${uid}`).push().set({
          type: "WhatsApp Earnings",
          amount: 50,
          timestamp: new Date().toISOString()
        }).then(() => {
          return db.ref(`users/${uid}`).update({
            coins: admin.database.ServerValue.increment(50),
            lastWhatsAppEarning: new Date().toISOString()
          });
        });
        tasks.push(p);
        count++;
      }
    });

    await Promise.all(tasks);

    res.status(200).json({ success:true, message:`Processed: ${count} users`, processed:count });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}