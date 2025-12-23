import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiService, SUPPORT_COMPANIONS } from '../services/ai.service.js';

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
    id: 'burnout',
    name: 'Taylor',
    condition: 'Burnout',
    difficulty: 'Moderate',
    description: 'Experiencing work-related exhaustion, cynicism, and reduced accomplishment',
    traits: ['exhausted', 'detached', 'frustrated', 'overwhelmed'],
    triggerTopics: ['work', 'deadlines', 'responsibilities', 'rest'],
    crisisKeywords: ['quit', 'can\'t do this anymore', 'too much'],
    openingMessages: ["I've been working so hard lately, but I just feel... empty. Like nothing I do matters anymore."],
  },
  {
    id: 'grief',
    name: 'Morgan',
    condition: 'Grief',
    difficulty: 'Moderate',
    description: 'Processing loss of a loved one or significant relationship',
    traits: ['sad', 'lonely', 'confused', 'numb'],
    triggerTopics: ['memories', 'anniversaries', 'life without them', 'moving on'],
    crisisKeywords: ['gone', 'lost', 'miss them', 'can\'t go on'],
    openingMessages: ["I keep thinking about... you know. Some days are harder than others. I don't know how to handle this."],
  },
  {
    id: 'self-esteem',
    name: 'Casey',
    condition: 'Self-Esteem',
    difficulty: 'Mild',
    description: 'Struggling with self-worth, imposter syndrome, and self-doubt',
    traits: ['insecure', 'self-critical', 'doubtful', 'perfectionist'],
    triggerTopics: ['accomplishments', 'others\' opinions', 'failure', 'success'],
    crisisKeywords: ['not good enough', 'failure', 'embarrassed', 'stupid'],
    openingMessages: ["I just... I don't feel like I'm enough, you know? Like no matter what I do, it's never quite enough."],
  },
  {
    id: 'relationships',
    name: 'Riley',
    condition: 'Relationship Issues',
    difficulty: 'Mild',
    description: 'Struggling with relationship conflicts, communication, or breakups',
    traits: ['hurt', 'confused', 'anxious', 'frustrated'],
    triggerTopics: ['partner', 'family', 'friends', 'communication'],
    crisisKeywords: ['breakup', 'alone', 'nobody understands'],
    openingMessages: ["Things have been really complicated with someone close to me. I don't know what to do anymore."],
  },
  {
    id: 'stress',
    name: 'Quinn',
    condition: 'Stress',
    difficulty: 'Mild',
    description: 'Overwhelmed by life pressures and demands',
    traits: ['tense', 'worried', 'hurried', 'overwhelmed'],
    triggerTopics: ['deadlines', 'responsibilities', 'time', 'pressure'],
    crisisKeywords: ['can\'t cope', 'too much', 'breakdown'],
    openingMessages: ["There's just so much going on right now. I feel like I'm drowning in everything."],
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
    name: 'Jamie',
    condition: 'Crisis',
    difficulty: 'Critical',
    description: 'In acute crisis with suicidal ideation - requires immediate safety intervention',
    traits: ['hopeless', 'desperate', 'isolating', 'despairing'],
    triggerTopics: ['pain', 'problems', 'alone', 'burden'],
    crisisKeywords: ['hurt myself', 'end it all', 'kill myself', 'better off dead', 'suicide', 'want to die'],
    openingMessages: ["I don't know what to do anymore. Things have been so hard... I just don't see a way out."],
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

// Get all support companions
router.get('/support/companions', asyncHandler(async (req: Request, res: Response) => {
  const companions = SUPPORT_COMPANIONS.map(({ systemPrompt, ...companion }) => companion);
  res.json({
    success: true,
    data: { companions },
  });
}));

// Validate chat request body
function validateChatRequest(body: any): { valid: boolean; error?: string } {
  // Allow empty message for initial greeting requests
  if (body.getInitialGreeting) {
    if (body.history && !Array.isArray(body.history)) {
      return { valid: false, error: 'History must be an array' };
    }
    return { valid: true };
  }
  if (!body.message || typeof body.message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' };
  }
  if (body.message.length > 10000) {
    return { valid: false, error: 'Message is too long (max 10000 characters)' };
  }
  if (body.history && !Array.isArray(body.history)) {
    return { valid: false, error: 'History must be an array' };
  }
  return { valid: true };
}

// Validate sentiment request
function validateSentimentRequest(body: any): { valid: boolean; error?: string } {
  if (!body.text || typeof body.text !== 'string') {
    return { valid: false, error: 'Text is required and must be a string' };
  }
  return { valid: true };
}

// Validate crisis detection request
function validateCrisisRequest(body: any): { valid: boolean; error?: string } {
  if (!body.text || typeof body.text !== 'string') {
    return { valid: false, error: 'Text is required and must be a string' };
  }
  return { valid: true };
}

// Helper function to evaluate training responses
function evaluateTrainingResponse(userMessage: string, history: any[], companion: any): { scoreChange: number; explanation: string } {
  const lowerMessage = userMessage.toLowerCase();

  // Positive indicators - empathetic, validating responses
  const positivePatterns = [
    /i (hear|see|understand|feel)/,
    /that sounds (difficult|hard|challenging|upsetting)/,
    /i'm (here|with you)/,
    /how (does|makes) that make you feel/i,
    /can you tell me more/i,
    /that must be (really|so) (hard|tough|difficult)/,
    /it's (understandable|okay|normal) to feel/i,
    /you're not alone/i,
    /i appreciate you sharing/i,
    /take your time/i,
    /there's no right or wrong way to feel/i,
    /that makes sense/i,
    /sounds like you're going through a lot/i,
  ];

  // Negative indicators - dismissive, advice-heavy, invalidating
  const negativePatterns = [
    /you should/i,
    /just (stop|calm down|relax|think positive)/i,
    /it's not that (bad|serious)/i,
    /other people have it worse/i,
    /why don't you just/i,
    /have you tried/i,
    /you need to/i,
    /you'll (feel better|get over it|be fine)/i,
    /don't (be|feel) (sad|upset|angry)/i,
    /cheer up/i,
    /snap out of it/i,
    /it's all in your head/i,
    /you're (overreacting|being dramatic)/i,
    // Dismissive and uncaring responses
    /i don't care/i,
    /whatever/i,
    /not my problem/i,
    /go tell/i,
    /go ask/i,
    /that's not my issue/i,
    /not my concern/i,
    /i don't have time/i,
    /figure it out/i,
    /solve it yourself/i,
    /i can't help you with that/i,
    /that's your problem/i,
  ];

  // Check for empathetic responses
  const isPositive = positivePatterns.some(pattern => pattern.test(lowerMessage));
  const isNegative = negativePatterns.some(pattern => pattern.test(lowerMessage));

  // Count previous exchanges
  const userMessageCount = history.filter(m => m.role === 'user').length;

  if (isPositive && !isNegative) {
    // Good response - empathetic and validating
    const baseScore = 10;
    // Bonus for early exchanges (encourage engagement)
    const bonus = userMessageCount < 3 ? 5 : 0;
    return {
      scoreChange: Math.min(15, baseScore + bonus),
      explanation: "Great empathetic response! You showed active listening and validation."
    };
  } else if (isNegative) {
    // Poor response - dismissive or advice-heavy
    const basePenalty = -10;
    // Extra penalty if very early in conversation (premature advice)
    const penalty = userMessageCount < 2 ? -5 : 0;
    return {
      scoreChange: basePenalty + penalty,
      explanation: "Try to listen and validate first before offering advice. Ask how they feel instead."
    };
  } else {
    // Neutral response - could be better
    const isQuestion = lowerMessage.includes('?');
    if (isQuestion) {
      return {
        scoreChange: 2,
        explanation: "Good job asking a question. Try to focus on their feelings and experience."
      };
    }
    return {
      scoreChange: 0,
      explanation: "Try to show more empathy by acknowledging their feelings."
    };
  }
}

// Map companion IDs to persona IDs for training mode
const companionToPersonaMap: Record<string, string> = {
  'empathetic-listener': 'depression',
  'anxiety-specialist': 'anxiety',
  'burnout-coach': 'burnout',
  'grief-companion': 'grief',
  'relationship-guide': 'relationships',
  'self-esteem-coach': 'self-esteem',
  'stress-specialist': 'stress',
  'trauma-specialist': 'ptsd',
  'crisis-support': 'crisis',
};

// Chat with persona or support companion
router.post('/chat', asyncHandler(async (req: Request, res: Response) => {
  const { personaId, message, history, isSupportMode, supportCompanionId, isTrainingMode, getInitialGreeting } = req.body;

  // Validate request
  const validation = validateChatRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validation.error },
    });
  }

  // Training mode: use persona (AI acts as person with mental health issue)
  if (isTrainingMode && supportCompanionId) {
    // Map companion ID to persona ID for training
    const mappedPersonaId = companionToPersonaMap[supportCompanionId] || supportCompanionId;
    let persona = defaultPersonas.find(p => p.id === mappedPersonaId);

    // If not found in default personas, try finding by condition match
    if (!persona) {
      const companion = SUPPORT_COMPANIONS.find(c => c.id === supportCompanionId);
      const specialty = companion?.specialties[0]?.toLowerCase();
      persona = defaultPersonas.find(p =>
        p.condition.toLowerCase() === specialty ||
        p.id === supportCompanionId
      );
    }

    // Fallback to first persona if not found
    if (!persona) {
      persona = defaultPersonas[0];
    }

    // Check if this is the initial greeting request or first message
    if (getInitialGreeting || !history || history.length === 0) {
      // Return the persona's opening message
      const openingMessage = persona.openingMessages?.[0] ||
        `Hi... I don't really know why I'm here today. Everything just feels so overwhelming lately.`;

      // Generate suggested responses based on the persona
      const suggestedResponses = [
        { id: 't1', content: "I'm here to listen. Can you tell me more?", category: 'listening' },
        { id: 't2', content: "That sounds really difficult. How long have you been feeling this way?", category: 'empathy' },
        { id: 't3', content: "I'm sorry you're going through this. I'm here for you.", category: 'support' },
      ];

      return res.json({
        success: true,
        data: {
          response: openingMessage,
          suggestedResponses,
          scoreChange: 0,
          explanation: "Start the conversation by responding empathetically.",
          trainingPersona: { id: persona.id, name: persona.name, condition: persona.condition },
        },
      });
    }

    // Not the first message - use AI to generate response
    const response = await aiService.generateResponse(
      persona as any,
      history || [],
      message
    );

    // Evaluate response for training score using Minimax AI
    const evaluation = await aiService.evaluateTrainingResponse(
      message,
      history || [],
      persona.name,
      persona.condition
    );

    return res.json({
      success: true,
      data: {
        response: response.content,
        suggestedResponses: response.suggestedResponses,
        scoreChange: evaluation.scoreChange,
        explanation: evaluation.explanation,
        trainingPersona: { id: persona.id, name: persona.name, condition: persona.condition },
      },
    });
  }

  // Support mode: use companion (AI acts as supportive helper)
  if (isSupportMode && supportCompanionId) {
    const companion = SUPPORT_COMPANIONS.find(c => c.id === supportCompanionId);
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

    const response = await aiService.generateResponse(
      minimalPersona as any,
      history || [],
      message,
      true,
      supportCompanionId
    );

    return res.json({
      success: true,
      data: {
        response: response.content,
        suggestedResponses: response.suggestedResponses,
        companion: { id: companion.id, name: companion.name, title: companion.title },
      },
    });
  }

  // Legacy training mode: use persona
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

  // Training mode: evaluate response and return score
  if (isTrainingMode) {
    const { scoreChange, explanation } = evaluateTrainingResponse(message, history || [], persona);
    return res.json({
      success: true,
      data: {
        response: response.content,
        suggestedResponses: response.suggestedResponses,
        scoreChange,
        explanation,
      },
    });
  }

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

  // Validate request
  const validation = validateSentimentRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validation.error },
    });
  }

  const analysis = await aiService.analyzeSentiment(text);

  res.json({
    success: true,
    data: { analysis },
  });
}));

// Crisis detection
router.post('/detect/crisis', asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;

  // Validate request
  const validation = validateCrisisRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validation.error },
    });
  }

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
