'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewThreadForm({ categories, defaultCategory }: { categories: any[]; defaultCategory?: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categorySlug, setCategorySlug] = useState(defaultCategory ?? categories[0]?.slug ?? '');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, categorySlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push(`/community/thread/${data.thread.id}`);
    } catch (err: any) {
      alert(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Category</label>
        <select value={categorySlug} onChange={e => setCategorySlug(e.target.value)} required className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500">
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={200}
          className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500"
          placeholder="What do you want to discuss?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Message</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          rows={8}
          className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500"
          placeholder="Share details, ask questions, start a conversation."
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary px-7 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Posting…' : 'Post thread'}
      </button>
    </form>
  );
}
