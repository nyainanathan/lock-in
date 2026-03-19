import { NextRequest, NextResponse } from 'next/server';
import{ getDb } from '@/lib/db';
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

export async function GET() {

  const pool = getDb()!;

  const USER_ID = await getAuth();

  const result = await pool.query(
    'SELECT * FROM chronos WHERE user_id = $1 ORDER BY created_at DESC',
    [USER_ID]
  );

  return NextResponse.json(result.rows as Chrono[]);
}

export async function POST(req: NextRequest) {

  const pool = getDb()!;

  const USER_ID = await getAuth();
  const { project_id } = await req.json();

  // Only one chrono can be running at a time
  const active = await pool.query(
    `SELECT * FROM chronos WHERE user_id = $1 AND status IN ('running', 'paused')`,
    [USER_ID]
  );

  if (active.rows.length > 0) {
    return NextResponse.json(
      { error: 'A chrono is already active. Stop it before starting a new one.' },
      { status: 409 }
    );
  }

  const inserted = await pool.query(
    `INSERT INTO chronos (user_id, project_id, status, stopped_at)
     VALUES ($1, $2, $3, now())
     RETURNING *`,
    [USER_ID, project_id ?? null, 'running']
  );

  return NextResponse.json({chrono : inserted.rows[0] }, { status: 201 });
}