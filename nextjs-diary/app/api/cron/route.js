import { NextResponse } from "next/server";
import { getExpiredEvents, deleteEventById } from "@/app/lib/eventDataUtils";
import { getFcmTokenByUserId, deleteFcmToken } from "@/app/lib/fcmDataUtils";
import admin from "firebase-admin";

export const runtime = "nodejs";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET(request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader != `Bearer ${process.env.CRON_SECRET}`)
        return new Response("Unauthorized", {
        status: 401,
    });
    console.log("Cron Job Ran at: ", new Date());
    return NextResponse.json({ message: `Cron Job Ran at ${new Date()}` }, { status: 200 });
}