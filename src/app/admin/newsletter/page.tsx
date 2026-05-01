import { prisma } from '@/lib/db';
import { ComposeForm } from './compose-form';
import { IssuesList } from './issues-list';

export const dynamic = 'force-dynamic';

export default async function NewsletterAdminPage() {
  const issues = await prisma.newsletterIssue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-sage-900 mb-8">Newsletter</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-xl text-sage-900 mb-4">Compose new issue</h2>
          <ComposeForm />
        </div>

        <div>
          <h2 className="font-display text-xl text-sage-900 mb-4">Recent issues</h2>
          <IssuesList issues={issues} />
        </div>
      </div>
    </div>
  );
}
