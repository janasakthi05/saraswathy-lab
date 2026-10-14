import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, shortDescription, fullDescription, icon, displayOrder, isActive, isFeatured } = body;

    const initiative = await db.healthcareInitiative.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(shortDescription && { shortDescription }),
        ...(fullDescription !== undefined && { fullDescription }),
        ...(icon !== undefined && { icon }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'HealthcareInitiative', id, `Updated initiative: ${initiative.title}`);
    return NextResponse.json({ success: true, initiative });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update initiative.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const initiative = await db.healthcareInitiative.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'HealthcareInitiative', id, `Deleted initiative: ${initiative.title}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete initiative.' }, { status: 500 });
  }
}
