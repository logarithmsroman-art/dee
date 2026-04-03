'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { FileUploader } from '@/components/admin/FileUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { ChevronUp } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { FileText } from 'lucide-react'
import { ScrollText } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ShelfEditViewProps {
  id?: string
}

export function ShelfEditView({ id }: ShelfEditViewProps) {
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
    slug: '',
    synopsis: '',
    cover_image_url: '',
    cta_url: '',
    is_visible: true,
    reader_mode: 'none' as 'none' | 'pdf' | 'narrative',
    pdf_url: '',
    narrative_content: [] as any[]
  })

  useEffect(() => {
    async function fetchData() {
      if (isNew) return
      
      const { data, error } = await supabase
        .from('shelf_items')
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
          synopsis: data.synopsis || '',
          cover_image_url: data.cover_image_url || '',
          cta_url: data.cta_url || '',
          is_visible: data.is_visible,
          reader_mode: data.reader_mode || 'none',
          pdf_url: data.pdf_url || '',
          narrative_content: (data.narrative_content || []).map((c: any) => ({ 
            ...c, 
            id: c.id || crypto.randomUUID(),
            isOpen: false 
          }))
        })
        setLoading(false)
      }
    }
    fetchData()
  }, [id, isNew, supabase])

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

    const payload = {
      title: formData.title,
      slug: slug,
      synopsis: formData.synopsis,
      cover_image_url: formData.cover_image_url,
      cta_url: formData.cta_url,
      is_visible: formData.is_visible,
      reader_mode: formData.reader_mode,
      pdf_url: formData.pdf_url,
      narrative_content: formData.narrative_content.map(({ title, content }) => ({ title, content }))
    }

    let saveError
    if (isNew) {
      const { error } = await supabase.from('shelf_items').insert(payload)
      saveError = error
    } else {
      const { error } = await supabase.from('shelf_items').update(payload).eq('id', id)
      saveError = error
    }

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
    } else {
      router.push('/admin/shelf')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-slate-500 mt-4 font-serif italic uppercase tracking-widest text-[10px]">Retrieving Manuscript...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl pb-32">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <Link href="/admin/shelf" className="flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest mb-4">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Shelf
          </Link>
          <h1 className="text-3xl font-serif text-slate-900">{isNew ? 'New Library Entry' : 'Refine Collection'}</h1>
          {!isNew && <p className="text-slate-500 mt-2">Editing entry: <span className="text-slate-900 font-bold">{formData.title}</span></p>}
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-10">
        {/* Core Details */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-600" /> Core Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Custom Slug</Label>
              <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
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

          <div className="pt-4">
            {formData.reader_mode === 'pdf' && (
              <div className="space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Label className="text-slate-900 font-bold">{isNew ? 'Upload Manuscript (PDF)' : 'Update Manuscript (PDF)'}</Label>
                <FileUploader 
                  bucket="media"
                  folder="shelf_pdfs"
                  accept="application/pdf"
                  currentFile={formData.pdf_url}
                  onUploadSuccess={(url) => setFormData({ ...formData, pdf_url: url })}
                />
              </div>
            )}

            {formData.reader_mode === 'narrative' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Chapter Studio</h3>
                  <Button type="button" size="sm" onClick={addChapter} className="rounded-full gap-2">
                    <Plus size={16} /> Add Chapter
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
                          <Trash2 size={16} />
                        </Button>
                        {chapter.isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
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
            <Button variant="outline" type="button" onClick={() => router.back()} className="flex-1 sm:flex-none bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full px-8">Discard</Button>
            <Button type="submit" disabled={saving} className="flex-1 sm:flex-none bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 font-bold">
              {saving ? 'Saving...' : (isNew ? 'Publish Entry' : 'Update Entry')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
