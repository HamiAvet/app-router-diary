import { NextResponse } from 'next/server';
import { getTokenData } from '@/app/lib/tokenDataUtils';
import { getUserIdByToken } from '@/app/lib/userDataUtils';

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

/*export async function POST(request) {
    // Update password if provided
    if (data.newPassword) {
        if (!data.newPasswordConfirm) {
            errors.newPasswordConfirmError = 'Please confirm your new password';
        } else if (data.newPasswordConfirm && data.newPassword !== data.newPasswordConfirm) {      
            errors.newPasswordConfirmError = 'Passwords do not match';
        }     
        // Verify old password before changing to new password 
        const passwordMatch = verifyPassword(data.newPassword, data.oldPassword);
        // If old password does not match, set new password
        if (!passwordMatch) {
            changeUserPasswordById(data)
        }
    }
    // If there are any errors, return them
    if (errors.newEmailError || errors.newPasswordError || errors.newPasswordConfirmError) {
        return NextResponse.json(errors, { status: 400});
    }
    // Return successful response
    return NextResponse.json({message : "Your account was updated successfully"}, { status: 200 });
}*/