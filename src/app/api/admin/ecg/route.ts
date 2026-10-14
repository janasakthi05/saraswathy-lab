import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const ecgs = await db.eCGService.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json({ ecgs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch ECG services.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, description, type, displayOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const ecg = await db.eCGService.create({
      data: {
        name,
        slug,
        description: description || null,
        type: type || 'Resting 12-Lead',
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'ECGService', ecg.id, `Created ECG service: ${name}`);
    return NextResponse.json({ success: true, ecg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create ECG service.' }, { status: 500 });
  }
}
