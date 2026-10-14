import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, includedTests, targetAudience, displayOrder, isActive, isFeatured } = body;

    const pkg = await db.healthPackage.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(includedTests && { includedTests }),
        ...(targetAudience !== undefined && { targetAudience }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'HealthPackage', id, `Updated package: ${pkg.name}`);
    return NextResponse.json({ success: true, package: pkg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update package.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const pkg = await db.healthPackage.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'HealthPackage', id, `Deleted package: ${pkg.name}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete package.' }, { status: 500 });
  }
}
