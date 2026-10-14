import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession, logAuditAction } from '@/lib/admin-auth';

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Props) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { patientName, reviewText, rating, email, phone, status, isPublished } = body;

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    const updateData: any = {};

    if (patientName !== undefined) updateData.patientName = patientName.trim();
    if (reviewText !== undefined) updateData.reviewText = reviewText.trim();
    if (rating !== undefined) updateData.rating = parseInt(rating, 10);
    if (email !== undefined) updateData.email = email ? email.trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    if (status !== undefined) {
      if (['PENDING', 'PUBLISHED', 'REJECTED'].includes(status)) {
        updateData.status = status;
        updateData.isPublished = status === 'PUBLISHED';
      }
    } else if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
      updateData.status = Boolean(isPublished) ? 'PUBLISHED' : 'PENDING';
    }

    const updated = await db.testimonial.update({
      where: { id },
      data: updateData,
    });

    await logAuditAction(
      session.email,
      'UPDATE',
      'Testimonial',
      id,
      `Updated review status for ${updated.patientName} to ${updated.status}`
    );

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err: any) {
    console.error('Error updating review:', err);
    return NextResponse.json({ error: err.message || 'Failed to update review.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    await db.testimonial.delete({ where: { id } });

    await logAuditAction(
      session.email,
      'DELETE',
      'Testimonial',
      id,
      `Deleted review for ${existing.patientName}`
    );

    return NextResponse.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting review:', err);
    return NextResponse.json({ error: 'Failed to delete review.' }, { status: 500 });
  }
}
