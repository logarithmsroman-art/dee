'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, X, Download, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/AuthModal'
import { useMember } from '@/hooks/useMember'

interface PDFReaderProps {
  item: {
    title: string
    pdf_url: string
  }
}

export function PDFReader({ item }: PDFReaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, loading, isAuthenticated } = useMember()

  if (!item.pdf_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 font-serif italic text-center p-8">
        The manuscript is currently being digitized. Check back soon.
      </div>
    )
  }

  const toggleFullscreen = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-900' : 'h-[85vh] bg-[#F1F5F9] rounded-2xl overflow-hidden shadow-2xl border border-slate-200'}`}>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      
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
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <Button 
              size="sm" 
              onClick={() => setAuthModalOpen(true)}
              className="bg-slate-900 text-white rounded-full px-6 font-bold text-[10px] uppercase tracking-widest"
            >
              Sign In to View
            </Button>
          )}
        </div>
      </div>

      {/* PDF Container - GATE CONTROLLED */}
      <div className="flex-1 relative bg-slate-800">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/20" />
          </div>
        ) : isAuthenticated ? (
          <>
            {/* Desktop Native Viewer */}
            <iframe
              src={`${item.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="hidden md:block w-full h-full border-none shadow-inner"
              title={`${item.title} - Desktop Viewer`}
            />
            
            {/* Mobile Google Docs Fallback */}
            <iframe
              src={`https://docs.google.com/gview?url=${item.pdf_url}&embedded=true`}
              className="md:hidden w-full h-full border-none shadow-inner bg-slate-100"
              title={`${item.title} - Mobile Viewer`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md p-10 text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-6">Subscription Required</h2>
            <p className="text-white/60 mb-10 max-w-sm font-light leading-relaxed italic">
              This manuscript is part of Dee's private collection. Please join the library to access the full text.
            </p>
            <Button 
              size="lg" 
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-slate-900 hover:bg-slate-50 px-12 py-8 rounded-full font-bold text-xs uppercase tracking-[0.2em]"
            >
              Join the Library
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        iframe {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  )
}
