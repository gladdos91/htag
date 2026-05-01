import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendNewsletter } from '@/lib/email';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { issueId } = await req.json();
  const issue = await prisma.newsletterIssue.findUnique({ where: { id: issueId } });
  if (!issue) return NextResponse.json({ error: 'Issue not found' }, { status: 404 });

  await prisma.newsletterIssue.update({
    where: { id: issueId },
    data: { status: 'SENDING' },
  });

  const subscribers = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' } });

  let sent = 0;
  for (const s of subscribers) {
    try {
      await sendNewsletter({
        to: s.email,
        subject: issue.subject,
        bodyHtml: issue.body,
        unsubscribeToken: s.unsubscribeToken,
      });
      sent++;
    } catch (e) {
      console.error('Send failed for', s.email, e);
    }
  }

  await prisma.newsletterIssue.update({
    where: { id: issueId },
    data: { status: 'SENT', sentAt: new Date(), recipientCount: sent },
  });

  return NextResponse.json({ sent, total: subscribers.length });
}
