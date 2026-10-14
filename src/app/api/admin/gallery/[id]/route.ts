import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, imageUrl, altText, category, displayOrder, isPublished } = body;

    const item = await db.galleryItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(altText !== undefined && { altText }),
        ...(category !== undefined && { category }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'GalleryItem', id, `Updated gallery item: ${item.title}`);
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update gallery item.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const item = await db.galleryItem.delete({ where: { id } });
    await logAuditAction(session.email, 'DELETE', 'GalleryItem', id, `Deleted gallery item: ${item.title}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete gallery item.' }, { status: 500 });
  }
}
