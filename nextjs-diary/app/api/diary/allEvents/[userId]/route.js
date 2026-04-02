import { NextResponse } from 'next/server';
import { getAllEvents } from '@/app/lib/eventDataUtils'
import { getFcmTokenByUserId } from "@/app/lib/fcmDataUtils";

// Handle GET request to retrieve all events
export async function GET(request, { params }) { // The _request parameter is unused
    // Get user ID from params
    const { userId } = await params;
    console.log(userId);
    
    // Get all events for the user from database
    const events = await getAllEvents(userId);
    
    /////////////////////////////////////////////

    // If no events found, return message
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    // Get current date and time
    const now = new Date();

    // For each event, check if the event date and time has already passed
    events.forEach(async (event) => {
        // Initialize eventDateTime variable
        let eventDateTime;
        // If hour is not provided, set time to 23:59 of the event date. Else, set time to provided hour
        if (!event.hour) {
          eventDateTime = new Date(`${event.date}T23:59`);  

        } else {
          eventDateTime = new Date(`${event.date}T${event.hour}`);  
        }

        // If event date and time has already passed, delete the event and send a notification to the user
        if (eventDateTime < now) {
            await fetch(new URL(`/api/diary/concreteEvent/${event.id}`, request.url), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: event.id })
            });
            // Send a notification to the user about the deleted event
            const fcmToken = await getFcmTokenByUserId(userId);
            
            if (fcmToken && fcmToken !== "null") {
                await fetch(new URL("/api/sendNotification", request.url), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        token: fcmToken,
                        title: "Event was deleted",
                        message: `Your event "${event.topic}" has been deleted.`,
                        link: "/diary" // You can include a link in the notification payload if needed
                    })
                });
            }
        };
    });

    // Return events with successful response
    return NextResponse.json(events, {status: 200});
}