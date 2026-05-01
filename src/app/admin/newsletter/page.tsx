import { prisma } from '@/lib/db';
import { ComposeForm } from './compose-form';

export default async function NewsletterAdminPage() {
  const issues = await prisma.newsletterIssue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
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
          <div className="space-y-3">
            {issues.length === 0 && <p className="text-ink/60 text-sm">No issues yet.</p>}
            {issues.map(i => (
              <div key={i.id} className="p-4 bg-white border border-sage-900/10 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sage-900">{i.subject}</div>
                    <div className="text-xs text-ink/60 mt-1">{i.status}{i.sentAt && ` · ${i.recipientCount} sent · ${new Date(i.sentAt).toLocaleDateString()}`}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
