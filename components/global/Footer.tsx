import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-auto bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="font-serif text-3xl text-slate-900 tracking-tight block">
              Dee's Pen House
            </Link>
            <p className="text-slate-500 font-light italic max-w-sm leading-relaxed">
              Premium storytelling and creative agency. We curate bespoke narratives that bridge the gap between vision and legacy.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <div className="flex flex-col gap-4">
              <Link href="/shelf" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">The Library</Link>
              <Link href="/blog" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">Journal</Link>
              <Link href="/services" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">Expertise</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">Digital Social</h4>
            <div className="flex flex-col gap-4">
              <Link href="/contact" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">Inquiries</Link>
              <a href="#" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">Instagram</a>
              <a href="#" className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em] hover:text-slate-900 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-20 pt-12 flex text-[10px] uppercase tracking-widest text-slate-400 justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Dee's Pen House. Built for legacy.</p>
          <Link href="/admin" className="hover:text-slate-900 transition-colors">Internal Portal</Link>
        </div>
      </div>
    </footer>
  );
}
