import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAllExpiredEvents, updateEventStatus, deleteEvent } from "@/app/lib/eventDataUtils";
import { getFcmTokenByUserId } from "@/app/lib/fcmDataUtils";

// Set runtime to Node.js for server-side operations
export const runtime = "nodejs";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  // Replace escaped newlines in the private key with actual newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  // Create service account object using environment variables
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

  // Initialize Firebase Admin SDK with the service account credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET(request) {
  // Check for authorization header
  const auth = request.headers.get("authorization");

  // If the CRON_SECRET is not set or the authorization header does not match, return unauthorized response
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Get all expired events
  const events = await getAllExpiredEvents();
  
  // If there are no expired events, return a message indicating that there are no expired events
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ ok: true, message: "No expired events", date: new Date().toISOString() }, { status: 200 });
  }

  // Create variable to track notification results for debugging
  let notified = 0;
  let deleted = 0;
  let skipped = 0;

  // Process each expired event
  for (const event of events) {
    // Get the user ID associated with the event
    const userId = event.userid;

    // If the event is already marked as 'Expired'
    if (event.status === 'Expired') {
          console.log("Event is deleted");
      // Already notified → delete the event
      await deleteEvent({ id: event.id });
      // Increment deleted count for debugging
      deleted++;
      // Continue to the next event
      continue;
    }


    // If the event is not marked as 'Expired'

    // Get the FCM token for the user
    const fcmToken = await getFcmTokenByUserId(userId);

    // If the FCM token exists and is not "null", send a notification
    if (fcmToken && fcmToken !== "null") {
      try {
        // Send a notification to the user about the expired event
        await admin.messaging().send({
          token: fcmToken,
          notification: {
            title: "Event expired",
            body: `Your event "${event.topic}" has expired.`,
          },
          // Include a link in the notification payload to direct the user to the diary page
          webpush: {
            fcmOptions: {
              link: new URL("/diary", request.url).toString(),
            },
          },
        });
        // Increment notified count for debugging
        notified++;
      } catch (error) {
        // Log any errors that occur while sending the notification
        console.error("Error sending notification:", error);
      }
    } else {
      // Increment skipped count for debugging
      skipped++;
    }
    // Mark the event as 'Expired' to indicate that the user has been notified (or attempted to be notified)
    await updateEventStatus({ id: event.id, status: 'Expired' });
    console.log(`Event is 'Expired'`);
    
  }

  // Return a response indicating the results of the cron job, including counts of notified, deleted, and skipped events for debugging purposes
  return NextResponse.json({
    success: true,
    date: new Date().toISOString(),
    notified,
    deleted,
    skipped,
  }, { status: 200 });
}