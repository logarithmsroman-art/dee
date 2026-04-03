import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { InkBackground } from '@/components/global/InkBackground'

interface ServicesViewProps {
  services: any[]
}

export function ServicesView({ services }: ServicesViewProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-32 px-6 relative overflow-hidden">
        <InkBackground />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-serif text-slate-900 mb-6 tracking-tight">Expertise & Services</h1>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mb-8" />
          <p className="text-lg text-slate-500 font-light italic max-w-2xl mx-auto">
            Crafting compelling narratives that elevate your brand and bring your stories to life with intentionality.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="space-y-24">
          {services && services.length > 0 ? services.map((service, index) => (
            <div key={service.id} className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2">
                <div className="editorial-card aspect-[4/3] p-16 flex flex-col justify-center items-center text-center group">
                  <h3 className="text-4xl font-serif text-slate-900 mb-6 tracking-tight">{service.title}</h3>
                  <div className="w-10 h-0.5 bg-amber-400 mb-8" />
                  {service.rate_or_pricing && (
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] border border-slate-100 px-4 py-2">
                      {service.rate_or_pricing}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <p className="text-lg text-slate-500 font-light leading-relaxed whitespace-pre-wrap italic">
                  {service.description}
                </p>
                <Link 
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center text-slate-900 font-medium group transition-colors uppercase tracking-[0.2em] text-[10px] border-b border-transparent hover:border-amber-600 pb-1"
                >
                  Request Consultation <ArrowRight className="ml-3 w-3 h-3 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl mb-4">Service details are currently being updated.</p>
              <p className="font-light">Please contact me directly to discuss your project needs.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-slate-50 py-32 px-6 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-5xl font-serif text-slate-900 tracking-tight">Ready to bring your story to life?</h2>
          <p className="text-lg text-slate-500 font-light italic">
            Let's discuss how we can work together to create a narrative that truly resonates.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-10 py-5 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all hover:-translate-y-1 transform tracking-wider uppercase text-xs"
            style={{ borderRadius: '2px' }}
          >
            Start the Conversation
          </Link>
        </div>
      </section>
    </div>
  )
}
