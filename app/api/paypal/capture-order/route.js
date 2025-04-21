import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderID } = await req.json();
    const apiUrl = 'https://api-m.paypal.com'; // Live URL for real payments

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      throw new Error('PayPal credentials are missing. Check NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_SECRET in .env.');
    }

    if (!process.env.NEXT_PUBLIC_RETURN_URL || !process.env.NEXT_PUBLIC_CANCEL_URL) {
      throw new Error('Return or cancel URLs are missing. Check NEXT_PUBLIC_RETURN_URL and NEXT_PUBLIC_CANCEL_URL in .env.');
    }

    console.log('Capturing PayPal order:', orderID);
    const response = await fetch(`${apiUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Capture result:', data.status);
    if (data.status === 'COMPLETED') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_RETURN_URL}`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CANCEL_URL}`);
    }
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CANCEL_URL}`);
  }
}