import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());
    const issue = await prisma.newsletterIssue.create({
      data: {
        subject: data.subject,
        body: data.body,
        authorId: (session.user as any).id,
      },
    });
    return NextResponse.json({ issue });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
