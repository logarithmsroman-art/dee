'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Chapter {
  title: string
  content: string
}

interface NarrativeReaderProps {
  item: {
    title: string
    cover_image_url?: string
    narrative_content: Chapter[]
  }
}

export function NarrativeReader({ item }: NarrativeReaderProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const chapters = item.narrative_content || []
  const activeChapter = chapters[activeChapterIndex]

  // Progress bar calculation
  const [readingProgress, setReadingProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeChapterIndex])

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 font-serif italic">
        The storyteller is still refining this tale. Check back soon.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 border-r border-slate-100 flex-col sticky top-0 h-screen bg-white/50 backdrop-blur-sm">
        <div className="p-8 border-b border-slate-100">
          <Link href="/shelf" className="flex items-center text-slate-400 hover:text-slate-900 transition-all text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Shelf
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-slate-900 leading-tight">{item.title}</h1>
            <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">Immersive Narrative</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapters</div>
          {chapters.map((chapter, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveChapterIndex(idx); window.scrollTo(0, 0); }}
              className={`w-full text-left px-4 py-4 rounded-lg transition-all flex items-center justify-between group ${
                activeChapterIndex === idx 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-[10px] mb-1 uppercase tracking-widest font-bold ${activeChapterIndex === idx ? 'text-amber-400' : 'text-slate-400'}`}>0{idx + 1}</span>
                <span className="font-serif text-sm truncate max-w-[180px]">{chapter.title}</span>
              </div>
              <ChevronRight className={`w-3 h-3 transition-transform ${activeChapterIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">~15 min read</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 lg:left-80 right-0 h-1 bg-slate-100 z-50">
          <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${readingProgress}%` }} />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest font-bold text-amber-600">Chapter 0{activeChapterIndex + 1}</div>
          </div>
          <Link href="/shelf" className="p-2 -mr-2 text-slate-400">
            <X className="w-5 h-5" />
          </Link>
        </div>

        {/* Story Text */}
        <div className="max-w-5xl mx-auto px-6 py-16 lg:py-32">
          {activeChapterIndex === 0 && item.cover_image_url && (
             <div className="mb-24 relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 max-w-md mx-auto">
                <Image src={item.cover_image_url} alt={item.title} fill className="object-cover" />
             </div>
          )}

          <header className="mb-20 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight">
              {activeChapter.title}
            </h2>
            <div className="w-12 h-px bg-amber-500/40 mx-auto" />
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold">Part 0{activeChapterIndex + 1} / 0{chapters.length}</p>
          </header>

          <div 
            className="editorial-reading-area prose prose-slate prose-lg md:prose-xl max-w-none prose-p:font-light prose-p:leading-[1.8] prose-p:text-slate-800 prose-p:mb-10 prose-headings:font-serif prose-headings:text-slate-900 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-amber-900 prose-blockquote:border-amber-500 prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-100"
            dangerouslySetInnerHTML={{ __html: activeChapter.content }}
          />

          <footer className="mt-32 pt-16 border-t border-slate-100 flex flex-col items-center gap-12">
            <div className="text-center space-y-4">
              <p className="text-slate-400 italic font-serif">End of Chapter</p>
              <div className="flex gap-2">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-200" />)}
              </div>
            </div>

            {activeChapterIndex < chapters.length - 1 && (
              <Button 
                onClick={() => { setActiveChapterIndex(v => v + 1); window.scrollTo(0, 0); }}
                className="group px-12 py-8 bg-slate-900 text-white rounded-full flex items-center gap-4 hover:bg-amber-600 transition-all shadow-xl shadow-slate-200"
              >
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-widest text-amber-400 font-bold">Next Up</span>
                  <span className="block font-serif text-lg">{chapters[activeChapterIndex + 1].title}</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </footer>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <nav className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="font-serif text-lg text-slate-900">Chapters</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 border border-slate-200 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chapters.map((chapter, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveChapterIndex(idx); setIsSidebarOpen(false); window.scrollTo(0, 0); }}
                  className={`w-full text-left p-4 rounded-xl flex flex-col gap-1 transition-all ${
                    activeChapterIndex === idx ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${activeChapterIndex === idx ? 'text-amber-400' : 'text-slate-400'}`}>0{idx + 1}</span>
                  <span className="font-serif text-base">{chapter.title}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Inject custom styles for reading */}
      <style jsx global>{`
        .editorial-reading-area {
          font-variant-numeric: oldstyle-nums;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
        }
      `}</style>
    </div>
  )
}
