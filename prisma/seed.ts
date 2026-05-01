import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Default forum categories
  const categories = [
    { slug: 'general', name: 'General Discussion', description: 'Community-wide conversation.', order: 0 },
    { slug: 'parks', name: 'Park Discussions', description: 'Park-by-park threads. Find your community.', order: 1 },
    { slug: 'legal', name: 'Legal & Rights Q&A', description: 'Questions about tenant law. Verified advocates respond.', order: 2 },
    { slug: 'organizing', name: 'Organizing & Events', description: 'Coordinate, plan, and rally.', order: 3 },
    { slug: 'support', name: 'Support & Stories', description: 'Share what you\'re facing. We\'re here to listen.', order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ✓ ${categories.length} categories`);

  // Default admin (change password after first login)
  const adminEmail = 'admin@hoffmantag.org';
  const passwordHash = await bcrypt.hash('changeme123', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'HTAG Admin',
      role: 'ADMIN',
      verified: true,
      passwordHash,
    },
  });
  console.log(`  ✓ admin user (${adminEmail} / changeme123)`);

  console.log('✅ Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
