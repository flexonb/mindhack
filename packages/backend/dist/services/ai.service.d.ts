import { Persona, ChatMessage } from '@mindhack/shared';
interface AIResponse {
    content: string;
    suggestedResponses: Array<{
        id: string;
        content: string;
        category: string;
    }>;
}
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
export declare const SUPPORT_COMPANIONS: SupportCompanion[];
export declare class AIService {
    private apiKey;
    private baseUrl;
    constructor();
    private buildSystemPrompt;
    generateResponse(persona: Persona, conversationHistory: ChatMessage[], userMessage: string, isSupportMode?: boolean, supportCompanionId?: string): Promise<AIResponse>;
    private generateSuggestedResponses;
    analyzeSentiment(text: string): Promise<{
        sentiment: 'positive' | 'neutral' | 'negative';
        score: number;
    }>;
}
export declare const aiService: AIService;
export {};
//# sourceMappingURL=ai.service.d.ts.map