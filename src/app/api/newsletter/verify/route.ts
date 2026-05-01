import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const sub = await prisma.subscriber.findUnique({ where: { verifyToken: token } });
  if (!sub) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });

  await prisma.subscriber.update({
    where: { id: sub.id },
    data: { status: 'ACTIVE', verifiedAt: new Date(), verifyToken: null },
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '/';
  return NextResponse.redirect(`${site}/newsletter?verified=1`);
}
