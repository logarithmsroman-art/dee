'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const [settings, setSettings] = useState({
    id: '',
    contact_email: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    brand_logo_url: '',
    hero_slide_1_title: '',
    hero_slide_1_tagline: '',
    hero_slide_2_title: '',
    hero_slide_2_tagline: '',
    hero_slide_3_title: '',
    hero_slide_3_tagline: '',
    methodology_title: '',
    methodology_main_title: '',
    methodology_description: '',
    methodology_image_url: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .limit(1)
        .single()

      if (data) {
        setSettings(data)
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error)
      }
      setLoading(false)
    }
    loadSettings()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ text: '', type: '' })

    const rowId = settings.id || '758cc5bb-fe57-4f72-9f4d-18423d728d06'

    const { error } = await supabase
      .from('global_settings')
      .update({
        contact_email: settings.contact_email,
        instagram_url: settings.instagram_url,
        twitter_url: settings.twitter_url,
        linkedin_url: settings.linkedin_url,
        brand_logo_url: settings.brand_logo_url,
        hero_slide_1_title: settings.hero_slide_1_title,
        hero_slide_1_tagline: settings.hero_slide_1_tagline,
        hero_slide_2_title: settings.hero_slide_2_title,
        hero_slide_2_tagline: settings.hero_slide_2_tagline,
        hero_slide_3_title: settings.hero_slide_3_title,
        hero_slide_3_tagline: settings.hero_slide_3_tagline,
        methodology_title: settings.methodology_title,
        methodology_main_title: settings.methodology_main_title,
        methodology_description: settings.methodology_description,
        methodology_image_url: settings.methodology_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rowId)

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'Settings saved successfully!', type: 'success' })
    }
    setSaving(false)
  }

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 4000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  if (loading) return <div className="animate-pulse space-y-8 p-12"><div className="h-4 bg-slate-100 w-1/4 rounded"></div><div className="h-32 bg-slate-50 rounded-xl"></div><div className="h-32 bg-slate-50 rounded-xl"></div></div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900">Global Settings</h1>
        <p className="text-slate-500 mt-2">Manage your core brand information and social footprint.</p>
      </div>

      {/* Fixed Toast Notification */}
      {message.text && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-4 duration-300 ${
          message.type === 'error'
            ? 'bg-red-600 text-white border-red-700'
            : 'bg-slate-900 text-white border-slate-800'
        }`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            message.type === 'error' ? 'bg-red-300' : 'bg-green-400'
          }`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-10">
        
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-50 pb-4 text-slate-900">Brand Identity</h2>
          <div className="space-y-4">
            <Label className="text-slate-500">Brand Logo</Label>
            <ImageUploader 
              bucket="media" 
              folder="brand"
              currentImage={settings.brand_logo_url}
              onUploadSuccess={(url) => setSettings({ ...settings, brand_logo_url: url })} 
            />
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Recommended: PNG with transparent background</p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <h2 className="text-lg font-bold border-b border-slate-50 pb-4 text-slate-900">Hero Slideshow Content</h2>
          
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Slide 01</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={settings.hero_slide_1_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_1_title: e.target.value })}
                placeholder="Slide 1 Title"
              />
              <Input
                value={settings.hero_slide_1_tagline || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_1_tagline: e.target.value })}
                placeholder="Slide 1 Tagline"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Slide 02</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={settings.hero_slide_2_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_2_title: e.target.value })}
                placeholder="Slide 2 Title"
              />
              <Input
                value={settings.hero_slide_2_tagline || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_2_tagline: e.target.value })}
                placeholder="Slide 2 Tagline"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Slide 03</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={settings.hero_slide_3_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_3_title: e.target.value })}
                placeholder="Slide 3 Title"
              />
              <Input
                value={settings.hero_slide_3_tagline || ''}
                onChange={(e) => setSettings({ ...settings, hero_slide_3_tagline: e.target.value })}
                placeholder="Slide 3 Tagline"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-50 pb-4 text-slate-900">Agency Methodology</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Methodology Title</Label>
              <Input
                value={settings.methodology_title || ''}
                onChange={(e) => setSettings({ ...settings, methodology_title: e.target.value })}
                placeholder="e.g. Our Methodology"
              />
            </div>
            <div className="space-y-2">
              <Label>Main Heading</Label>
              <Input
                value={settings.methodology_main_title || ''}
                onChange={(e) => setSettings({ ...settings, methodology_main_title: e.target.value })}
                placeholder="e.g. Designing the Architecture of Legacy."
              />
            </div>
            <div className="space-y-2">
              <Label>Methodology Background Image</Label>
              <ImageUploader 
                bucket="media" 
                folder="brand"
                currentImage={settings.methodology_image_url}
                onUploadSuccess={(url) => setSettings({ ...settings, methodology_image_url: url })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Methodology Description</Label>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-sans text-sm"
                value={settings.methodology_description || ''}
                onChange={(e) => setSettings({ ...settings, methodology_description: e.target.value })}
                placeholder="Describe your design and storytelling approach..."
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-50 pb-4 text-slate-900">Contact & Social</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Public Support Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="hello@deespen.house"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram Page</Label>
              <Input
                id="instagram_url"
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url">X / Twitter</Label>
              <Input
                id="twitter_url"
                type="url"
                value={settings.twitter_url || ''}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Office</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={saving} className="px-12 py-6 rounded-full font-bold">
            {saving ? 'Syncing...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
