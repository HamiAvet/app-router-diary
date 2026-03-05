import admin from "firebase-admin";
import { NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = require("@/serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

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

    try {
        const message = await admin.messaging().send(payload);
        return NextResponse.json({ success: true, message: message });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}