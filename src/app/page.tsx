import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export default async function HomePage() {
  let latestPosts: any[] = [];
  try {
    latestPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { author: { select: { name: true } } },
    }) as any;
  } catch {
    // DB not available — render with placeholders
  }

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero.jpg"
            alt="A Hoffman manufactured home community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="blob bg-coral-400 w-[400px] h-[400px] -top-20 -right-20"></div>
        <div className="blob bg-gold-400 w-[300px] h-[300px] top-1/3 left-1/4 opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-28 pt-32 w-full">
          <div className="max-w-3xl">
            <div className="reveal text-cream-50/90 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">
              Est. New York · 16 Communities
            </div>
            <h1 className="reveal delay-1 font-display font-light text-cream-50 text-4xl sm:text-5xl md:text-6xl lg:text-7xl display-tight mb-8">
              Advocating for tenants' rights —<br/>
              <span className="italic font-normal text-coral-200">past, present, and future.</span>
            </h1>
            <p className="reveal delay-2 text-cream-50/90 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
              We represent over sixteen manufactured home communities across New York State,
              fighting to ensure every tenant has a safe, dignified place to call home.
            </p>
            <div className="reveal delay-3 flex flex-wrap gap-4">
              <Link href="/donate" className="btn-coral px-7 py-3.5 text-sm font-medium tracking-wide">Support our work</Link>
              <Link href="/about" className="btn-ghost text-cream-50 px-7 py-3.5 text-sm font-medium tracking-wide">Learn more</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="about" className="relative py-24 md:py-32 bg-cream-100 overflow-hidden">
        <div className="blob bg-sage-200 w-[500px] h-[500px] -top-40 -left-40"></div>
        <div className="blob bg-coral-200 w-[400px] h-[400px] -bottom-40 -right-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Our Mission</div>
            <h2 className="font-display font-light text-sage-900 text-3xl md:text-5xl display-tight mb-8">
              Every tenant deserves peace of mind, and a safe place to live <span className="italic text-coral-600">without fear of losing their home.</span>
            </h2>
            <div className="space-y-5 text-ink/80 text-base md:text-lg leading-relaxed max-w-2xl">
              <p>
                Hoffman Tenants Advocacy Group represents over sixteen communities owned by Hoffman Homes.
                Our Executive Board members are tenants themselves — neighbors working to change things
                not only in our parks, but in every manufactured home community in New York.
              </p>
              <p>
                We are here to be the change, to educate, and to organize across the challenges our communities face every day.
              </p>
            </div>
            <Link href="/about" className="inline-block mt-10 text-sage-800 font-medium border-b-2 border-coral-500 hover:text-coral-600 pb-1 text-sm tracking-wide transition-colors">
              Read our story →
            </Link>
          </div>
          <div className="md:col-span-5">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80" alt="" className="w-full aspect-[4/5] object-cover rounded-md shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-coral-500 text-cream-50 px-6 py-4 max-w-[200px] rounded-md shadow-lg">
                <div className="font-display text-3xl font-light leading-none">16+</div>
                <div className="text-xs uppercase tracking-[0.18em] mt-2 opacity-95">Communities represented</div>
              </div>
              <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-gold-500 hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-24 md:py-32 bg-cream-50 border-t border-sage-900/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-4 rule-mark">Latest News</div>
              <h2 className="font-display font-light text-sage-900 text-3xl md:text-5xl display-tight max-w-2xl">
                Stories, updates, and calls to action.
              </h2>
            </div>
            <Link href="/news" className="text-sage-800 font-medium border-b-2 border-coral-500 hover:text-coral-600 pb-1 text-sm transition-colors">
              View all news →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.length > 0 ? (
              latestPosts.map((post: any) => (
                <Link href={`/news/${post.slug}`} key={post.id} className="group block">
                  <div className="overflow-hidden rounded-md mb-5 aspect-[4/3]">
                    <img src={post.coverImage ?? 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  </div>
                  <div className="inline-block bg-coral-100 text-coral-600 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] mb-3 font-medium">
                    {post.author?.name ?? 'HTAG'}
                  </div>
                  <h3 className="font-display font-medium text-sage-900 text-2xl leading-tight mb-3 group-hover:text-coral-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-ink/70 text-sm leading-relaxed">{post.excerpt}</p>}
                </Link>
              ))
            ) : (
              <>
                <article className="group">
                  <div className="overflow-hidden rounded-md mb-5 aspect-[4/3]">
                    <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="inline-block bg-gold-200 text-sage-900 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] mb-3 font-medium">May 2 · Convention</div>
                  <h3 className="font-display font-medium text-sage-900 text-2xl leading-tight mb-3">NYS Manufactured Tenant Convention</h3>
                  <p className="text-ink/70 text-sm leading-relaxed">The Attorney General's office is hosting a statewide convention. Anyone living in a manufactured park is welcome.</p>
                </article>
                <article className="group">
                  <div className="overflow-hidden rounded-md mb-5 aspect-[4/3]">
                    <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="inline-block bg-coral-100 text-coral-600 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] mb-3 font-medium">Story · Amber Hickey</div>
                  <h3 className="font-display font-medium text-sage-900 text-2xl leading-tight mb-3">Journey of change — what matters</h3>
                  <p className="text-ink/70 text-sm leading-relaxed">What started as one home's frustration became a movement across communities.</p>
                </article>
                <article className="group">
                  <div className="overflow-hidden rounded-md mb-5 aspect-[4/3]">
                    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="inline-block bg-sage-100 text-sage-800 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] mb-3 font-medium">Feature · MH Action</div>
                  <h3 className="font-display font-medium text-sage-900 text-2xl leading-tight mb-3">Our president's story</h3>
                  <p className="text-ink/70 text-sm leading-relaxed">MH Action profiled HTAG president Amber Hickey on the long road of organizing.</p>
                </article>
              </>
            )}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" className="py-24 md:py-32 bg-sage-700 text-cream-50 relative overflow-hidden">
        <div className="blob bg-coral-500 w-[400px] h-[400px] -top-20 -right-20 opacity-25"></div>
        <div className="blob bg-gold-500 w-[300px] h-[300px] -bottom-20 -left-10 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="text-coral-200 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Resources</div>
              <h2 className="font-display font-light text-cream-50 text-3xl md:text-5xl display-tight mb-8">
                Know your rights. <span className="italic text-gold-200">Know your tools.</span>
              </h2>
              <p className="text-cream-50/85 leading-relaxed mb-8 max-w-md">
                A growing library of guides, legal references, and templates for tenants navigating manufactured home park life.
              </p>
              <Link href="/resources" className="inline-block btn-ghost text-cream-50 px-6 py-3 text-sm font-medium tracking-wide">
                Browse resources →
              </Link>
            </div>
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { tag: 'Legal', title: 'Tenant Rights Handbook', body: 'Your protections under NY State manufactured home law.' },
                { tag: 'Templates', title: 'Letters & Complaint Forms', body: 'Pre-written forms for landlord disputes and code violations.' },
                { tag: 'Health', title: 'Health Survey', body: 'Document conditions affecting your family\'s wellbeing.' },
                { tag: 'Organizing', title: 'Community Toolkit', body: 'How to start organizing in your park.' },
              ].map(r => (
                <Link href="/resources" key={r.tag} className="group block p-6 bg-sage-800/50 hover:bg-cream-50 hover:text-sage-900 transition-all rounded-md border border-cream-50/15">
                  <div className="text-coral-400 group-hover:text-coral-600 text-[11px] uppercase tracking-[0.22em] mb-3 transition-colors">{r.tag}</div>
                  <h3 className="font-display text-xl mb-2">{r.title}</h3>
                  <p className="text-cream-50/70 group-hover:text-ink/70 text-sm transition-colors">{r.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-24 md:py-32 bg-cream-100 relative overflow-hidden">
        <div className="blob bg-sky-200 w-[400px] h-[400px] -top-20 right-0 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80" className="w-full aspect-[5/4] object-cover rounded-md shadow-xl" alt="Community" />
              <div className="absolute -top-5 -left-5 bg-gold-500 px-4 py-3 rounded-md shadow-lg">
                <div className="font-display text-sage-900 text-sm font-semibold">Community-led ✦</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Community</div>
            <h2 className="font-display font-light text-sage-900 text-3xl md:text-5xl display-tight mb-8">
              Tenants talking <span className="italic text-coral-600">to tenants.</span>
            </h2>
            <p className="text-ink/80 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              A discussion space built for our communities. Share what's happening in your park,
              compare notes with other neighborhoods, and organize together.
            </p>
            <ul className="space-y-3 mb-10 text-ink/80">
              <li className="flex gap-3 items-start"><span className="text-coral-500 text-lg leading-none mt-1">✦</span> Park-by-park discussion threads</li>
              <li className="flex gap-3 items-start"><span className="text-coral-500 text-lg leading-none mt-1">✦</span> Legal & rights Q&A with verified advocates</li>
              <li className="flex gap-3 items-start"><span className="text-coral-500 text-lg leading-none mt-1">✦</span> Organizing & event coordination</li>
            </ul>
            <Link href="/community" className="btn-primary inline-block px-7 py-3.5 text-sm font-medium tracking-wide">
              Join the community
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </>
  );
}
