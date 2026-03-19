import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import pool from '@/lib/db';
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
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  const existingResult = existing.rows[0];
  if (existingResult) {
    return NextResponse.json(
      { error: 'Email already in use' },
      { status: 409 }
    );
  }

  // Hash the password and insert
  const password_hash = await bcrypt.hash(password, 10);

  const insert = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id', 
        [name, email, password_hash]
  )

  const insertResult = insert.rows[0].id;

  const token = signToken({userId : Number(insertResult), email: email});


  return NextResponse.json({ok : true}, {
    headers: {
      'Set-Cookie' : `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
    }
  })
}