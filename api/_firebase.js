// api/_firebase.js
import admin from "firebase-admin";

const {
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PROJECT_ID,
  FIREBASE_DATABASE_URL
} = process.env;

if (!FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PROJECT_ID) {
  // do not throw here; handlers will check and return error if needed
  console.warn("WARNING: Firebase env vars are not fully set.");
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // Replace literal "\n" with newlines if the key was pasted with \n
        privateKey: FIREBASE_PRIVATE_KEY ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined
      }),
      databaseURL: FIREBASE_DATABASE_URL || `https://${FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  } catch (err) {
    // sometimes initialization can fail in dev if vars missing — log for debugging
    console.error("Firebase init error:", err.message || err);
  }
}

const db = admin.database ? admin.database() : null;

export { admin, db };