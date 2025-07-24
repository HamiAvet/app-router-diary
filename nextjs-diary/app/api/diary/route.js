import { NextResponse } from 'next/server';
import { addEvent } from '@/app/lib/data'
import { getEvent } from '@/app/lib/data';

export async function GET() {
    const events = await getEvent();
    return NextResponse.json(events, {status: 200});
}

export async function POST(request) {
    const data = await request.json()
    
    const dbResponse = await addEvent(data)    
    
    return NextResponse.json(dbResponse, {status: 201});
}