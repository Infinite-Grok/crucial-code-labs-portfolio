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

interface AIResponse {
  message: string
  leadData: Partial<LeadData>
}

interface LeadIntelligence {
  projectType: string
  complexityScore: number
  budgetSignals: string[]
  urgencyIndicators: string[]
  technicalSophistication: number
  decisionAuthority: 'high' | 'medium' | 'low'
  leadScore: number
  nextBestQuestion: string
  conversationPhase: 'discovery' | 'qualification' | 'closing'
  recommendedAction: 'continue' | 'qualify_budget' | 'book_consultation' | 'redirect'
}

export default class AIConversationEngine {
  private apiKey: string | undefined
  private baseURL = 'https://api.x.ai/v1/chat/completions'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY
  }

  private getSystemPrompt(): string {
    return `You are a senior technical consultant for CrucialCodeLabs, a boutique software development and AI integration firm. You're having a conversation with a potential client who visited our website.

YOUR PERSONA:
- 10+ years experience in custom software development and AI integration
- Curious and consultative, not pushy or salesy
- Technically sophisticated but explains concepts clearly
- Genuinely interested in solving business problems through technology
- Confident in capabilities but honest about project fit
- Professional but approachable

CONVERSATION OBJECTIVES:
1. Understand their technical challenge or business problem
2. Assess project scope, complexity, and technical requirements
3. Determine timeline and urgency factors
4. Qualify budget range without being direct about it
5. Build trust through demonstrating technical competence
6. Guide qualified leads toward consultation booking

QUALIFICATION CRITERIA (track but don't make obvious):
- Project Budget: $15K+ (high priority), $8K-15K (medium), <$8K (redirect gracefully)
- Complexity: AI/ML integration (premium), Custom Software (high), Basic Integration (medium)
- Timeline: Urgent/deadline-driven (bonus points), 1-3 months (good), 6+ months (lower priority)
- Authority: Decision maker (high value), Technical influencer (medium), Researcher only (low)

CONVERSATION STYLE:
- Ask thoughtful follow-up questions to understand context
- Share relevant insights without giving away detailed solutions
- Use phrases like "That's an interesting challenge..." "Tell me more about..."
- Reference similar challenges you've solved (without giving specifics)
- Maintain natural conversation flow, not interrogation
- Show technical understanding through intelligent questions

GUARDRAILS - STAY FOCUSED:
- Don't provide detailed technical solutions (save for paid consultation)
- Stay focused on software development and AI consulting services
- Redirect unrelated topics back to their business challenges
- Be honest about project fit - gracefully redirect projects under $8K
- Always end qualified conversations with consultation offer

RESPONSE GUIDELINES:
- Keep responses conversational and engaging (2-4 sentences typically)
- Ask one meaningful follow-up question per response
- Show you understand their domain/industry when possible
- Build towards consultation booking for qualified leads
- Be helpful but reserve detailed advice for paid consultations

Remember: You're not just qualifying leads - you're demonstrating the kind of intelligent, thoughtful consultation they'll receive if they work with CrucialCodeLabs.`
  }

  private getAnalysisPrompt(conversation: Message[], currentLeadData: LeadData): string {
    const lastUserMessage = conversation.filter(m => !m.isBot).pop()?.content || ''
    
    return `Analyze this conversation for lead qualification. Focus on the user's latest message and overall conversation context.

USER'S LATEST MESSAGE: "${lastUserMessage}"

CURRENT LEAD DATA: ${JSON.stringify(currentLeadData)}

CONVERSATION HISTORY: ${conversation.map(m => `${m.isBot ? 'AI' : 'User'}: ${m.content}`).join('\n')}

Analyze and return ONLY a valid JSON object with this exact structure:
{
  "projectType": "detected project category (e.g., 'AI Integration', 'Custom Software', 'E-commerce Platform')",
  "complexityScore": number from 1-10,
  "budgetSignals": ["array", "of", "budget", "indicators", "found"],
  "urgencyIndicators": ["array", "of", "urgency", "signals"],
  "technicalSophistication": number from 1-10,
  "decisionAuthority": "high" | "medium" | "low",
  "leadScore": number from 0-100,
  "nextBestQuestion": "most valuable follow-up question to ask",
  "conversationPhase": "discovery" | "qualification" | "closing",
  "recommendedAction": "continue" | "qualify_budget" | "book_consultation" | "redirect"
}

SCORING CRITERIA:
- Budget indicators: Company mentions, team size, "investment", "budget", dollar amounts (+20-40 points)
- Project complexity: AI/ML/automation (+30), custom software (+20), integrations (+15)
- Timeline urgency: ASAP/deadline (+20), months (+10), flexible (+5)
- Authority: CEO/CTO/founder (+15), technical lead (+10), researcher (+5)
- Technical sophistication: APIs/integrations/scalability mentioned (+10)

CONVERSATION PHASES:
- discovery: Learning about their challenge (first 1-3 exchanges)
- qualification: Understanding scope/budget/timeline (middle exchanges)
- closing: Moving toward consultation booking (qualified leads 60+ points)

RECOMMENDED ACTIONS:
- continue: Keep exploring their needs
- qualify_budget: Probe budget/investment level
- book_consultation: Suggest consultation call
- redirect: Project too small, redirect gracefully

Return ONLY the JSON object, no other text.`
  }

private async callGrokAPI(messages: Array<{role: string; content: string}>, systemPrompt: string, maxTokens: number = 1000): Promise<string> {    if (!this.apiKey) {
      throw new Error('Grok API key not configured')
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'grok-2-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Grok API error:', response.status, errorData)
        throw new Error(`Grok API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'I apologize, but I need a moment to process that. Could you rephrase your question?'
    } catch (error) {
      console.error('Grok API call failed:', error)
      throw error
    }
  }

  private async analyzeLeadIntelligence(conversation: Message[], currentLeadData: LeadData): Promise<LeadIntelligence> {
    try {
      const analysisPrompt = this.getAnalysisPrompt(conversation, currentLeadData)
      const response = await this.callGrokAPI(
        [{ role: 'user', content: analysisPrompt }],
        'You are a lead analysis expert. Analyze conversations for business qualification criteria. Always respond with valid JSON only.',
        500
      )

      // Parse the JSON response
      const analysis: LeadIntelligence = JSON.parse(response.trim())
      
      // Validate the response structure
      if (!analysis.leadScore || !analysis.conversationPhase || !analysis.recommendedAction) {
        throw new Error('Invalid analysis response structure')
      }

      return analysis
    } catch (error) {
      console.error('Lead analysis failed:', error)
      
      // Fallback analysis based on simple rules
      return this.fallbackAnalysis(conversation, currentLeadData)
    }
  }

  private fallbackAnalysis(conversation: Message[], currentLeadData: LeadData): LeadIntelligence {
    const lastUserMessage = conversation.filter(m => !m.isBot).pop()?.content.toLowerCase() || ''
    const messageCount = conversation.filter(m => !m.isBot).length
    
    let score = currentLeadData.leadScore || 0
    
    // Simple scoring rules
    if (lastUserMessage.includes('ai') || lastUserMessage.includes('machine learning')) score += 20
    if (lastUserMessage.includes('custom') || lastUserMessage.includes('software')) score += 15
    if (lastUserMessage.includes('urgent') || lastUserMessage.includes('asap')) score += 15
    if (lastUserMessage.includes('budget') || lastUserMessage.includes('$')) score += 10
    if (lastUserMessage.includes('team') || lastUserMessage.includes('company')) score += 10

    const phase = messageCount <= 2 ? 'discovery' : messageCount <= 4 ? 'qualification' : 'closing'
    const action = score >= 60 ? 'book_consultation' : score >= 40 ? 'qualify_budget' : 'continue'

    return {
      projectType: 'Software Development',
      complexityScore: 5,
      budgetSignals: [],
      urgencyIndicators: [],
      technicalSophistication: 5,
      decisionAuthority: 'medium',
      leadScore: Math.min(score, 100),
      nextBestQuestion: 'Could you tell me more about your technical requirements?',
      conversationPhase: phase,
      recommendedAction: action
    }
  }

  public async getResponse(conversation: Message[], currentLeadData: LeadData): Promise<AIResponse> {
    try {
      // Prepare conversation for API
      const apiMessages = conversation.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.content
      }))

      // Get AI response and lead analysis in parallel
      const [aiResponse, leadAnalysis] = await Promise.all([
        this.callGrokAPI(apiMessages, this.getSystemPrompt()),
        this.analyzeLeadIntelligence(conversation, currentLeadData)
      ])

      // Update lead data based on analysis
      const updatedLeadData: Partial<LeadData> = {
        projectType: leadAnalysis.projectType,
        leadScore: leadAnalysis.leadScore,
        conversationPhase: leadAnalysis.conversationPhase,
        qualified: leadAnalysis.leadScore >= 60
      }

      // Add urgency and budget signals if detected
      if (leadAnalysis.urgencyIndicators.length > 0) {
        updatedLeadData.urgency = 'high'
      }
      if (leadAnalysis.budgetSignals.length > 0) {
        updatedLeadData.budget = leadAnalysis.budgetSignals.join(', ')
      }

      return {
        message: aiResponse,
        leadData: updatedLeadData
      }
    } catch (error) {
      console.error('Conversation engine error:', error)
      
      // Fallback response
      return {
        message: "I apologize for the technical hiccup. I'm here to discuss your software development needs - what specific challenge are you trying to solve?",
        leadData: { leadScore: (currentLeadData.leadScore || 0) + 5 }
      }
    }
  }
}