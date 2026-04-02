'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewServicePage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    const { error: insertError } = await supabase
      .from('services')
      .insert({
        title: formData.title,
        description: formData.description,
        base_price: formData.base_price ? parseFloat(formData.base_price) : null,
      })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
    } else {
      router.push('/admin/services')
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900">Add Service</h1>
        <p className="text-slate-500 mt-2">Define a service offering for your prospective clients.</p>
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
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Service'}</Button>
        </div>
      </form>
    </div>
  )
}
