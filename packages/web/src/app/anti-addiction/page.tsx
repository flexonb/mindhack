'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Brain, Heart, Clock, ArrowRight, BookOpen, Target, TrendingDown, Award, Calendar, MessageCircle, Phone, X, CheckCircle, AlertCircle, Zap, RefreshCw, Lock, Unlock, Flame, Send, Loader2, Plus, Trash2, BarChart3, Activity, HelpCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useRecoveryTracking } from '@/hooks/useRecoveryTracking';

const addictionCategories = [
  { id: 'social-media', name: 'Social Media', icon: MessageCircle, color: 'from-blue-400 to-blue-600', description: 'Instagram, TikTok, Facebook, Twitter' },
  { id: 'gaming', name: 'Gaming', icon: Brain, color: 'from-purple-400 to-purple-600', description: 'Video games, online gaming' },
  { id: 'gambling', name: 'Gambling', icon: TrendingDown, color: 'from-red-400 to-red-600', description: 'Betting, casino, online gambling' },
  { id: 'phone', name: 'Phone/Screen', icon: Lock, color: 'from-green-400 to-green-600', description: 'Phone addiction, screen time' },
  { id: 'shopping', name: 'Shopping', icon: Target, color: 'from-amber-400 to-amber-600', description: 'Online shopping, compulsive buying' },
  { id: 'substance', name: 'Substance', icon: Heart, color: 'from-rose-400 to-rose-600', description: 'Alcohol, drugs, medication' },
  { id: 'smoking', name: 'Smoking', icon: Zap, color: 'from-gray-400 to-gray-600', description: 'Nicotine, tobacco products' },
  { id: 'pornography', name: 'Pornography', icon: Lock, color: 'from-pink-400 to-pink-600', description: 'Adult content addiction' },
  { id: 'food', name: 'Food', icon: Heart, color: 'from-orange-400 to-orange-600', description: 'Binge eating, food addiction' },
];

const copingStrategies = [
  { title: 'Delay the Urge', description: 'Wait 10 minutes before acting on the urge. Often it will pass.', icon: Clock },
  { title: 'Find a Distraction', description: 'Call a friend, go for a walk, or do something physical.', icon: Zap },
  { title: 'Deep Breathing', description: '4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.', icon: Brain },
  { title: 'Challenge Thoughts', description: 'Question the thoughts that lead to addiction.', icon: RefreshCw },
  { title: 'Reach Out', description: 'Contact a support person or hotline.', icon: Phone },
  { title: 'Remove Activity', description: 'Delete apps, block websites, change environments.', icon: X },
];

const milestones = [
  { days: 1, title: 'First Day', description: 'The hardest but most important step' },
  { days: 7, title: 'One Week', description: 'Breaking the initial habit cycle' },
  { days: 21, title: 'Three Weeks', description: 'Neural pathways begin to change' },
  { days: 30, title: 'One Month', description: 'Significant progress achieved' },
  { days: 90, title: '90 Days', description: 'New habits becoming automatic' },
  { days: 365, title: 'One Year', description: 'Complete transformation' },
];

const defaultDailyGoals = [
  'Morning meditation or mindfulness practice',
  'Reach out to a support person',
  'Avoid triggers for 2 hours',
  'Journal about progress and feelings',
  'Practice gratitude - list 3 things',
];

const defaultTriggers = [
  'Stress at work/school',
  'Boredom',
  'Social situations',
  'Evening/night time',
  'Feeling lonely',
  'Seeing related content',
];

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AntiAddictionPage() {
  const [selectedAddiction, setSelectedAddiction] = useState<typeof addictionCategories[0] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(1);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [showTriggerForm, setShowTriggerForm] = useState(false);
  const [newTrigger, setNewTrigger] = useState({ trigger: '', situation: '', urgeLevel: 5, copingStrategy: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    data,
    getSobrietyDays,
    getSobrietyHours,
    resetSobriety,
    addDailyGoal,
    toggleDailyGoal,
    deleteDailyGoal,
    clearCompletedGoals,
    getTodayGoals,
    getCompletedTodayGoals,
    addTrigger,
    deleteTrigger,
    getRecentTriggers,
    getTriggerStats,
  } = useRecoveryTracking();

  const sobrietyDays = getSobrietyDays();
  const sobrietyHours = getSobrietyHours();
  const todayGoals = getTodayGoals();
  const completedToday = getCompletedTodayGoals();
  const recentTriggers = getRecentTriggers(7);
  const triggerStats = getTriggerStats();

  useEffect(() => {
    if (selectedAddiction && chatMessages.length === 0) {
      setChatMessages([{
        role: 'ai',
        text: `I'm here to help you recover from ${selectedAddiction.name} addiction. This is a journey, and you don't have to do it alone. What's on your mind right now? What triggers your urges, or how are you feeling?`,
        timestamp: Date.now()
      }]);
    }
  }, [selectedAddiction, chatMessages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAddiction) return;

    const userMessage = newMessage;
    setNewMessage('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: Date.now() }]);
    setIsTyping(true);

    const getContextualFallback = () => {
      const lastMessages = chatMessages.slice(-3).map(m => m.text.toLowerCase());
      const context = lastMessages.join(' ');

      if (context.includes('urge') || context.includes('crave') || context.includes('want')) {
        return "Urges are temporary waves - they peak and fade. You've gotten through this before, and you can again. What usually helps you ride out these moments?";
      }
      if (context.includes('relapse') || context.includes('failed') || context.includes('slip')) {
        return "A slip doesn't erase your progress. What matters is that you're still here, still trying. Let's focus on what you can control right now - this next moment.";
      }
      if (context.includes('trigger') || context.includes('why')) {
        return "Understanding your triggers is powerful. Sometimes urges come from specific feelings, situations, or even time of day. What was happening before you felt this way?";
      }
      return "I'm here with you. Take a breath - you're doing something really brave by facing this. What's the hardest part of this moment?";
    };

    try {
      const history = chatMessages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          isSupportMode: true,
          supportCompanionId: 'burnout-coach',
          history
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.success && data.data?.response) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.data.response, timestamp: Date.now() }]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('AI service unavailable, using local response');
      setChatMessages(prev => [...prev, {
        role: 'ai',
        text: getContextualFallback(),
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddictionSelect = (addiction: typeof addictionCategories[0]) => {
    setSelectedAddiction(addiction);
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addDailyGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const handleAddTrigger = () => {
    if (newTrigger.trigger.trim()) {
      addTrigger(newTrigger.trigger, newTrigger.situation, newTrigger.urgeLevel, newTrigger.copingStrategy);
      setShowTriggerForm(false);
      setNewTrigger({ trigger: '', situation: '', urgeLevel: 5, copingStrategy: '' });
    }
  };

  const getUrgencyColor = () => {
    if (urgencyLevel <= 3) return 'text-green-600 bg-green-100';
    if (urgencyLevel <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return { day: days[d.getDay()], date: d, hours: data.weeklyProgress[i] || 0 };
    });
  };

  return (
    <Layout activePage="anti-addiction">
      {/* Hero Section */}
      <section className="bg-calm-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/30 rounded-full text-sm font-medium text-primary-200 mb-6">
              <HelpCircle className="h-4 w-4" />
              Recovery Support
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Break Free from Addiction
            </h1>
            <p className="text-calm-300 text-lg leading-relaxed mb-8">
              Recover from addiction with personalized support, evidence-based strategies, and tracking tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('addiction-types')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Get Support
              </button>
              <Link
                href="/crisis"
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Crisis Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Chart Section */}
      <section className="py-8 -mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md border border-calm-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-calm-900">Your Recovery Progress</h3>
                  <p className="text-sm text-calm-500">This week's activity</p>
                </div>
              </div>
              <button
                onClick={resetSobriety}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </button>
            </div>

            {/* Weekly Chart */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {getDaysOfWeek().map(({ day, date, hours }, index) => {
                const isToday = date.toDateString() === new Date().toDateString();
                const height = Math.min(100, hours * 10);
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-calm-500 mb-2">{day}</div>
                    <div className="relative h-20 bg-calm-100 rounded-lg flex items-end justify-center overflow-hidden">
                      <div
                        className={`w-full absolute bottom-0 transition-all duration-500 ${
                          hours > 0 ? 'bg-primary-500' : 'bg-calm-200'
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                      {isToday && (
                        <div className="absolute top-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-calm-700 mt-1">{hours}h</div>
                  </div>
                );
              })}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-calm-50 rounded-lg">
                <Flame className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-calm-900">{sobrietyDays}</p>
                <p className="text-xs text-calm-500">Days Sober</p>
              </div>
              <div className="text-center p-3 bg-calm-50 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-calm-900">{sobrietyHours % 24}</p>
                <p className="text-xs text-calm-500">Hours Today</p>
              </div>
              <div className="text-center p-3 bg-calm-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-calm-900">{completedToday.length}/{todayGoals.length}</p>
                <p className="text-xs text-calm-500">Goals Today</p>
              </div>
              <div className="text-center p-3 bg-calm-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-calm-900">{triggerStats.totalTriggers}</p>
                <p className="text-xs text-calm-500">Triggers Logged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Addiction Type Selection */}
      <section id="addiction-types" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-calm-900 mb-2">What Are You Recovering From?</h2>
            <p className="text-calm-600">Select the addiction type to get personalized support</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addictionCategories.map((addiction) => (
              <button
                key={addiction.id}
                onClick={() => handleAddictionSelect(addiction)}
                className={`group relative bg-gradient-to-br ${addiction.color} rounded-xl p-5 text-white text-left transition-all duration-200 hover:shadow-lg ${selectedAddiction?.id === addiction.id ? 'ring-4 ring-offset-2 ring-primary-500' : ''}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <addiction.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{addiction.name}</h3>
                </div>
                <p className="text-white/80 text-sm">{addiction.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Goals Section */}
      <section className="py-12 bg-calm-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md border border-calm-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-calm-100 bg-primary-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-calm-900">Daily Recovery Goals</h3>
                    <p className="text-sm text-calm-500">{completedToday.length} of {todayGoals.length} completed</p>
                  </div>
                </div>
                <button
                  onClick={clearCompletedGoals}
                  className="text-sm text-calm-500 hover:text-calm-700"
                >
                  Clear done
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {todayGoals.length === 0 ? (
                <div className="text-center py-6 text-calm-500">
                  <Award className="h-10 w-10 mx-auto mb-2 text-calm-300" />
                  <p className="text-sm">No goals set for today. Add some below!</p>
                </div>
              ) : (
                todayGoals.map((goal) => (
                  <label
                    key={goal.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      goal.completed
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-calm-50 border border-calm-100 hover:border-primary-200'
                    }`}
                  >
                    <div className={`relative ${goal.completed ? 'text-green-600' : 'text-calm-400'}`}>
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleDailyGoal(goal.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        goal.completed ? 'bg-green-600 border-green-600' : 'border-current'
                      }`}>
                        {goal.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <span className={`flex-1 text-sm ${goal.completed ? 'text-calm-400 line-through' : 'text-calm-700'}`}>
                      {goal.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteDailyGoal(goal.id);
                      }}
                      className="p-1 text-calm-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </label>
                ))
              )}

              <div className="flex gap-2 pt-3 border-t border-calm-100">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                  placeholder="Add a goal..."
                  className="flex-1 px-3 py-2 border border-calm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:bg-primary-300 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trigger Journal Section */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md border border-calm-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-calm-100 bg-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-calm-900">Trigger Journal</h3>
                    <p className="text-sm text-calm-500">Track and understand your triggers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTriggerForm(true)}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Log
                </button>
              </div>
            </div>

            <div className="p-4">
              {recentTriggers.length === 0 ? (
                <div className="text-center py-6 text-calm-500">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 text-calm-300" />
                  <p className="text-sm">No triggers logged yet. Click "Log" to track your triggers.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTriggers.slice(0, 5).map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-start gap-3 p-3 bg-calm-50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        trigger.urgeLevel >= 8 ? 'bg-red-500' :
                        trigger.urgeLevel >= 5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {trigger.urgeLevel}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-calm-900 text-sm">{trigger.trigger}</p>
                        <p className="text-xs text-calm-500">{trigger.situation}</p>
                        {trigger.copingStrategy && (
                          <p className="text-xs text-calm-400 mt-1">Coped with: {trigger.copingStrategy}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTrigger(trigger.id)}
                        className="p-1 text-calm-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trigger Log Form */}
            {showTriggerForm && (
              <div className="p-4 bg-calm-50 border-t border-calm-100">
                <h4 className="font-medium text-calm-900 mb-3">Log a Trigger</h4>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-calm-700 mb-1">Trigger</label>
                    <select
                      value={newTrigger.trigger}
                      onChange={(e) => setNewTrigger({ ...newTrigger, trigger: e.target.value })}
                      className="w-full px-3 py-2 border border-calm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select...</option>
                      {defaultTriggers.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-calm-700 mb-1">Urge Level (1-10)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newTrigger.urgeLevel}
                        onChange={(e) => setNewTrigger({ ...newTrigger, urgeLevel: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-calm-700 w-6 text-center">{newTrigger.urgeLevel}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-calm-700 mb-1">Situation</label>
                  <input
                    type="text"
                    value={newTrigger.situation}
                    onChange={(e) => setNewTrigger({ ...newTrigger, situation: e.target.value })}
                    placeholder="What were you doing/feeling?"
                    className="w-full px-3 py-2 border border-calm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-calm-700 mb-1">Coping Strategy</label>
                  <input
                    type="text"
                    value={newTrigger.copingStrategy}
                    onChange={(e) => setNewTrigger({ ...newTrigger, copingStrategy: e.target.value })}
                    placeholder="How did you handle it?"
                    className="w-full px-3 py-2 border border-calm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTrigger}
                    disabled={!newTrigger.trigger}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:bg-primary-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowTriggerForm(false)}
                    className="px-4 py-2 bg-calm-200 text-calm-700 rounded-lg text-sm font-medium hover:bg-calm-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Recovery Coach */}
      {selectedAddiction && (
        <section className="py-12 bg-calm-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full text-sm font-medium text-primary-700 mb-3">
                <Brain className="h-4 w-4" />
                {selectedAddiction.name} Recovery Coach
              </div>
              <h2 className="text-2xl font-bold text-calm-900 mb-1">Your Recovery Assistant</h2>
              <p className="text-calm-600 text-sm">Chat about your recovery journey</p>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-xl shadow-md border border-calm-100 overflow-hidden">
              <div className="h-80 overflow-y-auto p-4 space-y-3 bg-calm-50">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-white border border-calm-200 text-calm-900 rounded-bl-md shadow-sm'
                    }`}>
                      <MarkdownRenderer content={msg.text} className="leading-relaxed" />
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-calm-200 rounded-xl rounded-bl-md p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                        <span className="text-calm-500 text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Urge Level Indicator */}
              <div className="px-4 py-3 border-t border-calm-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-calm-700">Current Urge Level</span>
                  <div className={`px-3 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor()}`}>
                    {urgencyLevel <= 3 ? 'Low' : urgencyLevel <= 6 ? 'Moderate' : 'High'}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={urgencyLevel}
                  onChange={(e) => {
                    const level = parseInt(e.target.value);
                    setUrgencyLevel(level);
                    if (level >= 8) setShowEmergency(true);
                  }}
                  className="w-full h-2 bg-calm-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-calm-400 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Message Input */}
              <div className="px-4 py-3 border-t border-calm-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask about your recovery...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 border border-calm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:bg-primary-300 flex items-center gap-1"
                  >
                    {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send
                  </button>
                </div>
              </div>

              {urgencyLevel >= 7 && (
                <div className="px-4 py-3 bg-red-50 border-t border-red-100">
                  <button
                    onClick={() => setShowEmergency(true)}
                    className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Need Immediate Help
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Coping Strategies */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-calm-900 mb-2">Coping Strategies</h2>
            <p className="text-calm-600">Techniques to manage urges and cravings</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {copingStrategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-calm-50 rounded-xl p-5 border border-calm-100 hover:border-primary-200 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <strategy.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-calm-900 mb-1">{strategy.title}</h3>
                <p className="text-calm-600 text-sm">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 bg-calm-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-calm-900 mb-2">Recovery Milestones</h2>
            <p className="text-calm-600">Celebrate each step of your journey</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 h-full w-0.5 bg-calm-200 md:left-1/2 md:-translate-x-px"></div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const achieved = sobrietyDays >= milestone.days;
                return (
                  <div key={index} className="flex items-center gap-4 pl-10 md:pl-0 relative">
                    <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm z-10 ${
                      achieved ? 'bg-primary-600' : 'bg-calm-300'
                    }`}>
                      {achieved ? <CheckCircle className="h-4 w-4" /> : milestone.days}
                    </div>
                    <div className={`flex-1 md:text-${index % 2 === 0 ? 'left' : 'right'}`}>
                      <div className={`bg-white rounded-lg p-3 shadow-sm border border-calm-100 ${achieved ? '' : 'opacity-60'}`}>
                        <p className="font-medium text-calm-900">{milestone.title}</p>
                        <p className="text-sm text-calm-500">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-12 bg-red-600">
        <div className="max-w-lg mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">In Crisis? Get Help Now</h2>
          <p className="text-red-100 mb-6">
            If you're feeling overwhelmed or having thoughts of self-harm, please reach out immediately.
          </p>
          <div className="space-y-3">
            <Link
              href="/crisis"
              className="block w-full py-3 bg-white text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              View Crisis Hotlines
            </Link>
            <a
              href="tel:911"
              className="block w-full py-3 bg-white/10 text-white rounded-lg font-medium border border-white/30 hover:bg-white/20 transition-colors"
            >
              Call Emergency Services
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-calm-50 border-t border-calm-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs text-calm-500">
            This platform is not a substitute for professional medical treatment. Recovery should involve healthcare professionals.
          </p>
        </div>
      </section>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-red-600 p-4 text-center">
              <AlertCircle className="h-12 w-12 text-white mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Immediate Support Available</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-calm-600 text-sm text-center">
                If you're in crisis, please reach out immediately:
              </p>
              <Link
                href="/crisis"
                className="block w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium text-center hover:bg-red-700 transition-colors"
              >
                View Crisis Hotlines
              </Link>
              <a
                href="tel:988"
                className="block w-full py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium text-center hover:bg-primary-700 transition-colors"
              >
                Call 988 (US)
              </a>
              <button
                onClick={() => setShowEmergency(false)}
                className="block w-full py-2 bg-calm-100 text-calm-700 rounded-lg text-sm font-medium hover:bg-calm-200 transition-colors"
              >
                I'm Feeling Better Now
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
