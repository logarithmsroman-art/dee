'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function submitInquiry(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { success: false, error: 'Full Identity, Electronic Mail, and Narrative are required.' }
  }

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

  const { error } = await supabase
    .from('inquiries')
    .insert([
      {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'new'
      },
    ])

  if (error) {
    console.error('Supabase error:', error)
    return { success: false, error: 'The transmission was interrupted. Please try again or contact via LinkedIn.' }
  }

  return { success: true }
}
