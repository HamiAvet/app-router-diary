import { NextResponse } from "next/server";
import { getExpiredEvents, deleteEventById } from "@/app/lib/eventDataUtils";
import { getFcmTokenByUserId, deleteFcmToken } from "@/app/lib/fcmDataUtils";
import { getFirebaseAdmin } from "@/app/lib/firebaseAdmin";

export const runtime = "nodejs";

const admin = getFirebaseAdmin();

export async function GET(request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader != `Bearer ${process.env.CRON_SECRET}`)
        return new Response("Unauthorized", {
        status: 401,
    });
    console.log("Cron Job Ran at: ", new Date());
    return NextResponse.json({ message: `Cron Job Ran at ${new Date()}` }, { status: 200 });
}