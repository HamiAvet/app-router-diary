import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAllEvents, updateEventStatus, updateEventReminderSent, deleteEvent } from "@/app/lib/eventDataUtils";
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

function getEventDate(event) {
  const hour = event.hour || "23:59";
  return new Date(`${event.date}T${hour}:00`);
}

async function sendNotification({ token, title, body, request }) {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
    webpush: {
      fcmOptions: {
        link: new URL("/diary", request.url).toString(),
      },
    },
  });
}

export async function GET(request) {
  // Check for authorization header
  const auth = request.headers.get("authorization");

  // If the CRON_SECRET is not set or the authorization header does not match, return unauthorized response
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Get all events
  const events = await getAllEvents();
  
  // If there are no events, return a message indicating that there are no events
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ success: false, message: "There are no events", date: new Date().toISOString() }, { status: 200 });
  }

  // Create variable to track notification results for debugging
  let notified = 0;
  let deleted = 0;
  let skipped = 0;

  // Get the current date and time
  const now = new Date();

  // Process each event
  for (const event of events) {
    // Get the user ID associated with the event
    const userId = event.userid || event.userId;

    // If there is no userId, just skip it
    if (!userId) {
      skipped++;
      continue;
    }

    // If the event is already marked as 'Expired'
    if (event.status === "Expired") {
      // Already notified → delete the event
      await deleteEvent({ id: event.id });

      // Increment deleted count for debugging
      deleted++;

      // Continue to the next event
      continue;
    }

    // Convert event date and hour into a JavaScript Date object
    const eventDate = getEventDate(event);

    // Get the FCM token for the user
    const fcmToken = await getFcmTokenByUserId(userId);

    // If the date of the event is passed, mark it as Expired
    if (eventDate < now) {
      // Mark the event as Expired
      await updateEventStatus({
        id: event.id,
        status: "Expired",
      });
      console.log("Event expired")
      // If the FCM token exists and is not "null", send a notification
      if (fcmToken && fcmToken !== "null") {
        try {
          // Send a notification to the user about the expired event
          await sendNotification({
            token: fcmToken,
            title: "Event expired",
            body: `Your event "${event.topic}" has expired.`,
            request,
          });

          // Increment notified count for debugging
          notified++;
        } catch (error) {
          // Log notification error
          console.error("Error sending notification:", error);

          // Increment skipped count for debugging
          skipped++;
        }
      } else {
        // Increment skipped count for debugging
        skipped++;
      }

      // Continue to the next event
      continue;
    }

    // If the event is not Active, skip it
    if (event.status !== "Active") {
      skipped++;
      continue;
    }

    // Define time values in milliseconds
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDays = 3 * oneDay;
    const oneWeek = 7 * oneDay;

    // Calculate the remaining time before the event
    const diffMs = eventDate.getTime() - now.getTime();

    // Create variables for the reminder
    let reminderType = "";
    let notifMessage = "";

    // If the event is less than one day away
    if (diffMs < oneDay) {
      reminderType = "1day";
      notifMessage = `Don't forget, your event "${event.topic}" is less than a day away!`;
      console.log("notifMessage : ", notifMessage)
    }

    // Else if the event is less than three days away
    else if (diffMs < threeDays) {
      reminderType = "3days";
      notifMessage = `Don't forget, your event "${event.topic}" is less than 3 days away!`;
      console.log("notifMessage : ", notifMessage)
    }

    // Else if the event is less than one week away
    else if (diffMs < oneWeek) {
      reminderType = "week";
      notifMessage = `Don't forget, your event "${event.topic}" is less than a week away!`;
      console.log("notifMessage : ", notifMessage)
    }

    // Else no reminder is needed
    else {
      skipped++;
      continue;
    }

    // If this reminder has already been sent, skip it
    if (event.reminder_sent === reminderType) {
      skipped++;
      continue;
    }

    // If there is no valid FCM token, skip it
    if (!fcmToken || fcmToken === "null") {
      skipped++;
      continue;
    }

    try {
      // Send reminder notification
      await sendNotification({
        token: fcmToken,
        title: "Event reminder",
        body: notifMessage,
        request,
      });

      // Save the reminder type to avoid duplicate notifications
      await updateEventReminderSent({
        id: event.id,
        reminder_sent: reminderType,
      });

      // Increment notified count for debugging
      notified++;
    } catch (error) {
      // Log notification error
      console.error("Error sending reminder notification:", error);

      // Increment skipped count for debugging
      skipped++;
    }
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