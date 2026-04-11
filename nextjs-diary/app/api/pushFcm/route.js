import { NextResponse } from "next/server";
import { addFcmToken } from "@/app/lib/fcmDataUtils";

export async function POST(request) {
    // Get user ID and FCM token from request body
    const { userId, fcmtoken } = await request.json();

    // Validate input data    
    if (!userId || !fcmtoken) {
        return NextResponse.json({ message: "User ID and FCM token are required" }, { status: 400 });
    }

    // Save the FCM token in the database
    await addFcmToken(userId, fcmtoken);
    
    // Return successful response
    return NextResponse.json({ status: 201 });
}