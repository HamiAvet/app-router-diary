import { NextResponse } from 'next/server';
import { addUser } from '@/app/lib/data'

export async function POST(request) {
    const data = await request.json();
    
    const errors = {
        usernameError: data.username === "" ? 'Username is required' : null,
        emailError: data.email === "" ? 'Email is required' : null,
        passwordError: data.password === "" ? 'Password is required' : null,
        passwordConfirmError: data.password !== data.passwordConfirm ? "Passwords do not match" : ""
    };    
    
    if (errors.usernameError != null || errors.emailError != null || errors.passwordError != null || errors.passwordConfirmError != null) {
        return NextResponse.json(errors, { status: 400});       
    }    
    const dbResponse = await addUser(data)
    
    if (dbResponse.message && dbResponse.message === 'duplicate key value violates unique constraint "users_email_key"') {
        errors.emailError = 'Email already in use';
        return NextResponse.json(errors, { status: 400});
    }

    return NextResponse.json(dbResponse, { status: 201 });
}

