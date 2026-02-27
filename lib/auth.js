import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('getUser error:', error.message)
      return null
    }
    return user
  } catch (error) {
    console.error('getUser exception:', error)
    return null
  }
}

export async function getClientData(userId) {
  const supabase = createServerSupabaseClient()
  
  try {
    // First get portal_users record
    const { data: portalUser, error: puError } = await supabase
      .from('portal_users')
      .select('*')
      .eq('auth_user_id', userId)
      .single()
    
    if (puError || !portalUser) {
      console.error('portal_users error:', puError?.message, 'userId:', userId)
      return null
    }

    // Then get client
    const { data: client, error: cError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', portalUser.client_id)
      .single()
    
    if (cError || !client) {
      console.error('clients error:', cError?.message)
      return null
    }

    return {
      ...portalUser,
      client,
      client_id: portalUser.client_id
    }
  } catch (error) {
    console.error('getClientData exception:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')
  }
  
  return user
}
