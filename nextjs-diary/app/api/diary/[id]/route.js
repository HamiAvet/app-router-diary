import { NextResponse } from 'next/server';
import { deleteEvent, updateEventStatus, getAllEvents } from '@/app/lib/eventDataUtils'

// Handle GET request to retrieve all events
export async function GET(request, { params }) {
    // Get all events from database
    const { id } = await params;
    const events = await getAllEvents(id);
    

    // If no events found, return message
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    // Return events with successful response
    return NextResponse.json(events, {status: 200});
}


// Handle DELETE request to delete an event
export async function DELETE(request) {
  // Get event ID from request body
  const { id } = await request.json();

  // If ID is not provided, return error
  if (!id) { 
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  // Delete event by ID
  await deleteEvent({ id: Number(id) });
  // Return successful response
  return NextResponse.json({ success: true }, { status: 201 });
}

// Handle PUT request to update event status
export async function PUT(request) {
  // Get event data from request body
  const { event } = await request.json();

  // If event or event ID is not provided, return error
  if (!event || !event.id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 401 });
  }

  // If status is invalid, return error
  if (!event.status || (event.status !== 'Active' && event.status !== 'Done')) {
    return NextResponse.json({ error: 'Wrong status' }, { status: 400 });
  }

  // Toggle event status
  if (event.status === 'Done') {
    event.status = 'Active';
  } else {
    event.status = 'Done';
  }

  // Update event status in database
  await updateEventStatus(event);

  // Return successful response
  return NextResponse.json({ success: true }, { status: 202 });
}
