import { NextResponse } from 'next/server';

// Handle POST request to edit an existing event
export async function POST(request) {
    // Get event data from request
    const data = await request.json();
    console.log(data);
    

    return NextResponse.json({ success: true }, {status: 201});
}