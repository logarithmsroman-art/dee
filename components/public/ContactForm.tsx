'use client'

import { useState } from 'react'
import { submitInquiry } from '@/lib/actions/public'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2'
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle'
import { useSearchParams } from 'next/navigation'

export function ContactForm() {
  const searchParams = useSearchParams()
  const defaultService = searchParams.get('service') || ''

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('submitting')
    setErrorMessage('')

    const result = await submitInquiry(formData)

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong. Please try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div className="editorial-card p-16 text-center max-w-xl mx-auto space-y-8">
        <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto mb-6" strokeWidth={1} />
        <h3 className="text-4xl font-serif text-slate-900 tracking-tight italic">Message Received</h3>
        <p className="text-slate-500 font-light text-lg italic">
          Your narrative inquiry has been securely sent. I will review it personally and respond within 48 hours.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="uppercase tracking-[0.2em] text-[10px] font-semibold border-b border-slate-900 pb-1"
        >
          Send Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <div className="editorial-card p-10 md:p-16 w-full relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-100" />
      
      <form action={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label htmlFor="name" className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] block">Full Identity</label>
            <Input 
              id="name" 
              name="name" 
              required 
              placeholder="Your name"
              className="px-0 py-6 border-0 border-b border-slate-100 bg-transparent focus-visible:ring-0 focus-visible:border-amber-500 transition-all rounded-none placeholder:text-slate-200"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="email" className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] block">Electronic Mail</label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="email@example.com"
              className="px-0 py-6 border-0 border-b border-slate-100 bg-transparent focus-visible:ring-0 focus-visible:border-amber-500 transition-all rounded-none placeholder:text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label htmlFor="subject" className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] block">Nature of Inquiry</label>
          <Input 
            id="subject" 
            name="subject" 
            defaultValue={defaultService}
            placeholder="Ghostwriting, Strategy, etc."
            className="px-0 py-6 border-0 border-b border-slate-100 bg-transparent focus-visible:ring-0 focus-visible:border-amber-500 transition-all rounded-none placeholder:text-slate-200"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="message" className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] block">The Narrative</label>
          <Textarea 
            id="message" 
            name="message" 
            required
            placeholder="Describe your vision, goals, and desired outcome..."
            className="px-0 py-6 border-0 border-b border-slate-100 bg-transparent min-h-[150px] resize-none focus-visible:ring-0 focus-visible:border-amber-500 transition-all rounded-none leading-relaxed placeholder:text-slate-200"
          />
        </div>

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 p-6 rounded-none flex items-start gap-3 border-l-2 border-red-500">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-slate-900 text-white py-6 rounded-none hover:bg-slate-800 transition-colors uppercase tracking-[0.2em] text-[10px] font-semibold"
        >
          {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Inquiry'}
        </Button>
      </form>
    </div>
  )
}
