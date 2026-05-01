import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { ReplyForm } from './reply-form';

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const thread = await prisma.thread.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, role: true, image: true } },
      category: true,
      replies: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { name: true, role: true, image: true } } },
      },
    },
  });

  if (!thread) notFound();

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-3xl mx-auto px-6 md:px-10">
        <Link href={`/community/${thread.category.slug}`} className="text-sm text-ink/60 hover:text-coral-600 mb-4 inline-block">
          ← {thread.category.name}
        </Link>
        <h1 className="font-display font-light text-sage-900 text-3xl md:text-4xl display-tight mb-6">{thread.title}</h1>

        {/* Original post */}
        <div className="bg-cream-100 rounded-md p-6 mb-10">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="w-9 h-9 rounded-full bg-coral-500 flex items-center justify-center text-cream-50 font-display">
              {thread.author.name?.[0] ?? '?'}
            </div>
            <div>
              <div className="font-medium text-sage-900">{thread.author.name}</div>
              <div className="text-xs text-ink/60">
                {thread.author.role === 'ADVOCATE' && <span className="text-coral-600 mr-2">✓ Advocate</span>}
                {new Date(thread.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-ink/85 whitespace-pre-line leading-relaxed">{thread.body}</div>
        </div>

        {/* Replies */}
        <h2 className="font-display text-2xl text-sage-900 mb-6">{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}</h2>
        <div className="space-y-5 mb-10">
          {thread.replies.map(r => (
            <div key={r.id} className="border-l-2 border-coral-500 pl-5 py-1">
              <div className="flex items-center gap-3 mb-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-sage-700 flex items-center justify-center text-cream-50 text-xs font-medium">
                  {r.author.name?.[0] ?? '?'}
                </div>
                <span className="font-medium text-sage-900">{r.author.name}</span>
                {r.author.role === 'ADVOCATE' && <span className="text-coral-600 text-xs">✓ Advocate</span>}
                <span className="text-xs text-ink/55">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-ink/85 whitespace-pre-line leading-relaxed">{r.body}</div>
            </div>
          ))}
        </div>

        {/* Reply form */}
        {session ? (
          <ReplyForm threadId={thread.id} locked={thread.locked} />
        ) : (
          <div className="bg-cream-100 rounded-md p-6 text-center">
            <Link href="/auth/signin" className="text-coral-600 underline">Sign in</Link> to reply.
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
