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