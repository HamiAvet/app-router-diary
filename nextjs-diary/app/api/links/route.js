import { NextResponse } from 'next/server';

export async function POST(request) {
    const contentType = await request.headers.get("Content-Type");
    if (contentType !== "application/json") {
        return NextResponse.json({"error": "Invalid Request"}, {status: 400});
    }
    const data = await request.json()    
    return NextResponse.json(data, {status: 201});
}