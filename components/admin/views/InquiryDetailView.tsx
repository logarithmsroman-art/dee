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

  // Reply State
  const [isReplying, setIsReplying] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyStatus, setReplyStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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
        if (!data.is_read) {
          await supabase.from('inquiries').update({ is_read: true }).eq('id', id)
        }
      }
      setLoading(false)
    }
    if (id) loadInquiry()
  }, [id, supabase])

  const toggleArchive = async () => {
    const { error } = await supabase.from('inquiries').update({ is_archived: !inquiry.is_archived }).eq('id', id)
    if (!error) {
       setInquiry({ ...inquiry, is_archived: !inquiry.is_archived })
       router.refresh()
    }
  }

  const deleteInquiry = async () => {
    if (!window.confirm('Delete message permanently?')) return
    await supabase.from('inquiries').delete().eq('id', id)
    router.push('/admin/inquiries')
    router.refresh()
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return
    setReplyStatus("loading")
    try {
      const res = await fetch("/api/inquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          inquiryId: id,
          toEmail: inquiry.email, 
          toName: inquiry.name,
          subject: inquiry.subject,
          message: replyMessage 
        }),
      })

      if (res.ok) {
        setReplyStatus("success")
        
        // Append to local state instantly
        const newReply = {
          message: replyMessage,
          sent_at: new Date().toISOString()
        }
        setInquiry({
          ...inquiry,
          replies: [...(inquiry.replies || []), newReply]
        })

        setReplyMessage('')
        setTimeout(() => {
          setIsReplying(false)
          setReplyStatus("idle")
        }, 3000)
      } else {
        setReplyStatus("error")
      }
    } catch {
       setReplyStatus("error")
    }
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
           <Button variant={inquiry.is_archived ? "default" : "outline"} size="sm" onClick={toggleArchive} className="rounded-full gap-2">
             <Archive size={14} className={inquiry.is_archived ? "text-white" : "text-slate-400"} /> {inquiry.is_archived ? 'Unarchive' : 'Archive'}
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
              
              <div className="flex gap-4 items-start w-full max-w-2xl pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold font-serif">{inquiry.name.charAt(0)}</div>
                <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-sm text-slate-700 font-light text-[15px] leading-[1.8] whitespace-pre-wrap italic font-serif">
                  {inquiry.message}
                </div>
              </div>

              {/* Render Admin Replies */}
              {inquiry.replies?.map((reply: any, i: number) => (
                <div key={i} className="flex gap-4 items-start w-full max-w-2xl ml-auto justify-end pt-4">
                  <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl rounded-tr-sm font-light text-[15px] leading-[1.8] whitespace-pre-wrap font-serif">
                    {reply.message}
                    <div className="text-[10px] text-slate-500 mt-3 uppercase tracking-widest font-sans font-medium">Sent on {new Date(reply.sent_at).toLocaleString()}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 relative overflow-hidden border border-slate-700">
                    <img src="/logo.png" className="w-full h-full object-cover" alt="Admin" />
                  </div>
                </div>
              ))}
           </div>

           <div className="pt-12 border-t border-slate-50">
             {!isReplying ? (
               <Button onClick={() => setIsReplying(true)} className="rounded-full px-10 py-6 font-bold gap-3">
                 <Mail size={16} /> Reply to {inquiry.name.split(' ')[0]} via Email
               </Button>
             ) : (
               <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                 <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Compose Reply from hello@deespenhouse.site</h4>
                 <textarea 
                   className="w-full min-h-[150px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 resize-y"
                   placeholder={`Write your response to ${inquiry.name}...`}
                   value={replyMessage}
                   onChange={(e) => setReplyMessage(e.target.value)}
                   disabled={replyStatus === "loading" || replyStatus === "success"}
                 ></textarea>
                 
                 <div className="flex gap-3 items-center">
                   <Button 
                     onClick={handleSendReply} 
                     disabled={replyStatus === "loading" || replyStatus === "success" || !replyMessage.trim()}
                     className="rounded-full px-8 gap-2 bg-slate-900 text-white"
                   >
                     {replyStatus === "loading" ? "Sending..." : replyStatus === "success" ? "Reply Sent" : "Send Reply Now"}
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="rounded-full text-slate-400"
                     onClick={() => setIsReplying(false)}
                     disabled={replyStatus === "loading" || replyStatus === "success"}
                   >
                     Cancel
                   </Button>
                   {replyStatus === "error" && <p className="text-xs text-red-500 font-medium ml-4">Error sending reply. Try again.</p>}
                   {replyStatus === "success" && <p className="text-xs text-amber-600 font-medium ml-4">Message sent to {inquiry.email}!</p>}
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
