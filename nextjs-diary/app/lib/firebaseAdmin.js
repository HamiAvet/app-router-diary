import admin from "firebase-admin";

function loadServiceAccountFromEnv() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    const jsonText = Buffer.from(b64, "base64").toString("utf8");
    return JSON.parse(jsonText);
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return JSON.parse(json);
  }

  return null;
}

export function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  const serviceAccount = loadServiceAccountFromEnv();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    return admin;
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_B64 (recommended) or FIREBASE_SERVICE_ACCOUNT_JSON, or configure GOOGLE_APPLICATION_CREDENTIALS."
  );
}
