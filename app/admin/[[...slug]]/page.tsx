import { ReactNode } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

// Views
import { LoginView } from '@/components/admin/views/LoginView'
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

// Wrapper for Authenticated Pages
function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar className="w-64 fixed inset-y-0 z-50 flex-shrink-0" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

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

  // Case: /admin/login (Special handling for login, no authentication required here)
  if (slug[0] === 'login') {
    return <LoginView />
  }

  // AUTH CHECK for ALL other /admin routes
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Dynamic Routing Logic (Wrapped in authenticated layout)
  let content: ReactNode;

  const primary = slug[0]
  const secondary = slug[1]
  const tertiary = slug[2]

  // Route: /admin
  if (slug.length === 0) {
    const stats = await getStats()
    content = <DashboardView stats={stats} />
  } 
  // Route: /admin/blogs
  else if (primary === 'blogs') {
    if (!secondary) content = <BlogsListView />
    else if (secondary === 'new') content = <BlogEditView />
    else if (secondary === 'edit' && tertiary) content = <BlogEditView id={tertiary} />
    else content = notFound()
  } 
  // Route: /admin/shelf
  else if (primary === 'shelf') {
    if (!secondary) content = <ShelfListView />
    else if (secondary === 'new') content = <ShelfEditView />
    else if (secondary === 'edit' && tertiary) content = <ShelfEditView id={tertiary} />
    else content = notFound()
  } 
  // Route: /admin/services
  else if (primary === 'services') {
    if (!secondary) content = <ServicesListView />
    else if (secondary === 'new') content = <ServiceEditView />
    else if (secondary === 'edit' && tertiary) content = <ServiceEditView id={tertiary} />
    else content = notFound()
  } 
  // Route: /admin/inquiries
  else if (primary === 'inquiries') {
    if (!secondary) content = <InquiriesListView />
    else if (secondary) content = <InquiryDetailView id={secondary} />
    else content = notFound()
  } 
  // Route: /admin/settings
  else if (primary === 'settings') {
    content = <SettingsView />
  } 
  else {
    content = notFound()
  }

  return <AuthenticatedLayout>{content}</AuthenticatedLayout>
}
