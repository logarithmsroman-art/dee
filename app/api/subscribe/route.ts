import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
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

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert({ email })

    // Ignore unique constraint errors (already subscribed)
    if (dbError && dbError.code !== '23505') {
      console.error('DB Error:', dbError)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    // Fetch Custom Template
    const { data: settings } = await supabase
      .from('global_settings')
      .select('email_template_welcome')
      .single()

    const dynamicWelcomeText = settings?.email_template_welcome || `Thank you for stepping into Dee's Pen House. We are thrilled to have you here.
    
As an esteemed member of our community, you will now receive exclusive updates whenever a new narrative or journal entry is published. We look forward to curating bespoke stories directly to your inbox.`

    // Send the Welcome Email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Dee's Pen House <hello@deespenhouse.site>",
      to: email,
      subject: "Welcome to Dee's Pen House",
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FCFBF9; border-top: 4px solid #d4af37;">
          <h1 style="color: #0f172a; margin-bottom: 24px; font-size: 28px;">Welcome to the Architecture of Legacy.</h1>
          <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap;">
            ${dynamicWelcomeText}
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            With elegance,<br>
            <strong>Dee's Pen House Team</strong>
          </p>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; font-style: italic;">
            Storytelling & Creative Agency. You received this because you requested to join our private distribution list.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Email Error:', emailError)
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscribe catch error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
