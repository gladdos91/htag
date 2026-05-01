import Link from 'next/link';
import { prisma } from '@/lib/db';

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
        <p className="text-ink/60">No posts yet. Posts are stub-only — wire up the editor next.</p>
      ) : (
        <div className="bg-white border border-sage-900/10 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-t border-sage-900/10">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">{p.author.name}</td>
                  <td className="px-4 py-3">{p.published ? '✓ Published' : 'Draft'}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
