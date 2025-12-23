'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  Brain, Heart, Shield, ChevronRight, ArrowRight,
  Trophy, Star, Target, Clock, BookOpen, CheckCircle,
  Lock, Share2, Zap, Award, Medal, Crown, RefreshCw, Loader2,
  BarChart3, Download, TrendingUp, Lightbulb
} from 'lucide-react';
import ProgressAnalytics from '@/components/ProgressAnalytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Types for real data from API
interface Persona {
  id: string;
  name: string;
  condition: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  traits: string[];
  openingMessages: string[];
  crisisKeywords: string[];
  idealResponses: string[];
  xpReward: number;
  estimatedTime: string;
  color: string;
}

interface UserProgress {
  level: number;
  xp: number;
  challengesCompleted: number;
  totalHelpPoints: number;
  badges: string[];
  currentStreak: number;
}

// Level definitions
const levels = [
  { level: 1, name: 'Beginner Helper', xpRequired: 0, icon: '🌱', color: 'bg-green-500' },
  { level: 2, name: 'Active Listener', xpRequired: 100, icon: '👂', color: 'bg-blue-500' },
  { level: 3, name: 'Empathy Builder', xpRequired: 250, icon: '💝', color: 'bg-purple-500' },
  { level: 4, name: 'Support Guide', xpRequired: 500, icon: '🛤️', color: 'bg-indigo-500' },
  { level: 5, name: 'Crisis Responder', xpRequired: 800, icon: '🛡️', color: 'bg-red-500' },
  { level: 6, name: 'Mental Health Ally', xpRequired: 1200, icon: '🤝', color: 'bg-teal-500' },
  { level: 7, name: 'Compassion Coach', xpRequired: 1700, icon: '🎯', color: 'bg-orange-500' },
  { level: 8, name: 'Wellness Mentor', xpRequired: 2300, icon: '✨', color: 'bg-pink-500' },
  { level: 9, name: 'Hope Ambassador', xpRequired: 3000, icon: '🌟', color: 'bg-amber-500' },
  { level: 10, name: 'Master Supporter', xpRequired: 4000, icon: '👑', color: 'bg-gradient-to-r from-yellow-400 to-amber-600' },
];

// Milestones
const milestones = [
  { id: 1, name: 'First Conversation', description: 'Complete your first challenge', icon: '💬', requirement: 1, reward: 'Beginner Badge' },
  { id: 2, name: 'Helping Hand', description: 'Complete 5 challenges', icon: '✋', requirement: 5, reward: 'Helper Badge' },
  { id: 3, name: 'Skill Builder', description: 'Complete 10 challenges', icon: '🧱', requirement: 10, reward: 'Skill Builder Badge' },
  { id: 4, name: 'Crisis Ready', description: 'Complete a crisis intervention challenge', icon: '🛡️', requirement: 1, reward: 'Crisis Ready Badge' },
  { id: 5, name: 'Century Club', description: 'Complete 100 challenges', icon: '💯', requirement: 100, reward: 'Century Club Badge' },
  { id: 6, name: 'Master Helper', description: 'Reach Level 10', icon: '👑', requirement: 10, reward: 'Master Helper Title' },
];

// Difficulty colors
const difficultyColors: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  intermediate: 'from-blue-400 to-indigo-500',
  advanced: 'from-amber-400 to-orange-500',
  expert: 'from-red-400 to-rose-500',
};

const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function TrainingPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showBadges, setShowBadges] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    challengesCompleted: 0,
    totalHelpPoints: 0,
    badges: [],
    currentStreak: 1,
  });

  // Load user progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindhack_training_progress');
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
  }, []);

  // Save user progress to localStorage
  const saveProgress = useCallback((progress: UserProgress) => {
    setUserProgress(progress);
    localStorage.setItem('mindhack_training_progress', JSON.stringify(progress));
  }, []);

  // Share progress
  const handleShare = useCallback(() => {
    const shareText = `🌟 MindHack Progress Report\n\n` +
      `📊 Level: ${userProgress.level} (${levels.find(l => l.level === userProgress.level)?.name || 'Beginner'})\n` +
      `⭐ XP: ${userProgress.xp}\n` +
      `🎯 Sessions: ${userProgress.challengesCompleted}\n` +
      `🔥 Streak: ${userProgress.currentStreak} days\n` +
      `🏆 Badges: ${userProgress.badges.length}\n\n` +
      `Join me on my mental health training journey!`;

    if (navigator.share) {
      navigator.share({
        title: 'MindHack Progress',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  }, [userProgress]);

  // Download progress report
  const handleDownload = useCallback(() => {
    const report = {
      reportDate: new Date().toISOString(),
      user: {
        level: userProgress.level,
        xp: userProgress.xp,
        challengesCompleted: userProgress.challengesCompleted,
        currentStreak: userProgress.currentStreak,
        badges: userProgress.badges,
        totalHelpPoints: userProgress.totalHelpPoints,
      },
      levelDetails: levels.find(l => l.level === userProgress.level),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindhack-progress-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userProgress]);

  // Fetch personas from real API
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/support/companions`);
        if (!response.ok) throw new Error('Failed to fetch personas');

        const data = await response.json();
        if (data.success && data.data?.companions) {
          // Transform companions to training personas format
          const transformedPersonas: Persona[] = data.data.companions.map((companion: any, index: number) => {
            const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
            const conditions = ['Depression', 'Anxiety', 'Burnout', 'Grief', 'Self-Esteem', 'Relationships', 'Crisis'];
            const colors = ['from-blue-400 to-indigo-500', 'from-amber-400 to-orange-500', 'from-purple-400 to-violet-500', 'from-pink-400 to-rose-500'];

            return {
              id: companion.id || `persona-${index}`,
              name: companion.name || `Persona ${index + 1}`,
              condition: companion.specialties?.[0] || conditions[index % conditions.length],
              difficulty: difficulties[index % difficulties.length] as any,
              description: companion.description || `Practice helping someone with ${conditions[index % conditions.length].toLowerCase()}.`,
              traits: companion.specialties || ['Active Listening', 'Empathy', 'Support'],
              openingMessages: [
                `I've been struggling lately and I don't know who to talk to...`,
                `Things have been really hard for me.`,
                `I just need someone to listen.`,
              ],
              crisisKeywords: ['hurt myself', 'end it all', 'suicide', 'kill', 'die'],
              idealResponses: ['I hear you', 'That sounds really difficult', 'I\'m here for you'],
              xpReward: 50 + (index * 25),
              estimatedTime: '5-10 min',
              color: colors[index % colors.length],
            };
          });

          setPersonas(transformedPersonas);
        }
      } catch (error) {
        console.error('Error fetching personas:', error);
        // Fallback to empty array - will show error state
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const currentLevel = levels.find(l => l.level === userProgress.level) || levels[0];
  const nextLevel = levels.find(l => l.level === userProgress.level + 1);
  const xpProgress = nextLevel
    ? Math.min(100, ((userProgress.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100)
    : 100;

  const categories = [...new Set(personas.map(p => p.condition))];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredPersonas = personas.filter(p => {
    const matchesCategory = !selectedCategory || p.condition === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesCategory && matchesDifficulty;
  });

  const completedChallenges = userProgress.challengesCompleted;

  if (loading) {
    return (
      <Layout activePage="training">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-calm-600 font-medium">Loading training scenarios...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="training">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* User Stats Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Level & Avatar */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className={`w-20 h-20 ${currentLevel.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                    {currentLevel.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                    <span className="text-xs font-bold text-calm-900">{userProgress.level}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-calm-900">{currentLevel.name}</h2>
                  <p className="text-calm-500 text-sm">{nextLevel ? `Level ${nextLevel.level}: ${nextLevel.name}` : 'Max Level Reached!'}</p>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-calm-600">{userProgress.xp} XP</span>
                  <span className="text-calm-500">{nextLevel ? `${nextLevel.xpRequired} XP` : 'MAX'} XP</span>
                </div>
                <div className="h-3 bg-calm-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${currentLevel.color} rounded-full transition-all duration-500`}
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-calm-500 mt-1">
                  {nextLevel ? `${nextLevel.xpRequired - userProgress.xp} XP to next level` : 'Congratulations!'}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-calm-900">{completedChallenges}</p>
                  <p className="text-xs text-calm-500">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-calm-900">{userProgress.currentStreak}</p>
                  <p className="text-xs text-calm-500">Day Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-calm-900">{userProgress.totalHelpPoints}</p>
                  <p className="text-xs text-calm-500">Help Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/support"
              className="group px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Get Support
            </Link>
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold border-2 border-calm-200 hover:border-primary-300 transition-all duration-300 flex items-center gap-2"
            >
              <Trophy className="h-5 w-5 text-amber-500" />
              Badges
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold border-2 border-calm-200 hover:border-primary-300 transition-all duration-300 flex items-center gap-2"
            >
              <BarChart3 className="h-5 w-5 text-primary-500" />
              Analytics
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold border-2 border-calm-200 hover:border-primary-300 transition-all duration-300 flex items-center gap-2"
            >
              <Share2 className="h-5 w-5 text-blue-500" />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold border-2 border-calm-200 hover:border-red-300 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="h-5 w-5 text-green-500" />
              Export
            </button>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      {showBadges && (
        <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-semibold text-calm-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Your Badges ({userProgress.badges.length})
            </h3>
            <div className="flex flex-wrap gap-4">
              {userProgress.badges.map((badge, index) => (
                <div key={index} className="bg-white rounded-xl p-3 shadow-md flex items-center gap-2">
                  <span className="text-2xl">{badge}</span>
                  <span className="text-sm font-medium text-calm-700">Earned</span>
                </div>
              ))}
              {milestones.filter(m => !userProgress.badges.includes(m.icon) && m.requirement > completedChallenges).map((milestone) => (
                <div key={milestone.id} className="bg-calm-100 rounded-xl p-3 flex items-center gap-2 opacity-60">
                  <span className="text-2xl grayscale">{milestone.icon}</span>
                  <span className="text-sm text-calm-500">{milestone.requirement - completedChallenges} more</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Analytics Section */}
      {showAnalytics && (
        <section className="py-8 bg-calm-50 border-y border-calm-100 animate-in slide-in-from-top-2">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressAnalytics
              progress={userProgress}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          </div>
        </section>
      )}

      {/* Milestones Progress */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-calm-900 mb-6">Your Journey</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone) => {
              const achieved = completedChallenges >= milestone.requirement;
              return (
                <div
                  key={milestone.id}
                  className={`relative rounded-2xl p-4 border-2 transition-all duration-300 ${
                    achieved
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                      : 'bg-calm-50 border-calm-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${achieved ? 'bg-emerald-100' : 'bg-calm-200'}`}>
                      {achieved ? milestone.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achieved ? 'text-calm-900' : 'text-calm-500'}`}>
                        {milestone.name}
                      </h4>
                      <p className="text-sm text-calm-500">{milestone.description}</p>
                      <p className="text-xs font-medium text-primary-600 mt-1">
                        Reward: {milestone.reward}
                      </p>
                    </div>
                    {achieved && (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    )}
                  </div>
                  {!achieved && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-calm-500 mb-1">
                        <span>{completedChallenges}/{milestone.requirement}</span>
                        <span>{Math.round(Math.min(100, (completedChallenges / milestone.requirement) * 100))}%</span>
                      </div>
                      <div className="h-2 bg-calm-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (completedChallenges / milestone.requirement) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Scenarios Section */}
      <section className="py-12 bg-gradient-to-b from-white to-calm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-calm-900 mb-2">Training Scenarios</h2>
              <p className="text-calm-600">Practice helping people with real AI-powered conversations</p>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2.5 rounded-xl border border-calm-200 bg-white text-calm-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-4 py-2.5 rounded-xl border border-calm-200 bg-white text-calm-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          {personas.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-calm-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-calm-900 mb-2">No Training Scenarios Available</h3>
              <p className="text-calm-500 mb-4">We're preparing real training scenarios for you.</p>
              <Link
                href="/support/chat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Try a Companion
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonas.map((persona) => {
                const difficultyIndex = difficultyOrder.indexOf(persona.difficulty);
                // All personas are accessible - user can start training immediately
                const isLocked = false;

                return (
                  <div
                    key={persona.id}
                    className={`group relative bg-white rounded-2xl overflow-hidden border border-calm-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
                  >
                    {/* Difficulty Indicator */}
                    <div className={`h-2 bg-gradient-to-r ${persona.color}`}></div>

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {difficultyIndex + 1}
                        </div>
                        <div className="flex items-center gap-1 text-calm-500 text-sm">
                          <Clock className="h-4 w-4" />
                          {persona.estimatedTime}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-calm-900 mb-2">{persona.name}</h3>
                      <p className="text-calm-600 text-sm mb-4 line-clamp-2">{persona.description}</p>

                      {/* Condition & Traits */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                          {persona.condition}
                        </span>
                        {persona.traits.slice(0, 2).map((trait) => (
                          <span key={trait} className="px-2 py-1 bg-calm-100 text-calm-600 rounded-lg text-xs">
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* Success Preview */}
                      <div className="bg-emerald-50 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium mb-1">
                          <CheckCircle className="h-4 w-4" />
                          Success Goal
                        </div>
                        <p className="text-calm-600 text-xs">
                          Help the person feel heard and practice evidence-based support techniques.
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-calm-100">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span className="font-semibold text-calm-900">{persona.xpReward} XP</span>
                        </div>
                      </div>

                      {/* Start Button Overlay */}
                      <Link
                        href={`/training/chat?persona=${persona.id}`}
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2 text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                          <>
                            Start Training
                            <ArrowRight className="h-5 w-5" />
                          </>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 bg-calm-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-calm-900 mb-4">Training Tips</h2>
          <p className="text-calm-600 mb-6">
            Each scenario has a clear ending when the person feels better. Your goal is to help them reach that point
            through active listening, empathy, and evidence-based support techniques.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-calm-900 mb-2">Listen First</h4>
              <p className="text-calm-600 text-sm">Before jumping to solutions, make sure they feel heard and understood.</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-calm-900 mb-2">Validate Emotions</h4>
              <p className="text-calm-600 text-sm">Acknowledge their feelings without judgment - it helps them feel less alone.</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-calm-900 mb-2">Small Steps</h4>
              <p className="text-calm-600 text-sm">Big changes happen through small, achievable actions they commit to.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

