'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Issue = {
  id: string;
  subject: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT';
  sentAt: Date | null;
  recipientCount: number;
};

export function IssuesList({ issues: initialIssues }: { issues: Issue[] }) {
  const [issues, setIssues] = useState(initialIssues);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function deleteIssue(id: string, subject: string) {
    if (!confirm(`Delete "${subject}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/newsletter/issues/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setIssues(prev => prev.filter(i => i.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (issues.length === 0) {
    return <p className="text-ink/60 text-sm">No issues yet.</p>;
  }

  const statusBadge: Record<Issue['status'], string> = {
    DRAFT: 'bg-gold-200 text-sage-900',
    SCHEDULED: 'bg-sky-200 text-sage-900',
    SENDING: 'bg-coral-200 text-coral-600',
    SENT: 'bg-sage-100 text-sage-800',
  };

  return (
    <div className="space-y-3">
      {issues.map(i => (
        <div key={i.id} className="p-4 bg-white border border-sage-900/10 rounded-md flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sage-900 truncate">{i.subject}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-medium ${statusBadge[i.status]}`}>
                {i.status}
              </span>
              {i.sentAt && (
                <span className="text-xs text-ink/55">
                  {i.recipientCount} sent · {new Date(i.sentAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => deleteIssue(i.id, i.subject)}
            disabled={busyId === i.id}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-cream-100 hover:bg-coral-100 text-coral-600 disabled:opacity-50 shrink-0"
          >
            {busyId === i.id ? '...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
}
