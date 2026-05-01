'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Nav() {
  const [open, setOpen] = useState(false);
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

        <Link href="/donate" className="hidden md:inline-block btn-coral px-5 py-2.5 text-sm font-medium tracking-wide">
          Support our work
        </Link>

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
          <Link href="/donate" className="btn-coral inline-block px-5 py-2.5 text-sm mt-2">Support our work</Link>
        </div>
      )}
    </nav>
  );
}
