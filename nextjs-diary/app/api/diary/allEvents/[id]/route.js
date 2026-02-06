import { NextResponse } from 'next/server';
import { getAllEvents } from '@/app/lib/eventDataUtils'

// Handle GET request to retrieve all events
export async function GET(_request, { params }) { // The _request parameter is unused
    // Get user ID from params
    const { id } = await params;
    // Get all events for the user from database
    const events = await getAllEvents(id);
    
    // If no events found, return message
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    // Return events with successful response
    return NextResponse.json(events, {status: 200});
}