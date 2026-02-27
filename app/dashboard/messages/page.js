import { requireAuth, getClientData } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import MessageThread from '@/components/MessageThread'

async function getMessages(clientId) {
  const supabase = createServerSupabaseClient()
  
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
  
  return messages || []
}

export default async function MessagesPage() {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)
  const messages = await getMessages(clientData.client_id)
  
  const unreadCount = messages.filter(m => !m.read && m.sender_type === 'team').length

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-2">
            Chat with the WingfieldGemini team
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wg-red text-white">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Message Thread */}
      <div className="bg-white rounded-lg flex-1 min-h-[600px] flex flex-col">
        <MessageThread 
          messages={messages} 
          clientId={clientData.client_id}
          clientName={clientData.client.business_name}
        />
      </div>
    </div>
  )
}