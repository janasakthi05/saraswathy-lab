import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';
import { comparePassword, hashPassword } from '@/lib/auth';

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { email: session.email } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await db.admin.update({
      where: { email: session.email },
      data: { passwordHash: newHash },
    });

    await logAuditAction(session.email, 'UPDATE', 'AdminPassword', admin.id, 'Changed admin secret password');
    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update security credentials.' }, { status: 500 });
  }
}
