'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { Library } from 'lucide-react'
import { FileText } from 'lucide-react'
import { Briefcase } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Settings } from 'lucide-react'
import { LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/shelf', label: 'Shelf', icon: Library },
  { href: '/admin/blogs', label: 'Blog', icon: FileText },
  { href: '/admin/members', label: 'Members', icon: Briefcase },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/inquiries', label: 'Inbox', icon: Inbox },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* ── Desktop Sidebar (md and above only) ── */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-serif text-white tracking-wide">Dee's Pen House</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-slate-800 text-white font-medium' 
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar (branding only) ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
        <h2 className="text-lg font-serif text-white tracking-wide">Dee's Pen House</h2>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Admin</span>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-colors ${
                isActive
                  ? 'text-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[9px] uppercase tracking-wider font-bold ${
                isActive ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
