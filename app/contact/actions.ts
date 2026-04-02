'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function submitInquiry(formData: FormData) {
  try {
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

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string || ''
    const message = formData.get('message') as string

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' }
    }

    // Since this table accepts inserts from anonymous public visitors,
    // Anon Key and Public RLS allows it.
    const { error } = await supabase
      .from('inquiries')
      .insert({
        name,
        email,
        message: `${subject ? `[Subject/Service: ${subject}]\n\n` : ''}${message}`,
        status: 'unread'
      })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting inquiry:', error.message)
    return { success: false, error: 'Failed to submit inquiry. Please try again or email directly.' }
  }
}
