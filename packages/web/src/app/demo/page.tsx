'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Send, Sparkles, AlertCircle, ChevronLeft, Bot } from 'lucide-react';

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const defaultPersona: Persona = {
  id: 'depression',
  name: 'Alex',
  condition: 'Depression',
  difficulty: 'Moderate',
  description: 'Experiencing persistent sadness',
  traits: ['withdrawn', 'sad'],
  openingMessages: ["Hi... I don't really know why I'm here today. Everything just feels so overwhelming lately."],
};

export default function DemoPage() {
  const searchParams = useSearchParams();
  const personaId = searchParams.get('persona') || 'depression';

  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch persona from API
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/personas`);
        if (!response.ok) throw new Error('Failed to fetch personas');

        const data = await response.json();
        if (data.success && data.data.personas.length > 0) {
          // Find the requested persona or use first one
          const found = data.data.personas.find((p: Persona) => p.id === personaId);
          const selected = found || data.data.personas[0];
          setPersona(selected);
          setMessages([{ role: 'assistant', content: selected.openingMessages?.[0] || selected.description }]);
        } else {
          // Fallback if no personas in DB
          setPersona(defaultPersona);
          setMessages([{ role: 'assistant', content: defaultPersona.openingMessages[0] }]);
        }
      } catch (err) {
        console.error('Error fetching persona:', err);
        setPersona(defaultPersona);
        setMessages([{ role: 'assistant', content: defaultPersona.openingMessages[0] }]);
        setError('Unable to load persona. Chat may not work properly.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [personaId]);

  const handleSend = async () => {
    if (!input.trim() || !persona) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: persona.id,
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from AI');

      const data = await response.json();

      if (data.success) {
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
        content: "I'm having trouble connecting right now. Please try again later.",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedResponse = (text: string) => {
    setInput(text);
  };

  if (loading) {
    return (
      <Layout activePage="demo" showFooter={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!persona) {
    return (
      <Layout activePage="demo" showFooter={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-calm-500 mb-4">Persona not found</p>
            <Link href="/training" className="btn-primary">Back to Training</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="demo" showFooter={false}>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Persona Header */}
        <div className="bg-white border-b border-calm-100 p-4">
          <div className="flex items-center gap-4">
            <Link href="/training" className="p-2 hover:bg-calm-100 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-calm-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center relative">
                <Bot className="h-6 w-6 text-primary-600" />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-semibold text-calm-900">{persona.name}</h1>
                <p className="text-sm text-calm-500">{persona.condition} - {persona.difficulty}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Sparkles className="h-4 w-4" />
              AI Powered
            </div>
          </div>
        </div>

        {/* Crisis Warning */}
        {personaId === 'crisis' && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">This is a crisis scenario for training purposes.</p>
              <p className="text-sm text-red-600 mt-1">In real emergencies, call 988 or your local crisis line immediately.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-white border border-calm-200 rounded-bl-md'
              }`}>
                <p className={message.role === 'user' ? 'text-white' : 'text-calm-700'}>{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-calm-200 rounded-2xl rounded-bl-md px-4 py-3">
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

        {/* Input Area */}
        <div className="bg-white border-t border-calm-100 p-4">
          {messages[messages.length - 1]?.suggestedResponses && messages[messages.length - 1].role === 'assistant' && (
            <>
              <p className="text-xs font-medium text-calm-500 uppercase tracking-wide mb-2">Suggested Responses</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {messages[messages.length - 1].suggestedResponses!.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => handleSuggestedResponse(response.content)}
                    className="px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm transition-colors text-left"
                  >
                    {response.content}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 input-field"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
