import { db, admin } from "./_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success:false, message:"POST required" });

  try {
    const { referralCode, newUserId } = req.body;

    if (!referralCode || !newUserId)
      return res.status(400).json({ success:false, message:"referralCode & newUserId required" });

    const snap = await db.ref("users")
      .orderByChild("referralCode")
      .equalTo(referralCode)
      .once("value");

    if (!snap.exists())
      return res.status(404).json({ success:false, message:"Invalid referral code" });

    const refObj = snap.val();
    const referrerId = Object.keys(refObj)[0];

    await db.ref(`users/${newUserId}`).update({
      referredBy: referralCode,
      coins: admin.database.ServerValue.increment(50)
    });

    await db.ref(`earnings/${referrerId}`).push().set({
      type: "Referral Bonus",
      amount: 100,
      timestamp: new Date().toISOString()
    });

    await db.ref(`users/${referrerId}`).update({
      coins: admin.database.ServerValue.increment(100)
    });

    res.status(200).json({
      success:true,
      message:"Referral applied",
      data:{ newUserBonus:50, referrerBonus:100 }
    });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}