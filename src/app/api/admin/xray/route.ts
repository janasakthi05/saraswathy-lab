import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const xrays = await db.xRayService.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json({ xrays });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch X-Ray services.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, description, bodyPart, displayOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const xray = await db.xRayService.create({
      data: {
        name,
        slug,
        description: description || null,
        bodyPart: bodyPart || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'XRayService', xray.id, `Created X-Ray service: ${name}`);
    return NextResponse.json({ success: true, xray }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create X-Ray service.' }, { status: 500 });
  }
}
