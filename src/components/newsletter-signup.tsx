'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setState('ok');
      setMessage(data.message || 'Check your email to confirm.');
      setEmail('');
    } catch (err: any) {
      setState('error');
      setMessage(err.message);
    }
  }

  return (
    <section id="newsletter" className="py-24 md:py-32 bg-coral-500 text-cream-50 relative overflow-hidden">
      <div className="blob bg-gold-400 w-[400px] h-[400px] -top-40 -left-20 opacity-50"></div>
      <div className="blob bg-coral-200 w-[300px] h-[300px] -bottom-20 right-10 opacity-40"></div>
      <div className="relative max-w-4xl mx-auto px-6 md:px-10 text-center">
        <div className="text-cream-50/85 text-xs uppercase tracking-[0.3em] mb-6">— Newsletter —</div>
        <h2 className="font-display font-light text-3xl md:text-5xl display-tight mb-6">
          Stay informed. <span className="italic">Stay organized.</span>
        </h2>
        <p className="text-cream-50/90 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Get HTAG updates, organizing alerts, and rights news delivered to your inbox.
          No spam. Unsubscribe any time.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={state === 'loading'}
            className="flex-1 px-5 py-3.5 bg-cream-50 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-sage-900 rounded-full disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="bg-sage-900 hover:bg-sage-800 text-cream-50 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors rounded-full disabled:opacity-50"
          >
            {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`mt-5 text-sm ${state === 'ok' ? 'text-cream-50' : 'text-gold-200'}`}>{message}</p>
        )}
      </div>
    </section>
  );
}
