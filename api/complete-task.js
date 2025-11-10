import { db, admin } from "./_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success:false, message:"POST required" });

  try {
    const { userId, taskId, taskName, reward } = req.body;
    if (!userId || !taskId || typeof reward === "undefined")
      return res.status(400).json({ success:false, message:"userId, taskId, reward required" });

    const earning = {
      type: `Task: ${taskName || taskId}`,
      amount: Number(reward),
      timestamp: new Date().toISOString(),
      taskId
    };

    await db.ref(`earnings/${userId}`).push().set(earning);

    await db.ref(`users/${userId}`).update({
      coins: admin.database.ServerValue.increment(Number(reward)),
      tasksCompleted: admin.database.ServerValue.increment(1)
    });

    res.status(200).json({ success:true, message:"Task completed", data:earning });

  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}