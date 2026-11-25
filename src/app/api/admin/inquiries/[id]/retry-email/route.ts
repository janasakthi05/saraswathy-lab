import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { id } = await params;

    const inquiry = await db.enquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry record not found.' },
        { status: 404 }
      );
    }

    console.log(`[Admin] Retrying email dispatch for inquiry ID: ${id}...`);

    const result = await sendAdminNotification({
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      inquiryType: inquiry.inquiryType,
      subject: inquiry.subject,
      message: inquiry.message,
    });

    if (result.success) {
      await db.enquiry.update({
        where: { id },
        data: { emailDeliveryStatus: 'SENT' },
      });

      return NextResponse.json({
        success: true,
        message: 'Notification email sent successfully to administrator.',
        emailDeliveryStatus: 'SENT',
      });
    } else {
      await db.enquiry.update({
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
    console.error('Retry email dispatch error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error retrying email dispatch.' },
      { status: 500 }
    );
  }
}
