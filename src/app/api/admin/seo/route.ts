import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const seoSettings = await db.sEOSettings.findMany();
    return NextResponse.json({ seoSettings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch SEO settings.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { pageSlug, metaTitle, metaDescription, ogTitle, ogDescription, ogImage, keywords } = body;

    if (!pageSlug || !metaTitle || !metaDescription) {
      return NextResponse.json({ error: 'Page slug, meta title, and meta description are required.' }, { status: 400 });
    }

    const seo = await db.sEOSettings.upsert({
      where: { pageSlug },
      update: {
        metaTitle,
        metaDescription,
        ogTitle: ogTitle || metaTitle,
        ogDescription: ogDescription || metaDescription,
        ogImage: ogImage || null,
        keywords: keywords || null,
      },
      create: {
        pageSlug,
        metaTitle,
        metaDescription,
        ogTitle: ogTitle || metaTitle,
        ogDescription: ogDescription || metaDescription,
        ogImage: ogImage || null,
        keywords: keywords || null,
      },
    });

    await logAuditAction(session.email, 'UPDATE', 'SEOSettings', seo.id, `Updated SEO settings for page: ${pageSlug}`);
    return NextResponse.json({ success: true, seo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update SEO settings.' }, { status: 500 });
  }
}
