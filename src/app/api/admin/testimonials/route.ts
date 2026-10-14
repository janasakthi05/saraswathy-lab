import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const pendingCount = testimonials.filter((t) => t.status === 'PENDING' || (!t.isPublished && t.status !== 'REJECTED')).length;
    const publishedCount = testimonials.filter((t) => t.status === 'PUBLISHED' || t.isPublished).length;
    const rejectedCount = testimonials.filter((t) => t.status === 'REJECTED').length;

    return NextResponse.json({
      testimonials,
      stats: {
        pending: pendingCount,
        published: publishedCount,
        rejected: rejectedCount,
        total: testimonials.length,
      },
    });
  } catch (err: any) {
    console.error('Admin testimonials fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await req.json();
    const { patientName, reviewText, rating, email, phone, status, photoUrl } = body;

    if (!patientName || !patientName.trim()) {
      return NextResponse.json({ error: 'Patient name is required.' }, { status: 400 });
    }

    if (!reviewText || !reviewText.trim()) {
      return NextResponse.json({ error: 'Review text is required.' }, { status: 400 });
    }

    const reviewStatus = ['PENDING', 'PUBLISHED', 'REJECTED'].includes(status) ? status : 'PUBLISHED';
    const isPub = reviewStatus === 'PUBLISHED';

    const testimonial = await db.testimonial.create({
      data: {
        patientName: patientName.trim(),
        reviewText: reviewText.trim(),
        rating: rating ? parseInt(rating, 10) : 5,
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        photoUrl: photoUrl || null,
        status: reviewStatus,
        isPublished: isPub,
        consent: true,
      },
    });

    await logAuditAction(
      session.email,
      'CREATE',
      'Testimonial',
      testimonial.id,
      `Manually added review for ${patientName} with status ${reviewStatus}`
    );

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (err: any) {
    console.error('Admin create review error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create review.' }, { status: 500 });
  }
}
