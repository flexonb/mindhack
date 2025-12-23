'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Send, AlertCircle, ChevronLeft, Heart, Phone, Download, Clock, CheckCheck, FileText, Code, Trash2, HelpCircle, Trophy, RefreshCw, BookOpen, TrendingUp, Info } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useChatPersistence } from '@/hooks/useChatPersistence';

interface Companion {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  personality: string;
  greeting: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedResponses?: Array<{ id: string; content: string; category: string }>;
  timestamp?: number;
}

// Diverse suggested responses for different situations
const getSuggestedResponses = (category: string = 'general') => {
  const responses: Record<string, Array<{ id: string; content: string; category: string }>> = {
    general: [
      { id: 'g1', content: "Can you tell me more about that?", category: 'explore' },
      { id: 'g2', content: "How does that make you feel?", category: 'feelings' },
      { id: 'g3', content: "I've been feeling overwhelmed lately", category: 'share' },
      { id: 'g4', content: "What can I do to feel better?", category: 'help' },
    ],
    feelings: [
      { id: 'f1', content: "I'm feeling really anxious about it", category: 'anxiety' },
      { id: 'f2', content: "I feel like I'm not good enough", category: 'self-worth' },
      { id: 'f3', content: "I feel so tired all the time", category: 'exhaustion' },
      { id: 'f4', content: "I don't know how I feel anymore", category: 'confusion' },
    ],
    explore: [
      { id: 'e1', content: "It started about a week ago", category: 'timeline' },
      { id: 'e2', content: "It's been building up for a while", category: 'timeline' },
      { id: 'e3', content: "I think it might be related to work", category: 'cause' },
      { id: 'e4', content: "I'm not sure what triggered it", category: 'uncertain' },
    ],
    crisis: [
      { id: 'c1', content: "I'm not okay, I need help", category: 'urgent' },
      { id: 'c2', content: "I've been having dark thoughts", category: 'serious' },
      { id: 'c3', content: "I don't see a way forward", category: 'hopeless' },
      { id: 'c4', content: "I need someone to talk to right now", category: 'immediate' },
    ]
  };

  return responses[category] || responses.general;
};

const defaultCompanions: Companion[] = [
  {
    id: 'empathetic-listener',
    name: 'Emma',
    title: 'Empathetic Listener',
    description: 'Specializes in active listening and emotional validation for depression and loneliness.',
    specialties: ['Depression', 'Loneliness', 'Emotional Support'],
    personality: 'warm, patient, validating',
    greeting: "Hi there. I'm Emma. I'm here to listen without any judgment. What's been on your mind?",
  },
  {
    id: 'anxiety-specialist',
    name: 'Marcus',
    title: 'Anxiety Specialist',
    description: 'Helps calm worry, anxiety, and overwhelming thoughts with practical techniques.',
    specialties: ['Anxiety', 'Worry', 'Overthinking', 'Panic'],
    personality: 'calm, grounding, reassuring',
    greeting: "Hey, I'm Marcus. I know things can feel overwhelming sometimes. Let's take this one step at a time. What's been worrying you?",
  },
  {
    id: 'burnout-coach',
    name: 'Jordan',
    title: 'Burnout Coach',
    description: 'Helps recover from exhaustion, stress, and find work-life balance.',
    specialties: ['Burnout', 'Stress', 'Exhaustion', 'Work-Life Balance'],
    personality: 'understanding, practical, encouraging',
    greeting: "I'm Jordan. It sounds like you've been carrying a lot. Burnout is real, and you deserve support. Tell me what's been going on.",
  },
  {
    id: 'grief-companion',
    name: 'Sofia',
    title: 'Grief Companion',
    description: 'Provides gentle, patient support through loss and the grieving process.',
    specialties: ['Grief', 'Loss', 'Bereavement', 'Change'],
    personality: 'gentle, patient, present',
    greeting: "I'm Sofia. I'm so sorry you're going through this. Grief is one of the hardest things we face. I'm here to be with you through this. Take your time.",
  },
  {
    id: 'relationship-guide',
    name: 'Alex',
    title: 'Relationship Guide',
    description: 'Helps navigate relationship challenges and improve communication patterns.',
    specialties: ['Relationships', 'Communication', 'Family Issues', 'Friendships'],
    personality: 'insightful, balanced, diplomatic',
    greeting: "I'm Alex. Relationships can be complicated, and it's okay to need support with them. What's been happening?",
  },
  {
    id: 'self-esteem-coach',
    name: 'Casey',
    title: 'Self-Esteem Coach',
    description: 'Helps build self-worth, challenge negative self-talk, and find confidence.',
    specialties: ['Self-Esteem', 'Self-Worth', 'Confidence', 'Self-Criticism'],
    personality: 'encouraging, empowering, gentle',
    greeting: "Hey, I'm Casey. I know how hard it can be to feel good about yourself sometimes. You deserve kindness, especially from yourself. What's been going on?",
  },
];

const companionColors: Record<string, { bg: string; border: string; text: string; gradient: string; shadow: string }> = {
  'empathetic-listener': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', gradient: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-500/25' },
  'anxiety-specialist': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', gradient: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-500/25' },
  'burnout-coach': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/25' },
  'grief-companion': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', gradient: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-500/25' },
  'relationship-guide': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', gradient: 'from-teal-400 to-cyan-500', shadow: 'shadow-teal-500/25' },
  'self-esteem-coach': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', gradient: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/25' },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Format timestamp
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function SupportChatPage() {
  const searchParams = useSearchParams();
  const companionId = searchParams.get('companion') || 'empathetic-listener';
  const isTrainingMode = searchParams.get('mode') === 'training';

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCrisisBanner, setShowCrisisBanner] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [trainingScore, setTrainingScore] = useState(100);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lowScoreCount, setLowScoreCount] = useState(0);
  const [scoreExplanation, setScoreExplanation] = useState<string | null>(null);
  const [trainingPersonaInfo, setTrainingPersonaInfo] = useState<{id: string; name: string; condition: string} | null>(null);
  const [waitingForGreeting, setWaitingForGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert HTML <br> tags to newlines for proper markdown rendering
  const normalizeContent = (content: string) => {
    return content.replace(/<br\s*\/?>/gi, '\n\n');
  };

  // Use chat persistence hook - different key for training mode
  const persistenceKey = isTrainingMode ? `training_${companionId}` : `support_${companionId}`;
  const { messages, setMessages, addMessage, clearMessages, downloadExport, isLoading: isLoadingHistory } = useChatPersistence(persistenceKey);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch companion and initialize chat
  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/support/companions`);
        if (!response.ok) throw new Error('Failed to fetch companions');

        const data = await response.json();
        let selected: Companion;

        if (data.success && data.data.companions.length > 0) {
          const found = data.data.companions.find((c: Companion) => c.id === companionId);
          selected = found || data.data.companions[0];
        } else {
          selected = defaultCompanions.find(c => c.id === companionId) || defaultCompanions[0];
        }

        setCompanion(selected);

        // In training mode, we don't set a greeting here - it will come from the persona
        // In support mode, set the companion's greeting if no history exists
        if (messages.length === 0 && !isTrainingMode) {
          setMessages([{
            role: 'assistant',
            content: selected.greeting,
            timestamp: Date.now()
          }]);
        }
      } catch (err) {
        console.error('Error fetching companion:', err);
        const fallback = defaultCompanions.find(c => c.id === companionId) || defaultCompanions[0];
        setCompanion(fallback);
        if (messages.length === 0 && !isTrainingMode) {
          setMessages([{
            role: 'assistant',
            content: fallback.greeting,
            timestamp: Date.now()
          }]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanion();
  }, [companionId, messages.length, setMessages, isTrainingMode]);

  // Trigger initial persona greeting in training mode
  useEffect(() => {
    if (isTrainingMode && messages.length === 0 && !loading && companion && !waitingForGreeting && !isLoadingHistory) {
      setWaitingForGreeting(true);
      // Request initial greeting from backend
      handleSend('', true);
    }
  }, [isTrainingMode, messages.length, loading, companion, waitingForGreeting, isLoadingHistory]);

  const handleSend = async (messageText?: string, isInitialGreeting = false) => {
    const userMessage = messageText !== undefined ? messageText : input.trim();
    if (!userMessage && !isInitialGreeting) return;
    if (!companion) return;

    if (!isInitialGreeting) {
      setInput('');
    }
    setError(null);
    setScoreExplanation(null);

    // Only add user message for actual messages (not initial greeting)
    if (!isInitialGreeting && userMessage) {
      addMessage({ role: 'user', content: userMessage, timestamp: Date.now() });
    }
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // In training mode, use persona; in support mode, use companion
          isSupportMode: !isTrainingMode,
          supportCompanionId: companion.id,
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          isTrainingMode: isTrainingMode,
          getInitialGreeting: isInitialGreeting,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from AI');

      const data = await response.json();

      if (data.success) {
        // In training mode, capture persona info and evaluate response
        if (isTrainingMode) {
          if (data.data.trainingPersona) {
            setTrainingPersonaInfo(data.data.trainingPersona);
          }

          if (data.data.scoreChange !== undefined) {
            const newScore = Math.max(0, Math.min(100, trainingScore + data.data.scoreChange));
            setTrainingScore(newScore);

            // Track low score occurrences for advice
            if (data.data.scoreChange < -5) {
              const newLowScoreCount = lowScoreCount + 1;
              setLowScoreCount(newLowScoreCount);

              // If struggling multiple times, suggest reading articles
              if (newLowScoreCount >= 2) {
                const topic = data.data.trainingPersona?.condition || companion?.specialties[0] || 'this topic';
                setScoreExplanation(`${data.data.explanation}. Consider reading our resources on ${topic} for better techniques.`);
              } else {
                setScoreExplanation(data.data.explanation);
              }
            } else if (data.data.scoreChange > 0) {
              setScoreExplanation(data.data.explanation);
              setLowScoreCount(0); // Reset counter on improvement
            } else {
              setScoreExplanation(data.data.explanation);
            }

            // Check for completion
            if (newScore >= 80) {
              setShowCompletion(true);
            }
          }
        }

        addMessage({
          role: 'assistant',
          content: data.data.response,
          suggestedResponses: data.data.suggestedResponses,
        });
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'AI service unavailable');
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again later. In the meantime, remember to take deep breaths and be kind to yourself.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedResponse = (text: string) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleExport = (format: 'text' | 'json') => {
    downloadExport(format);
    setShowExportMenu(false);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
      clearMessages();
      setWaitingForGreeting(false);
      setTrainingScore(100);
      setLowScoreCount(0);
      setScoreExplanation(null);
      setTrainingPersonaInfo(null);

      if (isTrainingMode) {
        // In training mode, request initial greeting from backend
        setWaitingForGreeting(true);
        handleSend('', true);
      } else if (companion) {
        // In support mode, use companion's greeting
        setMessages([{
          role: 'assistant',
          content: companion.greeting,
          timestamp: Date.now()
        }]);
      }
    }
    setShowExportMenu(false);
  };

  if (loading || isLoadingHistory) {
    return (
      <Layout activePage={isTrainingMode ? 'training' : 'support'} showFooter={false}>
        <div className="flex-1 flex items-center justify-center bg-calm-50">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-calm-600 font-medium">Connecting you to your companion...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!companion) {
    return (
      <Layout activePage={isTrainingMode ? 'training' : 'support'} showFooter={false}>
        <div className="flex-1 flex items-center justify-center bg-calm-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-calm-900 mb-2">Companion Not Found</h2>
            <p className="text-calm-600 mb-4">We couldn't find the companion you're looking for.</p>
            <Link href="/support" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Return to Support
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const colors = companionColors[companion.id] || companionColors['empathetic-listener'];

  return (
    <Layout activePage={isTrainingMode ? 'training' : 'support'} showFooter={false}>
      <div className="flex-1 flex flex-col h-screen bg-calm-50">
        {/* Header */}
        <div className="bg-white border-b border-calm-100 px-4 py-3 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Link href="/support" className="p-2 hover:bg-calm-100 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-calm-600" />
            </Link>

            {/* Companion Avatar */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm`}>
                <span className="text-white font-semibold">{companion.name[0]}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-calm-900 truncate">
                {isTrainingMode && trainingPersonaInfo ? trainingPersonaInfo.name : companion.name}
              </h1>
              <p className="text-sm text-calm-500 truncate">
                {isTrainingMode && trainingPersonaInfo
                  ? `${trainingPersonaInfo.condition} - Practice Helping`
                  : companion.title}
              </p>
            </div>

            {/* Training Mode Score */}
            {isTrainingMode && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    trainingScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    trainingScore >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span>{trainingScore}%</span>
                  </div>
                  {scoreExplanation && (
                    <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-white rounded-lg shadow-lg border border-calm-200 z-20">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-calm-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-calm-600">{scoreExplanation}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                  <Trophy className="h-4 w-4" />
                  <span>Training</span>
                </div>
              </div>
            )}

            {!isTrainingMode && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                <HelpCircle className="h-4 w-4" />
                <span>AI Companion</span>
              </div>
            )}

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-calm-100 rounded-lg transition-colors"
                title="Export options"
              >
                <Download className="h-5 w-5 text-calm-600" />
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-calm-200 py-2 z-20">
                    <button onClick={() => handleExport('text')} className="w-full px-4 py-2 text-left text-calm-700 hover:bg-calm-50 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Export as Text
                    </button>
                    <button onClick={() => handleExport('json')} className="w-full px-4 py-2 text-left text-calm-700 hover:bg-calm-50 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Export as JSON
                    </button>
                    <hr className="my-2 border-calm-200" />
                    <button onClick={handleClearChat} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" /> Clear Chat
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Training Completion Screen */}
        {showCompletion && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                {/* Big Checkmark */}
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in bounce-in">
                  <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-calm-900 mb-2">Training Complete!</h2>
                <p className="text-calm-600 mb-6">You successfully helped {companion.name} with a score of {trainingScore}%.</p>

                {/* Score Summary */}
                <div className="bg-calm-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-calm-600">Final Score</span>
                    <span className={`font-bold text-xl ${
                      trainingScore >= 80 ? 'text-emerald-600' :
                      trainingScore >= 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>{trainingScore}%</span>
                  </div>
                  <div className="h-3 bg-calm-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        trainingScore >= 80 ? 'bg-emerald-500' :
                        trainingScore >= 50 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${trainingScore}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowCompletion(false);
                      setTrainingScore(100);
                      setLowScoreCount(0);
                      clearMessages();
                    }}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Try Again
                  </button>
                  <Link
                    href="/resources"
                    className="w-full py-3 bg-calm-100 text-calm-700 rounded-xl font-semibold hover:bg-calm-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    Read Resources
                  </Link>
                  <Link
                    href="/training"
                    className="w-full py-3 text-calm-500 rounded-xl font-medium hover:text-calm-700 transition-colors"
                  >
                    Back to Training
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crisis Banner */}
        {showCrisisBanner && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 max-w-5xl mx-auto w-full">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-800">Need immediate human support?</p>
              <p className="text-sm text-red-600 mt-1">
                This is an AI companion. For immediate help, call or text <span className="font-bold">988</span> (US) or visit <Link href="/crisis" className="underline font-medium">Crisis Resources</Link>.
              </p>
            </div>
            <button
              onClick={() => setShowCrisisBanner(false)}
              className="p-1 hover:bg-red-200 rounded-lg transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 max-w-5xl mx-auto w-full">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-700 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-yellow-200 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl mx-auto w-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-end gap-3 max-w-[85%]">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.gradient} flex-shrink-0 flex items-center justify-center shadow-sm`}>
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div className="relative">
                    <div className="bg-white border border-calm-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <MarkdownRenderer content={normalizeContent(message.content)} className="text-calm-700 leading-relaxed text-sm" />
                    </div>
                    {message.timestamp && (
                      <span className="absolute -bottom-5 left-2 text-xs text-calm-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {message.role === 'user' && (
                <div className="max-w-[75%]">
                  <div className="relative bg-primary-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                    <p className="leading-relaxed whitespace-pre-wrap text-sm">{message.content}</p>
                    {message.timestamp && (
                      <span className="absolute -bottom-5 right-2 text-xs text-calm-400 flex items-center gap-1">
                        {formatTime(message.timestamp)}
                        <CheckCheck className="h-3 w-3 text-primary-500" />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm`}>
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-calm-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-calm-500">{companion.name} is typing</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-calm-100 px-4 py-4">
          <div className="max-w-5xl mx-auto">
            {/* Suggested Responses */}
            {messages[messages.length - 1]?.suggestedResponses && messages[messages.length - 1].role === 'assistant' && !isTyping && (
              <div className="mb-3">
                <p className="text-xs font-medium text-calm-500 mb-2">Suggested Responses</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestedResponses!.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => handleSuggestedResponse(response.content)}
                      className="px-3 py-2 bg-white border border-calm-200 hover:border-primary-300 hover:bg-primary-50 text-calm-700 rounded-lg text-sm transition-colors text-left"
                    >
                      {response.content}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback suggested responses when AI doesn't provide them */}
            {!messages[messages.length - 1]?.suggestedResponses && !isTyping && messages.length > 2 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-calm-500 mb-2">Quick Responses</p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedResponses().slice(0, 3).map((response) => (
                    <button
                      key={response.id}
                      onClick={() => handleSuggestedResponse(response.content)}
                      className="px-3 py-2 bg-white border border-calm-200 hover:border-primary-300 hover:bg-primary-50 text-calm-700 rounded-lg text-sm transition-colors text-left"
                    >
                      {response.content}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Share what's on your mind..."
                  disabled={isTyping}
                  className="w-full px-4 py-3 pr-12 bg-calm-50 border border-calm-200 rounded-xl text-calm-700 placeholder-calm-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className={`w-2 h-2 rounded-full ${input.trim() ? 'bg-green-400' : 'bg-calm-300'}`}></div>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-calm-400 mt-3">
              Remember, your companion is here to listen and support you. For emergencies, call 988.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
