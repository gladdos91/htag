import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import slugify from 'slugify';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal('')),
  publish: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());
    const baseSlug = slugify(data.title, { lower: true, strict: true });
    let slug = baseSlug;
    let n = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }
    const post = await prisma.post.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt || null,
        body: data.body,
        coverImage: data.coverImage || null,
        published: data.publish,
        publishedAt: data.publish ? new Date() : null,
        authorId: (session.user as any).id,
      },
    });
    return NextResponse.json({ post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
