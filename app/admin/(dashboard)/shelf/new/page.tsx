'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { FileUploader } from '@/components/admin/FileUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, ChevronDown, ChevronUp, BookOpen, FileText, ScrollText } from 'lucide-react'

export default function NewShelfItemPage() {
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
    synopsis: '',
    cover_image_url: '',
    cta_url: '',
    is_visible: true,
    reader_mode: 'none' as 'none' | 'pdf' | 'narrative',
    pdf_url: '',
    narrative_content: [] as { id: string; title: string; content: string; isOpen: boolean }[]
  })

  const addChapter = () => {
    const newChapter = {
      id: crypto.randomUUID(),
      title: `Chapter ${formData.narrative_content.length + 1}`,
      content: '',
      isOpen: true
    }
    setFormData({ ...formData, narrative_content: [...formData.narrative_content, newChapter] })
  }

  const removeChapter = (id: string) => {
    setFormData({ ...formData, narrative_content: formData.narrative_content.filter(c => c.id !== id) })
  }

  const updateChapter = (id: string, field: 'title' | 'content' | 'isOpen', value: string | boolean) => {
    setFormData({
      ...formData,
      narrative_content: formData.narrative_content.map(c => 
        c.id === id ? { ...c, [field]: value } : (field === 'isOpen' ? { ...c, isOpen: false } : c)
      )
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    let slug = formData.slug
    if (!slug) {
      slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    const { error: insertError } = await supabase
      .from('shelf_items')
      .insert({
        title: formData.title,
        slug: slug,
        synopsis: formData.synopsis,
        cover_image_url: formData.cover_image_url,
        cta_url: formData.cta_url,
        is_visible: formData.is_visible,
        reader_mode: formData.reader_mode,
        pdf_url: formData.pdf_url,
        narrative_content: formData.narrative_content.map(({ title, content }) => ({ title, content }))
      })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
    } else {
      router.push('/admin/shelf')
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl pb-32">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">New Library Entry</h1>
          <p className="text-slate-500 mt-2">Design a premium reading experience for your audience.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Core Details */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-600" /> Core Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. My Side" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Custom Slug</Label>
              <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Art</Label>
            <ImageUploader 
              bucket="media" 
              folder="shelf"
              currentImage={formData.cover_image_url}
              onUploadSuccess={(url) => setFormData({...formData, cover_image_url: url})} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis / Hook</Label>
            <Textarea id="synopsis" rows={3} value={formData.synopsis} onChange={(e) => setFormData({...formData, synopsis: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta_url">Purchase / CTA Link <span className="text-slate-400 font-normal">(Optional)</span></Label>
            <Input id="cta_url" type="url" value={formData.cta_url} onChange={(e) => setFormData({...formData, cta_url: e.target.value})} placeholder="https://amazon.com/..." />
          </div>
        </section>

        {/* Reader Configuration */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-600" /> Reader Experience
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'none', label: 'None', desc: 'Listing Only', icon: BookOpen },
              { id: 'pdf', label: 'PDF Book', desc: 'File Reader', icon: FileText },
              { id: 'narrative', label: 'Narrative', desc: 'Chapter Studio', icon: ScrollText },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFormData({ ...formData, reader_mode: mode.id as any })}
                className={`p-4 text-left border-2 rounded-xl transition-all ${
                  formData.reader_mode === mode.id 
                    ? 'border-amber-500 bg-amber-50/50 shadow-inner' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                }`}
              >
                <mode.icon className={`w-6 h-6 mb-3 ${formData.reader_mode === mode.id ? 'text-amber-600' : 'text-slate-400'}`} />
                <div className="font-bold text-sm">{mode.label}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{mode.desc}</div>
              </button>
            ))}
          </div>

          {/* Conditional Content Inputs */}
          <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-500">
            {formData.reader_mode === 'pdf' && (
              <div className="space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Label className="text-slate-900 font-bold">Upload Manuscript (PDF)</Label>
                <FileUploader 
                  bucket="media"
                  folder="shelf_pdfs"
                  accept="application/pdf"
                  currentFile={formData.pdf_url}
                  onUploadSuccess={(url) => setFormData({ ...formData, pdf_url: url })}
                />
                <p className="text-[10px] text-slate-500 italic">This file will be optimized for the immersive mobile viewer.</p>
              </div>
            )}

            {formData.reader_mode === 'narrative' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Chapter Studio</h3>
                  <Button type="button" size="sm" onClick={addChapter} className="rounded-full gap-2">
                    <Plus className="w-4 h-4" /> Add Chapter
                  </Button>
                </div>

                {formData.narrative_content.map((chapter, idx) => (
                  <div key={chapter.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="flex items-center justify-between p-4 bg-slate-50/80 cursor-pointer" onClick={() => updateChapter(chapter.id, 'isOpen', !chapter.isOpen)}>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 w-8 h-8 flex items-center justify-center rounded-full">0{idx + 1}</span>
                        <Input 
                          value={chapter.title} 
                          onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold border-none bg-transparent h-auto p-0 focus:scale-[1.01] transition-transform w-64 text-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeChapter(chapter.id); }} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {chapter.isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                    {chapter.isOpen && (
                      <div className="p-0 animate-in fade-in duration-300">
                        <TiptapEditor 
                          content={chapter.content}
                          onChange={(html) => updateChapter(chapter.id, 'content', html)}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {formData.narrative_content.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-2xl">
                    <ScrollText className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm italic">Start your story by adding your first chapter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Global Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-6 bg-slate-900 rounded-2xl shadow-xl text-white">
          <div className="flex items-center gap-4">
            <input 
              type="checkbox" 
              id="is_visible" 
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer" 
              checked={formData.is_visible} 
              onChange={(e) => setFormData({...formData, is_visible: e.target.checked})} 
            />
            <Label htmlFor="is_visible" className="cursor-pointer font-bold text-sm">Visible to Public</Label>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" type="button" onClick={() => router.back()} className="flex-1 sm:flex-none bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full px-8">Archive</Button>
            <Button type="submit" disabled={saving} className="flex-1 sm:flex-none bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 font-bold">
              {saving ? 'Publishing...' : 'Publish Entry'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
