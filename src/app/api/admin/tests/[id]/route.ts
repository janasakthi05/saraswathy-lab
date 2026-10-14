import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { categoryId, name, slug, shortDescription, overview, whoFor, preparation, displayOrder, isActive } = body;

    const test = await db.diagnosticTest.update({
      where: { id },
      data: {
        ...(categoryId && { categoryId }),
        ...(name && { name }),
        ...(slug && { slug }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(overview !== undefined && { overview }),
        ...(whoFor !== undefined && { whoFor }),
        ...(preparation !== undefined && { preparation }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: {
        category: true,
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'DiagnosticTest', id, `Updated test: ${test.name}`);

    return NextResponse.json({ success: true, test });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update diagnostic test.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const test = await db.diagnosticTest.delete({
      where: { id },
    });

    await logAuditAction(session.email, 'DELETE', 'DiagnosticTest', id, `Deleted test: ${test.name}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete test.' }, { status: 500 });
  }
}
