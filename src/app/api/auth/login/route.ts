import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { comparePassword } from '@/lib/auth';
import { signSession } from '@/lib/session';

// Login API Handler
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Fetch Admin User from database
    const admin = await db.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Return generic 401 to obfuscate exists checks
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        { status: 401 }
      );
    }

    // 3. Compare password hash
    const isPasswordCorrect = await comparePassword(password, admin.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        { status: 401 }
      );
    }

    // 4. Sign Edge-compatible session token
    const authSecret = process.env.AUTH_SECRET || 'local_secure_dev_auth_secret_token_184920';
    const sessionToken = await signSession(
      { id: admin.id, email: admin.email },
      authSecret,
      7 // expires in 7 days
    );

    // 5. Build response and set HTTP-only cookie
    const response = NextResponse.json(
      { success: true, message: 'Authenticated successfully.' },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    const msg = err?.message || '';
    if (
      msg.includes('reach database server') ||
      msg.includes('PrismaClient') ||
      msg.includes('connection') ||
      msg.includes('Initialization')
    ) {
      return NextResponse.json(
        { error: 'Database server unreachable. Please verify your DATABASE_URL in the .env file and make sure your database server is running.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred.' },
      { status: 500 }
    );
  }
}
