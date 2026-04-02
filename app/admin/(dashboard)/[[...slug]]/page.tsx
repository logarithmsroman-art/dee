import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

// Views
import { DashboardView } from '@/components/admin/views/DashboardView'
import { BlogsListView } from '@/components/admin/views/BlogsListView'
import { BlogEditView } from '@/components/admin/views/BlogEditView'
import { ShelfListView } from '@/components/admin/views/ShelfListView'
import { ShelfEditView } from '@/components/admin/views/ShelfEditView'
import { ServicesListView } from '@/components/admin/views/ServicesListView'
import { ServiceEditView } from '@/components/admin/views/ServiceEditView'
import { InquiriesListView } from '@/components/admin/views/InquiriesListView'
import { InquiryDetailView } from '@/components/admin/views/InquiryDetailView'
import { SettingsView } from '@/components/admin/views/SettingsView'

export const runtime = 'edge';

async function getStats() {
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

  const [
    { count: shelfCount },
    { count: articleCount },
    { count: inquiryCount }
  ] = await Promise.all([
    supabase.from('shelf_items').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
  ])

  return {
    shelfItems: shelfCount || 0,
    articles: articleCount || 0,
    inquiries: inquiryCount || 0,
  }
}

export default async function AdminRouterPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || []

  // Route: /admin
  if (slug.length === 0) {
    const stats = await getStats()
    return <DashboardView stats={stats} />
  }

  const primary = slug[0]
  const secondary = slug[1]
  const tertiary = slug[2]

  // Route: /admin/blogs
  if (primary === 'blogs') {
    if (!secondary) return <BlogsListView />
    if (secondary === 'new') return <BlogEditView />
    if (secondary === 'edit' && tertiary) return <BlogEditView id={tertiary} />
  }

  // Route: /admin/shelf
  if (primary === 'shelf') {
    if (!secondary) return <ShelfListView />
    if (secondary === 'new') return <ShelfEditView />
    if (secondary === 'edit' && tertiary) return <ShelfEditView id={tertiary} />
  }

  // Route: /admin/services
  if (primary === 'services') {
    if (!secondary) return <ServicesListView />
    if (secondary === 'new') return <ServiceEditView />
    if (secondary === 'edit' && tertiary) return <ServiceEditView id={tertiary} />
  }

  // Route: /admin/inquiries
  if (primary === 'inquiries') {
    if (!secondary) return <InquiriesListView />
    if (secondary) return <InquiryDetailView id={secondary} />
  }

  // Route: /admin/settings
  if (primary === 'settings') {
    return <SettingsView />
  }

  return notFound()
}
