import type { Metadata } from 'next';
import { Fraunces, Public_Sans } from 'next/font/google';
import { SessionProviderWrapper } from '@/components/session-provider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Hoffman Tenants Advocacy Group',
    template: '%s · HTAG',
  },
  description: 'Advocating for tenants\' rights — past, present, and future. Representing 16+ manufactured home communities across New York State.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Hoffman Tenants Advocacy Group',
    description: 'Advocating for tenants\' rights across New York State.',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body className="min-h-screen font-body">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
