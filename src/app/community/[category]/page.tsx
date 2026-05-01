import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const cat = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      threads: {
        orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
        include: {
          author: { select: { name: true, role: true } },
          _count: { select: { replies: true } },
        },
      },
    },
  });

  if (!cat) notFound();

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6 md:px-10">
        <Link href="/community" className="text-sm text-ink/60 hover:text-coral-600 mb-6 inline-block">← All categories</Link>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-4">Category</div>
            <h1 className="font-display font-light text-sage-900 text-4xl md:text-5xl display-tight mb-3">{cat.name}</h1>
            {cat.description && <p className="text-ink/70 max-w-2xl">{cat.description}</p>}
          </div>
          <Link href={`/community/new?category=${cat.slug}`} className="btn-primary px-6 py-3 text-sm font-medium">+ New thread</Link>
        </div>

        {cat.threads.length === 0 ? (
          <p className="text-ink/60">Be the first to start a discussion here.</p>
        ) : (
          <div className="border-t border-sage-900/10">
            {cat.threads.map(t => (
              <Link
                key={t.id}
                href={`/community/thread/${t.id}`}
                className="block py-5 border-b border-sage-900/10 hover:bg-cream-100 px-3 -mx-3 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {t.pinned && <span className="text-coral-500 mt-1">📌</span>}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-sage-900 group-hover:text-coral-600 transition-colors">{t.title}</h3>
                    <div className="text-xs text-ink/60 mt-1">
                      by {t.author.name}
                      {t.author.role === 'ADVOCATE' && <span className="ml-2 text-coral-500">✓ Advocate</span>}
                      {' · '}{new Date(t.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-ink/60 shrink-0">{t._count.replies} {t._count.replies === 1 ? 'reply' : 'replies'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
