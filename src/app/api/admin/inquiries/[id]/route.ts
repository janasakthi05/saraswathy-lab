import { NextResponse } from 'next/server';
import db from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Fetch single inquiry details
export async function GET(request: Request, { params }: Props) {
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

    return NextResponse.json({ inquiry }, { status: 200 });
  } catch (err: any) {
    console.error('Fetch inquiry detail error:', err);
    return NextResponse.json(
      { error: 'Internal server error retrieving record.' },
      { status: 500 }
    );
  }
}

// 2. Patch update status of a single inquiry
export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    const validStatuses = ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid message status parameter.' },
        { status: 400 }
      );
    }

    const updated = await db.enquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      { success: true, inquiry: updated, message: 'Status updated successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Update inquiry status error:', err);
    return NextResponse.json(
      { error: 'Internal server error updating status state.' },
      { status: 500 }
    );
  }
}

// 3. Delete / Archive entry from database
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await db.enquiry.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Record deleted from database successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Delete inquiry error:', err);
    return NextResponse.json(
      { error: 'Internal server error executing deletion.' },
      { status: 500 }
    );
  }
}
