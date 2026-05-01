'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ComposeForm() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function saveDraft(send: boolean) {
    setSubmitting(true);
    try {
      const create = await fetch('/api/newsletter/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      const { issue } = await create.json();
      if (!create.ok) throw new Error('Failed to save draft');

      if (send) {
        if (!confirm(`Send "${subject}" to all active subscribers?`)) return;
        const sendRes = await fetch('/api/newsletter/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ issueId: issue.id }),
        });
        const r = await sendRes.json();
        if (!sendRes.ok) throw new Error(r.error || 'Send failed');
        alert(`Sent to ${r.sent} of ${r.total} subscribers.`);
      } else {
        alert('Draft saved.');
      }
      router.refresh();
      setSubject('');
      setBody('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Subject line"
        className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500"
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="HTML body. Supports basic HTML tags."
        rows={14}
        className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 font-mono text-sm"
      />
      <div className="flex gap-3">
        <button onClick={() => saveDraft(false)} disabled={submitting || !subject || !body} className="px-5 py-3 border border-sage-900 text-sage-900 rounded-full text-sm font-medium hover:bg-sage-900 hover:text-cream-50 transition-colors disabled:opacity-50">
          Save draft
        </button>
        <button onClick={() => saveDraft(true)} disabled={submitting || !subject || !body} className="btn-coral px-5 py-3 text-sm font-medium disabled:opacity-50">
          Save & send to all
        </button>
      </div>
    </div>
  );
}
