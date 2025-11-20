import { NextResponse } from 'next/server';
import { changeUserNameById, changeUserEmailById, changeUserPasswordById } from '@/app/lib/data';
import { verifyPassword } from '@/app/lib/passwordUtils'


export async function POST(request) {
    const data = await request.json();
    console.log(data);

    const errors = {
        newEmailError: null,
        newPasswordError: null,
        newPasswordConfirmError: null
    };
    

    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }
    if (data.newUsername) {
        await changeUserNameById(data);
    }
    if (data.newEmail) {
        const dbResponse = await changeUserEmailById(data);
        if (dbResponse.message && dbResponse.message === 'duplicate key value violates unique constraint "users_email_key"') {
            errors.newEmailError = 'Email already in use';
        }
    }
    if (data.newPassword) {
        if (!data.newPasswordConfirm) {
            errors.newPasswordConfirmError = 'Please confirm your new password';
        } else if (data.newPasswordConfirm && data.newPassword !== data.newPasswordConfirm) {      
            errors.newPasswordConfirmError = 'Passwords do not match';
        }      
        const passwordMatch = verifyPassword(data.newPassword, data.oldPassword);
        if (!passwordMatch) {
            changeUserPasswordById(data)
        }
    }
    if (errors.newEmailError || errors.newPasswordError || errors.newPasswordConfirmError) {
        return NextResponse.json(errors, { status: 400});
    }
    
    return NextResponse.json({message : "Your account was updated successfully"}, { status: 200 });
}
