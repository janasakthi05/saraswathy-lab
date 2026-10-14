import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const requestItem = await db.homeCollectionRequest.update({
      where: { id },
      data: { status },
    });

    await logAuditAction(session.email, 'STATUS_CHANGE', 'HomeCollectionRequest', id, `Changed status to: ${status}`);
    return NextResponse.json({ success: true, requestItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update request status.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    await db.homeCollectionRequest.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'HomeCollectionRequest', id, `Deleted home collection request.`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete request.' }, { status: 500 });
  }
}
