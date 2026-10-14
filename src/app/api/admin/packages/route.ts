import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const packages = await db.healthPackage.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json({ packages });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch health packages.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, description, includedTests, targetAudience, displayOrder, isActive, isFeatured } = body;

    if (!name || !slug || !description || !includedTests) {
      return NextResponse.json({ error: 'Name, slug, description, and included tests are required.' }, { status: 400 });
    }

    const pkg = await db.healthPackage.create({
      data: {
        name,
        slug,
        description,
        includedTests,
        targetAudience: targetAudience || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      },
    });

    await logAuditAction(session.email, 'CREATE', 'HealthPackage', pkg.id, `Created package: ${name}`);
    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create package.' }, { status: 500 });
  }
}
