'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Brain, Heart, Shield, Users, ChevronRight, MessageCircle, ArrowRight, Target, Clock, Award, BookOpen, Phone } from 'lucide-react';
import AnimatedTagline, { Typewriter } from '@/components/AnimatedTagline';

const features = [
  {
    icon: Brain,
    title: 'Realistic AI Personas',
    description: 'Practice with AI that simulates authentic mental health scenarios',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: Target,
    title: 'Skill Development',
    description: 'Learn evidence-based techniques for supporting others effectively',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Train anytime, anywhere at your own pace',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Award,
    title: 'Progress Tracking',
    description: 'Track your growth and build confidence over time',
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

const quickFeatures = [
  { id: 1, title: 'AI Training', description: 'Practice with realistic personas', icon: Brain, href: '/training', color: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400' },
  { id: 2, title: 'Skill Levels', description: '10 levels of mastery', icon: Target, href: '/training', color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' },
  { id: 3, title: 'AI Companions', description: '24/7 emotional support', icon: Heart, href: '/support', color: 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400' },
  { id: 4, title: 'Resources', description: 'Mental health library', icon: BookOpen, href: '/resources', color: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' },
  { id: 5, title: 'Crisis Help', description: 'Immediate resources', icon: Phone, href: '/crisis', color: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' },
  { id: 6, title: 'Get Support', description: 'Connect with helpers', icon: MessageCircle, href: '/support', color: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400' },
];

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Layout activePage="home">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-calm-50 dark:bg-calm-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle Floating Elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        >
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-amber-200/30 dark:bg-amber-700/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-cyan-200/30 dark:bg-cyan-700/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
              <Brain className="h-4 w-4" />
              Mental Health Training Platform
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-calm-900 dark:text-white mb-6 leading-tight">
              Master the Art of{' '}
              <br className="hidden md:block" />
              <span className="text-primary-600 dark:text-primary-400">
                <AnimatedTagline
                  words={[
                    'Mental Resilience',
                    'Helping Others',
                    'Inner Peace',
                    'Positive Change',
                    'Self Growth',
                    'Compassion',
                  ]}
                  className="text-primary-600 dark:text-primary-400"
                />
              </span>
            </h1>

            <p className="text-xl text-calm-600 dark:text-calm-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice real conversations with AI personas, track your progress, and develop essential mental health support skills at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/training"
                className="group px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Start Training
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 bg-white dark:bg-calm-800 text-calm-700 dark:text-calm-200 rounded-xl font-semibold border-2 border-calm-200 dark:border-calm-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Support
              </Link>
            </div>

            {/* Quick Features Grid */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {quickFeatures.map((feature) => (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className="group p-4 bg-white dark:bg-calm-800 rounded-xl border border-calm-100 dark:border-calm-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-calm-900 dark:text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-calm-500 dark:text-calm-400">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-calm-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-calm-900 dark:text-white mb-4">
              Why Choose MindHack?
            </h2>
            <p className="text-lg text-calm-600 dark:text-calm-400 max-w-2xl mx-auto">
              Everything you need to develop mental health support skills and grow as a helper.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-calm-50 dark:bg-calm-900 rounded-2xl border border-calm-100 dark:border-calm-800 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.bgLight} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-calm-700 dark:text-calm-300" />
                </div>
                <h3 className="text-xl font-semibold text-calm-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-calm-600 dark:text-calm-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-calm-100 dark:bg-calm-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-calm-900 dark:text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-calm-600 dark:text-calm-400 mb-8">
            Start your journey to becoming a better supporter today. No experience needed.
          </p>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
          >
            Get Started Free
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
