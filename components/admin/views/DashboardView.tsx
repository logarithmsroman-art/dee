import { 
  Library, 
  FileText, 
  Inbox,
  ArrowRight,
  Plus,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Stats {
  shelfItems: number
  articles: number
  inquiries: number
  members: number
}

export function DashboardView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-serif text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2 font-light italic">Welcome back to Dee's Pen House administration system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Library Items</p>
            <p className="text-4xl font-serif text-slate-900">{stats.shelfItems}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
            <Library size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Journal Entries</p>
            <p className="text-4xl font-serif text-slate-900">{stats.articles}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Active Members</p>
            <p className="text-4xl font-serif text-slate-900">{stats.members}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Client Inquiries</p>
            <p className="text-4xl font-serif text-slate-900">{stats.inquiries}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
            <Inbox size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
        <h2 className="text-xl font-serif text-slate-900 mb-8 tracking-tight">Rapid Access</h2>
        <div className="flex flex-wrap gap-6">
          <Button asChild className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-[10px] h-auto shadow-lg shadow-slate-200 hover:shadow-amber-500/20 hover:bg-slate-800 transition-all">
            <Link href="/admin/blogs/new" className="flex items-center gap-3">
              <Plus size={16} /> Write New Entry
            </Link>
          </Button>
          <Button variant="secondary" asChild className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-[10px] h-auto shadow-sm hover:translate-y-[-2px] transition-all bg-slate-100 hover:bg-slate-200">
            <Link href="/admin/shelf/new" className="flex items-center gap-3">
              <Plus size={16} /> Expand Library
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-[10px] h-auto border-2 border-slate-100 hover:border-amber-200 hover:text-amber-700 transition-all">
            <Link href="/admin/members" className="flex items-center gap-3">
              Review Members <ArrowRight size={16} />
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-[10px] h-auto border-2 border-slate-100 hover:border-amber-200 hover:text-amber-700 transition-all">
            <Link href="/admin/inquiries" className="flex items-center gap-3">
              Check Inbox <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
