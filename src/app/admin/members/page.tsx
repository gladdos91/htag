import { prisma } from '@/lib/db';
import { MembersTable } from './members-table';

export const dynamic = 'force-dynamic';

export default async function MembersAdminPage({ searchParams }: { searchParams: { q?: string; filter?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const filter = searchParams.filter ?? 'all';

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { parkCommunity: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (filter === 'unverified') where.verified = false;
  if (filter === 'banned') where.banned = true;
  if (filter === 'admins') where.role = { in: ['ADMIN', 'MODERATOR'] };
  if (filter === 'advocates') where.role = 'ADVOCATE';

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const counts = {
    all: await prisma.user.count(),
    unverified: await prisma.user.count({ where: { verified: false } }),
    banned: await prisma.user.count({ where: { banned: true } }),
    admins: await prisma.user.count({ where: { role: { in: ['ADMIN', 'MODERATOR'] } } }),
    advocates: await prisma.user.count({ where: { role: 'ADVOCATE' } }),
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-display text-3xl text-sage-900">Members</h1>
      </div>
      <p className="text-sm text-ink/60 mb-8">
        Approve new members, set roles, and manage account status.
      </p>

      <MembersTable users={users} counts={counts} currentQuery={q} currentFilter={filter} />
    </div>
  );
}
