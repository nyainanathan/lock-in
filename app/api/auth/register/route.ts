import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { ok } from 'assert';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  // Basic validation
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return NextResponse.json(
      { error: 'Email already in use' },
      { status: 409 }
    );
  }

  // Hash the password and insert
  const password_hash = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run(name, email, password_hash);

  const token = signToken({userId : Number(result.lastInsertRowid), email: email});


  return NextResponse.json({ok : true}, {
    headers: {
      'Set-Cookie' : `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
    }
  })
}