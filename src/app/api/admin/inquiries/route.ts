import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * limit;

    // 1. Build dynamic Prisma filters
    const where: any = {};

    // Keyword Search (full-text search simulation in SQLite)
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Category / Inquiry Type filter
    if (type) {
      where.inquiryType = type;
    }

    // 2. Fetch total count matching filters
    const total = await db.enquiry.count({ where });

    // 3. Fetch paginated list
    const inquiries = await db.enquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: sort === 'oldest' ? 'asc' : 'desc',
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        inquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Admin inquiries fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve administrative records.' },
      { status: 500 }
    );
  }
}
