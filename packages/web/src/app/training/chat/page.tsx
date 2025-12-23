'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Send, AlertCircle, ChevronLeft, Heart, Phone, Download, Clock, CheckCheck, FileText, Code, Trash2, HelpCircle, Trophy, RefreshCw, BookOpen, TrendingUp, Info } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Persona {
  id: string;
  name: string;
  condition: string;
  difficulty: string;
  description: string;
  traits: string[];
  openingMessages: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedResponses?: Array<{ id: string; content: string; category: string }>;
  timestamp?: number;
}

// Default personas for training
const defaultPersonas: Persona[] = [
  {
    id: 'depression',
    name: 'Alex',
    condition: 'Depression',
    difficulty: 'Moderate',
    description: 'Experiencing persistent sadness, loss of interest, and feelings of hopelessness',
    traits: ['withdrawn', 'sad', 'fatigued', 'self-critical'],
    openingMessages: ["Hi... I don't really know why I'm here today. Everything just feels so overwhelming lately."],
  },
  {
    id: 'anxiety',
    name: 'Sam',
    condition: 'Anxiety',
    difficulty: 'Mild',
    description: 'Experiencing excessive worry, racing thoughts, and physical anxiety symptoms',
    traits: ['nervous', 'restless', 'overthinking', 'fearful'],
    openingMessages: ["I can't stop thinking about what happened yesterday. What if I made a mistake?"],
  },
  {
    id: 'burnout',
    name: 'Taylor',
    condition: 'Burnout',
    difficulty: 'Moderate',
    description: 'Experiencing work-related exhaustion, cynicism, and reduced accomplishment',
    traits: ['exhausted', 'detached', 'frustrated', 'overwhelmed'],
    openingMessages: ["I've been working so hard lately, but I just feel... empty. Like nothing I do matters anymore."],
  },
  {
    id: 'grief',
    name: 'Morgan',
    condition: 'Grief',
    difficulty: 'Moderate',
    description: 'Processing loss of a loved one or significant relationship',
    traits: ['sad', 'lonely', 'confused', 'numb'],
    openingMessages: ["I keep thinking about... you know. Some days are harder than others. I don't know how to handle this."],
  },
  {
    id: 'self-esteem',
    name: 'Casey',
    condition: 'Self-Esteem',
    difficulty: 'Mild',
    description: 'Struggling with self-worth, imposter syndrome, and self-doubt',
    traits: ['insecure', 'self-critical', 'doubtful', 'perfectionist'],
    openingMessages: ["I just... I don't feel like I'm enough, you know? Like no matter what I do, it's never quite enough."],
  },
  {
    id: 'relationships',
    name: 'Riley',
    condition: 'Relationship Issues',
    difficulty: 'Mild',
    description: 'Struggling with relationship conflicts, communication, or breakups',
    traits: ['hurt', 'confused', 'anxious', 'frustrated'],
    openingMessages: ["Things have been really complicated with someone close to me. I don't know what to do anymore."],
  },
  {
    id: 'stress',
    name: 'Quinn',
    condition: 'Stress',
    difficulty: 'Mild',
    description: 'Overwhelmed by life pressures and demands',
    traits: ['tense', 'worried', 'hurried', 'overwhelmed'],
    openingMessages: ["There's just so much going on right now. I feel like I'm drowning in everything."],
  },
  {
    id: 'ptsd',
    name: 'Jordan',
    condition: 'PTSD',
    difficulty: 'Moderate',
    description: 'Experiencing flashbacks, hypervigilance, and trauma-related distress',
    traits: ['jumpy', 'on edge', 'avoidant', 'hypervigilant'],
    openingMessages: ["Sometimes I... I feel like I'm back there again. The sounds, the images..."],
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Format timestamp
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function TrainingChatPage() {
  const searchParams = useSearchParams();
  const personaId = searchParams.get('persona') || 'depression';

  const [persona, setPersona] = useState<Persona | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [trainingScore, setTrainingScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lowScoreCount, setLowScoreCount] = useState(0);
  const [scoreExplanation, setScoreExplanation] = useState<string | null>(null);
  const [waitingForGreeting, setWaitingForGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate displayed score (clamped to 0-100)
  const displayedScore = Math.max(0, Math.min(100, trainingScore));

  // Convert HTML <br> tags to newlines for proper markdown rendering
  const normalizeContent = (content: string) => {
    return content.replace(/<br\s*\/?>/gi, '\n\n');
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize persona
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/personas`);
        if (!response.ok) throw new Error('Failed to fetch personas');

        const data = await response.json();
        let selected: Persona;

        if (data.success && data.data.personas.length > 0) {
          const found = data.data.personas.find((p: Persona) => p.id === personaId);
          selected = found || data.data.personas[0];
        } else {
          selected = defaultPersonas.find(p => p.id === personaId) || defaultPersonas[0];
        }

        setPersona(selected);
      } catch (err) {
        console.error('Error fetching persona:', err);
        const fallback = defaultPersonas.find(p => p.id === personaId) || defaultPersonas[0];
        setPersona(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [personaId]);

  // Trigger initial persona greeting
  useEffect(() => {
    if (persona && messages.length === 0 && !loading && !waitingForGreeting) {
      setWaitingForGreeting(true);
      handleSend('', true);
    }
  }, [persona, messages.length, loading, waitingForGreeting]);

  const handleSend = async (messageText?: string, isInitialGreeting = false) => {
    const userMessage = messageText !== undefined ? messageText : input.trim();
    if (!userMessage && !isInitialGreeting) return;
    if (!persona) return;

    if (!isInitialGreeting) {
      setInput('');
    }
    setError(null);
    setScoreExplanation(null);

    // Only add user message for actual messages (not initial greeting)
    if (!isInitialGreeting && userMessage) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
    }
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isSupportMode: false,
          supportCompanionId: persona.id,
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          isTrainingMode: true,
          getInitialGreeting: isInitialGreeting,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from AI');

      const data = await response.json();

      if (data.success) {
        // Capture persona info
        if (data.data.trainingPersona) {
          setPersona(prev => prev ? { ...prev, ...data.data.trainingPersona } : prev);
        }

        // Evaluate response and update score
        if (data.data.scoreChange !== undefined) {
          setTrainingScore(prevScore => {
            const newScore = prevScore + data.data.scoreChange;
            // Check for completion (only for positive scores)
            if (newScore >= 80) {
              setShowCompletion(true);
            }
            return newScore;
          });

          // Update low score count and explanation using functional updates
          if (data.data.scoreChange < -5) {
            setLowScoreCount(prev => {
              const newLowScoreCount = prev + 1;
              if (newLowScoreCount >= 2) {
                const topic = data.data.trainingPersona?.condition || persona?.condition || 'this topic';
                setScoreExplanation(`${data.data.explanation}. Consider reading our resources on ${topic} for better techniques.`);
              } else {
                setScoreExplanation(data.data.explanation);
              }
              return newLowScoreCount;
            });
          } else if (data.data.scoreChange > 0) {
            setScoreExplanation(data.data.explanation);
            setLowScoreCount(0);
          } else {
            setScoreExplanation(data.data.explanation);
          }
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.response,
          suggestedResponses: data.data.suggestedResponses,
        }]);
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'AI service unavailable');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again later. Remember to take deep breaths and be kind to yourself.",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedResponse = (text: string) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
      setMessages([]);
      setWaitingForGreeting(false);
      setTrainingScore(0);
      setLowScoreCount(0);
      setScoreExplanation(null);
      setShowCompletion(false);
      setTimeout(() => handleSend('', true), 100);
    }
    setShowExportMenu(false);
  };

  const exportChat = () => {
    const chatText = messages.map(m => `[${formatTime(m.timestamp || Date.now())}] ${m.role === 'user' ? 'You' : persona?.name || 'Persona'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-chat-${persona?.condition || 'session'}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (loading) {
    return (
      <Layout activePage="training" showFooter={false}>
        <div className="flex-1 flex items-center justify-center bg-calm-50">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-calm-600 font-medium">Connecting you to your practice session...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!persona) {
    return (
      <Layout activePage="training" showFooter={false}>
        <div className="flex-1 flex items-center justify-center bg-calm-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-calm-900 mb-2">Persona Not Found</h2>
            <p className="text-calm-600 mb-4">We couldn't find the person you're looking for.</p>
            <Link href="/training" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Return to Training
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="training" showFooter={false}>
      <div className="flex-1 flex flex-col h-screen bg-calm-50">
        {/* Header */}
        <div className="bg-white border-b border-calm-100 px-4 py-3 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Link href="/training" className="p-2 hover:bg-calm-100 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-calm-600" />
            </Link>

            {/* Persona Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold">{persona.name[0]}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-calm-900 truncate">{persona.name}</h1>
              <p className="text-sm text-calm-500 truncate">{persona.condition}</p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-amber-700">{displayedScore}%</span>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-calm-100 rounded-lg transition-colors"
              >
                <Info className="h-5 w-5 text-calm-600" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-calm-100 py-2 z-20">
                  <button onClick={handleClearChat} className="w-full px-4 py-2 text-left text-calm-700 hover:bg-calm-50 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Restart Conversation
                  </button>
                  <button onClick={exportChat} className="w-full px-4 py-2 text-left text-calm-700 hover:bg-calm-50 flex items-center gap-2">
                    <Download className="h-4 w-4" /> Export Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Explanation */}
        {scoreExplanation && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
            <div className="max-w-5xl mx-auto flex items-start gap-2 text-sm text-amber-800">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{scoreExplanation}</p>
            </div>
          </div>
        )}

        {/* Completion Banner */}
        {showCompletion && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-calm-900">Session Complete!</h3>
                  <p className="text-sm text-calm-600">You demonstrated great empathy skills!</p>
                </div>
              </div>
              <Link href="/training" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Continue Training
              </Link>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-5xl mx-auto">
            {messages.length === 0 && !isTyping && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-calm-900 mb-2">Training Session</h3>
                <p className="text-calm-600 max-w-md mx-auto">
                  You're helping <strong>{persona.name}</strong> who is experiencing <strong>{persona.condition.toLowerCase()}</strong>.
                  Respond with empathy and validation to build your helping skills.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} mb-4`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gradient-to-br from-rose-400 to-orange-500 text-white'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-sm font-medium">You</span>
                  ) : (
                    <span className="text-sm font-medium">{persona.name[0]}</span>
                  )}
                </div>
                <div className={`flex-1 max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-white border border-calm-200 rounded-tl-sm'
                  }`}>
                    {message.role === 'assistant' ? (
                      <MarkdownRenderer content={normalizeContent(message.content)} className="text-sm" />
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.timestamp && (
                    <p className="text-xs text-calm-400 mt-1">{formatTime(message.timestamp)}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">{persona.name[0]}</span>
                </div>
                <div className="bg-white border border-calm-200 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-calm-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Responses */}
        {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.suggestedResponses && (
          <div className="bg-white border-t border-calm-100 px-4 py-3">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs text-calm-500 mb-2">Suggested responses:</p>
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestedResponses!.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestedResponse(suggestion.content)}
                    className="px-3 py-1.5 bg-calm-100 text-calm-700 text-sm rounded-lg hover:bg-calm-200 transition-colors"
                  >
                    {suggestion.content}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white border-t border-calm-100 px-4 py-4">
          <div className="max-w-5xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Help ${persona.name}...`}
              className="flex-1 px-4 py-3 bg-calm-50 border border-calm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
