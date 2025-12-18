import { NextResponse } from 'next/server';
import { changeUserNameById, changeUserEmailById, changeUserPasswordById } from '@/app/lib/userDataUtils';
import { verifyPassword } from '@/app/lib/passwordUtils'

// Handle POST request to update user settings
export async function POST(request) {
    // Get data from request
    const data = await request.json();

    // Initialize error object
    const errors = {
        newEmailError: null,
        newPasswordError: null,
        newPasswordConfirmError: null
    };
    
    // If user ID is not provided, return error
    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }
    // Update user information based on provided data
    if (data.newUsername) {
        await changeUserNameById(data);
    }
    // Update email if provided
    if (data.newEmail) {
        const dbResponse = await changeUserEmailById(data);
        // If email is duplicate, set error message
        if (dbResponse.message && dbResponse.message === 'duplicate key value violates unique constraint "users_email_key"') {
            errors.newEmailError = 'Email already in use';
        }
    }
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
}
