import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // 0. Rate limiting (IP based)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests have been submitted. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { fullName, email, phone, inquiryType, subject, message, termsAccepted, honeypot } = body;

    // 1. Spam Protection (Honeypot)
    if (honeypot) {
      console.warn('Bot submission intercepted via honeypot field.');
      return NextResponse.json(
        { id: 'intercepted-bot-session', success: true },
        { status: 201 }
      );
    }

    // 2. Server-side validation (presence check)
    if (!fullName || !email || !phone || !inquiryType || !subject || !message) {
      return NextResponse.json(
        { error: 'All mandatory patient credentials (name, email, phone, category, subject, message) must be filled.' },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'You must acknowledge the HIPAA privacy terms statement.' },
        { status: 400 }
      );
    }

    // Server-side validation (field length checks)
    if (fullName.length > 100) {
      return NextResponse.json({ error: 'Full name must not exceed 100 characters.' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Email address must not exceed 254 characters.' }, { status: 400 });
    }
    if (phone.length > 30) {
      return NextResponse.json({ error: 'Phone number must not exceed 30 characters.' }, { status: 400 });
    }
    if (subject.length > 150) {
      return NextResponse.json({ error: 'Subject must not exceed 150 characters.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message must not exceed 5000 characters.' }, { status: 400 });
    }

    // Format inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 7) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (minimum 7 digits).' },
        { status: 400 }
      );
    }

    // 3. Save initial Inquiry log to SQLite Database with PENDING email status
    const inquiry = await db.enquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        inquiryType: inquiryType,
        subject: subject.trim(),
        message: message.trim(),
        status: 'NEW',
        emailDeliveryStatus: 'PENDING',
      },
    });

    console.log(`[Database] Inquiry logged. ID: ${inquiry.id}. Triggering email dispatch...`);

    // 4. Send Email Notification
    const emailResult = await sendAdminNotification({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      inquiryType: inquiryType,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (emailResult.success) {
      // Update DB to SENT
      await db.enquiry.update({
        where: { id: inquiry.id },
        data: { emailDeliveryStatus: 'SENT' },
      });

      return NextResponse.json(
        { success: true, id: inquiry.id, message: 'Your enquiry has been sent successfully. Our team will review your message shortly.' },
        { status: 201 }
      );
    } else {
      // Update DB to FAILED
      await db.enquiry.update({
        where: { id: inquiry.id },
        data: { emailDeliveryStatus: 'FAILED' },
      });

      console.error(`[Email Fail] ID: ${inquiry.id}. Reason: ${emailResult.message}`);

      // Since the inquiry was safely logged in the database, return confirmed success to the patient
      return NextResponse.json(
        {
          success: true,
          id: inquiry.id,
          message: 'Your enquiry has been received and saved to our system. Our team will review your message shortly.',
          emailDeliveryStatus: 'FAILED',
        },
        { status: 201 }
      );
    }
  } catch (err: any) {
    console.error('Inquiries API error:', err);
    return NextResponse.json(
      { error: 'Database service offline. Please coordinate bookings via our phone lines.' },
      { status: 500 }
    );
  }
}
