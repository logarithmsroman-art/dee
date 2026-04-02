import Link from 'next/link'
import Image from 'next/image'

interface ShelfListViewProps {
  shelfItems: any[]
}

export function ShelfListView({ shelfItems }: ShelfListViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-6xl font-serif text-slate-900 drop-shadow-sm tracking-tight mb-2">
          The Library
        </h1>
        <div className="w-16 h-0.5 bg-amber-500/40 mx-auto" />
        <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto italic pt-4">
          A curated collection of published books, creative works, and professional narratives.
        </p>
      </div>

      {shelfItems && shelfItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {shelfItems.map((item) => (
            <Link 
              key={item.id} 
              href={`/shelf/${item.slug}`}
              className="group editorial-card flex flex-col items-center text-center p-10 hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[2/3] mb-8 overflow-hidden bg-slate-50 border border-slate-100" style={{ borderRadius: '1px' }}>
                {item.cover_image_url ? (
                  <Image 
                    src={item.cover_image_url} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-serif italic text-xs uppercase tracking-widest">
                    Pending Cover
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-4 line-clamp-1 group-hover:text-amber-700 transition-colors">{item.title}</h3>
              <p className="text-slate-500 line-clamp-3 mb-8 text-sm font-light leading-relaxed">{item.synopsis}</p>
              <span className="inline-flex items-center text-slate-900 font-medium uppercase tracking-[0.2em] text-[10px] border-b border-transparent group-hover:border-amber-600 transition-all pb-1">
                Explore Story
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl mb-4">The shelf is currently empty.</p>
          <p className="font-light">Please check back soon for new additions.</p>
        </div>
      )}
    </div>
  )
}
