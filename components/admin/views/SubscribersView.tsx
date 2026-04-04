'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Trash2, Mail, Loader2 } from "lucide-react"

export function SubscribersView() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    
    if (data) setSubscribers(data)
    setLoading(false)
  }

  const handleRemove = async (email: string) => {
    const confirm = window.confirm(`Remove ${email} from the distribution list?`)
    if (!confirm) return

    setLoading(true)
    await supabase.from('subscribers').delete().eq('email', email)
    await fetchSubscribers()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Distribution List</h1>
        <p className="text-slate-500 mt-2">Manage the email addresses of your audience.</p>
      </div>

      <div className="rounded-xl border-slate-200 shadow-sm border overflow-hidden bg-white">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <h3 className="text-[11px] uppercase tracking-widest text-slate-500 font-bold m-0">
              Active Subscribers ({subscribers.length})
            </h3>
          </div>
        </div>
        <div className="p-0">
          <div className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center py-4 px-6 hover:bg-slate-50 transition-colors group">
                <div>
                  <p className="font-medium text-slate-900">{sub.email}</p>
                  <p className="text-xs text-slate-400 font-medium">Joined {new Date(sub.subscribed_at).toLocaleDateString()}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => handleRemove(sub.email)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
            {subscribers.length === 0 && (
              <div className="py-8 text-center text-slate-500 italic font-light">
                No subscribers found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
