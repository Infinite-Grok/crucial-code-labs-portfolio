'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import AIConversationEngine from './AIConversationEngine'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  leadData?: LeadData
}

interface LeadData {
  name?: string
  email?: string
  projectType?: string
  timeline?: string
  budget?: string
  urgency?: string
  company?: string
  challenges?: string
  leadScore: number
  qualified: boolean
  conversationPhase?: 'discovery' | 'qualification' | 'closing'
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({ leadScore: 0, qualified: false })
  const [showLeadForm, setShowLeadForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const conversationEngine = useRef(new AIConversationEngine())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addBotMessage = useCallback((content: string, data?: Partial<LeadData>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: true,
      timestamp: new Date(),
      leadData: data ? { ...leadData, ...data } : undefined
    }
    setMessages(prev => [...prev, newMessage])
    
    if (data) {
      setLeadData(prev => ({ ...prev, ...data }))
    }
  }, [leadData])

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Hi! I'm here to learn about your technical challenges and see how CrucialCodeLabs might be able to help. What kind of software project or technical challenge are you working on?"
      )
    }
  }, [isOpen, messages.length, addBotMessage])

  const handleSend = async () => {
  if (!input.trim() || isLoading) return

  const userMessage = input.trim()
  setInput('')
  const userMsg = addUserMessage(userMessage)
  setIsLoading(true)

  try {
    const response = await conversationEngine.current.getResponse(
      [...messages, userMsg],
      leadData
    )

    if (response.leadData) {
      setLeadData(prev => ({ ...prev, ...response.leadData }))
      
      if (response.leadData && 
          response.leadData.leadScore && 
          response.leadData.leadScore >= 60 && 
          response.leadData.conversationPhase === 'closing') {
        setShowLeadForm(true)
      }
    }

    addBotMessage(response.message, response.leadData)
  } catch (error) {
    console.error('Conversation error:', error)
    addBotMessage(
      "I'm having a brief technical issue. Could you try rephrasing that? I'm here to discuss your software development needs."
    )
  } finally {
    setIsLoading(false)
    // Auto-focus input after response (but not if form is showing)
    if (!showLeadForm) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }
}

  const handleContactSubmit = (contactData: { name: string; email: string; phone?: string }) => {
    const finalLeadData = { 
      ...leadData, 
      ...contactData,
      qualified: true 
    }
    
    const leads = JSON.parse(localStorage.getItem('crucialcodelabs_leads') || '[]')
    leads.push({
      ...finalLeadData,
      timestamp: new Date().toISOString(),
      conversation: messages
    })
    localStorage.setItem('crucialcodelabs_leads', JSON.stringify(leads))
    
    setShowLeadForm(false)
    addBotMessage(
      `Perfect! Thanks ${contactData.name}. I have your details and our lead developer will reach out within 24 hours to schedule your technical consultation.\n\nIn the meantime, feel free to browse our case studies on the site. Looking forward to discussing your project in detail! 🚀`
    )
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 10 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          background: leadData.qualified 
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : leadData.leadScore > 50 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : leadData.leadScore > 25
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white',
          padding: 'clamp(0.75rem, 3vw, 1rem)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
          transition: 'all 0.3s ease',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {leadData.leadScore > 0 && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: leadData.qualified ? '#10b981' : leadData.leadScore > 50 ? '#f59e0b' : '#6366f1',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {leadData.leadScore}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: 'min(400px, calc(100vw - 2rem))',
              height: 'min(600px, calc(100vh - 8rem))',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: `2px solid ${leadData.qualified ? '#10b981' : leadData.leadScore > 50 ? '#f59e0b' : '#2563eb'}`
            }}
          >
            <div style={{
              background: leadData.qualified 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : leadData.leadScore > 50 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={24} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                Chip - AI Technical Consultant
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                {leadData.qualified ? 'Qualified Lead! 🎯' : 
                leadData.leadScore > 50 ? 'High Interest 🚀' : 
                leadData.leadScore > 25 ? 'Engaged Prospect 💡' :
                'AI-Powered Assistant'}
                </p>
                </div>
              </div>
              {leadData.leadScore > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Score: {leadData.leadScore}
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    flexDirection: message.isBot ? 'row' : 'row-reverse'
                  }}
                >
                  <div style={{
                    background: message.isBot ? '#f3f4f6' : '#2563eb',
                    color: message.isBot ? '#2563eb' : 'white',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: '32px',
                    height: '32px'
                  }}>
                    {message.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div style={{
                    background: message.isBot ? '#f3f4f6' : '#2563eb',
                    color: message.isBot ? '#1f2937' : 'white',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    maxWidth: '80%',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{
                    background: '#f3f4f6',
                    color: '#2563eb',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}>
                    <Bot size={16} />
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Thinking...
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {showLeadForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}
              >
                <ContactForm onSubmit={handleContactSubmit} />
              </motion.div>
            )}

            {!showLeadForm && (
              <div style={{
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your technical challenge..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                      opacity: input.trim() && !isLoading ? 1 : 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ContactForm({ onSubmit }: { onSubmit: (data: { name: string; email: string; phone?: string }) => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
        🎯 Great! Let&apos;s schedule your consultation
      </h4>
      <input
        type="text"
        placeholder="Your name *"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        style={{
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          boxSizing: 'border-box'
        }}
      />
      <input
        type="email"
        placeholder="Your email *"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
        style={{
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          boxSizing: 'border-box'
        }}
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        style={{
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          boxSizing: 'border-box'
        }}
      />
      <button
        type="submit"
        disabled={!formData.name || !formData.email}
        style={{
          background: formData.name && formData.email ? '#10b981' : '#9ca3af',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: 'none',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: formData.name && formData.email ? 'pointer' : 'not-allowed'
        }}
      >
        Schedule My Consultation 📅
      </button>
    </form>
  )
}