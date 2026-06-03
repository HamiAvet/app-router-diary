import admin from "firebase-admin";
import { NextResponse } from 'next/server';

export const runtime = "nodejs";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const serviceAccount = {
        "type": "service_account",
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": privateKey,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export async function POST(request) {
    const { token, title, message, link } = await request.json();

    // Important: When sending a notification, we need to ensure that the link is an absolute URL.
    // If the link is a relative URL, we need to prepend the app's base URL to it.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // If the link is provided, we create an absolute URL. If it's not provided, we can leave it as undefined.
    const clickLink = link
        ? new URL(link, appUrl).toString()
        : undefined;

    // Construct the notification payload
    const payload = {
        token,
        data: {
            title: title || "Notification",
            body: message || "",
            link: clickLink || "", // Include the link in the data payload for use in the service worker
            icon: "/diary-icon.png", // You can specify an icon for the notification
            badge: "/diary-icon.png", // You can specify a badge for the notification
        },
        webpush: {
            notification: {
                title: title || "Notification",
                body: message || "",
                icon: "/diary-icon.png", // You can specify an icon for the notification
                badge: "/diary-icon.png", // You can specify a badge for the notification
            },
            fcmOptions: clickLink ? { link: clickLink } : undefined, // Include the link in fcmOptions for use in the service worker's notification click handling
        },
    };

    try {
        const messageId = await admin.messaging().send(payload);
        return NextResponse.json({ success: true, message: messageId });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { success: false, error: error?.message },
            { status: 500 }
        );
    }
}