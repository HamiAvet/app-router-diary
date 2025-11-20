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
    const now = new Date();
    if (!data.hour || data.hour === "") {
        data.hour = "00:00";
    }
    let eventDateTime;
    eventDateTime = new Date(`${data.date}T${data.hour}`);    
    const errors = {
        topicError: data.topic === "" ? 'Topic is required' : null,
        dateError: data.date === "" ? 'Date is required' : null,
        dateTimePassedError: eventDateTime < now ? "The selected date and time has already passed" : null,
    };

    if (errors.topicError != null || errors.dateError != null || errors.dateTimePassedError != null) {
        return NextResponse.json(errors, { status: 400});       
    }

    const dbResponse = await addEvent(data);
    return NextResponse.json(dbResponse, {status: 201});
}

