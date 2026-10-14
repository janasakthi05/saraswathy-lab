import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const homepage = await db.homepageContent.findUnique({ where: { id: 'default' } });
    return NextResponse.json({ homepage });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch homepage content.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      heroHeading,
      heroSubheading,
      heroCtaText,
      heroCtaLink,
      heroImage,
      aboutHeading,
      aboutDescription,
      aboutImage,
      contactHeading,
      contactDescription,
      contactButtonText,
    } = body;

    const homepage = await db.homepageContent.upsert({
      where: { id: 'default' },
      update: {
        heroHeading,
        heroSubheading,
        heroCtaText,
        heroCtaLink,
        heroImage,
        aboutHeading,
        aboutDescription,
        aboutImage,
        contactHeading,
        contactDescription,
        contactButtonText,
      },
      create: {
        id: 'default',
        heroHeading,
        heroSubheading,
        heroCtaText,
        heroCtaLink,
        heroImage,
        aboutHeading,
        aboutDescription,
        aboutImage,
        contactHeading,
        contactDescription,
        contactButtonText,
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'HomepageContent', 'default', `Updated homepage content.`);
    return NextResponse.json({ success: true, homepage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update homepage content.' }, { status: 500 });
  }
}
