'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'

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
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({ leadScore: 0, qualified: false })
  const [showLeadForm, setShowLeadForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addBotMessage = (content: string, data?: Partial<LeadData>) => {
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
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial bot message
      addBotMessage(
        "👋 Hi! I'm the AI assistant for CrucialCodeLabs. I help identify how we can best support your technical projects.\n\nWhat type of software challenge are you looking to solve?"
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, messages.length])

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const calculateLeadScore = (data: LeadData): number => {
    let score = 0
    
    // Budget indicators (40 points max)
    if (data.budget?.includes('50K+') || data.budget?.includes('$50') || data.budget?.includes('premium')) score += 40
    else if (data.budget?.includes('25K') || data.budget?.includes('$25') || data.budget?.includes('enterprise')) score += 30
    else if (data.budget?.includes('15K') || data.budget?.includes('$15') || data.budget?.includes('professional')) score += 20
    else if (data.budget?.includes('8K') || data.budget?.includes('$8')) score += 10
    
    // Project complexity (30 points max)
    if (data.projectType?.includes('AI') || data.projectType?.includes('machine learning') || data.projectType?.includes('computer vision')) score += 30
    else if (data.projectType?.includes('custom software') || data.projectType?.includes('full-stack')) score += 20
    else if (data.projectType?.includes('integration') || data.projectType?.includes('automation')) score += 15
    
    // Timeline urgency (20 points max)
    if (data.timeline?.includes('ASAP') || data.timeline?.includes('urgent') || data.timeline?.includes('immediate')) score += 20
    else if (data.timeline?.includes('1-2 months') || data.timeline?.includes('soon')) score += 15
    else if (data.timeline?.includes('3-6 months')) score += 10
    
    // Company/email domain (10 points max)
    if (data.email?.includes('@') && !data.email.includes('gmail') && !data.email.includes('yahoo') && !data.email.includes('hotmail')) score += 10
    
    return Math.min(score, 100)
  }

  const analyzeMessageForLeadData = (userMessage: string): Partial<LeadData> => {
    const msg = userMessage.toLowerCase()
    const updates: Partial<LeadData> = {}
    
    // Budget detection
    if (msg.includes('$') || msg.includes('budget') || msg.includes('cost')) {
      if (msg.includes('50') && (msg.includes('k') || msg.includes('000'))) updates.budget = '$50K+'
      else if (msg.includes('25') && (msg.includes('k') || msg.includes('000'))) updates.budget = '$25K-$50K'
      else if (msg.includes('15') && (msg.includes('k') || msg.includes('000'))) updates.budget = '$15K-$25K'
      else if (msg.includes('8') && (msg.includes('k') || msg.includes('000'))) updates.budget = '$8K-$15K'
    }
    
    // Project type detection
    if (msg.includes('ai') || msg.includes('artificial intelligence') || msg.includes('machine learning')) {
      updates.projectType = 'AI/ML Development'
    } else if (msg.includes('app') || msg.includes('software') || msg.includes('platform')) {
      updates.projectType = 'Custom Software'
    } else if (msg.includes('automation') || msg.includes('integrate') || msg.includes('api')) {
      updates.projectType = 'Integration/Automation'
    } else if (msg.includes('data') || msg.includes('analytics') || msg.includes('dashboard')) {
      updates.projectType = 'Data Analytics'
    }
    
    // Timeline detection
    if (msg.includes('asap') || msg.includes('urgent') || msg.includes('immediately') || msg.includes('rush')) {
      updates.timeline = 'ASAP'
      updates.urgency = 'high'
    } else if (msg.includes('month') || msg.includes('soon')) {
      updates.timeline = '1-2 months'
    } else if (msg.includes('quarter') || msg.includes('3') || msg.includes('6')) {
      updates.timeline = '3-6 months'
    }
    
    return updates
  }

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Analyze user message for lead data
    const detectedData = analyzeMessageForLeadData(userMessage)
    const updatedLeadData = { ...leadData, ...detectedData }
    const score = calculateLeadScore(updatedLeadData)
    
    setLeadData({ ...updatedLeadData, leadScore: score, qualified: score >= 60 })
    
    // Determine response based on conversation stage and lead score
    const messageCount = messages.filter(m => !m.isBot).length
    
    if (messageCount === 1) {
      // First user message - project type inquiry
      if (detectedData.projectType) {
        return `Great! ${detectedData.projectType} is definitely within our expertise. We have delivered similar solutions for clients ranging from startups to enterprise companies.\n\nTo give you the most accurate guidance, what is your target timeline for this project?`
      } else {
        return `That sounds interesting! To better understand how we can help, could you tell me more about:\n\n• What type of software or system you are looking to build\n• Any specific technical challenges you are facing\n• Whether this is a new project or enhancing existing systems`
      }
    }
    
    if (messageCount === 2) {
      // Second message - timeline discussion
      let response = "Perfect! "
      if (detectedData.timeline) {
        response += `A ${detectedData.timeline} timeline is definitely workable. `
      }
      response += "Understanding your budget range helps us recommend the right approach.\n\nOur projects typically fall into these ranges:\n\n"
      response += "• **$8K-$15K:** Focused solutions & integrations\n"
      response += "• **$15K-$25K:** Custom applications & workflows\n"
      response += "• **$25K-$50K:** Advanced AI & comprehensive systems\n"
      response += "• **$50K+:** Enterprise-grade & complex implementations\n\n"
      response += "What range aligns with your thinking?"
      return response
    }
    
    if (messageCount === 3) {
      // Third message - budget discussion & qualification
      if (score >= 60) {
        setShowLeadForm(true)
        return `Excellent! Based on our conversation, this sounds like a great fit for our expertise. \n\nI would love to connect you with our lead developer for a detailed technical consultation. This usually takes 15-30 minutes and you will get:\n\n✓ Specific approach recommendations\n✓ Accurate timeline estimates  \n✓ Technology stack guidance\n✓ Clear next steps\n\nCould you share your contact details so we can schedule a brief call?`
      } else {
        return `Thanks for sharing that information! While this project might be a bit outside our typical engagement range, I would still be happy to provide some guidance.\n\nWould you like me to:\n• Recommend some resources for your project scope\n• Suggest alternative approaches that might fit your budget\n• Connect you with other service providers who specialize in smaller projects\n\nWhat would be most helpful?`
      }
    }
    
    // Follow-up messages
    if (score >= 60) {
      return `I can see this is exactly the type of project where we excel. Let me get you connected with our technical team for a proper consultation. \n\nWhat is the best way to reach you for a quick 15-minute discussion?`
    } else {
      return `I appreciate you sharing more details. Let me know if you have any other questions about our services or if there is anything else I can help clarify!`
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    addUserMessage(userMessage)
    setIsLoading(true)

    // Simulate API delay for better UX
    setTimeout(async () => {
      const response = await generateBotResponse(userMessage)
      addBotMessage(response)
      setIsLoading(false)
    }, 1000)
  }

  const handleContactSubmit = (contactData: { name: string; email: string; phone?: string }) => {
    const finalLeadData = { 
      ...leadData, 
      ...contactData,
      leadScore: calculateLeadScore({ ...leadData, ...contactData }),
      qualified: true 
    }
    
    // Store lead data in localStorage for now (replace with API call)
    const leads = JSON.parse(localStorage.getItem('crucialcodelabs_leads') || '[]')
    leads.push({
      ...finalLeadData,
      timestamp: new Date().toISOString(),
      conversation: messages
    })
    localStorage.setItem('crucialcodelabs_leads', JSON.stringify(leads))
    
    setShowLeadForm(false)
    addBotMessage(
      `Perfect! Thanks ${contactData.name}. I have noted your details and our lead developer will reach out within 24 hours to schedule your technical consultation.\n\nIn the meantime, feel free to browse our case studies on the site. Looking forward to discussing your project in detail! 🚀`
    )
  }

  return (
    <>
      {/* Chat Toggle Button */}
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
            : leadData.leadScore > 30 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
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
            background: leadData.qualified ? '#10b981' : '#f59e0b',
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

      {/* Chat Window */}
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
              border: `2px solid ${leadData.qualified ? '#10b981' : leadData.leadScore > 30 ? '#f59e0b' : '#2563eb'}`
            }}
          >
            {/* Header */}
            <div style={{
              background: leadData.qualified 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : leadData.leadScore > 30 
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
                    CrucialCodeLabs AI
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                    {leadData.qualified ? 'Qualified Lead! 🎯' : 
                     leadData.leadScore > 30 ? 'Promising Prospect 🚀' : 
                     'Project Assistant'}
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

            {/* Messages */}
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

            {/* Lead Contact Form */}
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

            {/* Input */}
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
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
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

// Contact Form Component
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