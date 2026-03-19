import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const pool = getDb()!;
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // Find user
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]) as any;
  const userResult = user.rows[0];
  if (!userResult) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Verify password
  const valid = await bcrypt.compare(password, userResult.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  const token = signToken({ userId: userResult.id, email: userResult.email })

  return NextResponse.json({ ok: true }, {
    headers: {
      'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
    }
  })
}