import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Resources · HTAG' };
export const revalidate = 300;

export default async function ResourcesPage() {
  let resources: any[] = [];
  try {
    resources = await prisma.resource.findMany({ orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] });
  } catch {}

  // Group by category
  const groups: Record<string, any[]> = {};
  for (const r of resources) {
    const c = r.category ?? 'Other';
    (groups[c] ??= []).push(r);
  }

  return (
    <>
      <Nav />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Resources</div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight mb-6 max-w-3xl">
          Know your rights. <span className="italic text-coral-600">Know your tools.</span>
        </h1>
        <p className="text-ink/75 text-lg max-w-2xl mb-16">
          Guides, legal references, and templates for tenants navigating manufactured home park life.
        </p>

        {Object.keys(groups).length === 0 ? (
          <p className="text-ink/60">Resources are being added. Check back soon.</p>
        ) : (
          Object.entries(groups).map(([cat, items]) => (
            <div key={cat} className="mb-16">
              <h2 className="font-display text-2xl text-sage-900 mb-6 border-b border-sage-900/15 pb-3">{cat}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(r => (
                  <a
                    key={r.id}
                    href={r.url ?? r.fileUrl ?? `#`}
                    className="group block p-6 bg-cream-100 hover:bg-coral-100 transition-colors rounded-md border border-sage-900/10"
                  >
                    <div className="text-coral-600 text-[11px] uppercase tracking-[0.22em] mb-3 font-medium">{r.type}</div>
                    <h3 className="font-display text-xl text-sage-900 mb-2 group-hover:text-coral-600 transition-colors">{r.title}</h3>
                    {r.description && <p className="text-ink/70 text-sm">{r.description}</p>}
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
      <Footer />
    </>
  );
}
