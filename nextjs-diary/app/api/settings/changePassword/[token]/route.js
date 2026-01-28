import { NextResponse } from 'next/server';
import { getTokenData } from '@/app/lib/tokenDataUtils';

// Handle POST request to change password using token
export async function GET(request) {
    // Extract token from the URL
    const token = request.url.split('/').pop();

    // Get token data from the database
    console.log("The token is :", token);
    
    const tokenData = await getTokenData(token);
    console.log("The tokenData is :", tokenData);
    
    
    // If token data is not found, return error
    if (tokenData.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Return successful response
    return NextResponse.json({ message: `The Token is valid`, tokenData: tokenData },  { status: 200 });
}