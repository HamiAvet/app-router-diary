import { NextResponse } from 'next/server';
import { addUser } from '@/app/lib/userDataUtils'

// Handle POST request for user registration
export async function POST(request) {
    // Get data from request
    const data = await request.json();
    
    // Validate input data
    const errors = {
        usernameError: data.username === "" ? 'Username is required' : null,
        emailError: data.email === "" ? 'Email is required' : null,
        passwordError: data.password === "" ? 'Password is required' : null,
        passwordConfirmError: data.password !== data.passwordConfirm ? "Passwords do not match" : null
    };
    
    // Validate password strength
    const validedPasswordLength = /^.{8,}$/;
    const validedPasswordContent = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (data.password && !validedPasswordLength.test(data.password)) {
        // if password is less than 8 characters
        errors.passwordError = 'Password must be at least 8 characters long';
    } else if (data.password && !validedPasswordContent.test(data.password)) {
        // if password does not contain at least one uppercase letter, one lowercase letter and one number
        errors.passwordError = 'Password must include at least one uppercase letter, one lowercase letter and one number';
    }

    // If there are validation errors, return them
    if (errors.usernameError != null || errors.emailError != null || errors.passwordError != null || errors.passwordConfirmError != null) {        
        return NextResponse.json(errors, { status: 400 });       
    }

    // Add user to database
    const dbResponse = await addUser(data)
    
    // If email is already in use, return error
    if (dbResponse.message && dbResponse.message === 'duplicate key value violates unique constraint "users_email_key"') {
        errors.emailError = 'Email already in use';
        return NextResponse.json(errors, { status: 400 });
    }

    // Return successful response with user data
    return NextResponse.json(dbResponse, { status: 201 });
}

