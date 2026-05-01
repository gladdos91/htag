import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = schema.parse(await req.json());
    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: 'No password set on this account.' }, { status: 400 });
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Invalid request' }, { status: 400 });
  }
}
