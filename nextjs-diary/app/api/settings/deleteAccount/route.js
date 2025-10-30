import { NextResponse } from 'next/server';
import { deleteUserById } from '@/app/lib/data';

export async function POST(request) {
    const data = await request.json();

    if (!data.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    await deleteUserById(data.id);
    return NextResponse.json({message : "Your account was deleted successfully"}, { status: 200 });
}
