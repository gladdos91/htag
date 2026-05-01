import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post || !post.published) notFound();

  return (
    <>
      <Nav />
      <article className="pt-32 pb-16 max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">
          {post.author?.name ?? 'HTAG'} · {post.publishedAt?.toLocaleDateString()}
        </div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-5xl display-tight mb-10">
          {post.title}
        </h1>
        {post.coverImage && (
          <img src={post.coverImage} alt="" className="w-full aspect-[16/9] object-cover rounded-md mb-12" />
        )}
        <div
          className="prose prose-lg max-w-none text-ink/85 leading-relaxed prose-headings:font-display prose-headings:text-sage-900 prose-a:text-coral-600 prose-img:rounded-md"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
      <Footer />
    </>
  );
}
