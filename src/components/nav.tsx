'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const DONATE_URL = 'https://www.zeffy.com/en-US/donation-form/donate-to-help-see-actual-change-in-our-communities';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'MODERATOR';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-sage-900/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Hoffman Tenants Advocacy Group home">
          <Image
            src="/logo.png"
            alt="Hoffman Tenants Advocacy Group"
            width={1200}
            height={352}
            priority
            className="h-12 md:h-14 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-sage-900">
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/news" className="nav-link">News</Link>
          <Link href="/resources" className="nav-link">Resources</Link>
          <Link href="/community" className="nav-link">Community</Link>
          <Link href="/newsletter" className="nav-link">Newsletter</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-900 text-sm font-medium transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-coral-500 text-cream-50 flex items-center justify-center text-sm font-display">
                  {session.user?.name?.[0] ?? '?'}
                </span>
                <span>{session.user?.name?.split(' ')[0] ?? 'Account'}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 5l3 3 3-3" strokeLinecap="round" />
                </svg>
              </button>
              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-cream-50 border border-sage-900/10 rounded-md shadow-lg overflow-hidden z-20">
                    <div className="px-4 py-3 border-b border-sage-900/10">
                      <div className="text-sm font-medium text-sage-900">{session.user?.name}</div>
                      <div className="text-xs text-ink/60 truncate">{session.user?.email}</div>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-sm text-sage-900 hover:bg-cream-100 transition-colors">
                        Admin dashboard
                      </Link>
                    )}
                    <Link href="/community" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-sm text-sage-900 hover:bg-cream-100 transition-colors">
                      Community forum
                    </Link>
                    <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-sm text-sage-900 hover:bg-cream-100 transition-colors">
                      Account &amp; password
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2.5 text-sm text-coral-600 hover:bg-coral-100 transition-colors border-t border-sage-900/10"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="text-sm text-sage-900 hover:text-coral-600 font-medium">
              Sign in
            </Link>
          )}
          <a href={DONATE_URL} target="_blank" rel="noopener" className="btn-coral px-5 py-2.5 text-sm font-medium tracking-wide">
            Support our work
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-sage-900" aria-label="Menu">
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream-50 border-t border-sage-900/10 px-6 py-6 space-y-3 text-sage-900 font-medium">
          <Link href="/about" className="block">About</Link>
          <Link href="/news" className="block">News</Link>
          <Link href="/resources" className="block">Resources</Link>
          <Link href="/community" className="block">Community</Link>
          <Link href="/newsletter" className="block">Newsletter</Link>
          <Link href="/contact" className="block">Contact</Link>
          <div className="pt-3 border-t border-sage-900/10 space-y-3">
            {session ? (
              <>
                {isAdmin && <Link href="/admin" className="block">Admin dashboard</Link>}
                <Link href="/account" className="block">Account &amp; password</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="block text-coral-600">Sign out</button>
              </>
            ) : (
              <Link href="/auth/signin" className="block">Sign in</Link>
            )}
            <a href={DONATE_URL} target="_blank" rel="noopener" className="btn-coral inline-block px-5 py-2.5 text-sm">Support our work</a>
          </div>
        </div>
      )}
    </nav>
  );
}
