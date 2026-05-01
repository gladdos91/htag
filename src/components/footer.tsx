import Link from 'next/link';

export function Footer() {
  return (
    <footer id="contact" className="bg-sage-900 text-cream-50/85 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-coral-500 flex items-center justify-center">
                <span className="font-display font-semibold text-cream-50 text-xl">H</span>
              </div>
              <div className="leading-tight">
                <div className="font-display font-semibold text-cream-50">Hoffman Tenants</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-cream-50/65">Advocacy Group</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-cream-50/75">
              Representing over sixteen manufactured home communities across New York State.
              Fighting for the dignity, safety, and rights of every tenant.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.22em] text-coral-200 mb-5">Contact</div>
            <ul className="space-y-3 text-sm">
              <li>518-300-1294</li>
              <li><a href="mailto:Htag.Tenants@hoffmantag.org" className="hover:text-coral-200 transition-colors">Htag.Tenants@hoffmantag.org</a></li>
              <li className="text-cream-50/65 leading-relaxed">299 Hyspot Road<br/>Greenfield Center, NY 12833</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.22em] text-coral-200 mb-5">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-coral-200 transition-colors">About</Link></li>
              <li><Link href="/news" className="hover:text-coral-200 transition-colors">News</Link></li>
              <li><Link href="/resources" className="hover:text-coral-200 transition-colors">Resources</Link></li>
              <li><Link href="/community" className="hover:text-coral-200 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.22em] text-coral-200 mb-5">Follow</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.facebook.com/groups/1044965670467186" className="hover:text-coral-200 transition-colors">Facebook</a></li>
              <li><a href="https://hoffmantaghealthsurvey.org/" className="hover:text-coral-200 transition-colors">Health Survey</a></li>
              <li><Link href="/donate" className="hover:text-coral-200 transition-colors">Donate</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-cream-50/15 flex flex-wrap justify-between gap-4 text-xs text-cream-50/55">
          <div>© {new Date().getFullYear()} Hoffman Tenants Advocacy Group, Inc.</div>
          <div>A registered tenant advocacy nonprofit.</div>
        </div>
      </div>
    </footer>
  );
}
