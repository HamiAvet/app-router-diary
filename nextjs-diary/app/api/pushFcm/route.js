import { NextResponse } from "next/server";
import { saveFcmToken, getFcmTokensByUserId } from "@/app/lib/fcmDataUtils";

export async function POST(request) {
    const { userId, token } = await request.json();
    const fcm = await getFcmTokensByUserId(userId);
    return NextResponse.json(fcm, { status: 200 });
}