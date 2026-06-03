import { NextResponse } from 'next/server';
import { changeUserPasswordById } from '@/app/lib/userDataUtils';
import { verifyPassword } from '@/app/lib/passwordUtils'

export async function POST(request) {
    return NextResponse.json({ message: "This is just a test, chill." }, { status: 200 });
}