import { db } from "../../_firebase.js";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId)
    return res.status(400).json({ success:false, message:"userId required in path" });

  try {
    if (req.method === "GET") {
      const snap = await db.ref(`users/${userId}`).once("value");
      if (!snap.exists())
        return res.status(404).json({ success:false, message:"User not found" });

      return res.status(200).json({ success:true, data:snap.val() });
    }

    if (req.method === "PUT") {
      await db.ref(`users/${userId}`).update(req.body);
      const updated = await db.ref(`users/${userId}`).once("value");

      return res.status(200).json({ success:true, data:updated.val() });
    }

    return res.status(405).json({ success:false, message:"Method not allowed" });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}