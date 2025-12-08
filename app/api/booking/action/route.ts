import { NextRequest, NextResponse } from 'next/server';
import sendEmail from '@/lib/sendEmail';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const email = searchParams.get('email');

  if (!status || !email) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    const subject = status === 'accept' ? 'Booking Accepted' : 'Booking Declined';
    const message =
      status === 'accept'
        ? 'Your booking has been approved by the admin. We look forward to serving you!'
        : 'We regret to inform you that your booking has been declined.';

    await sendEmail({
      to: email,
      subject,
      html: `
        <h3>${subject}</h3>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: `Booking ${status} email sent successfully.` });
  } catch (error) {
    console.error('Failed to process admin action:', error);
    return NextResponse.json({ message: 'Failed to process admin action' }, { status: 500 });
  }
}
