import { NextResponse } from 'next/server';
import { getAllEvents, updateEventStatus } from '@/app/lib/eventDataUtils'
import { getFcmTokenByUserId } from '@/app/lib/fcmDataUtils';

// Set runtime to Node.js for server-side operations
export const runtime = "nodejs";

// Handle GET request to retrieve all events
export async function GET(request, { params }) {
    // Get user ID from params
    const { userId } = await params;

    // Get all events for the user from database
    const events = await getAllEvents(userId);

    // If no events found, return message
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    // Check each event for expiration and send notification if expired
    const now = new Date();

    // Create an array to hold active events that will be returned in the response
    const activeEvents = [];

    // Process each event to check if it's expired and send notification if necessary
    for (const event of events) {
        // Determine the event's date and time, treating events without a specified hour as expiring at the end of the day (23:59)
        const eventDateTime = !event.hour? new Date(`${event.date}T23:59:00`) : new Date(`${event.date}T${event.hour}`);

        // If the event is still active, add it to the activeEvents array to be returned in the response
        if (eventDateTime >= now) {
            // Event is still active
            activeEvents.push(event);
        } else if (event.status !== 'Expired') {
            // Get fcm token for the user to send notification
            const fcmToken = await getFcmTokenByUserId(userId);

            // If a valid FCM token exists, send a notification to the user about the expired event
            if (fcmToken && fcmToken !== "null") {
                await fetch(new URL("/api/sendNotification", request.url), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: fcmToken,
                        title: "Event expired",
                        message: `Your event "${event.topic}" has expired.`,
                        link: "/diary"
                    })
                });
            }
            // Mark as notified so it won't spam on next call
            await updateEventStatus({ id: event.id, status: 'Expired' });
        }
        // If status === 'Expired' → already notified, just hide it
    }
    // Return active events with successful response
    return NextResponse.json(activeEvents, { status: 200 });
}