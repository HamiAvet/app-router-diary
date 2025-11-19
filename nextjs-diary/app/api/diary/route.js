import { NextResponse } from 'next/server';
import { addEvent, getEvent} from '@/app/lib/data'


export async function GET() {
    const events = await getEvent();
    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }
    return NextResponse.json(events, {status: 200});
}

export async function POST(request) {
    const data = await request.json()
    console.log(data);

    const errors = {
        topicError: data.topic === "" ? 'Topic is required' : null,
        dateError: data.date === "" ? 'Date is required' : null,
        dateTimePassedError: null,
    };

    if (errors.topicError != null || errors.dateError != null) {
        return NextResponse.json(errors, { status: 400});       
    }

    const now = new Date();
    let eventDateTime;
    const eventDate = String(data.date);
    const eventHour = String(data.hour);

    if (!eventHour) {
        eventDateTime = new Date(`${eventDate}T00:00`);
    } else {
        eventDateTime = new Date(`${eventDate}T${eventHour}`);       
    } 

    if (eventDateTime < now) {
        errors.passedError.dateTimePassedError = "The selected date and time has already passed";
        return NextResponse.json(errors, { status: 400});
    }

    const dbResponse = data    
    return NextResponse.json(dbResponse, {status: 201});
}

