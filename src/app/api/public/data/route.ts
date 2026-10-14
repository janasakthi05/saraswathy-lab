import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      business,
      homepage,
      categories,
      xrays,
      ecgs,
      initiatives,
      packages,
      gallery,
      testimonials,
      seoSettings,
    ] = await Promise.all([
      db.businessSettings.findUnique({ where: { id: 'default' } }),
      db.homepageContent.findUnique({ where: { id: 'default' } }),
      db.diagnosticCategory.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          tests: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      db.xRayService.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.eCGService.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.healthcareInitiative.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.healthPackage.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.galleryItem.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.testimonial.findMany({
        where: {
          OR: [
            { status: 'PUBLISHED' },
            { isPublished: true },
          ],
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.sEOSettings.findMany(),
    ]);

    return NextResponse.json({
      business,
      homepage,
      categories,
      xrays,
      ecgs,
      initiatives,
      packages,
      gallery,
      testimonials,
      seoSettings,
    });
  } catch (err: any) {
    console.error('Public data API error:', err);
    return NextResponse.json({ error: 'Failed to fetch public CMS data.' }, { status: 500 });
  }
}
