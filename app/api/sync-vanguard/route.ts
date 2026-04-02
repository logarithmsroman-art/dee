import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
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
    .from('shelf_items')
    .update({
      title: 'The Vanguard',
      slug: 'the-vanguard',
      reader_mode: 'narrative',
      narrative_content: [
        {
          "title": "Chapter One: The Awakening",
          "content": "<p>The ceiling fan spun lazily overhead, its rhythm a steady, hypnotic hum in the quiet room. She sat on the edge of the bed for a second, just breathing. Then I walked to the gate and knocked twice.</p><img src=\"/shelf/awakening.png\" alt=\"Awakening\" class=\"rounded-2xl shadow-2xl border border-slate-100 my-16 w-full h-auto block hover:scale-[1.01] transition-transform duration-700\" /><p>It didn't take long. A familiar face peeked through—Abdullahi, the night guard. His brows pulled together when he saw me, but he opened the gate without a word. I could feel his judgment follow me as I stepped in, eyes heavy on my back.</p>"
        },
        {
          "title": "Chapter Two: Echoes of the Past",
          "content": "<p>Inside, the house was quiet—but that kind of fake quiet. The one that holds its breath, waiting to explode. As soon as I stepped into the living room, I saw him.</p><p>My father.</p><img src=\"/shelf/the_meeting.png\" alt=\"The Meeting\" class=\"rounded-2xl shadow-2xl border border-slate-100 my-16 w-full h-auto block hover:scale-[1.01] transition-transform duration-700\" /><p>She looked up lazily when she saw us. \"You're leaving?\" she asked, voice soft, slightly slurred. I nodded once. \"You could've woken me.\" Sofie smiled, her head resting on her man's chest. \"You looked too comfortable,\" she murmured. \"I thought you were spending the night.\"</p>"
        },
        {
          "title": "Chapter Three: The Gathering Storm",
          "content": "<p>I didn't answer. I didn't have the energy to explain myself, or the mess in my head. I just shook my head and walked past her. Jabir followed behind me, quiet now. No questions. No comments.</p><p>And honestly? That silence said everything.</p><img src=\"/shelf/the_departure.png\" alt=\"The Departure\" class=\"rounded-2xl shadow-2xl border border-slate-100 my-16 w-full h-auto block hover:scale-[1.01] transition-transform duration-700\" /><p>We drove through the rain-slicked streets, the only sound the rhythmic beat of the wipers. The world outside was a blur of neon and shadow, much like the path we were forced to walk.</p>"
        }
      ]
    })
    .eq('id', '8dc9aba2-f2cb-4b23-a8ed-beca4ee33629')

  if (error) {
    return NextResponse.json({ success: false, error: error.message })
  }

  return NextResponse.json({ success: true, message: 'The Vanguard has been successfully transformed into a Narrative Experience.' })
}
