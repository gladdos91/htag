import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const patchSchema = z.object({
  role: z.enum(['TENANT', 'ADVOCATE', 'MODERATOR', 'ADMIN']).optional(),
  verified: z.boolean().optional(),
  banned: z.boolean().optional(),
  bannedReason: z.string().nullable().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 });

  // Don't let an admin demote/ban themselves and lock everyone out
  if (params.id === (session.user as any).id) {
    const body = await req.json().catch(() => ({}));
    if (body.role && body.role !== 'ADMIN') {
      return NextResponse.json({ error: "You can't demote yourself." }, { status: 400 });
    }
    if (body.banned === true) {
      return NextResponse.json({ error: "You can't ban yourself." }, { status: 400 });
    }
  }

  try {
    const data = patchSchema.parse(await req.json());
    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true, name: true, email: true, role: true, parkCommunity: true,
        verified: true, banned: true, bannedReason: true, createdAt: true,
      },
    });
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 });

  if (params.id === (session.user as any).id) {
    return NextResponse.json({ error: "You can't delete yourself." }, { status: 400 });
  }

  try {
    // Cascade delete: kill threads/replies/posts authored by this user
    // (in production you'd usually mark these as orphaned instead)
    await prisma.$transaction([
      prisma.reply.deleteMany({ where: { authorId: params.id } }),
      prisma.thread.deleteMany({ where: { authorId: params.id } }),
      prisma.post.deleteMany({ where: { authorId: params.id } }),
      prisma.session.deleteMany({ where: { userId: params.id } }),
      prisma.account.deleteMany({ where: { userId: params.id } }),
      prisma.user.delete({ where: { id: params.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
