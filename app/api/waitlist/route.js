import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendWelcomeEmail } from '../../../lib/email';

export async function POST(req) {
  const { name, email, shopifyStoreName, websiteLink, productCategory } = await req.json();

  try {
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        name,
        email,
        shopifyStoreName,
        websiteLink,
        productCategory: JSON.stringify(productCategory),
        paymentStatus: 'COMPLETED',
      },
    });

    await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true, waitlistEntry });
  } catch (error) {
    console.error('Failed to join waitlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to join waitlist' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const waitlist = await prisma.waitlist.findMany({
      select: { name: true },
      where: { paymentStatus: 'COMPLETED' },
    });
    return NextResponse.json(waitlist);
  } catch (error) {
    console.error('Failed to fetch waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}