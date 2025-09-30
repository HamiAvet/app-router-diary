import { NextResponse } from 'next/server';
import { changeUserNameById, changeUserEmailById, changeUserPasswordById } from '@/app/lib/data';
import { verifyPassword } from '@/app/lib/passwordUtils'


export async function POST(request) {
    const data = await request.json();

    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (data.newUsername) {
        await changeUserNameById(data);
    }
    if (data.newEmail) {
        await changeUserEmailById(data);
    }
    if (data.newPassword) {
        const passwordMatch = verifyPassword(data.newPassword, data.oldPassword);
        if (!passwordMatch) {
            changeUserPasswordById(data)
        }
    }

    return NextResponse.json({message : "Your account was updated successfully"}, { status: 200 });
}
