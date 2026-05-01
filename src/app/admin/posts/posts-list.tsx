import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PostsList } from './posts-list';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-sage-900">News posts</h1>
        <Link href="/admin/posts/new" className="btn-coral px-5 py-2.5 text-sm font-medium">+ New post</Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-ink/60">No posts yet. Click "New post" to create one.</p>
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
}
