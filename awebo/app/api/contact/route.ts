import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const subject = body.subject?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!name || name.length > 120) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: 'Please enter a message of at least 10 characters.' },
      { status: 400 }
    );
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const payload = {
    name,
    email,
    subject: subject || 'Meeting Room inquiry',
    message,
    source: 'hq-meeting-room',
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.AWEBO_CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        console.error('Contact webhook failed', webhookResponse.status);
        return NextResponse.json(
          { error: 'Unable to send message right now. Please try again.' },
          { status: 502 }
        );
      }
    } catch (error) {
      console.error('Contact webhook error', error);
      return NextResponse.json(
        { error: 'Unable to send message right now. Please try again.' },
        { status: 502 }
      );
    }
  } else {
    console.info('[contact]', payload);
  }

  return NextResponse.json({ ok: true });
}
