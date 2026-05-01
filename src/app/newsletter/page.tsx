import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Newsletter · HTAG' };
export const revalidate = 60;

export default async function NewsletterPage() {
  let issues: any[] = [];
  try {
    issues = await prisma.newsletterIssue.findMany({
      where: { status: 'SENT' },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });
  } catch {}

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-4xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Newsletter</div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight mb-6">Past issues.</h1>
        <p className="text-ink/75 text-lg max-w-2xl mb-12">A record of what we've been up to. Read past dispatches or subscribe below to get future issues in your inbox.</p>

        {issues.length === 0 ? (
          <p className="text-ink/60 mb-16">No issues sent yet. Subscribe below to be the first to receive HTAG updates.</p>
        ) : (
          <div className="space-y-6 mb-16">
            {issues.map(i => (
              <div key={i.id} className="p-6 bg-cream-100 rounded-md border border-sage-900/10">
                <div className="text-xs text-ink/55 mb-2">{i.sentAt && new Date(i.sentAt).toLocaleDateString()}</div>
                <h2 className="font-display text-2xl text-sage-900 mb-3">{i.subject}</h2>
                <div className="text-ink/75 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: i.body }} />
              </div>
            ))}
          </div>
        )}
      </section>
      <NewsletterSignup />
      <Footer />
    </>
  );
}
