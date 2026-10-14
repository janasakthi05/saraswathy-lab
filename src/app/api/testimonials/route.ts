import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, rating, reviewText, email, phone, consent } = body;

    if (!patientName || !patientName.trim()) {
      return NextResponse.json({ error: 'Patient name is required.' }, { status: 400 });
    }

    if (!reviewText || !reviewText.trim()) {
      return NextResponse.json({ error: 'Review text is required.' }, { status: 400 });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'Please select a rating between 1 and 5 stars.' }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json({ error: 'You must agree to allow your review to be published.' }, { status: 400 });
    }

    const testimonial = await db.testimonial.create({
      data: {
        patientName: patientName.trim(),
        reviewText: reviewText.trim(),
        rating: parsedRating,
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        status: 'PENDING',
        isPublished: false,
        consent: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback. Your review has been submitted for verification.',
        id: testimonial.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error submitting patient review:', err);
    return NextResponse.json({ error: 'Failed to submit review. Please try again later.' }, { status: 500 });
  }
}
