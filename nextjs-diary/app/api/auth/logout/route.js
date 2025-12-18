import { NextResponse } from 'next/server';
import { endSessionUser } from '@/app/lib/session'

// Handle POST request for user logout
export async function POST() {
    // End session user
    await endSessionUser();

    // Return successful response
    return NextResponse.json("User's session was deleted", {status: 200});
}

