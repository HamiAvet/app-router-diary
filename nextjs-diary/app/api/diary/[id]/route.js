import { NextResponse } from 'next/server';
import { deleteEvent, updateEventStatus} from '@/app/lib/data'

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) { 
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  await deleteEvent({ id: Number(id) });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function UPDATE(request) {
  const { id } = await request.json();
  if (!id) { 
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  await updateEventStatus({ id: Number(id) });
  return NextResponse.json({ success: true }, { status: 202 });
}
