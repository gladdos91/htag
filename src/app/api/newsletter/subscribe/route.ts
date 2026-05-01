import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendVerifyEmail } from '@/lib/email';

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = schema.parse(body);

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing && existing.status === 'ACTIVE') {
      return NextResponse.json({ message: 'You\'re already subscribed.' });
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const sub = await prisma.subscriber.upsert({
      where: { email },
      update: { status: 'PENDING', verifyToken, name },
      create: { email, name, status: 'PENDING', verifyToken },
    });

    await sendVerifyEmail(email, verifyToken);

    return NextResponse.json({ message: 'Check your email to confirm.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Invalid request' }, { status: 400 });
  }
}
