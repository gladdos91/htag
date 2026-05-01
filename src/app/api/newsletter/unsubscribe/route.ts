import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  await prisma.subscriber.updateMany({
    where: { unsubscribeToken: token },
    data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '/';
  return NextResponse.redirect(`${site}/newsletter?unsubscribed=1`);
}
