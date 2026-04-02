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
import { Plus, Edit, Trash, BookOpen, Loader2 } from 'lucide-react'

export default function ShelfManagerPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [shelfItems, setShelfItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadShelfItems() {
    const { data, error } = await supabase
      .from('shelf_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setShelfItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadShelfItems()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this from your shelf? This cannot be undone.')) return

    const { error } = await supabase
      .from('shelf_items')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      loadShelfItems()
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">Dee's Pen Shelf</h1>
          <p className="text-slate-500 mt-2">Manage your books, projects, and portfolio items.</p>
        </div>
        <Button asChild>
          <Link href="/admin/shelf/new" className="flex items-center gap-2">
            <Plus size={16} /> Add to Shelf
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shelfItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Your shelf is empty. Add a book or project!
                </TableCell>
              </TableRow>
            ) : (
              shelfItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.cover_image_url ? (
                      <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
                        <img src={item.cover_image_url} alt={item.title} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{item.title}</TableCell>
                  <TableCell>
                    {item.is_visible ? (
                      <Badge className="bg-green-100 text-green-700 border-0">Visible</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-600 border-0">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href={`/admin/shelf/edit/${item.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                       <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(item.id)}
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
