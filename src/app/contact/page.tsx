import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export const metadata = { title: 'Contact · HTAG' };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <section className="pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-10">
        <div className="text-coral-600 text-xs uppercase tracking-[0.3em] mb-6 rule-mark">Get in Touch</div>
        <h1 className="font-display font-light text-sage-900 text-4xl md:text-6xl display-tight mb-12">
          We'd love to hear from you.
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl text-sage-900 mb-4">Contact info</h2>
            <ul className="space-y-3 text-ink/80">
              <li><strong>Phone:</strong> 518-300-1294</li>
              <li><strong>Email:</strong> <a href="mailto:Htag.Tenants@hoffmantag.org" className="text-coral-600 hover:underline">Htag.Tenants@hoffmantag.org</a></li>
              <li><strong>Address:</strong><br/>299 Hyspot Road<br/>Greenfield Center, NY 12833</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-sage-900 mb-4">Send a message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
              <input type="email" placeholder="Your email" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500" />
              <textarea rows={5} placeholder="How can we help?" className="w-full px-4 py-3 bg-cream-100 border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500"></textarea>
              <button type="submit" className="btn-coral px-6 py-3 text-sm font-medium">Send message</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
