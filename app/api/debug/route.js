import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No user', userError: userError?.message })
  }

  const { data: portalUser, error: puError } = await supabase
    .from('portal_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  const { data: allPortalUsers, error: allError } = await supabase
    .from('portal_users')
    .select('auth_user_id, client_id')

  return NextResponse.json({
    userId: user.id,
    email: user.email,
    portalUser,
    puError: puError?.message,
    allPortalUsers,
    allError: allError?.message
  })
}
