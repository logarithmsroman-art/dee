'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PDFReaderProps {
  item: {
    title: string
    pdf_url: string
  }
}

export function PDFReader({ item }: PDFReaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!item.pdf_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 font-serif italic text-center p-8">
        The manuscript is currently being digitized. Check back soon.
      </div>
    )
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-900' : 'h-[85vh] bg-[#F1F5F9] rounded-2xl overflow-hidden shadow-2xl border border-slate-200'}`}>
      {/* Viewer Toolbar */}
      <div className="px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        {!isFullscreen && (
          <Link href="/shelf" className="text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center">
            <ArrowLeft className="w-3 h-3 mr-2" /> Collection
          </Link>
        )}
        
        <div className="text-center flex-1 lg:flex-none">
          <h1 className={`font-serif text-slate-900 truncate px-4 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
            {item.title}
          </h1>
          {isFullscreen && <p className="text-[8px] uppercase tracking-widest text-amber-600 font-bold">Immersive Reading Mode</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Download Original PDF */}
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="text-slate-500 hover:text-slate-900 border-slate-200 hidden sm:flex"
          >
            <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" download>
              <Download className="w-4 h-4 mr-2 hidden sm:block" />
              Download
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="text-slate-500 hover:text-slate-900 border-slate-200 sm:hidden px-2"
            title="Download PDF"
          >
            <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" download>
              <Download className="w-4 h-4" />
            </a>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            className={`text-slate-500 hover:text-slate-900 hover:bg-slate-50 ${isFullscreen ? 'bg-amber-50 text-amber-600' : ''}`}
          >
            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* PDF Container - TOOLBAR SUPPRESSED */}
      <div className="flex-1 relative bg-slate-800">
        <iframe
          src={`${item.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          className="w-full h-full border-none shadow-inner"
          title={item.title}
        />
        
        {/* Mobile Optimizer Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/70 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-2xl pointer-events-none">
           Pinch to zoom for precision
        </div>
      </div>

      <style jsx>{`
        iframe {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  )
}
