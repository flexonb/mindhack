"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get user progress
router.get('/', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const progress = await prisma.userProgress.findUnique({
        where: { userId: req.user.id },
        include: {
            skillLevels: true,
        },
    });
    if (!progress) {
        // Create progress if not exists
        const newProgress = await prisma.userProgress.create({
            data: { userId: req.user.id },
            include: { skillLevels: true },
        });
        return res.json({
            success: true,
            data: { progress: newProgress },
        });
    }
    res.json({
        success: true,
        data: { progress },
    });
}));
// Get user badges
router.get('/badges', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const userBadges = await prisma.userBadge.findMany({
        where: { userId: req.user.id },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
    });
    const availableBadges = await prisma.badge.findMany({
        where: {
            NOT: {
                users: {
                    some: { userId: req.user.id },
                },
            },
        },
    });
    res.json({
        success: true,
        data: {
            earned: userBadges,
            available: availableBadges,
        },
    });
}));
// Get certificates
router.get('/certificates', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const certificates = await prisma.certificate.findMany({
        where: { userId: req.user.id },
        orderBy: { issuedAt: 'desc' },
    });
    res.json({
        success: true,
        data: { certificates },
    });
}));
// Get training statistics
router.get('/stats', errorHandler_js_1.requireAuth, (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const [totalSessions, scores, personasTried, recentBadges] = await Promise.all([
        prisma.trainingSession.count({ where: { userId: req.user.id } }),
        prisma.sessionScore.aggregate({
            where: { session: { userId: req.user.id } },
            _avg: { overall: true },
            _max: { overall: true },
        }),
        prisma.trainingSession.findMany({
            where: { userId: req.user.id },
            select: { personaId: true },
            distinct: ['personaId'],
        }),
        prisma.userBadge.findMany({
            where: { userId: req.user.id },
            include: { badge: true },
            take: 5,
            orderBy: { earnedAt: 'desc' },
        }),
    ]);
    const progress = await prisma.userProgress.findUnique({
        where: { userId: req.user.id },
    });
    res.json({
        success: true,
        data: {
            totalSessions,
            averageScore: scores._avg.overall || 0,
            bestScore: scores._max.overall || 0,
            personasCompleted: personasTried.length,
            streakDays: progress?.streakDays || 0,
            recentBadges,
        },
    });
}));
// Get leaderboard
router.get('/leaderboard', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const topUsers = await prisma.userProgress.findMany({
        where: {
            totalSessions: { gte: 5 },
        },
        include: {
            user: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: { averageScore: 'desc' },
        take: 50,
    });
    res.json({
        success: true,
        data: { leaderboard: topUsers },
    });
}));
exports.default = router;
//# sourceMappingURL=progress.routes.js.map