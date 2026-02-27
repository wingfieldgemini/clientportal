import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createServerSupabaseClient()
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getClientData(userId) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: portalUser, error } = await supabase
      .from('portal_users')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('auth_user_id', userId)
      .single()
    
    if (error) {
      console.error('Client data error:', error)
      return null
    }
    
    return portalUser
  } catch (error) {
    console.error('Error:', error)
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