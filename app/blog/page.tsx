import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { format as dateFnsFormat } from 'date-fns'
import { InkBackground } from '@/components/global/InkBackground'

export const metadata = {
  title: "Blog & Articles | Dee's Pen House",
  description: "Read the latest thoughts, articles, and stories from Dee's Pen House.",
}

export default async function BlogPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50/50 border-b border-slate-100 py-32 px-6 relative overflow-hidden">
        <InkBackground />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <h1 className="text-6xl font-serif text-slate-900 tracking-tight">
            The Journal
          </h1>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto" />
          <p className="text-lg text-slate-500 font-light italic max-w-2xl mx-auto pt-4">
            Reflections on the craft of storytelling and the power of the written word.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24">
        {articles && articles.length > 0 ? (
          <div className="space-y-16">
            {articles.map((article) => (
              <article key={article.id} className="group border-b border-slate-100 pb-16 last:border-0 last:pb-0">
                <Link href={`/blog/${article.slug}`} className="flex flex-col md:flex-row gap-10 items-start">
                  {article.feature_image_url && (
                    <div className="relative w-full md:w-1/3 aspect-[4/3] overflow-hidden border border-slate-100 shrink-0 group-hover:border-amber-200 transition-all duration-700" style={{ borderRadius: '1px' }}>
                      <Image 
                        src={article.feature_image_url} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={`flex flex-col justify-center ${!article.feature_image_url ? 'w-full' : 'w-full md:w-2/3'}`}>
                    <time className="text-sm font-medium text-amber-600 uppercase tracking-widest mb-3 block">
                      {article.published_at ? dateFnsFormat(new Date(article.published_at), 'MMMM d, yyyy') : 'Published'}
                    </time>
                    <h2 className="text-4xl font-serif text-slate-900 mb-6 group-hover:text-amber-700 transition-colors leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-slate-500 font-light text-lg leading-relaxed line-clamp-3 mb-8 italic">
                      {article.excerpt || article.content.substring(0, 150).replace(/(<([^>]+)>)/gi, "") + '...'}
                    </p>
                    <span className="inline-flex items-center text-slate-900 font-medium uppercase tracking-[0.2em] text-[10px] border-b border-transparent group-hover:border-amber-600 transition-all pb-1">
                      Read Entry <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl mb-4 text-slate-400 font-serif italic uppercase tracking-widest text-xs">The ink has yet to dry on our first entries.</p>
          </div>
        )}
      </div>
    </div>
  )
}
