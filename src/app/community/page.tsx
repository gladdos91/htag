import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export const metadata = { title: 'Community · HTAG' };
export const revalidate = 30;

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { threads: true } },
        threads: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
          include: { author: { select: { name: true } } },
        },
      },
    });
  } catch {}

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Community</div>
            <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight">Tenants talking <span className="italic text-coral-600">to tenants.</span></h1>
          </div>
          {session ? (
            <Link href="/community/new" className="btn-primary px-6 py-3 text-sm font-medium tracking-wide">
              + New thread
            </Link>
          ) : (
            <Link href="/auth/signin" className="btn-coral px-6 py-3 text-sm font-medium tracking-wide">
              Sign in to participate
            </Link>
          )}
        </div>

        {categories.length === 0 ? (
          <p className="text-ink/60">Forum is being set up. Run <code>npm run db:seed</code> to create default categories.</p>
        ) : (
          <div className="space-y-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/community/${cat.slug}`}
                className="group block p-6 bg-cream-100 hover:bg-cream-50 border border-sage-900/10 hover:border-coral-500 rounded-md transition-all"
              >
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <h2 className="font-display text-2xl text-sage-900 mb-1 group-hover:text-coral-600 transition-colors">{cat.name}</h2>
                    {cat.description && <p className="text-ink/70 text-sm">{cat.description}</p>}
                  </div>
                  <div className="md:col-span-2 text-center">
                    <div className="font-display text-2xl text-coral-600">{cat._count.threads}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Threads</div>
                  </div>
                  <div className="md:col-span-3 text-sm text-ink/60">
                    {cat.threads[0] ? (
                      <>
                        <div className="text-ink/80 truncate">{cat.threads[0].title}</div>
                        <div className="text-[11px] mt-1">{cat.threads[0].author.name} · {new Date(cat.threads[0].updatedAt).toLocaleDateString()}</div>
                      </>
                    ) : (
                      <span className="text-ink/40">No threads yet.</span>
                    )}
                  </div>
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
