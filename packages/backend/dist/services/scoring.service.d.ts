import { TrainingSession } from '@prisma/client';
interface SessionScores {
    crisisRecognition: number;
    empathy: number;
    appropriateness: number;
    deescalation: number;
    overall: number;
}
export declare class ScoringService {
    private crisisRecognitionKeywords;
    private empathyKeywords;
    private inappropriateKeywords;
    private deescalationKeywords;
    calculateScores(session: TrainingSession & {
        messages: any[];
    }): Promise<SessionScores>;
    private calculateCrisisRecognition;
    private calculateEmpathy;
    private calculateAppropriateness;
    private calculateDeescalation;
    getSkillLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert';
    getLevelLabel(level: string): string;
}
export declare const scoringService: ScoringService;
export {};
//# sourceMappingURL=scoring.service.d.ts.map