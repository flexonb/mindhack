'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import { Brain, Heart, Shield, Users, ChevronRight, Sparkles, MessageCircle, Frown, Wind, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <Layout activePage="home">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-calm-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  AI-Powered Mental Health Training
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-calm-900 leading-tight">
                Learn to Help.
                <br />
                <span className="text-primary-600">Get Support.</span>
                <br />
                Feel Better.
              </h1>
              <p className="text-xl text-calm-600 max-w-lg">
                Practice handling mental health conversations with AI personas,
                then connect with real human helpers when you need support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/training" className="btn-primary flex items-center justify-center gap-2">
                  Start Training
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/demo" className="btn-secondary flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Try Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-calm-100">
                <div className="space-y-4">
                  {/* Chat preview */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1 bg-calm-50 rounded-xl p-4">
                      <p className="text-calm-700">
                        I just... I don't know anymore. Everything feels so overwhelming.
                        Like I'm drowning and no one can see it.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-wellness-green/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-wellness-green" />
                    </div>
                    <div className="flex-1 bg-primary-50 rounded-xl p-4">
                      <p className="text-calm-700">
                        I hear you, and I want you to know that what you're feeling is valid.
                        Can you tell me more about what's been overwhelming you lately?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-calm-500">
                    <Shield className="h-4 w-4" />
                    <span>Safe, confidential, and secure</span>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-wellness-green/10 rounded-xl p-3 animate-bounce-gentle">
                <Heart className="h-6 w-6 text-wellness-green" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-wellness-purple/10 rounded-xl p-3">
                <Users className="h-6 w-6 text-wellness-purple" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-calm-900 mb-4">
              Two Powerful Modes for Mental Wellness
            </h2>
            <p className="text-xl text-calm-600">
              Whether you want to practice helping others or need someone to talk to,
              MindHack has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Training Mode */}
            <div id="training" className="card bg-gradient-to-br from-primary-50 to-white border-primary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-calm-900 mb-3">
                AI Training Mode
              </h3>
              <p className="text-calm-600 mb-6">
                Practice conversations with AI personas simulating various mental health
                conditions. Learn to recognize warning signs, respond with empathy,
                and provide appropriate support.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                  Multiple mental health personas
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                  Real-time feedback and guidance
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                  Skill progression tracking
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                  Crisis intervention training
                </li>
              </ul>
              <Link href="/training" className="btn-primary w-full flex items-center justify-center gap-2">
                Explore Training
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Support Mode */}
            <div id="support" className="card bg-gradient-to-br from-wellness-green/10 to-white border-wellness-green/20">
              <div className="w-12 h-12 bg-wellness-green/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-wellness-green" />
              </div>
              <h3 className="text-2xl font-bold text-calm-900 mb-3">
                Human Support Mode
              </h3>
              <p className="text-calm-600 mb-6">
                Connect with trained listeners, peer supporters, and licensed counselors
                whenever you need someone to talk to.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-wellness-green" />
                  Trained mental health listeners
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-wellness-green" />
                  24/7 crisis responders available
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-wellness-green" />
                  Anonymous matching available
                </li>
                <li className="flex items-center gap-2 text-calm-700">
                  <ChevronRight className="h-4 w-4 text-wellness-green" />
                  Professional counselors
                </li>
              </ul>
              <Link href="/support" className="btn-secondary w-full flex items-center justify-center gap-2">
                Get Support Now
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Personas Section */}
      <section className="py-20 bg-calm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-calm-900 mb-4">
              Train with Realistic AI Personas
            </h2>
            <p className="text-xl text-calm-600">
              Our AI personas simulate authentic mental health scenarios,
              helping you develop real-world helping skills.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Depression', icon: Frown, color: 'bg-blue-100 text-blue-700' },
              { name: 'Anxiety', icon: Wind, color: 'bg-yellow-100 text-yellow-700' },
              { name: 'PTSD', icon: AlertTriangle, color: 'bg-purple-100 text-purple-700' },
              { name: 'Crisis', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
            ].map((persona) => (
              <Link
                key={persona.name}
                href="/training"
                className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 ${persona.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <persona.icon className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-calm-900">{persona.name}</h4>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/training" className="btn-primary inline-flex items-center gap-2">
              View All Personas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start practicing with our AI personas or connect with a human helper today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Try Demo Now
            </Link>
            <Link href="/support" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Get Support
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
