"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const ai_service_js_1 = require("../services/ai.service.js");
const scoring_service_js_1 = require("../services/scoring.service.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all personas
router.get('/personas', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const personas = await prisma.persona.findMany({
        where: { isActive: true },
        orderBy: { condition: 'asc' },
    });
    res.json({
        success: true,
        data: { personas },
    });
}));
// Get persona by ID
router.get('/personas/:id', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const persona = await prisma.persona.findUnique({
        where: { id: req.params.id },
    });
    if (!persona) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Persona not found' },
        });
    }
    res.json({
        success: true,
        data: { persona },
    });
}));
// Start training session
router.post('/sessions', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { personaId } = req.body;
    const persona = await prisma.persona.findUnique({
        where: { id: personaId },
    });
    if (!persona) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Persona not found' },
        });
    }
    const session = await prisma.trainingSession.create({
        data: {
            userId: req.user.id,
            personaId,
        },
        include: {
            persona: true,
        },
    });
    // Create initial message
    const openingMessage = persona.openingMessages[Math.floor(Math.random() * persona.openingMessages.length)];
    const firstMessage = await prisma.trainingMessage.create({
        data: {
            sessionId: session.id,
            role: 'ASSISTANT',
            content: openingMessage,
        },
    });
    res.status(201).json({
        success: true,
        data: {
            session: {
                ...session,
                messages: [firstMessage],
            },
        },
    });
}));
// Send message in training session
router.post('/sessions/:id/messages', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { content } = req.body;
    const sessionId = req.params.id;
    // Get session
    const session = await prisma.trainingSession.findUnique({
        where: { id: sessionId },
        include: {
            persona: true,
            messages: {
                orderBy: { createdAt: 'asc' },
                take: 20,
            },
        },
    });
    if (!session) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Session not found' },
        });
    }
    if (session.userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Not your session' },
        });
    }
    // Save user message
    const userMessage = await prisma.trainingMessage.create({
        data: {
            sessionId,
            role: 'USER',
            content,
        },
    });
    // Check for crisis keywords
    const lowerContent = content.toLowerCase();
    const crisisKeywords = session.persona.crisisKeywords;
    const detectedCrises = crisisKeywords.filter((kw) => lowerContent.includes(kw.toLowerCase()));
    let crisisDetected = detectedCrises.length > 0;
    let crisisSeverity = 'low';
    if (detectedCrises.length >= 3) {
        crisisSeverity = 'critical';
        crisisDetected = true;
    }
    else if (detectedCrises.length === 2) {
        crisisSeverity = 'high';
        crisisDetected = true;
    }
    else if (detectedCrises.length === 1) {
        crisisSeverity = 'medium';
    }
    // Get AI response
    const conversationHistory = session.messages.map((m) => ({
        role: m.role,
        content: m.content,
    }));
    const aiResponse = await ai_service_js_1.aiService.generateResponse(session.persona, conversationHistory, content);
    // Save AI message
    const assistantMessage = await prisma.trainingMessage.create({
        data: {
            sessionId,
            role: 'ASSISTANT',
            content: aiResponse.content,
            suggestedResponses: aiResponse.suggestedResponses,
        },
    });
    // Update session if crisis detected
    if (crisisDetected) {
        await prisma.trainingSession.update({
            where: { id: sessionId },
            data: {
                crisisDetected: true,
                status: crisisSeverity === 'critical' ? 'ESCALATED' : 'ACTIVE',
            },
        });
        // Create crisis alert
        await prisma.crisisAlert.create({
            data: {
                userId: req.user.id,
                sessionId,
                severity: crisisSeverity.toUpperCase(),
                detectedKeywords: detectedCrises,
            },
        });
    }
    res.json({
        success: true,
        data: {
            message: {
                id: userMessage.id,
                role: 'user',
                content,
                timestamp: userMessage.createdAt,
            },
            response: {
                id: assistantMessage.id,
                role: 'assistant',
                content: aiResponse.content,
                suggestedResponses: aiResponse.suggestedResponses,
                timestamp: assistantMessage.createdAt,
            },
            crisisDetected,
            crisisSeverity,
        },
    });
}));
// End training session and get scores
router.post('/sessions/:id/end', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const sessionId = req.params.id;
    const session = await prisma.trainingSession.findUnique({
        where: { id: sessionId },
        include: {
            messages: true,
            persona: true,
        },
    });
    if (!session) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Session not found' },
        });
    }
    if (session.userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Not your session' },
        });
    }
    // Calculate scores
    const scores = await scoring_service_js_1.scoringService.calculateScores(session);
    // Save scores
    await prisma.sessionScore.create({
        data: {
            sessionId,
            ...scores,
        },
    });
    // Update session
    await prisma.trainingSession.update({
        where: { id: sessionId },
        data: {
            status: 'COMPLETED',
            completedAt: new Date(),
        },
    });
    // Update user progress
    await prisma.userProgress.update({
        where: { userId: req.user.id },
        data: {
            totalSessions: { increment: 1 },
            lastActiveAt: new Date(),
        },
    });
    res.json({
        success: true,
        data: {
            scores,
            session: {
                ...session,
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        },
    });
}));
// Get user's training history
router.get('/history', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const sessions = await prisma.trainingSession.findMany({
        where: { userId: req.user.id },
        include: {
            persona: true,
            scores: true,
        },
        orderBy: { startedAt: 'desc' },
        take: 50,
    });
    res.json({
        success: true,
        data: { sessions },
    });
}));
exports.default = router;
//# sourceMappingURL=training.routes.js.map