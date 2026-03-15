import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Hardcoded for now, will be replaced by auth later
const USER_ID = 1;

export async function GET() {
  const projects = db.prepare(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC'
  ).all(USER_ID);

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  const result = db.prepare(
    'INSERT INTO projects (name, user_id) VALUES (?, ?)'
  ).run(name, USER_ID);

  const project = db.prepare(
    'SELECT * FROM projects WHERE id = ?'
  ).get(result.lastInsertRowid);

  return NextResponse.json(project, { status: 201 });
}