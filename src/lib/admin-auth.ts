import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import db from '@/lib/db';

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    const secret = process.env.AUTH_SECRET || 'fallback-secret-key-change-me';
    if (!token) return null;
    return await verifySession(token, secret);
  } catch (err) {
    console.error('getAdminSession error:', err);
    return null;
  }
}

export async function logAuditAction(
  adminEmail: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: string
) {
  try {
    await db.auditLog.create({
      data: {
        adminEmail,
        action,
        resource,
        resourceId: resourceId || null,
        details: details || null,
      },
    });
  } catch (err) {
    console.error('Audit log write error:', err);
  }
}
