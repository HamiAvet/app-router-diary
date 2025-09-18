import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/data'
import { verifyPassword } from '@/app/lib/passwordUtils'
import { setSessionUser } from '@/app/lib/session'


export async function POST(request) {
    const data = await request.json()
    
    /*if (!data.username || !data.email || !data.password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }*/

    const dbResponse = await getUserByEmail(data)    
    const userRecord = dbResponse[0];
    const userRecordId = userRecord.id
    console.log("userRecordId:", userRecordId);
    
    const passwordMatch = userRecord && verifyPassword(data.password, userRecord.password);
    
    if (passwordMatch) {
        console.log("Welcome,", userRecord.username); 
    }
    
    await setSessionUser(userRecordId)
    return NextResponse.json(dbResponse, {status: 201});
}

