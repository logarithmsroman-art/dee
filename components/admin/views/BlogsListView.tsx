'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Edit } from 'lucide-react'
import { Trash } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export function BlogsListView() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadBlogs() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setBlogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This is permanent.')) return

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      loadBlogs()
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">Blog Engine</h1>
          <p className="text-slate-500 mt-2">Write and manage your storytelling articles.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new" className="flex items-center gap-2">
            <Plus size={16} /> New Article
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No articles found. Start writing!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog: any) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium text-slate-900">{blog.title}</TableCell>
                  <TableCell>
                    {blog.is_published ? (
                      <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-200">Published</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 border-0 hover:bg-amber-200">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href={`/admin/blogs/edit/${blog.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
