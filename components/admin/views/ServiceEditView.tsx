'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'
import Link from 'next/link'

interface ServiceEditViewProps {
  id?: string
}

export function ServiceEditView({ id }: ServiceEditViewProps) {
  const router = useRouter()
  const isNew = !id

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '',
  })

  useEffect(() => {
    async function fetchData() {
      if (isNew) return
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          base_price: data.base_price ? data.base_price.toString() : '',
        })
        setLoading(false)
      }
    }
    fetchData()
  }, [id, isNew, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    const payload = {
      title: formData.title,
      description: formData.description,
      base_price: formData.base_price ? parseFloat(formData.base_price) : null,
    }

    let saveError
    if (isNew) {
      const { error } = await supabase.from('services').insert(payload)
      saveError = error
    } else {
      const { error } = await supabase.from('services').update(payload).eq('id', id)
      saveError = error
    }

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
    } else {
      router.push('/admin/services')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-slate-500 mt-4 font-serif italic uppercase tracking-widest text-[10px]">Retrieving Service Details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/services" className="flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest mb-4">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Services
        </Link>
        <h1 className="text-3xl font-serif text-slate-900">{isNew ? 'Define Service' : 'Revise Service'}</h1>
        {!isNew && <p className="text-slate-500 mt-2">Updating: <span className="text-slate-900 font-bold">{formData.title}</span></p>}
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-md border bg-red-50 text-red-600 border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Service Title *</Label>
          <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Ghostwriting" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description</Label>
          <Textarea id="description" rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="base_price">Base Price Point ($)</Label>
          <Input id="base_price" type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({...formData, base_price: e.target.value})} placeholder="e.g. 500" />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (isNew ? 'Create Service' : 'Update Service')}</Button>
        </div>
      </form>
    </div>
  )
}
