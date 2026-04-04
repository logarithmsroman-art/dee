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
import { MembersView } from '@/components/admin/views/MembersView'
import { SettingsView } from '@/components/admin/views/SettingsView'
import { SubscribersView } from '@/components/admin/views/SubscribersView'

// Wrapper for Authenticated Pages
function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 pt-14 pb-20 px-4 md:pt-8 md:pb-8 md:px-8 w-full">
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

  try {
    const [
      { count: shelfCount },
      { count: articleCount },
      { count: inquiryCount },
      { count: profilesCount }
    ] = await Promise.all([
      supabase.from('shelf_items').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    return {
      shelfItems: shelfCount || 0,
      articles: articleCount || 0,
      inquiries: inquiryCount || 0,
      members: profilesCount || 0,
    }
  } catch {
    return {
      shelfItems: 0,
      articles: 0,
      inquiries: 0,
      members: 0,
    }
  }
}

export default async function AdminRouterPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || []

  // HIGH PRIORITY: Always allow access to /admin/login 
  // regardless of auth state (allows switching from regular user to admin)
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

  let user = null;
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  } catch (err) {
    console.error('Auth check fetch failure:', err)
    // We let it fall through to user check
  }

  // Handle Redirection OUTSIDE of try/catch
  if (!user && slug[0] !== 'login') {
    redirect('/admin/login')
  }

  // SECONDARY CHECK: Profile check (minimal fetch)
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      // Admin guard could go here
    } catch (e) {
      // Profile hitch – usually non-fatal for navigation
    }
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
  // Route: /admin/members
  else if (primary === 'members') {
    content = <MembersView />
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
  // Route: /admin/subscribers
  else if (primary === 'subscribers') {
    content = <SubscribersView />
  }
  else {
    content = notFound()
  }

  return <AuthenticatedLayout>{content}</AuthenticatedLayout>
}
