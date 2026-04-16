import { NextResponse } from 'next/server';
import { getAllEvents, updateEventStatus } from '@/app/lib/eventDataUtils'
import { getFcmTokenByUserId } from '@/app/lib/fcmDataUtils';

export const runtime = "nodejs";

// Handle GET request to retrieve all events
export async function GET(request, { params }) {
    const { userId } = await params;
    const events = await getAllEvents(userId);

    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    const now = new Date();
    const activeEvents = [];

    for (const event of events) {
        const eventDateTime = !event.hour
            ? new Date(`${event.date}T23:59:00`)
            : new Date(`${event.date}T${event.hour}`);

        if (eventDateTime >= now) {
            // Event is still active
            activeEvents.push(event);
        } else if (event.status !== 'Expired') {
            // Event just expired and hasn't been notified yet → send one notification
            const fcmToken = await getFcmTokenByUserId(userId);

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

    return NextResponse.json(activeEvents, { status: 200 });
}