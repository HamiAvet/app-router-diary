import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/data'
import { verifyPassword } from '@/app/lib/passwordUtils'
import { setSessionUser } from '@/app/lib/session'


export async function POST(request) {
    const data = await request.json()
    
    if (!data.email || !data.password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const dbResponse = await getUserByEmail(data)        
    const userRecord = dbResponse[0];
    if (!userRecord) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    const userRecordId = userRecord.id
    
    const passwordMatch = userRecord && verifyPassword(data.password, userRecord.password);
    
    
    if (!passwordMatch) {    
        return NextResponse.json({ error: 'Incorrect Password' }, { status: 402 })
    } 
    await setSessionUser(userRecordId)
    return NextResponse.json(dbResponse, {status: 201});
}

