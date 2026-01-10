import { NextResponse } from 'next/server';
import { verifySessionUser } from "@/app/lib/session";

// Handle GET request to provide available session providers
export async function GET() {
    try {
        // Get the current session user
        const sessionUser = await verifySessionUser();

        // If there is no active session, return 400 status
        if (sessionUser === false) {
            return NextResponse.json({message : "A user is not authenticated"}, { status: 200 });
        } 

        // If there is an active session, return 200 status
        return NextResponse.json({message : "A user is authenticated"}, { status: 201 });

        // Return the session user as JSON response
    } catch (error) {
        return NextResponse.json({ message: 'Error retrieving session user', error: error.message }, { status: 500 });
    }
}