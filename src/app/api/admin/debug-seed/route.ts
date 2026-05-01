import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER USE
// GET  → reports current state of the admin user
// POST → forcibly creates/updates admin@hoffmantag.org with password 'changeme123'

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, name: true, role: true,
      verified: true, banned: true,
      hasPassword: false,
    },
  });
  const adminEmail = 'admin@hoffmantag.org';
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  const categoryCount = await prisma.category.count();

  return NextResponse.json({
    totalUsers: users.length,
    users: users.map(u => ({ email: u.email, role: u.role, banned: u.banned })),
    adminExists: !!admin,
    adminHasPassword: !!admin?.passwordHash,
    adminBanned: admin?.banned ?? null,
    categoryCount,
  });
}

export async function POST() {
  const passwordHash = await bcrypt.hash('changeme123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@hoffmantag.org' },
    update: {
      passwordHash,
      role: 'ADMIN',
      banned: false,
      verified: true,
    },
    create: {
      email: 'admin@hoffmantag.org',
      name: 'HTAG Admin',
      role: 'ADMIN',
      verified: true,
      banned: false,
      passwordHash,
    },
  });
  return NextResponse.json({
    ok: true,
    email: user.email,
    role: user.role,
    message: 'Admin reset. Try signing in with admin@hoffmantag.org / changeme123',
  });
}
