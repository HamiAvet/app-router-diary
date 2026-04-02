import { NextResponse } from 'next/server';
import { deleteUserById } from '@/app/lib/userDataUtils';
import { deleteAllUserEvents } from '@/app/lib/eventDataUtils';
import { endSessionUser } from '@/app/lib/session'

// Handle POST request to delete user account
export async function POST(request) {
    // Get data from request
    const data = await request.json();

    // If user ID is not provided, return error
    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // End session user
    await endSessionUser();

    // Delete all events for the user
    await deleteAllUserEvents(data.id);

    // Delete user by ID
    await deleteUserById(data.id);
    // Return successful response
    return NextResponse.json({message : "Your account was deleted successfully"}, { status: 200 });
}
