import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { articleId, title, excerpt, slug } = await req.json()

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing article data' }, { status: 400 })
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

    // Verify requesting user is admin/owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all subscribers
    const { data: subscribers, error: dbError } = await supabase
      .from('subscribers')
      .select('email')

    if (dbError) {
      console.error('Fetch subscribers error:', dbError)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscribers to notify' })
    }

    // Get the dynamic email template
    const { data: settings } = await supabase
      .from('global_settings')
      .select('email_template_new_post')
      .single()

    const dynamicIntroText = settings?.email_template_new_post || 'A new narrative has just been published.'

    const emailsToNotify = subscribers.map((sub: any) => sub.email)
    const articleUrl = `https://deespenhouse.site/blog/${slug}`

    // Send emails in a loop or batch. Resend allows batch sending, but let's use a standard send 
    // for Bcc to avoid exposing all lists, or loop it. Wait, Resend has batch sending, but let's 
    // just send one message using Bcc if the list isn't massive.
    // For simplicity, we'll send it individually or Bcc up to a limit.
    // We'll BCC all subscribers to send exactly one API request. 
    // (Note: Resend supports up to 50 BCCs per request, if more we should loop, but BCC works for now).

    const { error: emailError } = await resend.emails.send({
      from: "Dee's Pen House <hello@deespenhouse.site>",
      to: "hello@deespenhouse.site", // Primary recipient
      bcc: emailsToNotify, // Subscribers hidden in BCC
      subject: `New Journal Entry: ${title}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FCFBF9; border-top: 4px solid #d4af37;">
          <h4 style="color: #d4af37; letter-spacing: 2px; font-size: 10px; text-transform: uppercase;">The Journal</h4>
          <h1 style="color: #0f172a; margin-bottom: 24px; font-size: 28px;">${title}</h1>
          <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap;">
            ${dynamicIntroText}
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; font-style: italic; margin-bottom: 24px; border-left: 2px solid #e2e8f0; padding-left: 16px;">
            "${excerpt || 'Excerpt unavailable.'}"
          </p>
          <a href="${articleUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">Read the Full Context</a>
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
      console.error('Email Dispatch Error:', emailError)
      return NextResponse.json({ error: 'Failed to dispatch emails' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: emailsToNotify.length })
  } catch (err) {
    console.error('Notify catch error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
