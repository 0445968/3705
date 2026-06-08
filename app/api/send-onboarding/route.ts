import { NextResponse } from 'next/server';
import { resend } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, orgName, inviteUrl } = await req.json();

    const { error } = await resend.emails.send({
      from: 'Crafterkite <onboarding@yourdomain.com>',
      to: email,
      subject: `You're invited to ${orgName}`,
      html: `
        <h2>Welcome to ${orgName}</h2>
        <p>Click below to start onboarding:</p>
        <a href="${inviteUrl}">Start onboarding</a>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}