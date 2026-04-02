import Link from 'next/link'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'

interface ArticleViewProps {
  article: any
}

export function ArticleView({ article }: ArticleViewProps) {
  return (
    <article className="min-h-screen bg-white">
      {/* Editorial Header */}
      <header className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center border-b border-slate-100">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors mb-10 uppercase tracking-widest text-xs font-semibold"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Journal
        </Link>
        <time className="block text-amber-600 font-medium tracking-widest uppercase mb-6 text-sm">
          {article.published_at ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.published_at)) : 'Published'}
        </time>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 leading-tight md:leading-tight lg:leading-tight mb-8">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed italic">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Feature Image - DYNAMIC FRAME (No more cropping) */}
      {article.feature_image_url && (
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-50 flex justify-center items-center">
            <img 
              src={article.feature_image_url} 
              alt={article.title}
              className="w-full h-auto max-h-[85vh] object-contain transition-all"
            />
          </div>
        </div>
      )}

      {/* Reading Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
        <div 
          className="prose prose-slate prose-lg md:prose-xl prose-p:font-light prose-p:leading-relaxed prose-headings:font-serif prose-a:text-amber-600 hover:prose-a:text-amber-700 max-w-none text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <div className="mt-24 pt-12 border-t border-slate-100 flex justify-center">
          <div className="w-4 h-4 rounded-full bg-slate-200" />
        </div>
      </div>
    </article>
  )
}
