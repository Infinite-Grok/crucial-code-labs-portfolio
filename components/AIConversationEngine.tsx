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

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  private getSystemPrompt(): string {
    return `You are Chip, an AI technical consultant for CrucialCodeLabs, a boutique software development and AI integration firm. You're having a conversation with a potential client who visited our website.

IMPORTANT: You are an AI assistant and should be transparent about this. Only introduce yourself by name in your VERY FIRST response. After that, engage naturally in conversation without repeating your name or role. Be honest that you're AI-powered if directly asked, but focus on helping with their technical challenges.

YOUR PERSONA:
- Name: Chip (AI Technical Consultant)
- Transparent about being AI while professionally knowledgeable
- 10+ years of training data in software development and AI integration
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

GUARDRAILS - STAY STRICTLY PROFESSIONAL:
- Don't provide detailed technical solutions (save for paid consultation)
- Stay focused ONLY on software development and AI consulting services
- DO NOT engage with personal, relationship, or emotional topics
- Immediately redirect personal conversations back to business/technical topics
- Be polite but firm about professional boundaries
- If someone mentions personal issues, acknowledge briefly then redirect to business
- Never offer counseling, therapy, or personal advice
- Be honest about project fit - gracefully redirect projects under $8K
- Always end qualified conversations with consultation offer

PROFESSIONAL REDIRECTS FOR OFF-TOPIC:
- Personal issues: "I focus on technical consulting. For your software development needs, what challenges is your business facing?"
- Non-business topics: "I specialize in software and AI solutions for businesses. What technical projects are you working on?"
- General chat: "I'm here to discuss technical consulting services. How can I help with your software development goals?"

RESPONSE GUIDELINES:
- Keep responses conversational and engaging (2-4 sentences typically)
- Ask one meaningful follow-up question per response
- Show you understand their domain/industry when possible
- Build towards consultation booking for qualified leads
- Be helpful but reserve detailed advice for paid consultations
- DO NOT repeat your name or introduction after the first message
- Focus on their needs, not your identity
- NEVER engage with personal/relationship topics - redirect professionally
- Maintain strict business focus at all times

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

  private async callGrokAPI(messages: Array<{role: string; content: string}>, systemPrompt: string, maxTokens: number = 1000): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured')
    }

    // Mobile-specific timeout and retry logic
    const isMobileDevice = this.isMobile()
    const timeout = isMobileDevice ? 15000 : 30000 // Shorter timeout for mobile
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          // Add mobile-friendly headers
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          model: 'grok-2-1212',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: isMobileDevice ? 500 : maxTokens, // Smaller responses for mobile
          temperature: 0.7,
          stream: false
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Could you rephrase that?'
    } catch (error) {
      // Enhanced mobile fallback
      if (isMobileDevice) {
        console.log('Mobile API failed, using enhanced fallback')
        return this.getMobileFallbackResponse(messages)
      }
      throw error
    }
  }

  private async analyzeLeadIntelligence(conversation: Message[], currentLeadData: LeadData): Promise<LeadIntelligence> {
    try {
      const analysisPrompt = this.getAnalysisPrompt(conversation, currentLeadData)
      const response = await this.callGrokAPI(
        [{ role: 'user', content: analysisPrompt }],
        'You are a lead analysis expert. Always respond with valid JSON only. No additional text or explanation.',
        500
      )

      // Clean the response - remove any non-JSON text
      const cleanResponse = response.trim()
      let jsonStart = cleanResponse.indexOf('{')
      let jsonEnd = cleanResponse.lastIndexOf('}') + 1
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON found in response')
      }
      
      const jsonString = cleanResponse.substring(jsonStart, jsonEnd)
      const analysis: LeadIntelligence = JSON.parse(jsonString)
      
      // Validate required fields and provide defaults
      const validatedAnalysis: LeadIntelligence = {
        projectType: analysis.projectType || 'Software Development',
        complexityScore: analysis.complexityScore || 5,
        budgetSignals: Array.isArray(analysis.budgetSignals) ? analysis.budgetSignals : [],
        urgencyIndicators: Array.isArray(analysis.urgencyIndicators) ? analysis.urgencyIndicators : [],
        technicalSophistication: analysis.technicalSophistication || 5,
        decisionAuthority: analysis.decisionAuthority || 'medium',
        leadScore: typeof analysis.leadScore === 'number' ? analysis.leadScore : 0,
        nextBestQuestion: analysis.nextBestQuestion || 'Could you tell me more about your project requirements?',
        conversationPhase: analysis.conversationPhase || 'discovery',
        recommendedAction: analysis.recommendedAction || 'continue'
      }
      
      return validatedAnalysis
    } catch (error) {
      console.error('Lead analysis failed:', error)
      
      // Enhanced fallback analysis
      return this.fallbackAnalysis(conversation, currentLeadData)
    }
  }

  private fallbackAnalysis(conversation: Message[], currentLeadData: LeadData): LeadIntelligence {
    const lastUserMessage = conversation.filter(m => !m.isBot).pop()?.content.toLowerCase() || ''
    const messageCount = conversation.filter(m => !m.isBot).length
    
    let score = currentLeadData.leadScore || 0
    const budgetSignals: string[] = []
    const urgencyIndicators: string[] = []
    
    // Enhanced scoring rules
    if (lastUserMessage.includes('ai') || lastUserMessage.includes('machine learning') || lastUserMessage.includes('artificial intelligence')) {
      score += 20
    }
    if (lastUserMessage.includes('custom') || lastUserMessage.includes('software') || lastUserMessage.includes('platform')) {
      score += 15
    }
    if (lastUserMessage.includes('urgent') || lastUserMessage.includes('asap') || lastUserMessage.includes('deadline')) {
      score += 15
      urgencyIndicators.push('urgent timeline')
    }
    if (lastUserMessage.includes('budget') || lastUserMessage.includes('$') || lastUserMessage.includes('investment')) {
      score += 10
      budgetSignals.push('budget mentioned')
    }
    if (lastUserMessage.includes('team') || lastUserMessage.includes('company') || lastUserMessage.includes('enterprise')) {
      score += 10
    }
    
    // Determine conversation phase
    let phase: 'discovery' | 'qualification' | 'closing' = 'discovery'
    if (messageCount > 3 || score >= 50) {
      phase = 'qualification'
    }
    if (score >= 60) {
      phase = 'closing'
    }
    
    // Determine action
    let action: 'continue' | 'qualify_budget' | 'book_consultation' | 'redirect' = 'continue'
    if (score >= 60) {
      action = 'book_consultation'
    } else if (score >= 40) {
      action = 'qualify_budget'
    }

    return {
      projectType: lastUserMessage.includes('ai') ? 'AI Integration' : 'Software Development',
      complexityScore: Math.min(Math.max(score / 10, 1), 10),
      budgetSignals,
      urgencyIndicators,
      technicalSophistication: lastUserMessage.includes('api') || lastUserMessage.includes('integration') ? 7 : 5,
      decisionAuthority: lastUserMessage.includes('ceo') || lastUserMessage.includes('founder') || lastUserMessage.includes('we need') ? 'high' : 'medium',
      leadScore: Math.min(score, 100),
      nextBestQuestion: score < 40 ? 'What specific technical challenges are you facing?' : 'What timeline are you working with for this project?',
      conversationPhase: phase,
      recommendedAction: action
    }
  }

  private getMobileFallbackResponse(messages: Array<{role: string; content: string}>): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    
    // Smart mobile fallbacks based on keywords
    if (lastMessage.includes('ai') || lastMessage.includes('machine learning')) {
      return "That's an exciting AI project! We specialize in AI integration and have helped many companies implement intelligent solutions. What specific AI capabilities are you looking to add to your platform?"
    }
    
    if (lastMessage.includes('website') || lastMessage.includes('web')) {
      return "Web development is one of our core services. Are you looking for a complete rebuild, specific functionality additions, or perhaps integrating modern features like AI chatbots?"
    }
    
    if (lastMessage.includes('app') || lastMessage.includes('mobile')) {
      return "Mobile applications are a great way to engage users. Are you thinking iOS, Android, or a cross-platform solution? What's the main purpose of the app?"
    }
    
    if (lastMessage.includes('budget') || lastMessage.includes('cost') || lastMessage.includes('$')) {
      return "I appreciate you thinking about investment. Our projects typically range from $8K for focused solutions up to $50K+ for comprehensive AI implementations. What scope are you considering?"
    }
    
    // Default professional response
    return "That sounds like an interesting challenge! Could you tell me more about the specific technical requirements or business goals you're trying to achieve? This will help me understand how we can best assist you."
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