import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/userDataUtils';
import { verifyPassword } from '@/app/lib/passwordUtils';
import { setSessionUser } from '@/app/lib/session';

// Handle POST request for user login
export async function POST(request) {
    // Get data from request
    const data = await request.json();

    // Validate input data
    const errors = {
        emailError: data.email === "" ? 'Email is required' : null,
        passwordError: data.password === "" ? 'Password is required' : null,
    };    

    // If there are validation errors, return them
    if (errors.emailError != null || errors.passwordError != null) {
        return NextResponse.json(errors, { status: 400});       
    }

    // Get user by email
    const dbResponse = await getUserByEmail(data);

    // Get the first user record from the response
    const userRecord = dbResponse[0];

    // If user not found, return error
    if (!userRecord) {
        errors.emailError = 'User is not found';
        return NextResponse.json(errors, { status: 400});
    }

    // Get user ID
    const userRecordId = userRecord.id;

    // Verify password
    const passwordMatch = userRecord && verifyPassword(data.password, userRecord.password);

    // If password does not match, return error
    if (!passwordMatch) {    
        errors.passwordError = 'Incorrect Password';
        return NextResponse.json(errors, { status: 400 });
    } 

    // Set session user
    await setSessionUser(userRecordId);

    // Return successful response with user data
    return NextResponse.json(dbResponse, {status: 201});
}

