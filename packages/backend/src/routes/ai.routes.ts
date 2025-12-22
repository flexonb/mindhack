import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiService } from '../services/ai.service.js';

const router = Router();
const prisma = new PrismaClient();

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
router.get('/personas', asyncHandler(async (req: Request, res: Response) => {
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
  } catch (error) {
    // Fallback to default personas if DB is unavailable
    console.error('Database error, using default personas:', error);
    res.json({
      success: true,
      data: { personas: defaultPersonas, source: 'default' },
    });
  }
}));

// Chat with persona (no auth required)
router.post('/chat', asyncHandler(async (req: Request, res: Response) => {
  const { personaId, message, history } = req.body;

  // Find persona in defaults or database
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
        } as any;
      }
    } catch (error) {
      console.error('Database error finding persona:', error);
    }
  }

  if (!persona) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Persona not found' },
    });
  }

  const response = await aiService.generateResponse(
    persona as any,
    history || [],
    message
  );

  res.json({
    success: true,
    data: {
      response: response.content,
      suggestedResponses: response.suggestedResponses,
    },
  });
}));

// Analyze sentiment (for scoring)
router.post('/analyze/sentiment', asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;

  const analysis = await aiService.analyzeSentiment(text);

  res.json({
    success: true,
    data: { analysis },
  });
}));

// Crisis detection
router.post('/detect/crisis', asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;

  const allCrisisKeywords = defaultPersonas.flatMap((p) => p.crisisKeywords);
  const lowerText = text.toLowerCase();

  const detectedKeywords = allCrisisKeywords.filter((kw) =>
    lowerText.includes(kw.toLowerCase())
  );

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

export default router;
