'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string | null };
};

export function PostsList({ posts: initialPosts }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function togglePublish(id: string, currentlyPublished: boolean) {
    setBusyId(id);
    try {
      const res = await fetch('/api/posts/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentlyPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data.post } : p));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(id: string, title: string) {
    if (!confirm('Delete "' + title + '"? This cannot be undone.')) return;
    setBusyId(id);
    try {
      const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setPosts(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="bg-white border border-sage-900/10 rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-cream-100 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id} className="border-t border-sage-900/10">
              <td className="px-4 py-3 font-medium">{p.title}</td>
              <td className="px-4 py-3">{p.author.name}</td>
              <td className="px-4 py-3">
                {p.published ? (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-medium">Published</span>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-gold-200 text-sage-900 text-xs font-medium">Draft</span>
                )}
              </td>
              <td className="px-4 py-3 text-ink/60 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end">
                  <a href={'/news/' + p.slug} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-md text-xs font-medium bg-sage-100 hover:bg-sage-200 text-sage-900">View</a>
                  <button onClick={() => togglePublish(p.id, p.published)} disabled={busyId === p.id} className={'px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 ' + (p.published ? 'bg-cream-100 hover:bg-coral-100 text-sage-900' : 'bg-coral-500 hover:bg-coral-600 text-cream-50')}>
                    {busyId === p.id ? '...' : p.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deletePost(p.id, p.title)} disabled={busyId === p.id} className="px-3 py-1.5 rounded-md text-xs font-medium bg-cream-100 hover:bg-coral-100 text-coral-600 disabled:opacity-50">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
