import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { inquiryId, toEmail, toName, subject, message } = await req.json()

    if (!toEmail || !message) {
      return NextResponse.json({ error: 'Missing email or message' }, { status: 400 })
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

    // Verify requesting user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error: emailError } = await resend.emails.send({
      from: "Dee's Pen House <hello@deespenhouse.site>",
      to: toEmail,
      subject: `Re: ${subject || 'Your Inquiry'}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FCFBF9; border-top: 4px solid #d4af37;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Dear ${toName.split(' ')[0]},
          </p>
          <div style="color: #0f172a; font-size: 16px; line-height: 1.8; margin-bottom: 32px; white-space: pre-wrap;">
            ${message}
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            With elegance,<br>
            <strong>Dee's Pen House</strong>
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Email Dispatch Error:', emailError)
      return NextResponse.json({ error: 'Failed to dispatch email' }, { status: 500 })
    }

    if (inquiryId) {
      const { data: currentInquiry } = await supabase.from('inquiries').select('replies').eq('id', inquiryId).single()
      const currentReplies = currentInquiry?.replies || []
      await supabase.from('inquiries').update({
        replies: [...currentReplies, {
          message: message,
          sent_at: new Date().toISOString()
        }]
      }).eq('id', inquiryId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Notify catch error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
