import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/data'
import { verifyPassword } from '@/app/lib/passwordUtils'
import { setSessionUser } from '@/app/lib/session'


export async function POST(request) {
    const data = await request.json();

    const errors = {
        emailError: data.email === "" ? 'Email is required' : null,
        passwordError: data.password === "" ? 'Password is required' : null,
    };    

    if (errors.emailError != null || errors.passwordError != null) {
        return NextResponse.json(errors, { status: 400});       
    }

    const dbResponse = await getUserByEmail(data)        
    const userRecord = dbResponse[0];
    if (!userRecord) {
        errors.emailError = 'User is not found';
        return NextResponse.json(errors, { status: 400});
    }
    const userRecordId = userRecord.id
    
    const passwordMatch = userRecord && verifyPassword(data.password, userRecord.password);
    
    
    if (!passwordMatch) {    
        return NextResponse.json({ error: 'Incorrect Password' }, { status: 402 })
    } 
    await setSessionUser(userRecordId)
    return NextResponse.json(dbResponse, {status: 201});
}

