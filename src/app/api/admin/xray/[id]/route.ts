import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, bodyPart, displayOrder, isActive } = body;

    const xray = await db.xRayService.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(bodyPart !== undefined && { bodyPart }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'XRayService', id, `Updated X-Ray service: ${xray.name}`);
    return NextResponse.json({ success: true, xray });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update X-Ray service.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const xray = await db.xRayService.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'XRayService', id, `Deleted X-Ray service: ${xray.name}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete X-Ray service.' }, { status: 500 });
  }
}
