import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from "@/app/lib/firebaseAdmin";

export const runtime = "nodejs";

const admin = getFirebaseAdmin();

export async function POST(request) {
    const { token, title, message, link } = await request.json();
    
    const payload = {
        token: token,
        notification: {
            title: title,
            body: message
        },
        webpush: link && {
            fcmOptions: {
                link, // This will be used in the service worker to handle notification clicks
            }
        }
    };
    console.log(payload);
    

    try {
        const message = await admin.messaging().send(payload);
        return NextResponse.json({ success: true, message: message });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}