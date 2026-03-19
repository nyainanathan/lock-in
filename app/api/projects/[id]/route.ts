export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';

type Project = {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
};

// GET one project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const pool = getDb()!;

  const USER_ID = await getAuth();
  const { id } = await params;

  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
    [id, USER_ID]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0] as Project);
}

// PATCH — update project name
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getDb()!;

  const USER_ID = await getAuth();
  const { id } = await params;
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existing = await pool.query(
    'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
    [id, USER_ID]
  );

  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const updated = await pool.query(
    'UPDATE projects SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );

  return NextResponse.json(updated.rows[0] as Project);
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const pool = getDb()!;

  const USER_ID = await getAuth();
  const { id } = await params;

  const existing = await pool.query(
    'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
    [id, USER_ID]
  );

  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await pool.query('DELETE FROM projects WHERE id = $1', [id]);

  return NextResponse.json({ success: true });
}