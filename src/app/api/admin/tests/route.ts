import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const tests = await db.diagnosticTest.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
      },
    });
    return NextResponse.json({ tests });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch diagnostic tests.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { categoryId, name, slug, shortDescription, overview, whoFor, preparation, displayOrder, isActive } = body;

    if (!categoryId || !name || !slug) {
      return NextResponse.json({ error: 'Category, name, and slug are mandatory.' }, { status: 400 });
    }

    const test = await db.diagnosticTest.create({
      data: {
        categoryId,
        name,
        slug,
        shortDescription: shortDescription || null,
        overview: overview || null,
        whoFor: whoFor || null,
        preparation: preparation || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        category: true,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'DiagnosticTest', test.id, `Created test: ${name}`);

    return NextResponse.json({ success: true, test }, { status: 201 });
  } catch (err: any) {
    console.error('Create test error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create test.' }, { status: 500 });
  }
}
