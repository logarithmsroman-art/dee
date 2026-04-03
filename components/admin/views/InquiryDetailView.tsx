'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Mail } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { Archive } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface InquiryDetailViewProps {
  id: string
}

export function InquiryDetailView({ id }: InquiryDetailViewProps) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [inquiry, setInquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInquiry() {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setInquiry(data)
        // Auto-mark as read
        if (data.status === 'unread') {
          await supabase.from('inquiries').update({ status: 'read' }).eq('id', id)
        }
      }
      setLoading(false)
    }
    if (id) loadInquiry()
  }, [id, supabase])

  const deleteInquiry = async () => {
    if (!window.confirm('Delete message permanently?')) return
    await supabase.from('inquiries').delete().eq('id', id)
    router.push('/admin/inquiries')
    router.refresh()
  }

  if (loading) return <div className="animate-pulse p-12 space-y-6"><div className="h-4 w-1/4 bg-slate-100 rounded"></div><div className="h-48 bg-slate-50 rounded-2xl"></div></div>
  if (!inquiry) return <div className="text-center py-20 font-serif italic text-slate-400">Message not found. It may have been archived.</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-12 flex justify-between items-center">
        <Link href="/admin/inquiries" className="flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Inbox
        </Link>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={() => router.push('/admin/inquiries')} className="rounded-full gap-2">
             <Archive size={14} className="text-slate-400" /> Archive
           </Button>
           <Button variant="ghost" size="sm" onClick={deleteInquiry} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full gap-2">
             <Trash2 size={14} /> Remove
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
        <header className="p-8 border-b border-slate-50 bg-slate-50/50">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center font-bold text-xl font-serif">
                   {inquiry.name.charAt(0)}
                 </div>
                 <div>
                    <h1 className="text-2xl font-serif text-slate-900">{inquiry.name}</h1>
                    <a href={`mailto:${inquiry.email}`} className="text-amber-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:underline">
                      {inquiry.email} <ExternalLink size={10} />
                    </a>
                 </div>
              </div>
              <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                 <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Received</p>
                    <p className="text-slate-900 font-serif">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
           </div>
        </header>

        <div className="p-10 space-y-8">
           <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600 border border-amber-200 px-3 py-1 rounded-full">{inquiry.subject || 'New Inquiry'}</span>
              <div className="text-slate-700 font-light text-xl leading-[1.8] whitespace-pre-wrap py-4 italic font-serif">
                "{inquiry.message}"
              </div>
           </div>

           <div className="pt-12 border-t border-slate-50 flex gap-4">
             <Button asChild className="rounded-full px-10 py-6 font-bold gap-3">
               <a href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Your Inquiry'}`}>
                 <Mail size={16} /> Reply to {inquiry.name.split(' ')[0]}
               </a>
             </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
