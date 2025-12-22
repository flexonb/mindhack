import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, requireAuth } from '../middleware/errorHandler.js';
import { emitToSession } from '../websocket/index.js';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Request support session
const requestSupportSchema = z.object({
  helperId: z.string().optional(),
  type: z.enum(['TEXT', 'VOICE', 'VIDEO']).default('TEXT'),
  issueDescription: z.string().optional(),
});

router.post('/request', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = requestSupportSchema.parse(req.body);

  let session;

  if (data.helperId) {
    // Direct request to specific helper
    const helper = await prisma.helper.findUnique({
      where: { id: data.helperId },
    });

    if (!helper || !helper.isAvailable) {
      return res.status(400).json({
        success: false,
        error: { code: 'HELPER_UNAVAILABLE', message: 'Helper is not available' },
      });
    }

    session = await prisma.supportSession.create({
      data: {
        userId: req.user!.id,
        helperId: data.helperId,
        type: data.type,
        status: 'PENDING',
      },
    });
  } else {
    // Auto-match with available helper
    const availableHelper = await prisma.helper.findFirst({
      where: {
        isAvailable: true,
        isVerified: true,
        user: { isActive: true },
      },
      orderBy: { rating: 'desc' },
    });

    if (!availableHelper) {
      return res.status(503).json({
        success: false,
        error: { code: 'NO_HELPERS', message: 'No helpers available right now. Please try again later.' },
      });
    }

    session = await prisma.supportSession.create({
      data: {
        userId: req.user!.id,
        helperId: availableHelper.id,
        type: data.type,
        status: 'PENDING',
      },
    });
  }

  res.status(201).json({
    success: true,
    data: { session },
  });
}));

// Accept support session (helper)
router.post('/sessions/:id/accept', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.supportSession.findUnique({
    where: { id: req.params.id },
    include: { helper: true },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Session not found' },
    });
  }

  if (session.helper.userId !== req.user!.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Not your session' },
    });
  }

  const updatedSession = await prisma.supportSession.update({
    where: { id: req.params.id },
    data: {
      status: 'ACTIVE',
      startedAt: new Date(),
    },
  });

  res.json({
    success: true,
    data: { session: updatedSession },
  });
}));

// Send message in support session
router.post('/sessions/:id/messages', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const sessionId = req.params.id;

  const session = await prisma.supportSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Session not found' },
    });
  }

  if (session.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      error: { code: 'SESSION_NOT_ACTIVE', message: 'Session is not active' },
    });
  }

  // Verify user is participant
  if (session.userId !== req.user!.id && session.helperId !== req.user!.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Not a participant in this session' },
    });
  }

  const message = await prisma.supportMessage.create({
    data: {
      sessionId,
      senderId: req.user!.id,
      content,
    },
  });

  // Emit via WebSocket
  emitToSession(req.app.get('io'), sessionId, 'support:message', {
    id: message.id,
    senderId: message.senderId,
    content: message.content,
    timestamp: message.createdAt,
  });

  res.status(201).json({
    success: true,
    data: { message },
  });
}));

// End support session
router.post('/sessions/:id/end', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.supportSession.findUnique({
    where: { id: req.params.id },
    include: { helper: true },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Session not found' },
    });
  }

  // Both participants can end, but only helper can complete
  const isHelper = session.helper.userId === req.user!.id;
  const isUser = session.userId === req.user!.id;

  if (!isHelper && !isUser) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Not a participant' },
    });
  }

  const updatedSession = await prisma.supportSession.update({
    where: { id: req.params.id },
    data: {
      status: isHelper ? 'COMPLETED' : 'CANCELLED',
      endedAt: new Date(),
      rating: req.body.rating,
      feedback: req.body.feedback,
    },
  });

  // Update helper stats
  if (isHelper) {
    await prisma.helper.update({
      where: { id: session.helperId },
      data: {
        totalSessions: { increment: 1 },
      },
    });
  }

  res.json({
    success: true,
    data: { session: updatedSession },
  });
}));

// Get user's support sessions
router.get('/sessions', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const sessions = await prisma.supportSession.findMany({
    where: {
      OR: [
        { userId: req.user!.id },
        { helper: { userId: req.user!.id } },
      ],
    },
    include: {
      helper: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { startedAt: 'desc' },
    take: 50,
  });

  res.json({
    success: true,
    data: { sessions },
  });
}));

// Get specific session
router.get('/sessions/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.supportSession.findUnique({
    where: { id: req.params.id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      helper: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Session not found' },
    });
  }

  if (session.userId !== req.user!.id && session.helper.userId !== req.user!.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Not a participant' },
    });
  }

  res.json({
    success: true,
    data: { session },
  });
}));

// Helper: get pending sessions
router.get('/helper/pending', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const helper = await prisma.helper.findUnique({
    where: { userId: req.user!.id },
  });

  if (!helper) {
    return res.status(403).json({
      success: false,
      error: { code: 'NOT_HELPER', message: 'You are not a registered helper' },
    });
  }

  const sessions = await prisma.supportSession.findMany({
    where: {
      helperId: helper.id,
      status: 'PENDING',
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({
    success: true,
    data: { sessions },
  });
}));

// Update helper availability
router.patch('/helper/availability', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { isAvailable } = req.body;

  const helper = await prisma.helper.update({
    where: { userId: req.user!.id },
    data: { isAvailable },
  });

  res.json({
    success: true,
    data: { helper },
  });
}));

export default router;
