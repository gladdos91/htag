import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';

export const metadata = { title: 'News · HTAG' };
export const revalidate = 60;

export default async function NewsPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { name: true } } },
    });
  } catch {}

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">News & Stories</div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight mb-12 max-w-3xl">
          Updates from the field.
        </h1>

        {posts.length === 0 ? (
          <p className="text-ink/60">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link href={`/news/${post.slug}`} key={post.id} className="group block">
                <div className="overflow-hidden rounded-md mb-5 aspect-[4/3]">
                  <img src={post.coverImage ?? 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                </div>
                <div className="inline-block bg-coral-100 text-coral-600 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] mb-3 font-medium">
                  {post.author?.name ?? 'HTAG'}
                </div>
                <h2 className="font-display font-medium text-sage-900 text-2xl leading-tight mb-3 group-hover:text-coral-600 transition-colors">{post.title}</h2>
                {post.excerpt && <p className="text-ink/70 text-sm leading-relaxed">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
