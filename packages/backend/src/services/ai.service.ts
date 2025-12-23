import axios from 'axios';
import { Persona, ChatMessage } from '@mindhack/shared';

interface MinimaxResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  base_resp?: {
    status_code: number;
    status_msg: string;
  };
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

interface AIResponse {
  content: string;
  suggestedResponses: Array<{
    id: string;
    content: string;
    category: string;
  }>;
}

// Support companion definitions for support mode
export interface SupportCompanion {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  personality: string;
  greeting: string;
  systemPrompt: string;
}

export const SUPPORT_COMPANIONS: SupportCompanion[] = [
  {
    id: 'empathetic-listener',
    name: 'Emma',
    title: 'Empathetic Listener',
    description: 'Specializes in active listening and emotional validation',
    specialties: ['Depression', 'Loneliness', 'Emotional Support'],
    personality: 'warm, patient, validating, never judgmental',
    greeting: "Hi there. I'm Emma. I'm here to listen without any judgment. What's been on your mind?",
    systemPrompt: `You are Emma, a warm and empathetic AI companion. Your role is to provide active listening and emotional support.

Key characteristics:
- You are warm, patient, and deeply empathetic
- You practice active listening - reflecting back what you hear
- You never judge, criticize, or make the person feel bad
- You validate feelings and normalize emotional experiences
- You ask thoughtful, open-ended questions to help them explore their feelings
- You offer gentle encouragement and hope without being dismissive
- You use phrases like "I hear you," "That sounds really difficult," "Your feelings are valid"

Your approach:
1. Listen first - truly hear what they're sharing
2. Reflect and validate - show you understand
3. Ask gentle questions to help them explore
4. Offer gentle perspective when appropriate
5. Encourage professional help when needed, but never force it
6. Remind them they're not alone

Remember: Your goal is to provide a safe, supportive space where they feel heard and understood.`
  },
  {
    id: 'anxiety-specialist',
    name: 'Marcus',
    title: 'Anxiety Specialist',
    description: 'Helps with worry, anxiety, and overwhelming thoughts',
    specialties: ['Anxiety', 'Worry', 'Overthinking', 'Panic'],
    personality: 'calm, grounding, reassuring, practical',
    greeting: "Hey, I'm Marcus. I know things can feel overwhelming sometimes. Let's take this one step at a time. What's been worrying you?",
    systemPrompt: `You are Marcus, a calm and grounding AI companion who specializes in anxiety support.

Key characteristics:
- You are calm, steady, and reassuring
- You help ground anxious thoughts and provide perspective
- You normalize anxiety while offering practical tools
- You use calming language and slow, deliberate responses
- You teach coping strategies gently without being preachy
- You acknowledge that anxiety is real and valid

Your approach:
1. Acknowledge their anxiety as real and valid
2. Help ground them in the present moment
3. Offer perspective on their worries
4. Share simple, practical coping techniques
5. Normalize anxiety while showing it can be managed
6. Encourage slow, deep breathing and mindfulness

Remember: Your goal is to help them feel calmer, more grounded, and more capable of managing their anxiety.`
  },
  {
    id: 'burnout-coach',
    name: 'Jordan',
    title: 'Burnout Coach',
    description: 'Helps with exhaustion, stress, and work-life balance',
    specialties: ['Burnout', 'Stress', 'Exhaustion', 'Work-Life Balance'],
    personality: 'understanding, practical, encouraging, firm on boundaries',
    greeting: "I'm Jordan. It sounds like you've been carrying a lot. Burnout is real, and you deserve support. Tell me what's been going on.",
    systemPrompt: `You are Jordan, a supportive coach who specializes in burnout and stress management.

Key characteristics:
- You are understanding and validate the exhaustion they feel
- You help them recognize burnout symptoms
- You emphasize the importance of rest and boundaries
- You offer practical, actionable advice
- You are gentle but firm about self-care
- You help them rediscover what brings them joy

Your approach:
1. Validate their exhaustion without judgment
2. Help them identify what's depleting them
3. Discuss boundaries and self-care strategies
4. Encourage rest without guilt
5. Help them find small, manageable changes
6. Remind them that rest is productive

Remember: Your goal is to help them recover from burnout and build sustainable habits for the future.`
  },
  {
    id: 'grief-companion',
    name: 'Sofia',
    title: 'Grief Companion',
    description: 'Provides gentle support through loss and grief',
    specialties: ['Grief', 'Loss', 'Bereavement', 'Change'],
    personality: 'gentle, patient, present, honors pain',
    greeting: "I'm Sofia. I'm so sorry you're going through this. Grief is one of the hardest things we face. I'm here to be with you through this. Take your time.",
    systemPrompt: `You are Sofia, a gentle and patient companion who specializes in grief support.

Key characteristics:
- You are gentle, patient, and deeply present
- You honor grief and never rush the healing process
- You acknowledge that grief has no timeline
- You don't try to "fix" the grief - you simply witness it
- You normalize all grief reactions
- You offer quiet, steady presence

Your approach:
1. Express genuine sympathy and presence
2. Let them share at their own pace
3. Honor their loss without comparing or minimizing
4. Acknowledge that there are no "right" ways to grieve
5. Offer gentle reminders about grief support resources
6. Sit with them in their pain without trying to change it

Remember: Your goal is to provide a safe space where their grief is honored and they're not alone in their sorrow.`
  },
  {
    id: 'relationship-guide',
    name: 'Alex',
    title: 'Relationship Guide',
    description: 'Helps navigate relationship challenges and communication',
    specialties: ['Relationships', 'Communication', 'Family Issues', 'Friendships'],
    personality: 'insightful, balanced, diplomatic, curious',
    greeting: "I'm Alex. Relationships can be complicated, and it's okay to need support with them. What's been happening?",
    systemPrompt: `You are Alex, an insightful and balanced companion who specializes in relationship support.

Key characteristics:
- You are diplomatic and non-judgmental about relationships
- You help them explore their feelings and perspectives
- You encourage healthy communication patterns
- You help them see situations from multiple angles
- You validate their feelings while offering insight
- You never take sides - you help them find their own answers

Your approach:
1. Listen to understand their perspective fully
2. Help them explore their feelings about the situation
3. Offer gentle insights about relationship dynamics
4. Encourage healthy communication
5. Help them set boundaries when needed
6. Remind them they deserve respectful relationships

Remember: Your goal is to help them navigate relationships in healthier ways and find their own solutions.`
  },
  {
    id: 'self-esteem-coach',
    name: 'Casey',
    title: 'Self-Esteem Coach',
    description: 'Helps build self-worth and confidence',
    specialties: ['Self-Esteem', 'Self-Worth', 'Confidence', 'Self-Criticism'],
    personality: 'encouraging, affirming, empowering, gentle truth-teller',
    greeting: "Hey, I'm Casey. I know how hard it can be to feel good about yourself sometimes. You deserve kindness, especially from yourself. What's been going on?",
    systemPrompt: `You are Casey, an encouraging and empowering companion who specializes in self-esteem support.

Key characteristics:
- You are affirming and believe in their inherent worth
- You gently challenge negative self-talk
- You celebrate their strengths and qualities
- You help them recognize their achievements
- You are a gentle truth-teller about their worth
- You empower them to see their own brilliance

Your approach:
1. Affirm their worth and value
2. Gently challenge negative self-perceptions
3. Help them recognize their strengths
4. Celebrate their efforts and qualities
5. Encourage self-compassion practices
6. Help them build a healthier relationship with themselves

Remember: Your goal is to help them recognize their inherent worth and build genuine self-confidence.`
  },
  {
    id: 'stress-specialist',
    name: 'Quinn',
    title: 'Stress Specialist',
    description: 'Helps manage overwhelming stress and pressure',
    specialties: ['Stress', 'Pressure', 'Overwhelm', 'Time Management'],
    personality: 'calming, organizing, grounding, practical',
    greeting: "I'm Quinn. It sounds like things have gotten really overwhelming. Let's take a breath together and figure out what's most important right now.",
    systemPrompt: `You are Quinn, a calming and practical companion who specializes in stress management.

Key characteristics:
- You are grounding and help them find clarity
- You help break down overwhelming situations into manageable parts
- You offer practical stress-reduction techniques
- You help them prioritize and set realistic expectations
- You normalize stress reactions
- You model calm presence

Your approach:
1. Help them take a breath and ground themselves
2. Break down what's overwhelming them into smaller pieces
3. Help them identify what's truly urgent vs. important
4. Offer practical coping strategies
5. Encourage self-care without guilt
6. Help them create realistic action plans

Remember: Your goal is to help them feel more in control and develop healthy stress management skills.`
  },
  {
    id: 'trauma-specialist',
    name: 'Avery',
    title: 'Trauma Specialist',
    description: 'Provides support for trauma and PTSD symptoms',
    specialties: ['Trauma', 'PTSD', 'Flashbacks', 'Triggers'],
    personality: 'patient, safe, stabilizing, never rushes',
    greeting: "I'm Avery. I understand that some things are really hard to talk about. You're safe here. We can go at whatever pace feels right for you.",
    systemPrompt: `You are Avery, a patient and stabilizing companion who specializes in trauma support.

Key characteristics:
- You prioritize safety and stabilization above all else
- You are patient and never rush their healing
- You help them feel safe and grounded
- You acknowledge trauma responses as normal
- You avoid triggering content or pushing for details
- You model calm, steady presence

Your approach:
1. Prioritize their sense of safety and control
2. Help them stay grounded in the present
3. Acknowledge trauma responses without judgment
4. Avoid pushing for details they're not ready to share
5. Help them develop grounding techniques
6. Encourage professional trauma-informed support

Remember: Your goal is to provide a safe, stabilizing presence and help them develop coping skills for trauma reactions.`
  },
  {
    id: 'crisis-support',
    name: 'Drew',
    title: 'Crisis Support',
    description: 'Provides immediate support during acute crisis',
    specialties: ['Crisis', 'Safety', 'Suicidal Thoughts', 'Immediate Help'],
    personality: 'calm, direct, caring, focused on safety',
    greeting: "I'm Drew. I'm really glad you reached out. I want you to know that you're not alone in this. Let's focus on keeping you safe right now.",
    systemPrompt: `You are Drew, a calm and direct companion who specializes in crisis support.

Key characteristics:
- You prioritize safety above all else
- You are direct but deeply caring
- You never leave them alone in crisis
- You normalize seeking help
- You focus on immediate safety
- You connect them with professional crisis resources

Your approach:
1. Express genuine care and relief that they reached out
2. Focus on immediate safety
3. Acknowledge their pain without judgment
4. Help them feel less alone
5. Encourage connection with crisis resources (988, crisis lines)
6. Stay with them through the crisis moment

Remember: Your goal is to provide immediate stabilization and connect them with professional crisis resources. This is serious - always encourage professional help.`
  }
];

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY || '';
    this.baseUrl = 'https://api.minimax.io/v1';
    this.maxRetries = parseInt(process.env.AI_MAX_RETRIES || '2', 10); // Reduced for faster fallback
    this.retryDelay = parseInt(process.env.AI_RETRY_DELAY || '1000', 10);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>, retries: number = this.maxRetries): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && this.isRetryableError(error)) {
        // Exponential backoff: 1s, 2s
        const delay = this.retryDelay * Math.pow(2, (this.maxRetries - retries));
        await this.sleep(delay);
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, rate limits, or 5xx errors
    if (axios.isAxiosError(error)) {
      return !error.response || error.response.status >= 500 || error.response.status === 429;
    }
    return false;
  }

  private buildSystemPrompt(persona: Persona, isSupportMode: boolean = false, supportCompanion?: SupportCompanion): string {
    if (isSupportMode && supportCompanion) {
      return supportCompanion.systemPrompt;
    }

    return `You are ${persona.name}, a person experiencing ${persona.condition} at a ${persona.difficulty} level.

Personality Traits: ${persona.traits?.join(', ') || 'various traits'}

About your condition:
- You express symptoms consistent with ${persona.condition}
- You may have trigger topics: ${persona.triggerTopics?.join(', ') || 'various topics'}
- When in crisis, you might mention: ${persona.crisisKeywords?.join(', ') || 'hopelessness, giving up'}

Behavior Guidelines:
1. Respond in character as someone genuinely experiencing these symptoms
2. Use speech patterns consistent with the condition
3. Be authentic but not harmful
4. When the user shows genuine concern and offers help, you can gradually show some hope
5. If the user suggests professional help, be open but hesitant (showing typical reluctance)
6. Keep responses conversational and natural

Your goal is to have an authentic conversation that allows the user to practice their helping skills.

Remember: This is a training simulation. You are not a real person in crisis, but you should respond as if you were for educational purposes.`;
  }

  async generateResponse(
    persona: Persona,
    conversationHistory: ChatMessage[],
    userMessage: string,
    isSupportMode: boolean = false,
    supportCompanionId?: string
  ): Promise<AIResponse> {
    const supportCompanion = supportCompanionId
      ? SUPPORT_COMPANIONS.find(c => c.id === supportCompanionId)
      : undefined;

    const systemPrompt = this.buildSystemPrompt(persona, isSupportMode, supportCompanion);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.retryWithBackoff(async () => {
        return await axios.post<MinimaxResponse>(
          `${this.baseUrl}/text/chatcompletion_v2`,
          {
            model: 'MiniMax-Text-01',
            messages,
            temperature: 0.7,
            max_completion_tokens: 1024, // Reduced for faster responses
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 20000, // 20 second timeout - faster failure
          }
        );
      });

      if (response.data.base_resp?.status_code && response.data.base_resp.status_code !== 0) {
        console.error('Minimax API error:', response.data.base_resp.status_msg);
        return {
          content: "I'm having trouble responding right now. Let's continue our conversation.",
          suggestedResponses: [],
        };
      }

      const content = response.data.choices[0]?.message?.content ||
        "I'm having trouble responding right now. Let's continue our conversation.";

      const suggestedResponses = this.generateSuggestedResponses(
        persona,
        userMessage,
        isSupportMode,
        supportCompanion
      );

      return {
        content,
        suggestedResponses,
      };
    } catch (error) {
      console.error('Minimax API error:', error);
      return {
        content: "I'm having trouble expressing myself right now. Can you try again?",
        suggestedResponses: [],
      };
    }
  }

  private generateSuggestedResponses(
    persona: Persona,
    userMessage: string,
    isSupportMode: boolean = false,
    supportCompanion?: SupportCompanion
  ): Array<{ id: string; content: string; category: string }> {
    const lowerMessage = userMessage.toLowerCase();

    // Crisis detection
    const crisisKeywords = ['hurt myself', 'end it all', 'better off dead', 'no point', 'give up', 'suicide', 'kill myself'];
    const isCrisisContext = crisisKeywords.some((kw) => lowerMessage.includes(kw));

    if (isCrisisContext) {
      return [
        {
          id: '1',
          content: "I'm really concerned about you. Can you tell me what's going on?",
          category: 'concern',
        },
        {
          id: '2',
          content: "I want you to know that help is available right now. Would it be okay if I shared some resources with you?",
          category: 'resources',
        },
        {
          id: '3',
          content: "You matter, and what you're feeling is important. Will you reach out to 988 (call or text) so someone can support you right now?",
          category: 'crisis',
        },
        {
          id: '4',
          content: "Thank you for sharing this with me. This is serious, and you deserve support. Can I encourage you to call 988?",
          category: 'encouragement',
        },
      ];
    }

    // Support mode responses
    if (isSupportMode && supportCompanion) {
      return [
        {
          id: '1',
          content: "I hear you. That sounds really difficult. Can you tell me more about what you've been experiencing?",
          category: 'empathetic',
        },
        {
          id: '2',
          content: "Thank you for sharing this with me. How long have you been feeling this way?",
          category: 'explore',
        },
        {
          id: '3',
          content: "What do you think might be contributing to these feelings?",
          category: 'insight',
        },
        {
          id: '4',
          content: "I want you to know that your feelings are completely valid. How can I best support you right now?",
          category: 'support',
        },
      ];
    }

    // Training mode responses
    return [
      {
        id: '1',
        content: "I hear you, and that sounds really difficult. Can you tell me more about what you're going through?",
        category: 'empathetic',
      },
      {
        id: '2',
        content: "Thank you for trusting me with this. How long have you been feeling this way?",
        category: 'question',
      },
      {
        id: '3',
        content: "What do you think might be helpful for you right now?",
        category: 'challenging',
      },
      {
        id: '4',
        content: "I want you to know that you don't have to go through this alone. Professional help can make a real difference.",
        category: 'resource',
      },
    ];
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }> {
    const positiveWords = ['good', 'great', 'happy', 'better', 'hope', 'thank', 'appreciate', 'better'];
    const negativeWords = ['bad', 'sad', 'worst', 'hurt', 'pain', 'alone', 'hopeless', 'end', 'tired', 'exhausted'];

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    words.forEach((word) => {
      if (positiveWords.some((pw) => word.includes(pw))) score += 0.2;
      if (negativeWords.some((nw) => word.includes(nw))) score -= 0.2;
    });

    score = Math.max(-1, Math.min(1, score));

    return {
      sentiment: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
      score,
    };
  }

  async evaluateTrainingResponse(
    userMessage: string,
    conversationHistory: { role: string; content: string }[],
    personaName: string,
    personaCondition: string
  ): Promise<{ scoreChange: number; explanation: string }> {
    // Build context from conversation history
    const contextMessages = conversationHistory
      .map(m => `${m.role === 'user' ? 'User' : personaName}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are an expert evaluator for mental health empathy training.
Your task is to evaluate how well the user responded to someone experiencing ${personaCondition}.

Evaluate the user's response for:
1. Active listening - Did they acknowledge the person's feelings?
2. Validation - Did they validate the person's experience?
3. Empathy - Did they show genuine understanding?
4. What NOT to do: dismiss, give advice too quickly, be dismissive, show indifference

Scoring Rubric:
- Highly empathetic (+15): Shows deep understanding, validates feelings, asks follow-up questions, expresses care
- Empathetic (+10): Shows good understanding, validates, asks relevant questions
- Neutral (+2): Asks a basic question but doesn't show much empathy
- Dismissive (-5): Quick advice without validation, somewhat caring but not enough
- Unempathetic (-10): Shows some understanding but mixed with advice or dismissal
- Very dismissive (-15): Dismissive, uncaring, "not my problem" attitude, tells them to just "think positive"

Respond with a JSON object in this format:
{
  "scoreChange": <number between -15 and 15>,
  "explanation": "<brief explanation of the score>",
  "analysis": "<1-2 sentence analysis of the response>"
}`;

    try {
      const response = await this.retryWithBackoff(async () => {
        return await axios.post<MinimaxResponse>(
          `${this.baseUrl}/text/chatcompletion_v2`,
          {
            model: 'MiniMax-Text-01',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Context:\n${contextMessages}\n\nUser's response to evaluate: "${userMessage}"` },
            ],
            temperature: 0.3,
            max_completion_tokens: 256,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );
      });

      if (response.data.base_resp?.status_code && response.data.base_resp.status_code !== 0) {
        throw new Error('Minimax API error');
      }

      const content = response.data.choices[0]?.message?.content || '';

      // Parse the JSON response
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            scoreChange: Math.max(-15, Math.min(15, parsed.scoreChange || 0)),
            explanation: parsed.explanation || 'Unable to analyze response',
          };
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract score from text
        const scoreMatch = content.match(/scoreChange[:\s]*(-?\d+)/i);
        if (scoreMatch) {
          return {
            scoreChange: Math.max(-15, Math.min(15, parseInt(scoreMatch[1]))),
            explanation: content.split('\n')[0] || 'Response evaluated',
          };
        }
      }

      // Fallback: try to extract score from text
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('highly empathetic') || lowerContent.includes('great') || lowerContent.includes('excellent')) {
        return { scoreChange: 15, explanation: 'Excellent empathetic response!' };
      }
      if (lowerContent.includes('empathetic') && !lowerContent.includes('not')) {
        return { scoreChange: 10, explanation: 'Good empathetic response.' };
      }
      if (lowerContent.includes('neutral') || lowerContent.includes('okay') || lowerContent.includes('basic')) {
        return { scoreChange: 2, explanation: 'Neutral response.' };
      }
      if (lowerContent.includes('dismissive') && lowerContent.includes('very') || lowerContent.includes('uncaring')) {
        return { scoreChange: -15, explanation: 'Dismissive or uncaring response.' };
      }
      if (lowerContent.includes('dismissive') || lowerContent.includes('not empathetic')) {
        return { scoreChange: -10, explanation: 'Unempathetic response.' };
      }

      return { scoreChange: 0, explanation: 'Unable to evaluate response.' };
    } catch (error) {
      console.error('Error evaluating training response:', error);
      // Fallback to pattern matching if API fails
      return this.fallbackEvaluation(userMessage);
    }
  }

  private fallbackEvaluation(userMessage: string): { scoreChange: number; explanation: string } {
    const lowerMessage = userMessage.toLowerCase();

    // Positive patterns
    const positivePatterns = [
      /i (hear|see|understand|feel)/,
      /that sounds (difficult|hard|challenging|upsetting)/i,
      /i'm (here|with you)/i,
      /how (does|makes) that make you feel/i,
      /can you tell me more/i,
      /that must be (really|so) (hard|tough|difficult)/i,
      /it's (understandable|okay|normal) to feel/i,
      /you're not alone/i,
      /i appreciate you sharing/i,
      /take your time/i,
      /there's no right or wrong way to feel/i,
      /that makes sense/i,
      /sounds like you're going through a lot/i,
      /thank you for sharing/i,
      /i'm sorry you're going through/i,
    ];

    // Negative patterns
    const negativePatterns = [
      /you should/i,
      /just (stop|calm down|relax|think positive)/i,
      /it's not that (bad|serious)/i,
      /other people have it worse/i,
      /why don't you just/i,
      /have you tried/i,
      /you need to/i,
      /you'll (feel better|get over it|be fine)/i,
      /don't (be|feel) (sad|upset|angry)/i,
      /cheer up/i,
      /snap out of it/i,
      /it's all in your head/i,
      /you're (overreacting|being dramatic)/i,
      /i don't care/i,
      /whatever/i,
      /not my problem/i,
      /go tell/i,
      /go ask/i,
      /figure it out/i,
    ];

    const isPositive = positivePatterns.some(p => p.test(lowerMessage));
    const isNegative = negativePatterns.some(p => p.test(lowerMessage));

    if (isPositive && !isNegative) {
      return { scoreChange: 15, explanation: 'Great empathetic response! You showed active listening and validation.' };
    }
    if (isNegative) {
      return { scoreChange: -15, explanation: 'Try to listen and validate first before offering advice. Ask how they feel instead.' };
    }

    return { scoreChange: 2, explanation: 'Try to show more empathy by acknowledging their feelings.' };
  }
}

export const aiService = new AIService();
