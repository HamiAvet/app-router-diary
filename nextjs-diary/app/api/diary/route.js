import { NextResponse } from 'next/server';
import { addEvent, getAllEvents, getEvent} from '@/app/lib/data'


export async function GET() {
    const events = await getAllEvents();
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }
    return NextResponse.json(events, {status: 200});
}

export async function POST(request) {
    const data = await request.json()
    const now = new Date();
    let eventDateTime;

    if (!data.hour || data.hour === "") {
        eventDateTime = new Date(`${data.date}T00:00`);    
    } else {
        eventDateTime = new Date(`${data.date}T${data.hour}`);        
    }
    const errors = {
        topicError: data.topic === "" ? "Topic is required" : null,
        dateError: data.date === "" ? "Date is required" : null,
        dateTimePassedError: eventDateTime < now ? "The selected date and time has already passed" : null,
        alreadyExists: data.alreadyExists || ""
    };

    if (errors.topicError != null || errors.dateError != null || errors.dateTimePassedError != null) {
        return NextResponse.json(errors, { status: 400});       
    }    
    // Testing if the event is already existing
    const existingEvent = await getEvent(data);
    
    if (existingEvent && existingEvent.length > 0) {
        errors.alreadyExists = 'This event is already exists';
        return NextResponse.json(errors, { status: 400});
    }

    const dbResponse = await addEvent(data);
    return NextResponse.json(dbResponse, {status: 201});
}

