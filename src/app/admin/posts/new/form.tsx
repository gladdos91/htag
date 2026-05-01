'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewPostForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function save(publish: boolean) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, body, coverImage, publish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/admin/posts');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 text-lg font-display" />
      <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Cover image URL (optional)" className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 text-sm" />
      <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short excerpt for the listing card" rows={2} className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Full body. Plain text or basic markdown." rows={16} className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      <div className="flex gap-3">
        <button onClick={() => save(false)} disabled={submitting || !title || !body} className="px-5 py-3 border border-sage-900 text-sage-900 rounded-full text-sm font-medium hover:bg-sage-900 hover:text-cream-50 transition-colors disabled:opacity-50">Save draft</button>
        <button onClick={() => save(true)} disabled={submitting || !title || !body} className="btn-coral px-5 py-3 text-sm font-medium disabled:opacity-50">Publish</button>
      </div>
    </div>
  );
}
