import admin from "firebase-admin";

function loadServiceAccountFromEnv() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_B64 (base64-encoded Firebase service account JSON)."
    );
  }

  const json = Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json);
}

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccountFromEnv();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
}
