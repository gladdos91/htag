'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/community';

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
      {error && <p className="text-sm text-coral-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary px-6 py-3 text-sm font-medium w-full disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-md mx-auto px-6 md:px-10">
        <h1 className="font-display font-light text-sage-900 text-4xl display-tight mb-8">Welcome back.</h1>
        <Suspense fallback={<div className="text-ink/60">Loading…</div>}>
          <SignInForm />
        </Suspense>
        <p className="mt-6 text-sm text-ink/70">
          New here? <Link href="/auth/signup" className="text-coral-600 underline">Create an account</Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
