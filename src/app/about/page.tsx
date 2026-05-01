import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export const metadata = { title: 'About · HTAG' };

export default function AboutPage() {
  return (
    <>
      <Nav />
      <section className="pt-32 pb-24 md:pb-32 max-w-4xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">About HTAG</div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight mb-8">
          Neighbors fighting for <span className="italic text-coral-600">neighbors.</span>
        </h1>
        <div className="prose prose-lg max-w-none text-ink/85 leading-relaxed space-y-6">
          <p>
            Hoffman Tenants Advocacy Group represents over sixteen manufactured home communities
            owned by Hoffman Homes across New York State. Our Executive Board members are
            tenants themselves — neighbors working to change things not only in our own parks,
            but in every manufactured home community in the state.
          </p>
          <p>
            Our goal is to give every tenant peace of mind, and a safe place to live without
            fear of losing their home. We educate our communities, support tenants facing
            unsafe conditions, and organize for the policy changes that everyone living in
            a manufactured home park needs.
          </p>
          <h2 className="font-display text-3xl text-sage-900 mt-12">What we do</h2>
          <ul className="space-y-2">
            <li>Advocate for tenant rights at the state and local level.</li>
            <li>Connect tenants with legal resources and templates.</li>
            <li>Document health and safety issues across our communities.</li>
            <li>Organize statewide and within individual parks.</li>
            <li>Provide a safe community space for tenants to share, learn, and act.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
