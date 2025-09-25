import { NextResponse } from 'next/server';
import { getUserById } from '@/app/lib/data';

export async function GET(request) {
    const userId = request.url.split('/').pop();
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const user = await getUserById(userId);
    if (!user || user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 201 });
}
