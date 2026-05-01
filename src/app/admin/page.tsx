import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const [users, posts, threads, subscribers, pending] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.thread.count(),
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.subscriber.count({ where: { status: 'PENDING' } }),
  ]);

  const stats = [
    { label: 'Users', value: users },
    { label: 'News posts', value: posts },
    { label: 'Forum threads', value: threads },
    { label: 'Active subscribers', value: subscribers },
    { label: 'Pending subscribers', value: pending },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-sage-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-sage-900/10 rounded-md p-5">
            <div className="text-3xl font-display text-coral-600">{s.value}</div>
            <div className="text-xs uppercase tracking-[0.18em] text-ink/60 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
