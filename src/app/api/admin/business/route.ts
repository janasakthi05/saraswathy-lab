import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const business = await db.businessSettings.findUnique({ where: { id: 'default' } });
    return NextResponse.json({ business });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch business information.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { businessName, address, phone, mobile, timing, email, mapUrl } = body;

    const business = await db.businessSettings.upsert({
      where: { id: 'default' },
      update: {
        businessName,
        address,
        phone,
        mobile,
        timing,
        email,
        mapUrl,
      },
      create: {
        id: 'default',
        businessName,
        address,
        phone,
        mobile,
        timing,
        email,
        mapUrl,
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'BusinessSettings', 'default', `Updated business information.`);
    return NextResponse.json({ success: true, business });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update business information.' }, { status: 500 });
  }
}
