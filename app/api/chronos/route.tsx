import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const USER_ID = 1;

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
  const chronos = db.prepare(
    'SELECT * FROM chronos WHERE user_id = ? ORDER BY created_at DESC'
  ).all(USER_ID) as Chrono[];

  return NextResponse.json(chronos);
}

export async function POST(req: NextRequest) {
  const { project_id } = await req.json();

  // Only one chrono can be running at a time
  const active = db.prepare(
    `SELECT * FROM chronos WHERE user_id = ? AND status IN ('running', 'paused')`
  ).get(USER_ID);

  if (active) {
    return NextResponse.json(
      { error: 'A chrono is already active. Stop it before starting a new one.' },
      { status: 409 }
    );
  }

  const result = db.prepare(
    'INSERT INTO chronos (user_id, project_id, status) VALUES (?, ?, ?)'
  ).run(USER_ID, project_id ?? null, 'running');

  const chrono = db.prepare(
    'SELECT * FROM chronos WHERE id = ?'
  ).get(result.lastInsertRowid) as Chrono;

  return NextResponse.json(chrono, { status: 201 });
}