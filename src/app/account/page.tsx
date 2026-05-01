import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { authOptions } from '@/lib/auth';
import { ChangePasswordForm } from './change-password-form';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin?callbackUrl=/account');

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-2xl mx-auto px-6 md:px-10">
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-5xl display-tight mb-3">Your account</h1>
        <p className="text-ink/70 mb-10">Signed in as {session.user?.email}</p>

        <div className="bg-cream-100 rounded-md p-6 md:p-8 border border-sage-900/10">
          <h2 className="font-display text-2xl text-sage-900 mb-6">Change password</h2>
          <ChangePasswordForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
