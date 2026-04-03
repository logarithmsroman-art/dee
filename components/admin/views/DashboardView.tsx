import { 
  Library, 
  FileText, 
  Inbox,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Stats {
  shelfItems: number
  articles: number
  inquiries: number
}

export function DashboardView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back to Dee's Pen House administration system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Books & Projects</p>
            <p className="text-3xl font-bold text-slate-900">{stats.shelfItems}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
            <Library size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Published Articles</p>
            <p className="text-3xl font-bold text-slate-900">{stats.articles}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Inquiries</p>
            <p className="text-3xl font-bold text-slate-900">{stats.inquiries}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
            <Inbox size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/admin/blogs/new" className="flex items-center gap-2">
              <Plus size={16} /> Write New Article
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/shelf/new" className="flex items-center gap-2">
              <Plus size={16} /> Add New Book
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/inquiries" className="flex items-center gap-2">
              View Inbox <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
