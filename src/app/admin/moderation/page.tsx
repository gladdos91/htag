import { prisma } from '@/lib/db';

export default async function ModerationPage() {
  const recentThreads = await prisma.thread.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { author: { select: { name: true } }, category: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-sage-900 mb-8">Moderation</h1>

      <div className="bg-white border border-sage-900/10 rounded-md p-6 mb-8">
        <h2 className="font-display text-xl text-sage-900 mb-4">Recent threads</h2>
        {recentThreads.length === 0 ? (
          <p className="text-ink/60 text-sm">No threads yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentThreads.map(t => (
              <li key={t.id} className="flex justify-between items-start py-2 border-b border-sage-900/5">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-ink/60">{t.author.name} · {t.category.name}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  {t.pinned && <span className="px-2 py-1 bg-gold-200 rounded">Pinned</span>}
                  {t.locked && <span className="px-2 py-1 bg-coral-200 rounded">Locked</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-cream-100 border border-sage-900/10 rounded-md p-6 text-sm text-ink/70">
        <strong>To build out:</strong> reports system, user ban tools, content removal queue. Wire these to <code>/api/admin/moderation/*</code> endpoints.
      </div>
    </div>
  );
}
