import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-60 bg-sage-900 text-cream-50 p-6 sticky top-0 h-screen">
        <Link href="/" className="font-display text-xl text-cream-50 mb-10 block">HTAG Admin</Link>
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block py-2 hover:text-coral-200">Dashboard</Link>
          <Link href="/admin/posts" className="block py-2 hover:text-coral-200">News Posts</Link>
          <Link href="/admin/newsletter" className="block py-2 hover:text-coral-200">Newsletter</Link>
          <Link href="/admin/members" className="block py-2 hover:text-coral-200">Members</Link>
          <Link href="/admin/moderation" className="block py-2 hover:text-coral-200">Moderation</Link>
        </nav>
        <div className="mt-10 pt-6 border-t border-cream-50/15 text-xs text-cream-50/60">
          Signed in as {session.user?.name}
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-coral-200">{role}</div>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
