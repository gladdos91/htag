'use client';

import { useState } from 'react';

export function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (next !== confirm) {
      setMessage({ type: 'err', text: "New passwords don't match." });
      return;
    }
    if (next.length < 8) {
      setMessage({ type: 'err', text: 'New password must be at least 8 characters.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage({ type: 'ok', text: 'Password updated.' });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err: any) {
      setMessage({ type: 'err', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Current password</label>
        <input type="password" required value={current} onChange={e => setCurrent(e.target.value)} className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">New password</label>
        <input type="password" required minLength={8} value={next} onChange={e => setNext(e.target.value)} className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
        <p className="text-xs text-ink/55 mt-1">At least 8 characters.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Confirm new password</label>
        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'ok' ? 'text-sage-700' : 'text-coral-600'}`}>{message.text}</p>
      )}
      <button type="submit" disabled={submitting} className="btn-primary px-6 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
