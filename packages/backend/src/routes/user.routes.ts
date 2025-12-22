import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Get all helpers (public)
router.get('/helpers', asyncHandler(async (req: Request, res: Response) => {
  const { role, specialty, available } = req.query;

  const helpers = await prisma.helper.findMany({
    where: {
      isVerified: true,
      isAvailable: available === 'true' ? true : undefined,
      role: role as string | undefined,
      specialties: specialty ? { has: specialty as string } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { rating: 'desc' },
  });

  res.json({
    success: true,
    data: { helpers },
  });
}));

// Get specific helper (public)
router.get('/helpers/:id', asyncHandler(async (req: Request, res: Response) => {
  const helper = await prisma.helper.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      credentials: {
        where: { isVerified: true },
      },
      availability: true,
    },
  });

  if (!helper) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Helper not found' },
    });
  }

  res.json({
    success: true,
    data: { helper },
  });
}));

// Get all resources (public)
router.get('/resources', asyncHandler(async (req: Request, res: Response) => {
  const { category, type, search } = req.query;

  const resources = await prisma.resource.findMany({
    where: {
      isPublished: true,
      category: category as string | undefined,
      type: type as string | undefined,
      OR: search ? [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ] : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: { resources },
  });
}));

// Get specific resource (public)
router.get('/resources/:id', asyncHandler(async (req: Request, res: Response) => {
  const resource = await prisma.resource.findUnique({
    where: { id: req.params.id },
  });

  if (!resource) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  }

  res.json({
    success: true,
    data: { resource },
  });
}));

export default router;
