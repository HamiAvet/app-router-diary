import { NextResponse } from 'next/server';
import { addEvent, getEvent } from '@/app/lib/eventDataUtils'


// Handle POST request to add a new event
export async function POST(request) {
    // Get event data from request
    const data = await request.json();
    
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
    const existingEvent = await getEvent(data);
    
    // If event already exists, return error
    if (existingEvent && existingEvent.length > 0) {
        errors.alreadyExists = 'This event is already exists';
        return NextResponse.json(errors, { status: 400});
    }

    // Add event to database
    const dbResponse = await addEvent(data);

    // Return successful response with event data
    return NextResponse.json(dbResponse, {status: 201});
}

