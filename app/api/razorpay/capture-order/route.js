import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Manually verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Invalid payment signature:', {
        generatedSignature,
        razorpay_signature,
        razorpay_order_id,
        razorpay_payment_id,
      });
      return new Response(JSON.stringify({ success: false, error: 'Invalid payment signature' }), {
        status: 400,
      });
    }

    // Fetch payment details to confirm success
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== 'captured') {
      console.error('Payment not captured:', payment.status, payment);
      return new Response(JSON.stringify({ success: false, error: 'Payment not captured' }), {
        status: 400,
      });
    }

    console.log('Payment verified successfully:', { razorpay_order_id, razorpay_payment_id, payment });
    return new Response(JSON.stringify({ success: true, paymentId: razorpay_payment_id }), {
      status: 200,
    });
  } catch (error) {
    console.error('Payment verification error:', error.message, error);
    return new Response(JSON.stringify({ success: false, error: 'Payment verification failed' }), {
      status: 400,
    });
  }
}