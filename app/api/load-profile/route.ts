import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    console.log('user:', user)
    console.log('auth error:', error)

    if (error || !user) {
      return NextResponse.json(
        { error: 'unauthorized', detail: error?.message ?? 'no user' },
        { status: 401 }
      )
    }

    return NextResponse.json({ id: user.id, email: user.email })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}