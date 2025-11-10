import { db } from "./_firebase.js";

export default async function handler(req, res) {
  try {
    let dbOk = false;
    if (db) {
      try {
        await db.ref(".info/connected").once("value");
        dbOk = true;
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: "EarnApp API running",
      time: new Date().toISOString(),
      databaseConnected: dbOk
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}