import { NextResponse } from 'next/server';
import { deleteUserById } from '@/app/lib/userDataUtils';

// Handle POST request to delete user account
export async function POST(request) {
    // Get data from request
    const data = await request.json();

    // If user ID is not provided, return error
    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    // Delete user by ID
    await deleteUserById(data.id);
    // Return successful response
    return NextResponse.json({message : "Your account was deleted successfully"}, { status: 200 });
}
