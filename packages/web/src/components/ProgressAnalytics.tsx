'use client';

import { memo, useMemo, useCallback } from 'react';
import {
  Trophy, Flame, Zap, Award, BarChart3, Share2, Download, Star, Target
} from 'lucide-react';

interface TrainingProgress {
  level: number;
  xp: number;
  challengesCompleted: number;
  totalHelpPoints: number;
  badges: string[];
  currentStreak: number;
  lastActiveDate?: string | null;
}

interface AnalyticsProps {
  progress: TrainingProgress;
  onShare?: () => void;
  onDownload?: () => void;
}

// Level definitions - memoized outside component
const levels = [
  { level: 1, name: 'Beginner Helper', xpRequired: 0, color: 'bg-green-500' },
  { level: 2, name: 'Active Listener', xpRequired: 100, color: 'bg-blue-500' },
  { level: 3, name: 'Empathy Builder', xpRequired: 250, color: 'bg-purple-500' },
  { level: 4, name: 'Support Guide', xpRequired: 500, color: 'bg-indigo-500' },
  { level: 5, name: 'Crisis Responder', xpRequired: 800, color: 'bg-red-500' },
  { level: 6, name: 'Mental Health Ally', xpRequired: 1200, color: 'bg-teal-500' },
  { level: 7, name: 'Compassion Coach', xpRequired: 1700, color: 'bg-orange-500' },
  { level: 8, name: 'Wellness Mentor', xpRequired: 2300, color: 'bg-pink-500' },
  { level: 9, name: 'Hope Ambassador', xpRequired: 3000, color: 'bg-amber-500' },
  { level: 10, name: 'Master Supporter', xpRequired: 4000, color: 'bg-gradient-to-r from-yellow-400 to-amber-600' },
];

const allBadges = [
  { id: 'first-chat', name: 'First Conversation', icon: '💬', requirement: 1 },
  { id: 'helper', name: 'Helping Hand', icon: '✋', requirement: 5 },
  { id: 'skill-builder', name: 'Skill Builder', icon: '🧱', requirement: 10 },
  { id: 'crisis-ready', name: 'Crisis Ready', icon: '🛡️', requirement: 1 },
  { id: 'century', name: 'Century Club', icon: '💯', requirement: 100 },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', requirement: 7 },
  { id: 'streak-30', name: 'Monthly Master', icon: '🌟', requirement: 30 },
  { id: 'positive', name: 'Positive Impact', icon: '💝', requirement: 1 },
];

// Stats component - memoized
const StatsGrid = memo(function StatsGrid({ progress, avgXP }: { progress: TrainingProgress; avgXP: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard icon={Trophy} value={progress.challengesCompleted} label="Sessions" color="text-amber-600" bgColor="bg-amber-100" />
      <StatCard icon={Flame} value={progress.currentStreak} label="Day Streak" color="text-orange-600" bgColor="bg-orange-100" />
      <StatCard icon={Zap} value={avgXP} label="Avg XP/Session" color="text-yellow-600" bgColor="bg-yellow-100" />
      <StatCard icon={Award} value={progress.badges.length} label="Badges" color="text-purple-600" bgColor="bg-purple-100" />
    </div>
  );
});

// Individual stat card - memoized
const StatCard = memo(function StatCard({
  icon: Icon,
  value,
  label,
  color,
  bgColor
}: {
  icon: typeof Trophy;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="text-center p-4 bg-calm-50 rounded-xl">
      <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-calm-900">{value}</p>
      <p className="text-xs text-calm-500">{label}</p>
    </div>
  );
});

// Badge section - memoized
const BadgeSection = memo(function BadgeSection({ earned, total }: { earned: number; total: number }) {
  const percent = Math.round((earned / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-calm-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          Badge Progress
        </h5>
        <span className="text-sm text-calm-500">{earned}/{total}</span>
      </div>
      <div className="h-2 bg-calm-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

// Earned badges - memoized
const EarnedBadges = memo(function EarnedBadges({ badges }: { badges: string[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="mb-6">
      <h5 className="font-semibold text-calm-900 mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-500" />
        Earned Badges
      </h5>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => {
          const badgeDef = allBadges.find(ab => ab.icon === badge || ab.id === badge);
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
            >
              <span className="text-xl">{badge}</span>
              <span className="text-sm font-medium text-amber-800">{badgeDef?.name || 'Badge'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Locked badges preview - memoized
const LockedBadges = memo(function LockedBadges({ badges }: { badges: string[] }) {
  const locked = allBadges.filter(b => !badges.includes(b.icon) && !badges.includes(b.id));

  if (locked.length === 0 || badges.length >= allBadges.length) return null;

  return (
    <div>
      <h5 className="font-semibold text-calm-900 mb-3 flex items-center gap-2">
        <Target className="h-4 w-4 text-calm-400" />
        Badges to Earn
      </h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {locked.slice(0, 4).map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center p-3 bg-calm-50 rounded-xl opacity-60"
          >
            <span className="text-2xl grayscale mb-1">{badge.icon}</span>
            <span className="text-xs text-calm-600 text-center">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

function ProgressAnalyticsInner({ progress, onShare, onDownload }: AnalyticsProps) {
  const currentLevel = useMemo(() =>
    levels.find(l => l.level === progress.level) || levels[0],
    [progress.level]
  );

  const nextLevel = useMemo(() =>
    levels.find(l => l.level === progress.level + 1),
    [progress.level]
  );

  const xpProgress = useMemo(() => {
    if (!nextLevel) return 100;
    return Math.min(100, ((progress.xp - currentLevel.xpRequired) /
      (nextLevel.xpRequired - currentLevel.xpRequired)) * 100);
  }, [progress.xp, currentLevel.xpRequired, nextLevel]);

  const stats = useMemo(() => ({
    avgXPPerSession: progress.challengesCompleted > 0
      ? Math.round(progress.totalHelpPoints / progress.challengesCompleted)
      : 0,
    xpToNextLevel: nextLevel ? nextLevel.xpRequired - progress.xp : 0,
    badgeProgress: `${progress.badges.length}/${allBadges.length}`,
    badgePercent: Math.round((progress.badges.length / allBadges.length) * 100),
  }), [progress, nextLevel, currentLevel]);

  const handleShare = useCallback(() => {
    const shareText = `MindHack Progress Report

Level: ${progress.level} (${currentLevel.name})
XP: ${progress.xp}
Sessions: ${progress.challengesCompleted}
Streak: ${progress.currentStreak} days
Badges: ${progress.badges.length}

Join me on my mental health training journey!`;

    if (navigator.share) {
      navigator.share({ title: 'MindHack Progress', text: shareText }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
    }
  }, [progress, currentLevel]);

  const handleDownload = useCallback(() => {
    const report = {
      reportDate: new Date().toISOString(),
      user: {
        level: progress.level,
        xp: progress.xp,
        challengesCompleted: progress.challengesCompleted,
        currentStreak: progress.currentStreak,
        badges: progress.badges,
        totalHelpPoints: progress.totalHelpPoints,
      },
      levelDetails: currentLevel,
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
  }, [progress, currentLevel]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-calm-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-calm-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-calm-900">Your Progress</h3>
            <p className="text-sm text-calm-500">Track your achievements</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={handleShare}
              className="p-2 text-calm-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Share progress"
            >
              <Share2 className="h-5 w-5" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-calm-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Download report"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Level Card */}
      <div className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-calm-100">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 ${currentLevel.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
            {currentLevel.level}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-calm-900">{currentLevel.name}</h4>
            <p className="text-calm-500 text-sm">
              {nextLevel ? `Level ${nextLevel.level}: ${nextLevel.name}` : 'Maximum Level Achieved!'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">{progress.xp}</p>
            <p className="text-sm text-calm-500">Total XP</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-calm-600">Progress to Level {nextLevel.level}</span>
              <span className="text-calm-500">{Math.round(xpProgress)}%</span>
            </div>
            <div className="h-3 bg-calm-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-calm-500 mt-1">
              {stats.xpToNextLevel} XP needed
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <StatsGrid progress={progress} avgXP={stats.avgXPPerSession} />
        <BadgeSection earned={progress.badges.length} total={allBadges.length} />
        <EarnedBadges badges={progress.badges} />
        <LockedBadges badges={progress.badges} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-calm-50 border-t border-calm-100">
        <button
          onClick={handleShare}
          className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="h-5 w-5" />
          Share Your Progress
        </button>
      </div>
    </div>
  );
}

// Export memoized component
export default memo(ProgressAnalyticsInner);
