import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NewThreadForm } from './form';

export default async function NewThreadPage({ searchParams }: { searchParams: { category?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin?callbackUrl=/community/new');

  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-3xl mx-auto px-6 md:px-10">
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-5xl display-tight mb-10">Start a thread</h1>
        <NewThreadForm categories={categories} defaultCategory={searchParams.category} />
      </section>
      <Footer />
    </>
  );
}
