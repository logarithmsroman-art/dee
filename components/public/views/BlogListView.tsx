'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { InkBackground } from '@/components/global/InkBackground'
import { Search, Filter, Clock, Tag, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface BlogListViewProps {
  articles: any[]
}

export function BlogListView({ articles }: BlogListViewProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  // Derive unique categories from articles
  const categories = useMemo(() => {
    const cats = new Set(['All'])
    articles.forEach(a => {
      if (a.category) cats.add(a.category)
    })
    return Array.from(cats)
  }, [articles])

  // Filter and Sort articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                             (article.excerpt || '').toLowerCase().includes(search.toLowerCase())
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.view_count || 0) - (a.view_count || 0)
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
      })
  }, [articles, search, activeCategory, sortBy])

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="bg-slate-50/50 border-b border-slate-100 py-40 px-6 relative overflow-hidden">
        <InkBackground />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-7xl font-serif text-slate-900 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Journal
          </h1>
          <div className="w-24 h-px bg-amber-500/30 mx-auto" />
          <p className="text-xl text-slate-500 font-light italic max-w-2xl mx-auto pt-4 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Reflections on the craft of storytelling, brand narrative, and the power of the written word.
          </p>
        </div>
      </div>

      {/* Discovery Bar */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search the library archives..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-amber-500/10 transition-all font-light italic text-lg"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-amber-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 border-l border-slate-100 pl-8">
             <button 
                onClick={() => setSortBy(sortBy === 'recent' ? 'popular' : 'recent')}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors"
             >
               <Filter size={14} />
               {sortBy === 'recent' ? 'Latest Releases' : 'Most Popular'}
             </button>
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <div className="max-w-5xl mx-auto px-6 py-32">
        {filteredArticles.length > 0 ? (
          <div className="space-y-24">
            {filteredArticles.map((article) => (
              <article key={article.id} className="group animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Link href={`/blog/${article.slug}`} className="flex flex-col lg:flex-row gap-16 items-start">
                  {article.feature_image_url && (
                    <div className="relative w-full lg:w-[45%] aspect-[3/2] overflow-hidden rounded-[2px] border border-slate-100 shrink-0 shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200 group-hover:border-amber-100 transition-all duration-1000">
                      <Image 
                        src={article.feature_image_url} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 font-bold uppercase tracking-[0.2em] text-[8px] px-4 py-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                          {article.category || 'General'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className={`flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-1000 ${!article.feature_image_url ? 'w-full max-w-2xl mx-auto text-center' : 'w-full lg:w-[55%]'}`}>
                    <div className={`flex items-center gap-4 mb-6 ${!article.feature_image_url ? 'justify-center' : ''}`}>
                      <time className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                        {article.published_at ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.published_at)) : 'Latest Edition'}
                      </time>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        <Clock size={12} className="text-amber-500/50" />
                        ~{article.reading_time_minutes || 5} Min Read
                      </div>
                    </div>

                    <h2 className="text-5xl font-serif text-slate-900 mb-8 group-hover:text-amber-700 transition-colors leading-[1.1] tracking-tight">
                      {article.title}
                    </h2>
                    
                    <p className="text-slate-500 font-light text-xl leading-relaxed line-clamp-3 mb-10 italic">
                      {article.excerpt || article.content.substring(0, 150).replace(/(<([^>]+)>)/gi, "") + '...'}
                    </p>

                    <div className={`flex items-center ${!article.feature_image_url ? 'justify-center' : ''}`}>
                      <span className="inline-flex items-center text-slate-900 font-bold uppercase tracking-[0.3em] text-[9px] border-b-2 border-slate-100 group-hover:border-amber-500 transition-all pb-2 gap-4">
                        Read Full Entry 
                        <div className="w-12 h-px bg-slate-200 group-hover:bg-amber-500 group-hover:w-16 transition-all duration-500" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 rounded-3xl border border-dashed border-slate-200 animate-in fade-in duration-1000">
             <Search className="w-12 h-12 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-serif text-slate-900 mb-2 italic">Descriptive silence.</h3>
             <p className="text-slate-400 font-light italic">No entries resonate with your current search criteria.</p>
             <button 
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="mt-8 text-[10px] font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors"
                >
                Reset Archives
             </button>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="py-24 flex justify-center opacity-20">
        <div className="w-px h-24 bg-gradient-to-b from-slate-900 to-transparent" />
      </div>
    </div>
  )
}
