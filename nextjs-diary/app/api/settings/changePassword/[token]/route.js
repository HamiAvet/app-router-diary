import { NextResponse } from 'next/server';
import { getTokenData } from '@/app/lib/tokenDataUtils';

// Handle POST request to change password using token
export async function GET(request) {
    // Extract token from the URL
    const token = request.url.split('/').pop();

    // If token is not provided, return error
    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Get token data from the database
    const tokenData = await getTokenData(token);
    
    // If token data is not found, return error
    if (!tokenData || tokenData.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Return successful response
    return NextResponse.json({ message: `The Token is valid`, tokenData: tokenData },  { status: 200 });
}