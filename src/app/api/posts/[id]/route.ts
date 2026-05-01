import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const patchSchema = z.object({
  published: z.boolean().optional(),
  title: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  coverImage: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = patchSchema.parse(await req.json());
    const updateData: any = { ...data };
    if (data.published === true) {
      const existing = await prisma.post.findUnique({ where: { id: params.id }, select: { publishedAt: true } });
      if (existing && !existing.publishedAt) updateData.publishedAt = new Date();
    }
    if (data.published === false) {
      updateData.publishedAt = null;
    }
    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json({ post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
