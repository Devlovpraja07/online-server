import { db } from "../../_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success:false, message:"POST required" });

  try {
    const { userId, fullName, phone, referralCode } = req.body;
    if (!userId || !fullName)
      return res.status(400).json({ success:false, message:"userId & fullName required" });

    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");

    if (snapshot.exists())
      return res.status(409).json({ success:false, message:"User already exists" });

    const newUser = {
      fullName,
      phone: phone || null,
      coins: 0,
      tasksCompleted: 0,
      referralCode: referralCode || null,
      createdAt: new Date().toISOString()
    };

    await userRef.set(newUser);

    res.status(201).json({ success:true, message:"User created", data:newUser });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}