import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendHomeCollectionNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, preferredDate, preferredTime, honeypot } = body;

    // 1. Anti-bot honeypot trap
    if (honeypot && honeypot.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Request processed.' }, { status: 200 });
    }

    // 2. Server-side validation
    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, phone number, and address are mandatory fields.' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json({ error: 'Name cannot exceed 100 characters.' }, { status: 400 });
    }
    if (phone.length > 30) {
      return NextResponse.json({ error: 'Phone number cannot exceed 30 characters.' }, { status: 400 });
    }
    if (address.length > 500) {
      return NextResponse.json({ error: 'Address cannot exceed 500 characters.' }, { status: 400 });
    }

    // 3. Save request to database
    const record = await db.homeCollectionRequest.create({
      data: {
        name,
        phone,
        address,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        status: 'NEW',
        emailDeliveryStatus: 'PENDING',
      },
    });

    // 4. Trigger email dispatch server-side to ADMIN_EMAIL
    let emailResult = { success: false, message: '' };
    try {
      emailResult = await sendHomeCollectionNotification({
        name,
        phone,
        address,
        preferredDate,
        preferredTime,
      });

      await db.homeCollectionRequest.update({
        where: { id: record.id },
        data: {
          emailDeliveryStatus: emailResult.success ? 'SENT' : 'FAILED',
        },
      });
    } catch (emailErr) {
      console.error('[Home Collection Email Error]', emailErr);
      await db.homeCollectionRequest.update({
        where: { id: record.id },
        data: { emailDeliveryStatus: 'FAILED' },
      });
    }

    return NextResponse.json(
      {
        success: true,
        id: record.id,
        message: 'Home collection request received. Our coordinator will contact you shortly.',
        emailDeliveryStatus: emailResult.success ? 'SENT' : 'PENDING',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Home Collection API error:', err);
    return NextResponse.json(
      { error: 'Internal server error while processing home collection request.' },
      { status: 500 }
    );
  }
}
