'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function MessageThread({ messages: initialMessages = [], clientId, clientName }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`messages-${clientId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        }, 
        (payload) => {
          setMessages(current => [...current, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientId, supabase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            client_id: clientId,
            sender_type: 'client',
            sender_name: clientName,
            message: newMessage.trim()
          }
        ])

      if (!error) {
        setNewMessage('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-600">
              Send your first message to the WingfieldGemini team below.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender_type === 'client'
                    ? 'bg-wg-red text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className={`text-xs mt-2 ${
                  message.sender_type === 'client' 
                    ? 'text-red-100' 
                    : 'text-gray-500'
                }`}>
                  {message.sender_name && (
                    <span className="font-medium">
                      {message.sender_name} • 
                    </span>
                  )}
                  <span className="ml-1">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wg-red focus:border-transparent resize-none"
              disabled={sending}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-2 bg-wg-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-wg-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}