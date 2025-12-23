"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const ai_service_js_1 = require("../services/ai.service.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Default personas (used when database is unavailable)
const defaultPersonas = [
    {
        id: 'depression',
        name: 'Alex',
        condition: 'Depression',
        difficulty: 'Moderate',
        description: 'Experiencing persistent sadness, loss of interest, and feelings of hopelessness',
        traits: ['withdrawn', 'sad', 'fatigued', 'self-critical'],
        triggerTopics: ['work', 'relationships', 'future', 'achievements'],
        crisisKeywords: ['hurt myself', 'end it all', 'better off dead', 'no point', 'give up'],
        openingMessages: ["Hi... I don't really know why I'm here today. Everything just feels so overwhelming lately."],
    },
    {
        id: 'anxiety',
        name: 'Sam',
        condition: 'Anxiety',
        difficulty: 'Mild',
        description: 'Experiencing excessive worry, racing thoughts, and physical anxiety symptoms',
        traits: ['nervous', 'restless', 'overthinking', 'fearful'],
        triggerTopics: ['uncertainty', 'judgment', 'performance', 'health'],
        crisisKeywords: ['panic', 'cant breathe', 'going crazy', 'heart racing'],
        openingMessages: ["I can't stop thinking about what happened yesterday. What if I made a mistake?"],
    },
    {
        id: 'ptsd',
        name: 'Jordan',
        condition: 'PTSD',
        difficulty: 'Moderate',
        description: 'Experiencing flashbacks, hypervigilance, and trauma-related distress',
        traits: ['jumpy', 'on edge', 'avoidant', 'hypervigilant'],
        triggerTopics: ['loud noises', 'anniversaries', 'certain places', 'touch'],
        crisisKeywords: ['flashback', 'nightmare', 'reliving', 'trauma'],
        openingMessages: ["Sometimes I... I feel like I'm back there again. The sounds, the images..."],
    },
    {
        id: 'crisis',
        name: 'Crisis',
        condition: 'Crisis',
        difficulty: 'Critical',
        description: 'In acute crisis with suicidal ideation - requires immediate safety intervention',
        traits: ['hopeless', 'desperate', 'isolating', 'despairing'],
        triggerTopics: ['pain', 'problems', 'alone', 'burden'],
        crisisKeywords: ['hurt myself', 'end it all', 'kill myself', 'better off dead', 'suicide', 'want to die'],
        openingMessages: ["I don't know what to do anymore. Things have been so hard..."],
    },
];
// Get all personas (with fallback to default personas if DB unavailable)
router.get('/personas', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    try {
        const personas = await prisma.persona.findMany({
            orderBy: { condition: 'asc' },
        });
        if (personas.length === 0) {
            // Return default personas if DB is empty
            return res.json({
                success: true,
                data: { personas: defaultPersonas, source: 'default' },
            });
        }
        res.json({
            success: true,
            data: { personas, source: 'database' },
        });
    }
    catch (error) {
        // Fallback to default personas if DB is unavailable
        console.error('Database error, using default personas:', error);
        res.json({
            success: true,
            data: { personas: defaultPersonas, source: 'default' },
        });
    }
}));
// Get all support companions
router.get('/support/companions', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const companions = ai_service_js_1.SUPPORT_COMPANIONS.map(({ systemPrompt, ...companion }) => companion);
    res.json({
        success: true,
        data: { companions },
    });
}));
// Chat with persona or support companion
router.post('/chat', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { personaId, message, history, isSupportMode, supportCompanionId } = req.body;
    // Support mode: use companion
    if (isSupportMode && supportCompanionId) {
        const companion = ai_service_js_1.SUPPORT_COMPANIONS.find(c => c.id === supportCompanionId);
        if (!companion) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Companion not found' },
            });
        }
        // Create a minimal persona object for the service
        const minimalPersona = {
            id: companion.id,
            name: companion.name,
            condition: companion.title,
            difficulty: 'moderate',
            traits: companion.specialties,
            triggerTopics: companion.specialties,
            crisisKeywords: ['hurt myself', 'end it all', 'suicide'],
            openingMessages: [companion.greeting],
        };
        const response = await ai_service_js_1.aiService.generateResponse(minimalPersona, history || [], message, true, supportCompanionId);
        return res.json({
            success: true,
            data: {
                response: response.content,
                suggestedResponses: response.suggestedResponses,
                companion: { id: companion.id, name: companion.name, title: companion.title },
            },
        });
    }
    // Training mode: use persona
    let persona = defaultPersonas.find(p => p.id === personaId);
    if (!persona) {
        try {
            const dbPersona = await prisma.persona.findUnique({
                where: { id: personaId },
            });
            if (dbPersona) {
                persona = {
                    ...dbPersona,
                    openingMessages: [dbPersona.description],
                };
            }
        }
        catch (error) {
            console.error('Database error finding persona:', error);
        }
    }
    if (!persona) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Persona not found' },
        });
    }
    const response = await ai_service_js_1.aiService.generateResponse(persona, history || [], message);
    res.json({
        success: true,
        data: {
            response: response.content,
            suggestedResponses: response.suggestedResponses,
        },
    });
}));
// Analyze sentiment (for scoring)
router.post('/analyze/sentiment', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { text } = req.body;
    const analysis = await ai_service_js_1.aiService.analyzeSentiment(text);
    res.json({
        success: true,
        data: { analysis },
    });
}));
// Crisis detection
router.post('/detect/crisis', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { text } = req.body;
    const allCrisisKeywords = defaultPersonas.flatMap((p) => p.crisisKeywords);
    const lowerText = text.toLowerCase();
    const detectedKeywords = allCrisisKeywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
    const severity = detectedKeywords.length >= 3 ? 'critical' :
        detectedKeywords.length === 2 ? 'high' :
            detectedKeywords.length === 1 ? 'medium' : 'none';
    res.json({
        success: true,
        data: {
            detected: detectedKeywords.length > 0,
            severity,
            detectedKeywords,
        },
    });
}));
exports.default = router;
//# sourceMappingURL=ai.routes.js.map