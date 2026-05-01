import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(1),
  categorySlug: z.string(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const threads = await prisma.thread.findMany({
    where: category ? { category: { slug: category } } : {},
    orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
    include: {
      author: { select: { id: true, name: true, role: true } },
      category: true,
      _count: { select: { replies: true } },
    },
    take: 50,
  });
  return NextResponse.json({ threads });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, body: postBody, categorySlug } = createSchema.parse(body);

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });

    const thread = await prisma.thread.create({
      data: {
        title,
        body: postBody,
        categoryId: category.id,
        authorId: (session.user as any).id,
      },
    });
    return NextResponse.json({ thread });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
