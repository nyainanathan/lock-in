import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuth } from '@/lib/auth';


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
  
  const USER_ID = await getAuth();

  const { id } = await params;

  const project = db.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Project | undefined;

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}

// PATCH — update project name
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();

  const { id } = await params;
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  const project = db.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Project | undefined;

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  db.prepare('UPDATE projects SET name = ? WHERE id = ?').run(name, id);

  const updated = db.prepare(
    'SELECT * FROM projects WHERE id = ?'
  ).get(id) as Project;

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const USER_ID = await getAuth();

  const { id } = await params;

  const project = db.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?'
  ).get(id, USER_ID) as Project | undefined;

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  db.prepare('DELETE FROM projects WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}