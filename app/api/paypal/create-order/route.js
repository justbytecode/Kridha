import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '9.00',
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Failed to create PayPal order:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}