import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuth } from '@/lib/auth';

export async function GET() {
  const USER_ID = await getAuth();

  const result = await pool.query(
    'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
    [USER_ID]
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const USER_ID = await getAuth();
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const result = await pool.query(
    'INSERT INTO projects (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, USER_ID]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}