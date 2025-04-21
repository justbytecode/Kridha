import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiUrl = 'https://api-m.paypal.com'; // Live URL

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      console.error('Missing PayPal credentials in .env');
      throw new Error('PayPal credentials are missing. Check NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_SECRET in .env.');
    }

    if (!process.env.NEXT_PUBLIC_RETURN_URL || !process.env.NEXT_PUBLIC_CANCEL_URL) {
      console.error('Missing return/cancel URLs in .env');
      throw new Error('Return or cancel URLs are missing. Check NEXT_PUBLIC_RETURN_URL and NEXT_PUBLIC_CANCEL_URL in .env.');
    }

    console.log('Initiating PayPal order creation...');
    const response = await fetch(`${apiUrl}/v2/checkout/orders`, {
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
        application_context: {
          return_url: process.env.NEXT_PUBLIC_RETURN_URL,
          cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PayPal API error: ${response.status} - ${errorText}`);
      throw new Error(`PayPal API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const approvalUrl = data.links.find((link) => link.rel === 'approve')?.href;
    if (!approvalUrl) {
      console.error('No approval URL in PayPal response:', data);
      throw new Error('No approval URL returned from PayPal.');
    }

    console.log('PayPal order created, approval URL:', approvalUrl);
    return NextResponse.json({ approvalUrl });
  } catch (error) {
    console.error('Failed to create PayPal order:', error.message);
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error.message },
      { status: 500 }
    );
  }
}