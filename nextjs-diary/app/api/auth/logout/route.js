import { NextResponse } from 'next/server';
import { endSessionUser } from '@/app/lib/session'


export async function POST() {
    await endSessionUser()
    return NextResponse.json("User's session was deleted", {status: 200});
}

