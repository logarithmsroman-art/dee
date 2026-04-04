import Image from 'next/image'

interface AboutViewProps {
  settings: any
}

export function AboutView({ settings }: AboutViewProps) {
  const imageUrl = settings.about_owner_image || '/about_author.jpg'
  const textContent = settings.about_owner_text || `As a master storyteller and architect of legacy, I believe that every individual holds a reservoir of narratives waiting to be immortalized.

Dee's Pen House was built on the philosophy that a beautifully structured sentence can bridge the gap between fleeting vision and eternal impact. Whether ghostwriting private memoirs or curating an organization's brand identity, my methodology relies on profound empathy, rigorous research, and elegant prose.

When I step away from the ink and parchment, I am continually studying the arts, architecture, and the beautiful idiosyncrasies of human connection. I welcome you to explore the Library and the Journal, and I look forward to uncovering the legacy you are building.`

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <div className="relative aspect-[3/4] md:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="absolute inset-0 border-[8px] border-white z-10" />
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-color-burn z-20 pointer-events-none" />
            <Image 
              src={imageUrl}
              alt="About the Author"
              fill
              className="object-cover"
              sizes="(max-w-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-150 fill-mode-both">
            <div>
              <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">About Me</h4>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                Architect of<br/>
                <span className="italic text-slate-500">Narratives.</span>
              </h1>
            </div>

            <div className="space-y-6 text-slate-600 font-light leading-relaxed font-serif text-lg">
              {textContent.split('\n').map((paragraph: string, i: number) => {
                if (!paragraph.trim()) return null
                return <p key={i}>{paragraph}</p>
              })}
            </div>

            <div className="pt-8 border-t border-slate-200">
              <a href="mailto:hello@deespenhouse.site" className="text-[10px] uppercase tracking-widest font-bold text-slate-900 border border-slate-900 px-8 py-4 hover:bg-slate-900 hover:text-white transition-all inline-block hover:shadow-xl">
                Start a Conversation
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
