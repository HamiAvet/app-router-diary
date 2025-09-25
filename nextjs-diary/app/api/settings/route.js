import { NextResponse } from 'next/server';
import { changeUserNameById, changeUserEmailById } from '@/app/lib/data';


export async function POST(request) {
    const data = await request.json();
    console.log(data);
    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (data.newUsername) {
        await changeUserNameById(data);

    }
    if (data.newEmail) {
        await changeUserEmailById(data);
    }

    return NextResponse.json({message : "Your account was updated successfully"}, { status: 200 });
}
