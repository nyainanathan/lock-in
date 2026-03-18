import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuth } from '@/lib/auth';


type Chrono = {
  id: number;
  user_id: number;
  project_id: number | null;
  status: 'running' | 'paused' | 'stopped';
  total_focus_time: number;
  stopped_at: string | null;
  created_at: string;
};

// GET one chrono
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();

  const { id } = await params;

  const chrono = db.prepare(
    'SELECT * FROM chronos WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Chrono | undefined;

  if (!chrono) {
    return NextResponse.json(
      { error: 'Chrono not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(chrono);
}

// PATCH — pause / resume / stop
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();


  const { id } = await params;
  const { action } = await req.json(); // action: 'pause' | 'resume' | 'stop'

  const chrono = db.prepare(
    'SELECT * FROM chronos WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Chrono | undefined;

  if (!chrono) {
    return NextResponse.json(
      { error: 'Chrono not found' },
      { status: 404 }
    );
  }

  if (chrono.status === 'stopped') {
    return NextResponse.json(
      { error: 'Chrono is already stopped' },
      { status: 409 }
    );
  }

  if (action === 'pause') {
    if (chrono.status === 'paused') {
      return NextResponse.json(
        { error: 'Chrono is already paused' },
        { status: 409 }
      );
    }

    
    // Calculate time elapsed since chrono started/resumed
    //Inform JS that it is an UTC timestamp
    const createdAt = new Date(chrono.created_at.replace(' ', 'T') + 'Z');

    const elapsed = Math.floor(
    (Date.now() - createdAt.getTime()) / 1000
    );
    

    db.prepare(
      'UPDATE chronos SET status = ?, total_focus_time = ? WHERE id = ?'
    ).run('paused', chrono.total_focus_time + elapsed, id);
  }

  else if (action === 'resume') {
    if (chrono.status === 'running') {
      return NextResponse.json(
        { error: 'Chrono is already running' },
        { status: 409 }
      );
    }

    db.prepare(
      'UPDATE chronos SET status = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run('running', id);
  }

  else if (action === 'stop') {
    const elapsed = chrono.status === 'running'
      ? Math.floor((Date.now() - new Date(chrono.created_at).getTime()) / 1000)
      : 0;

    db.prepare(
      `UPDATE chronos
       SET status = 'stopped',
           total_focus_time = ?,
           stopped_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(chrono.total_focus_time + elapsed, id);
  }

  else {
    return NextResponse.json(
      { error: 'Invalid action. Use pause, resume or stop.' },
      { status: 400 }
    );
  }

  const updated = db.prepare(
    'SELECT * FROM chronos WHERE id = ?'
  ).get(id) as Chrono;

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();

  const { id } = await params;

  const chrono = db.prepare(
    'SELECT * FROM chronos WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Chrono | undefined;

  if (!chrono) {
    return NextResponse.json(
      { error: 'Chrono not found' },
      { status: 404 }
    );
  }

  // Prevent deleting an active chrono
  if (chrono.status === 'running' || chrono.status === 'paused') {
    return NextResponse.json(
      { error: 'Cannot delete an active chrono. Stop it first.' },
      { status: 409 }
    );
  }

  db.prepare('DELETE FROM chronos WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}