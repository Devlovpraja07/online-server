import { db } from "../../_firebase.js";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId)
    return res.status(400).json({ success:false, message:"userId required" });

  try {
    const userSnap = await db.ref(`users/${userId}`).once("value");
    const user = userSnap.val();

    if (!user || !user.referralCode)
      return res.status(200).json({ success:true, data:[] });

    const refSnap = await db.ref("users")
      .orderByChild("referredBy")
      .equalTo(user.referralCode)
      .once("value");

    const refs = refSnap.val() || {};
    const arr = Object.keys(refs).map(id => ({ id, ...refs[id] }));

    res.status(200).json({ success:true, data:arr });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}