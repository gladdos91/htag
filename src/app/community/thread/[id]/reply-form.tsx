'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReplyForm({ threadId, locked }: { threadId: string; locked: boolean }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (locked) {
    return <div className="bg-cream-100 rounded-md p-6 text-center text-ink/60">This thread is locked.</div>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, body }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setBody('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-cream-100 rounded-md p-6">
      <h3 className="font-display text-xl text-sage-900 mb-4">Reply</h3>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={5}
        required
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 bg-cream-50 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 mb-4"
      />
      <button type="submit" disabled={submitting} className="btn-primary px-6 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Posting…' : 'Post reply'}
      </button>
    </form>
  );
}
