'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parkCommunity, setParkCommunity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, parkCommunity }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }
      // Auto sign in
      await signIn('credentials', { email, password, redirect: false });
      router.push('/community');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-md mx-auto px-6 md:px-10">
        <h1 className="font-display font-light text-sage-900 text-4xl display-tight mb-3">Join the community.</h1>
        <p className="text-ink/70 mb-8">Create an account to participate in discussions.</p>
        <form onSubmit={handle} className="space-y-4">
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Password (min 8 characters)" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
          <input value={parkCommunity} onChange={e => setParkCommunity(e.target.value)} placeholder="Your park community (optional)" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
          {error && <p className="text-sm text-coral-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary px-6 py-3 text-sm font-medium w-full disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/70">
          Already a member? <Link href="/auth/signin" className="text-coral-600 underline">Sign in</Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
