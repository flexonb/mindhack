import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, requireAuth } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// Get user progress
router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const progress = await prisma.userProgress.findUnique({
    where: { userId: req.user!.id },
    include: {
      skillLevels: true,
    },
  });

  if (!progress) {
    // Create progress if not exists
    const newProgress = await prisma.userProgress.create({
      data: { userId: req.user!.id },
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
router.get('/badges', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: req.user!.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });

  const availableBadges = await prisma.badge.findMany({
    where: {
      NOT: {
        users: {
          some: { userId: req.user!.id },
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
router.get('/certificates', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const certificates = await prisma.certificate.findMany({
    where: { userId: req.user!.id },
    orderBy: { issuedAt: 'desc' },
  });

  res.json({
    success: true,
    data: { certificates },
  });
}));

// Get training statistics
router.get('/stats', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const [totalSessions, scores, personasTried, recentBadges] = await Promise.all([
    prisma.trainingSession.count({ where: { userId: req.user!.id } }),
    prisma.sessionScore.aggregate({
      where: { session: { userId: req.user!.id } },
      _avg: { overall: true },
      _max: { overall: true },
    }),
    prisma.trainingSession.findMany({
      where: { userId: req.user!.id },
      select: { personaId: true },
      distinct: ['personaId'],
    }),
    prisma.userBadge.findMany({
      where: { userId: req.user!.id },
      include: { badge: true },
      take: 5,
      orderBy: { earnedAt: 'desc' },
    }),
  ]);

  const progress = await prisma.userProgress.findUnique({
    where: { userId: req.user!.id },
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
router.get('/leaderboard', asyncHandler(async (req: Request, res: Response) => {
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

export default router;
