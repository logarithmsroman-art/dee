'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'

export default function NewBlogPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  const handleSave = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    let slug = formData.slug
    if (!slug) {
      slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    const { error: insertError } = await supabase
      .from('articles')
      .insert({
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        feature_image_url: formData.feature_image_url,
        content: formData.content,
        is_published: publish,
      })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
    } else {
      router.push('/admin/blogs')
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900">New Article</h1>
        <p className="text-slate-500 mt-2">Write a new story or blog post.</p>
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
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button variant="outline" type="button" disabled={saving} onClick={(e) => handleSave(e, false)}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button type="button" disabled={saving} onClick={(e) => handleSave(e, true)}>
            Publish Article
          </Button>
        </div>
      </form>
    </div>
  )
}
