import { NextResponse } from 'next/server';
import { deleteEvent, updateEventStatus, updateEvent, getEvent, verifyEventExistence} from '@/app/lib/eventDataUtils';

// Handle GET request to retrieve all events
export async function GET(_request, { params }) { // The _request parameter is unused
    // Get user ID from params
    const { id } = await params;
    // Get event for the user from database
    const event = await getEvent(id);
    
    // If no event found, return message
    if (!event || event.length === 0) {
        return NextResponse.json({ message: 'No event found' }, { status: 404 });
    }

    // Return event with successful response
    return NextResponse.json(event, {status: 200});
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
export async function PATCH(request) {
  // Get event data from request body
  const { event, userId } = await request.json();
  console.log(userId);
  
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

// Handle PUT request to update the entire event
export async function PUT(request) {
  // Get event data from request body
  const  data  = await request.json();
  
  // If event or event ID is not provided, return error
  if (!data || !data.id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 401 });
  }

  // Get current date and time
  const now = new Date();
  let eventDateTime;

  if (!data.hour || data.hour === "") {
      // If hour is not provided, set time to 00:00
      eventDateTime = new Date(`${data.date}T00:00`);    
  } else {
      // Else, set time to provided hour
      eventDateTime = new Date(`${data.date}T${data.hour}`);        
  }

  // Validate input data
  const errors = {
      topicError: data.topic === "" ? "Topic is required" : null,
      dateError: data.date === "" ? "Date is required" : null,
      dateTimePassedError: eventDateTime < now ? "The selected date and time has already passed" : null,
      alreadyExists: data.alreadyExists || ""
  };
  
  // If there are validation errors, return them
  if (errors.topicError != null || errors.dateError != null || errors.dateTimePassedError != null) {
      return NextResponse.json(errors, { status: 400});       
  }    

  // Testing if the event is already existing
  const existingEvent = await verifyEventExistence(data);
  
  // If event already exists, return error
  if (existingEvent && existingEvent.length > 0) {
      errors.alreadyExists = 'This event already exists';
      return NextResponse.json(errors, { status: 400});
  }

  // Update event status in database
  await updateEvent(data);
  
  // Return successful response
  return NextResponse.json({ success: true }, { status: 202 });
}