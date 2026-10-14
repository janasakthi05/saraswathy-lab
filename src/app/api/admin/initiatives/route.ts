import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const initiatives = await db.healthcareInitiative.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json({ initiatives });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch initiatives.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, slug, shortDescription, fullDescription, icon, displayOrder, isActive, isFeatured } = body;

    if (!title || !slug || !shortDescription) {
      return NextResponse.json({ error: 'Title, slug, and short description are required.' }, { status: 400 });
    }

    const initiative = await db.healthcareInitiative.create({
      data: {
        title,
        slug,
        shortDescription,
        fullDescription: fullDescription || null,
        icon: icon || 'Heart',
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'HealthcareInitiative', initiative.id, `Created initiative: ${title}`);
    return NextResponse.json({ success: true, initiative }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create initiative.' }, { status: 500 });
  }
}
