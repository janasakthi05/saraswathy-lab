import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const categories = await db.diagnosticCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        tests: true,
      },
    });
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, icon, displayOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const category = await db.diagnosticCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || 'Microscope',
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'DiagnosticCategory', category.id, `Created category: ${name}`);

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    console.error('Create category error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create category.' }, { status: 500 });
  }
}
