import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const items = await db.galleryItem.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch gallery items.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, imageUrl, altText, category, displayOrder, isPublished } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required.' }, { status: 400 });
    }

    const item = await db.galleryItem.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        altText: altText || title,
        category: category || 'Laboratory',
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'GalleryItem', item.id, `Created gallery item: ${title}`);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create gallery item.' }, { status: 500 });
  }
}
