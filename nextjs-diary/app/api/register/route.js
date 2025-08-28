import { NextResponse } from 'next/server';
import { addUser } from '@/app/lib/data'


/*export async function GET() {

    if () {
        return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }
    return NextResponse.json(events, {status: 200});
}*/

export async function POST(request) {
    const data = await request.json()
    console.log(data);
    
    if (!data.username || !data.email || !data.password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const dbResponse = await addUser(data)    
    return NextResponse.json(dbResponse, {status: 201});
}

