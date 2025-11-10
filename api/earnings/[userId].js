import { db, admin } from "../../_firebase.js";

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success:false, message:"userId required" });

  try {
    if (req.method === "GET") {
      const snap = await db.ref(`earnings/${userId}`).once("value");
      const data = snap.val() || {};

      const arr = Object.keys(data).map(id => ({ id, ...data[id] }))
        .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));

      return res.status(200).json({ success:true, data:arr });
    }

    if (req.method === "POST") {
      const { type, amount } = req.body;
      if (!type || typeof amount === "undefined")
        return res.status(400).json({ success:false, message:"type & amount required" });

      const earning = { type, amount:Number(amount), timestamp:new Date().toISOString() };
      await db.ref(`earnings/${userId}`).push().set(earning);

      await db.ref(`users/${userId}`).update({
        coins: admin.database.ServerValue.increment(Number(amount))
      });

      return res.status(201).json({ success:true, message:"Earning added", data:earning });
    }

    return res.status(405).json({ success:false, message:"Method not allowed" });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}