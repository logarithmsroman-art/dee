import Link from 'next/link'
import Image from 'next/image'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'
import { FadeIn, ScrollReveal } from '@/components/global/FadeIn'
import { HeroSlideshow } from '@/components/global/HeroSlideshow'
import { WritersPattern } from '@/components/global/WritersPattern'
import { InkBackground } from '@/components/global/InkBackground'

interface HomeViewProps {
  latestShelfItem: any
  latestArticle: any
  services: any[]
  settings: any
}

export function HomeView({ latestShelfItem, latestArticle, services, settings }: HomeViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Cinematic Hero Slideshow */}
      <HeroSlideshow settings={settings} />

      {/* Architectural Heritage Section - Replaces the Mountain Gap */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <FadeIn direction="right">
            <div className="relative h-[600px] w-full editorial-card shadow-2xl">
              <Image 
                src={settings?.methodology_image_url || "/visionary.png"} 
                alt="Architectural Vision"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all duration-700" />
            </div>
          </FadeIn>
          
          <div className="space-y-12">
            <FadeIn direction="left" delay={0.3}>
              <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.4em] mb-4">
                {settings?.methodology_title || "Our Methodology"}
              </h2>
              <h3 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight">
                {settings?.methodology_main_title || "Designing the Architecture of Legacy."}
              </h3>
              <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed italic max-w-xl">
                {settings?.methodology_description || "We believe that every story is a monument. Our agency doesn't just write books; we construct narrative foundations that stand the test of time, blending artistic precision with structural integrity."}
              </p>
              <div className="pt-8">
                <Link href="/services" className="inline-flex items-center text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] border-b-2 border-amber-500/20 pb-2 hover:border-amber-500 transition-all">
                  Discover Our Craft
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section with Writer's Pattern */}
      <section id="services" className="relative py-40 px-6 overflow-hidden bg-[#FCFBF9]">
        <WritersPattern />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <FadeIn className="text-center mb-32">
            <h2 className="text-[10px] font-semibold text-amber-600 uppercase tracking-[0.4em] mb-6">Expertise</h2>
            <p className="text-4xl md:text-7xl font-serif text-slate-900 tracking-tight leading-tight">The Craft of the Narrative</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {['Ghostwriting', 'Content Writing', 'Brand Storytelling'].map((service, i) => (
              <FadeIn key={service} delay={i * 0.3} direction="up" className="relative group">
                <div className="editorial-card p-12 bg-white/40 backdrop-blur-md border border-slate-100 hover:border-amber-200 transition-all duration-700 min-h-[450px] flex flex-col justify-between overflow-hidden">
                  <div className="space-y-10 focus-within:ring-2">
                    <h3 className="text-4xl font-serif text-slate-900 leading-[1.1] group-hover:text-amber-700 transition-colors">
                      {service}
                    </h3>
                    <div className="w-16 h-px bg-amber-500/20 group-hover:w-full transition-all duration-1000 origin-left" />
                    <p className="text-slate-500 font-light leading-relaxed italic text-lg opacity-80">
                      {i === 0 && "Elevating your unique voice to literary perfection while maintaining absolute discretion."}
                      {i === 1 && "Precision-crafted copy and thought leadership that commands attention and resonance."}
                      {i === 2 && "Bespoke narrative strategies designed to unite your brand vision with human connection."}
                    </p>
                  </div>
                  <Link href="/services" className="inline-flex items-center text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] pt-12 group-hover:pl-4 transition-all border-t border-slate-50">
                    Consult <ArrowRight className="ml-3 w-3 h-3 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Teasers Section */}
      <section className="py-32 bg-white px-6">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-32">
            {latestShelfItem && (
              <div className="group editorial-card p-12 border border-slate-50 hover:border-slate-100 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Latest Release</h3>
                  <div className="w-16 h-px bg-slate-100" />
                </div>
                <h4 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-8 group-hover:text-amber-700 transition-colors">{latestShelfItem.title}</h4>
                <p className="text-slate-500 text-lg mb-12 line-clamp-4 font-light leading-relaxed italic">{latestShelfItem.synopsis}</p>
                <Link href={`/shelf/${latestShelfItem.slug}`} className="inline-flex items-center text-slate-900 font-medium group-hover:text-amber-600 transition-colors uppercase text-[10px] tracking-widest border-b border-slate-100 pb-1">
                  Journal Entry <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}

            {latestArticle && (
              <div className="group editorial-card p-12 border border-slate-50 hover:border-slate-100 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">The Journal</h3>
                  <div className="w-16 h-px bg-slate-100" />
                </div>
                <h4 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-8 group-hover:text-amber-700 transition-colors">{latestArticle.title}</h4>
                <p className="text-slate-500 text-lg mb-12 line-clamp-4 font-light leading-relaxed italic">{latestArticle.excerpt}</p>
                <Link href={`/blog/${latestArticle.slug}`} className="inline-flex items-center text-slate-900 font-medium group-hover:text-amber-600 transition-colors uppercase text-[10px] tracking-widest border-b border-slate-100 pb-1">
                  Read Context <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 bg-slate-900 text-center relative overflow-hidden">
        <InkBackground />
        <ScrollReveal>
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight">Your Narrative Starts Here.</h2>
            <div className="w-20 h-px bg-amber-500/40 mx-auto" />
            <p className="text-white/70 text-xl font-light italic max-w-xl mx-auto">
              Our industry-leading expertise is ready for your unique vision.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-20 py-6 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all active:scale-95 tracking-[0.2em] uppercase text-[10px]"
              style={{ borderRadius: '1px' }}
            >
              Start Consultation
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
