'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
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
import { Loader2 } from 'lucide-react'
import { Mail } from 'lucide-react'
import { MailOpen } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export function InquiriesListView() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadInquiries() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setInquiries(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  const updateStatus = async (id: string, is_read: boolean) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ is_read })
      .eq('id', id)

    if (error) alert(error.message)
    else loadInquiries()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this inquiry?')) return
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)

    if (error) alert(error.message)
    else loadInquiries()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">Inquiry Inbox</h1>
          <p className="text-slate-500 mt-2">Manage incoming messages from clients and readers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-serif italic uppercase tracking-widest text-[10px]">
                  No messages found. The storyteller is quiet for now.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry: any) => (
                <TableRow key={inquiry.id} className={inquiry.status === 'unread' ? 'bg-amber-50/10' : ''}>
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{inquiry.name}</TableCell>
                  <TableCell className="text-slate-500">{inquiry.email}</TableCell>
                  <TableCell>
                    {inquiry.is_read ? (
                       <Badge variant="outline" className="text-slate-500 border-slate-200 font-bold uppercase text-[8px]">Replied</Badge>
                    ) : (
                      <Badge className="bg-amber-500 text-white border-0 hover:bg-amber-600 font-bold">New</Badge>
                    )}
                    {inquiry.is_archived && (
                      <Badge variant="outline" className="text-slate-400 border-slate-200 font-bold uppercase text-[8px] ml-2">Archived</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="sm" asChild className="text-blue-500 hover:bg-blue-50">
                        <Link href={`/admin/inquiries/${inquiry.id}`}>
                           <Eye size={16} />
                        </Link>
                      </Button>
                      
                      {!inquiry.is_read ? (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(inquiry.id, true)} className="text-slate-400 hover:text-slate-900">
                           <Mail size={16} />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(inquiry.id, false)} className="text-amber-500">
                           <MailOpen size={16} />
                        </Button>
                      )}

                      <Button variant="ghost" size="sm" onClick={() => handleDelete(inquiry.id)} className="text-red-300 hover:text-red-600">
                        <Trash2 size={16} />
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
