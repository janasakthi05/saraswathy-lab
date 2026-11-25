import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendHomeCollectionNotification } from '@/lib/email';

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { id } = await params;

    const record = await db.homeCollectionRequest.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Home collection record not found.' },
        { status: 404 }
      );
    }

    console.log(`[Admin] Retrying email dispatch for home collection ID: ${id}...`);

    const result = await sendHomeCollectionNotification({
      name: record.name,
      phone: record.phone,
      address: record.address,
      preferredDate: record.preferredDate || undefined,
      preferredTime: record.preferredTime || undefined,
    });

    if (result.success) {
      await db.homeCollectionRequest.update({
        where: { id },
        data: { emailDeliveryStatus: 'SENT' },
      });

      return NextResponse.json({
        success: true,
        message: 'Notification email sent successfully to administrator.',
        emailDeliveryStatus: 'SENT',
      });
    } else {
      await db.homeCollectionRequest.update({
        where: { id },
        data: { emailDeliveryStatus: 'FAILED' },
      });

      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Failed to dispatch email. Check server email configuration.',
          emailDeliveryStatus: 'FAILED',
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('Retry home collection email error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error retrying email dispatch.' },
      { status: 500 }
    );
  }
}
