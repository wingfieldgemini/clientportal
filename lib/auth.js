import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
  } catch (error) {
    return null
  }
}

export async function getClientData(userId) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: portalUser, error: puError } = await supabase
      .from('portal_users')
      .select('*')
      .eq('auth_user_id', userId)
      .single()
    
    if (puError || !portalUser) return null

    const { data: client, error: cError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', portalUser.client_id)
      .single()
    
    if (cError || !client) return null

    return {
      ...portalUser,
      client,
      client_id: portalUser.client_id
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/')
  return user
}
