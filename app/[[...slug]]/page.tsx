import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

// Views
import { HomeView } from '@/components/public/views/HomeView'
import { BlogListView } from '@/components/public/views/BlogListView'
import { ArticleView } from '@/components/public/views/ArticleView'
import { ServicesView } from '@/components/public/views/ServicesView'
import { ShelfListView } from '@/components/public/views/ShelfListView'
import { ShelfItemView } from '@/components/public/views/ShelfItemView'
import { ContactView } from '@/components/public/views/ContactView'

export const runtime = 'edge';

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || []
  const supabase = await getSupabase()

  if (slug.length === 0) return { title: "Dee's Pen House | Architect of Narratives" }

  const primary = slug[0]
  const secondary = slug[1]

  if (primary === 'blog') {
    if (!secondary) return { title: "The Journal | Dee's Pen House" }
    const { data } = await supabase.from('articles').select('title').eq('slug', secondary).single()
    return { title: data ? `${data.title} | Dee's Pen House` : 'Journal Entry' }
  }

  if (primary === 'shelf') {
    if (!secondary) return { title: "The Library | Dee's Pen House" }
    const { data } = await supabase.from('shelf_items').select('title').eq('slug', secondary).single()
    return { title: data ? `${data.title} | Dee's Pen House` : 'Publication' }
  }

  if (primary === 'services') return { title: "Expertise | Dee's Pen House" }
  if (primary === 'contact') return { title: "Inquire | Dee's Pen House" }

  return { title: "Dee's Pen House" }
}

export default async function PublicRouterPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || []
  const supabase = await getSupabase()

  // Route: /
  if (slug.length === 0) {
    const [
      { data: latestShelfItems },
      { data: latestArticles },
      { data: services },
      { data: settings }
    ] = await Promise.all([
      supabase.from('shelf_items').select('*').eq('is_visible', true).order('created_at', { ascending: false }).limit(1),
      supabase.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(1),
      supabase.from('services').select('*').order('created_at', { ascending: true }).limit(3),
      supabase.from('global_settings').select('*').limit(1).single()
    ])

    return (
      <HomeView 
        latestShelfItem={latestShelfItems?.[0]} 
        latestArticle={latestArticles?.[0]}
        services={services || []}
        settings={settings}
      />
    )
  }

  const primary = slug[0]
  const secondary = slug[1]

  // Route: /blog
  if (primary === 'blog') {
    if (!secondary) {
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      return <BlogListView articles={articles || []} />
    }
    
    // Route: /blog/[slug]
    const { data: article } = await supabase.from('articles').select('*').eq('slug', secondary).single()
    if (!article || article.status !== 'published') notFound()
    return <ArticleView article={article} />
  }

  // Route: /shelf
  if (primary === 'shelf') {
    if (!secondary) {
      const { data: shelfItems } = await supabase
        .from('shelf_items')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
      return <ShelfListView shelfItems={shelfItems || []} />
    }

    // Route: /shelf/[slug]
    const { data: item } = await supabase.from('shelf_items').select('*').eq('slug', secondary).single()
    if (!item || !item.is_visible) notFound()
    return <ShelfItemView item={item} />
  }

  // Route: /services
  if (primary === 'services') {
    const { data: services } = await supabase.from('services').select('*').order('created_at', { ascending: true })
    return <ServicesView services={services || []} />
  }

  // Route: /contact
  if (primary === 'contact') {
    const { data: settings } = await supabase.from('global_settings').select('contact_email, linkedin_url, twitter_url').single()
    return <ContactView settings={settings} />
  }

  return notFound()
}
