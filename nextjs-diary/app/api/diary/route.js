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
    if (!data.topic || !data.category || !data.date || !data.hour) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const dbResponse = await addEvent(data)    
    return NextResponse.json(dbResponse, {status: 201});
}

