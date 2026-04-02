import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ContactForm } from '@/components/public/ContactForm'
import { Suspense } from 'react'

export const metadata = {
  title: "Contact & Inquiries | Dee's Pen House",
  description: "Get in touch with Dee's Pen House for ghostwriting, content writing, and storytelling inquiries.",
}

async function getGlobalSettings() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: settings } = await supabase
    .from('global_settings')
    .select('contact_email, linkedin_url, twitter_url')
    .single()

  return settings
}

export default async function ContactPage() {
  const settings = await getGlobalSettings()

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 item-start">
        
        {/* Left Column: Context & Contact info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">Let's write your story.</h1>
            <div className="w-16 h-1 bg-amber-500 rounded-full mb-8" />
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-lg">
              Whether you're looking for a ghostwriter for your next book, compelling articles for your brand, or a creative partner to shape your narrative—I'm ready to collaborate. 
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Direct Contact</h3>
            
            {settings?.contact_email ? (
              <a href={`mailto:${settings.contact_email}`} className="block text-2xl font-serif text-slate-900 hover:text-amber-600 transition-colors">
                {settings.contact_email}
              </a>
            ) : (
              <p className="text-lg text-slate-900 italic">Email not configured.</p>
            )}
          </div>

          {(settings?.linkedin_url || settings?.twitter_url) && (
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Connect Online</h3>
              <div className="flex gap-6">
                {settings.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                    LinkedIn
                  </a>
                )}
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                    Twitter / X
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Form */}
        <div className="relative">
          <Suspense fallback={<div className="h-[600px] w-full bg-slate-100 rounded-2xl animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>

      </div>
    </div>
  )
}
