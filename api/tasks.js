import { db } from "./_firebase.js";

export default async function handler(req, res) {
  try {
    const snap = await db.ref("tasks").once("value");
    let tasks = snap.val() || {};

    if (!Object.keys(tasks).length) {
      tasks = {
        task1: { id:"task1", title:"Download App A", reward:50, status:"active" },
        task2: { id:"task2", title:"Complete Survey", reward:30, status:"active" }
      };
      await db.ref("tasks").set(tasks);
    }

    const arr = Object.keys(tasks).map(id => tasks[id]);

    res.status(200).json({ success:true, data:arr });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
}