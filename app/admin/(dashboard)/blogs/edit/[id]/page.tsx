'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    feature_image_url: '',
    content: '',
    is_published: false,
  })

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          feature_image_url: data.feature_image_url || '',
          content: data.content || '',
          is_published: data.is_published,
        })
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id, supabase])

  const handleSave = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    const isActuallyPublished = publish !== undefined ? publish : formData.is_published

    const { error: updateError } = await supabase
      .from('articles')
      .update({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        feature_image_url: formData.feature_image_url,
        content: formData.content,
        is_published: isActuallyPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
    } else {
      router.push('/admin/blogs')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-slate-500 mt-4 font-serif italic uppercase tracking-widest text-[10px]">Retrieving Article...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/blogs" className="flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest mb-4">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Blogs
        </Link>
        <h1 className="text-3xl font-serif text-slate-900">Revise Story</h1>
        <p className="text-slate-500 mt-2">Editing: <span className="text-slate-900 font-bold">{formData.title}</span></p>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-md border bg-red-50 text-red-600 border-red-100">
          {error}
        </div>
      )}

      <form className="space-y-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">Title *</Label>
            <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="text-lg py-6 font-serif" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Optional)</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated-from-title" />
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Input value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label>Feature Image</Label>
            <ImageUploader 
              bucket="media" 
              folder="blogs"
              currentImage={formData.feature_image_url}
              onUploadSuccess={(url) => setFormData({...formData, feature_image_url: url})} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <TiptapEditor 
            content={formData.content} 
            onChange={(html) => setFormData({...formData, content: html})}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel Updates</Button>
          <Button variant="outline" type="button" disabled={saving} onClick={(e) => handleSave(e, false)}>
            {saving ? 'Saving...' : 'Switch to Draft'}
          </Button>
          <Button type="button" disabled={saving} onClick={(e) => handleSave(e, true)}>
            Update & Publish
          </Button>
        </div>
      </form>
    </div>
  )
}
