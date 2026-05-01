import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  threadId: z.string(),
  body: z.string().min(1),
  parentId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = schema.parse(await req.json());
    const thread = await prisma.thread.findUnique({ where: { id: data.threadId } });
    if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    if (thread.locked) return NextResponse.json({ error: 'Thread is locked' }, { status: 403 });

    const reply = await prisma.reply.create({
      data: {
        threadId: data.threadId,
        body: data.body,
        parentId: data.parentId,
        authorId: (session.user as any).id,
      },
    });

    // Bump thread updatedAt
    await prisma.thread.update({
      where: { id: data.threadId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
