"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = exports.SUPPORT_COMPANIONS = void 0;
const axios_1 = __importDefault(require("axios"));
exports.SUPPORT_COMPANIONS = [
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
    }
];
class AIService {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = process.env.MINIMAX_API_KEY || '';
        this.baseUrl = 'https://api.minimax.io/v1';
    }
    buildSystemPrompt(persona, isSupportMode = false, supportCompanion) {
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
    async generateResponse(persona, conversationHistory, userMessage, isSupportMode = false, supportCompanionId) {
        const supportCompanion = supportCompanionId
            ? exports.SUPPORT_COMPANIONS.find(c => c.id === supportCompanionId)
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
            const response = await axios_1.default.post(`${this.baseUrl}/text/chatcompletion_v2`, {
                model: 'MiniMax-Text-01',
                messages,
                temperature: 0.7,
                max_completion_tokens: 2048,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
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
            const suggestedResponses = this.generateSuggestedResponses(persona, userMessage, isSupportMode, supportCompanion);
            return {
                content,
                suggestedResponses,
            };
        }
        catch (error) {
            console.error('Minimax API error:', error);
            return {
                content: "I'm having trouble expressing myself right now. Can you try again?",
                suggestedResponses: [],
            };
        }
    }
    generateSuggestedResponses(persona, userMessage, isSupportMode = false, supportCompanion) {
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
    async analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'happy', 'better', 'hope', 'thank', 'appreciate', 'better'];
        const negativeWords = ['bad', 'sad', 'worst', 'hurt', 'pain', 'alone', 'hopeless', 'end', 'tired', 'exhausted'];
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        words.forEach((word) => {
            if (positiveWords.some((pw) => word.includes(pw)))
                score += 0.2;
            if (negativeWords.some((nw) => word.includes(nw)))
                score -= 0.2;
        });
        score = Math.max(-1, Math.min(1, score));
        return {
            sentiment: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
            score,
        };
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map