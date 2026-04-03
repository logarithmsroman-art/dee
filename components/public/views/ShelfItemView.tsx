import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import { NarrativeReader } from '@/components/global/NarrativeReader'
import { PDFReader } from '@/components/global/PDFReader'

interface ShelfItemViewProps {
  item: any
}

export function ShelfItemView({ item }: ShelfItemViewProps) {
  // Handle Narrative Mode
  if (item.reader_mode === 'narrative') {
    return <NarrativeReader item={item} />
  }

  // Handle PDF Mode
  if (item.reader_mode === 'pdf') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-12">
        <PDFReader item={item} />
      </div>
    )
  }

  // Default Landing Page Mode (Classic Look)
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 min-h-screen relative overflow-hidden">
      <Link 
        href="/shelf" 
        className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors mb-16 uppercase tracking-[0.2em] text-[10px] font-semibold border-b border-transparent hover:border-slate-900 pb-1"
      >
        <ArrowLeft className="w-3 h-3 mr-3" /> Back to Library
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Cover Image */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="relative w-full aspect-[2/3] editorial-card overflow-hidden bg-slate-50 border border-slate-100">
            {item.cover_image_url ? (
              <Image 
                src={item.cover_image_url} 
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-serif italic text-xs uppercase tracking-widest text-center px-4">
                The Manuscript is currently in refinement.
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-2/3 flex flex-col justify-center text-left space-y-10">
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tight leading-[1.1]">
            {item.title}
          </h1>
          
          <div className="w-16 h-px bg-amber-500/40" />
          
          <div className="text-slate-500 font-light text-xl leading-[1.8] whitespace-pre-wrap italic">
            {item.synopsis}
          </div>

          {item.purchase_link && (
            <div className="pt-10">
              <a 
                href={item.purchase_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-12 py-6 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all hover:-translate-y-1 transform tracking-[0.2em] uppercase text-[10px] group"
                style={{ borderRadius: '2px' }}
              >
                Access Publication <ExternalLink className="ml-4 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
