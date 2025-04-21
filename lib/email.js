import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to, name) {
  try {
    await resend.emails.send({
      from: 'Kridha Team <no-reply@kridha.com>',
      to,
      subject: 'Welcome to Kridha Virtual Try-On Waitlist!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining the Kridha Virtual Try-On waitlist!</p>
        <p>As a special offer, we're providing you with <strong>6 months of free access</strong> to Kridha Virtual Try-On for Shopify store owners, including a Beautiful Premium Template.</p>
        <p>We'll keep you updated on your waitlist status.</p>
        <p>Best regards,<br/>The Kridha Team</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send welcome email');
  }
}