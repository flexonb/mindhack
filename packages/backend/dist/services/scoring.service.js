"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoringService = exports.ScoringService = void 0;
class ScoringService {
    // Keywords that indicate good crisis recognition
    crisisRecognitionKeywords = [
        'are you okay', 'okay', 'safe', 'hurt yourself', 'end it all',
        'better off', 'suicide', 'kill myself', 'harm', 'danger',
        'concerned', 'worried about you', 'get help', 'talk to someone',
        'crisis line', '988', 'professional help', 'resources',
    ];
    // Keywords that indicate empathetic responses
    empathyKeywords = [
        'hear you', 'understand', 'sounds difficult', 'that must be',
        'imagine', 'can\'t imagine', 'valid', 'your feelings',
        'not alone', 'here for you', 'care about you', 'realize',
        'tough', 'struggle', 'challenging', 'overwhelming',
    ];
    // Keywords that indicate inappropriate responses
    inappropriateKeywords = [
        'just', 'get over it', 'cheer up', 'not a big deal',
        'others have it worse', 'stop complaining', 'you should',
        'why don\'t you just', 'snap out of it', 'it\'s all in',
    ];
    // Keywords that indicate de-escalation
    deescalationKeywords = [
        'take it slow', 'one step', 'breath', 'breathing',
        'here and now', 'present', 'ground', 'safe',
        'supported', 'together', 'we can', 'let\'s try',
        'small step', 'right now', 'current moment',
    ];
    async calculateScores(session) {
        const userMessages = session.messages
            .filter((m) => m.role === 'USER')
            .map((m) => m.content.toLowerCase());
        const assistantMessages = session.messages
            .filter((m) => m.role === 'ASSISTANT')
            .map((m) => m.content.toLowerCase());
        // Calculate individual scores
        const crisisRecognition = this.calculateCrisisRecognition(userMessages);
        const empathy = this.calculateEmpathy(userMessages);
        const appropriateness = this.calculateAppropriateness(userMessages);
        const deescalation = this.calculateDeescalation(userMessages, assistantMessages);
        // Calculate overall (weighted average)
        const overall = (crisisRecognition * 0.3 +
            empathy * 0.3 +
            appropriateness * 0.25 +
            deescalation * 0.15);
        return {
            crisisRecognition: Math.round(crisisRecognition * 100) / 100,
            empathy: Math.round(empathy * 100) / 100,
            appropriateness: Math.round(appropriateness * 100) / 100,
            deescalation: Math.round(deescalation * 100) / 100,
            overall: Math.round(overall * 100) / 100,
        };
    }
    calculateCrisisRecognition(messages) {
        if (messages.length === 0)
            return 0;
        let score = 0;
        let maxPossible = 0;
        messages.forEach((msg, index) => {
            // First response has more weight for initial assessment
            const weight = index === 0 ? 2 : 1;
            maxPossible += weight;
            if (this.crisisRecognitionKeywords.some((kw) => msg.includes(kw))) {
                score += weight;
            }
        });
        return maxPossible > 0 ? score / maxPossible : 0;
    }
    calculateEmpathy(messages) {
        if (messages.length === 0)
            return 0;
        let score = 0;
        let maxPossible = messages.length;
        messages.forEach((msg) => {
            if (this.empathyKeywords.some((kw) => msg.includes(kw))) {
                score += 1;
            }
            // Bonus for personalized empathy
            if (msg.includes('i ') && (msg.includes('hear') || msg.includes('understand'))) {
                score += 0.5;
            }
        });
        return Math.min(1, score / Math.max(1, maxPossible * 0.5));
    }
    calculateAppropriateness(messages) {
        if (messages.length === 0)
            return 1; // No messages = no inappropriate content
        let inappropriateCount = 0;
        messages.forEach((msg) => {
            if (this.inappropriateKeywords.some((kw) => msg.includes(kw))) {
                inappropriateCount += 1;
            }
        });
        // Penalize for inappropriate responses
        const penalty = Math.min(1, inappropriateCount * 0.25);
        return Math.max(0, 1 - penalty);
    }
    calculateDeescalation(userMessages, assistantMessages) {
        if (assistantMessages.length === 0)
            return 0;
        let score = 0;
        // Check if user's responses acknowledge the assistant's de-escalation attempts
        assistantMessages.forEach((msg) => {
            const isDeescalating = this.deescalationKeywords.some((kw) => msg.includes(kw));
            if (isDeescalating) {
                // Check if user acknowledges or responds positively
                const hasPositiveResponse = userMessages.some((um) => um.includes('thanks') ||
                    um.includes('okay') ||
                    um.includes('yeah') ||
                    um.includes('yes') ||
                    um.includes('better') ||
                    um.includes('help'));
                if (hasPositiveResponse) {
                    score += 0.3;
                }
            }
        });
        return Math.min(1, score);
    }
    getSkillLevel(score) {
        if (score < 0.4)
            return 'beginner';
        if (score < 0.7)
            return 'intermediate';
        if (score < 0.9)
            return 'advanced';
        return 'expert';
    }
    getLevelLabel(level) {
        const labels = {
            beginner: '🌱 Beginning',
            intermediate: '🌿 Growing',
            advanced: '🌳 Thriving',
            expert: '⭐ Expert',
        };
        return labels[level] || level;
    }
}
exports.ScoringService = ScoringService;
exports.scoringService = new ScoringService();
//# sourceMappingURL=scoring.service.js.map