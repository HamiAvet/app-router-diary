import { NextResponse } from 'next/server';
import { getUserById } from '@/app/lib/userDataUtils';

// Handle GET request to retrieve user settings by user ID
export async function GET(request) {
    // Extract user ID from request URL
    const userId = request.url.split('/').pop();

    // If user ID is not provided, return error
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user by ID
    const user = await getUserById(userId);

    // If user not found, return error
    if (!user || user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data
    return NextResponse.json(user, { status: 201 });
}
