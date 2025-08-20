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

export async function PUT(request) {
  const { event } = await request.json();
  if (!event || !event.id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 401 });
  }
  if (!event.status || (event.status !== 'Active' && event.status !== 'Done')) {
    return NextResponse.json({ error: 'Wrong status' }, { status: 400 });
  }
  if (event.status === 'Done') {
    event.status = 'Active';
  } else {
    event.status = 'Done';
  }
  await updateEventStatus(event);
  return NextResponse.json({ success: true }, { status: 202 });
}
