import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuth } from '@/lib/auth';
import pool from '@/lib/db';

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

  const chrono = await pool.query(
    'SELECT * FROM chronos WHERE id = $2 AND user_id = $2',
    [id, USER_ID]
  );

  const chronoResult = chrono.rows[0]  as Chrono | undefined;

  if (!chronoResult) {
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

  const chrono = await pool.query(
    'SELECT * FROM chronos WHERE id = $1 AND user_id = $2',
    [id, USER_ID]
  );

  const chronoResult = chrono.rows[0]  as Chrono | undefined;

  if (!chronoResult) {
    return NextResponse.json(
      { error: 'Chrono not found' },
      { status: 404 }
    );
  }

  if (chronoResult.status === 'stopped') {
    return NextResponse.json(
      { error: 'Chrono is already stopped' },
      { status: 409 }
    );
  }

  if (action === 'pause') {
    if (chronoResult.status === 'paused') {
      return NextResponse.json(
        { error: 'Chrono is already paused' },
        { status: 409 }
      );
    }

    
    // Calculate time elapsed since chrono started/resumed
    //Inform JS that it is an UTC timestamp
    const createdAt = new Date(chronoResult.created_at);

    const elapsed = Math.floor(
    (Date.now() - createdAt.getTime()) / 1000
    );
    
    await pool.query(
      'UPDATE chronos SET status = $1, total_focus_time = $2 WHERE id = $3',
      ['paused' , chronoResult.total_focus_time + elapsed, id]
    )
  }

  else if (action === 'resume') {
    if (chronoResult.status === 'running') {
      return NextResponse.json(
        { error: 'Chrono is already running' },
        { status: 409 }
      );
    }

    await pool.query(
      'UPDATE chronos SET status = $1, created_at = now() WHERE id = $2',
      ['running' , id]
    )

  }

  else if (action === 'stop') {

    console.log(chronoResult)

    const elapsed = chronoResult.status === 'running'
      ? Math.floor((Date.now() - new Date(chronoResult.created_at).getTime()) / 1000)
      : 0;

      console.log("Elapsed: " + elapsed);
      console.log("Total focus time: " + chronoResult.total_focus_time);

      await pool.query(
        `UPDATE chronos
          SET status = 'stopped',
              total_focus_time = $1,
              stopped_at = CURRENT_TIMESTAMP
          WHERE id = $2`,
          [chronoResult.total_focus_time + elapsed , id]
      )
  }

  else {
    return NextResponse.json(
      { error: 'Invalid action. Use pause, resume or stop.' },
      { status: 400 }
    );
  }

  const updated = await pool.query(
    'SELECT * FROM chronos WHERE id = $1',
    [id]
  );

  const updatedResult = updated.rows[0] as Chrono;

  return NextResponse.json(updatedResult);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();

  const { id } = await params;

  const chrono = await pool.query(
    'SELECT * FROM chronos WHERE id = $1 AND user_id = $2',
    [id, USER_ID]
  );

  const chronoResult = chrono.rows[0] as Chrono | undefined;


  if (!chronoResult) {
    return NextResponse.json(
      { error: 'Chrono not found' },
      { status: 404 }
    );
  }

  // Prevent deleting an active chrono
  if (chronoResult.status === 'running' || chronoResult.status === 'paused') {
    return NextResponse.json(
      { error: 'Cannot delete an active chrono. Stop it first.' },
      { status: 409 }
    );
  }

  await pool.query('DELETE FROM chronos WHERE id = $1', [id])

  return NextResponse.json({ success: true });
}