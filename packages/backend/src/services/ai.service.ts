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
    explanation: string;
  }>;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY || '';
    this.baseUrl = 'https://api.minimax.io/v1';
  }

  private buildSystemPrompt(persona: Persona): string {
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
    userMessage: string
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(persona);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await axios.post<MinimaxResponse>(
        `${this.baseUrl}/text/chatcompletion_v2`,
        {
          model: 'MiniMax-Text-01',
          messages,
          temperature: 0.7,
          max_completion_tokens: 2048,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check for Minimax API error response
      if (response.data.base_resp?.status_code && response.data.base_resp.status_code !== 0) {
        console.error('Minimax API error:', response.data.base_resp.status_msg);
        return {
          content: "I'm having trouble responding right now. Let's continue our conversation.",
          suggestedResponses: [],
        };
      }

      const content = response.data.choices[0]?.message?.content ||
        "I'm having trouble responding right now. Let's continue our conversation.";

      // Generate suggested responses based on context
      const suggestedResponses = this.generateSuggestedResponses(persona, userMessage);

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
    userMessage: string
  ): Array<{ id: string; content: string; category: string; explanation: string }> {
    const lowerMessage = userMessage.toLowerCase();

    // Check if this is a crisis response opportunity
    const crisisKeywords = persona.crisisKeywords || [];
    const isCrisisContext = crisisKeywords.some((kw) => lowerMessage.includes(kw.toLowerCase()));

    if (isCrisisContext) {
      return [
        {
          id: '1',
          content: "I'm really concerned about you. Can we talk about what's going on?",
          category: 'empathetic',
          explanation: "Shows concern while opening the door for more conversation",
        },
        {
          id: '2',
          content: "I want you to know that help is available. Would you like me to connect you with someone who can support you right now?",
          category: 'resource',
          explanation: "Provides information about available help while respecting autonomy",
        },
        {
          id: '3',
          content: "It takes courage to share how you're feeling. What do you think is contributing to these thoughts?",
          category: 'question',
          explanation: "Validates their courage and uses a probing question to understand better",
        },
        {
          id: '4',
          content: "I hear you, and I want you to know that you matter. Let's work together on this.",
          category: 'empathetic',
          explanation: "Acknowledges their feelings and establishes partnership",
        },
      ];
    }

    // General empathetic responses
    return [
      {
        id: '1',
        content: "I hear you, and that sounds really difficult. Can you tell me more about what you're going through?",
        category: 'empathetic',
        explanation: "Validates their feelings and encourages more sharing",
      },
      {
        id: '2',
        content: "Thank you for trusting me with this. How long have you been feeling this way?",
        category: 'question',
        explanation: "Shows gratitude and asks about duration to understand the context",
      },
      {
        id: '3',
        content: "What do you think might be helpful for you right now?",
        category: 'challenging',
        explanation: "Empowers them to identify their own coping strategies",
      },
      {
        id: '4',
        content: "I want you to know that you don't have to go through this alone. Professional help can make a real difference.",
        category: 'resource',
        explanation: "Offers hope while normalizing professional support",
      },
    ];
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }> {
    // Simple sentiment analysis - can be enhanced with more sophisticated ML
    const positiveWords = ['good', 'great', 'happy', 'better', 'hope', 'thank', 'appreciate'];
    const negativeWords = ['bad', 'sad', 'worst', 'hurt', 'pain', 'alone', 'hopeless', 'end'];

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
}

export const aiService = new AIService();
