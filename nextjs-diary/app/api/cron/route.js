import { NextResponse } from "next/server";
import { getExpiredEvents, deleteEventById } from "@/app/lib/eventDataUtils";
import { getFcmTokenByUserId, deleteFcmToken } from "@/app/lib/fcmDataUtils";
import admin from "firebase-admin";

export const runtime = "nodejs";

if (!admin.apps.length) {
  const serviceAccount = require("@/serviceAccountKey.json");
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