import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, type, displayOrder, isActive } = body;

    const ecg = await db.eCGService.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'ECGService', id, `Updated ECG service: ${ecg.name}`);
    return NextResponse.json({ success: true, ecg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update ECG service.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const ecg = await db.eCGService.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'ECGService', id, `Deleted ECG service: ${ecg.name}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete ECG service.' }, { status: 500 });
  }
}
