'use client';

import Layout from '@/components/Layout';
import {
  Brain, Heart, Shield, BookOpen, ArrowRight, CheckCircle,
  Users, MessageCircle, TrendingUp, Award, Phone, ChevronRight,
  Play, Star, Target, Clock, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <Layout activePage="home">
      <div className="bg-gradient-to-br from-calm-50 via-white to-primary-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-calm-900 mb-2">How MindHack Works</h1>
            <p className="text-calm-600">Your journey to better mental health starts here</p>
          </div>

          {/* Two Main Paths */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Training Path */}
            <div className="bg-white rounded-2xl shadow-sm border border-calm-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-calm-900">Training Mode</h2>
                  <p className="text-sm text-calm-500">Practice empathy & helping skills</p>
                </div>
              </div>
              <p className="text-calm-600 mb-6">
                Role-play as a supporter to practice empathetic responses and learn how to help people facing mental health challenges.
              </p>

              {/* Training Flow Tree */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="w-0.5 h-8 bg-primary-200"></div>
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary-500" />
                      Choose a Persona
                    </h4>
                    <p className="text-sm text-calm-600">
                      Select from various personas representing different mental health conditions (anxiety, depression, grief, etc.)
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="w-0.5 h-8 bg-primary-200"></div>
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary-500" />
                      Practice Responses
                    </h4>
                    <p className="text-sm text-calm-600">
                      Chat with the AI persona and practice giving supportive, empathetic responses
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="w-0.5 h-8 bg-primary-200"></div>
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary-500" />
                      Get Real-time Feedback
                    </h4>
                    <p className="text-sm text-calm-600">
                      AI evaluates your responses and provides empathy score with detailed feedback
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary-500" />
                      Earn XP & Badges
                    </h4>
                    <p className="text-sm text-calm-600">
                      Complete sessions to earn experience points and unlock achievement badges
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/training"
                className="mt-6 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Training
              </Link>
            </div>

            {/* Support Path */}
            <div className="bg-white rounded-2xl shadow-sm border border-calm-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-calm-900">Support Mode</h2>
                  <p className="text-sm text-calm-500">24/7 AI companionship</p>
                </div>
              </div>
              <p className="text-calm-600 mb-6">
                Chat with supportive AI companions designed to provide emotional support and a listening ear whenever you need it.
              </p>

              {/* Support Flow Tree */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="w-0.5 h-8 bg-emerald-200"></div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Choose a Companion
                    </h4>
                    <p className="text-sm text-calm-600">
                      Select from specialized companions (anxiety specialist, grief counselor, stress relief, etc.)
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="w-0.5 h-8 bg-emerald-200"></div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-emerald-500" />
                      Start Conversing
                    </h4>
                    <p className="text-sm text-calm-600">
                      Share your thoughts, feelings, or challenges in a safe, non-judgmental space
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="w-0.5 h-8 bg-emerald-200"></div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-emerald-500" />
                      Receive Support
                    </h4>
                    <p className="text-sm text-calm-600">
                      Get empathetic responses, coping strategies, and emotional validation
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-calm-900 mb-1 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Feel Better
                    </h4>
                    <p className="text-sm text-calm-600">
                      Gain insights, learn coping skills, and find comfort in being heard
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/support"
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Get Support
              </Link>
            </div>
          </div>

          {/* Crisis Path */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-sm border border-red-100 p-8 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-calm-900">Crisis Support</h2>
                <p className="text-sm text-calm-500">Immediate help when you need it most</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                  1
                </div>
                <h4 className="font-semibold text-calm-900 mb-1">Recognize Crisis</h4>
                <p className="text-sm text-calm-600">Identify when you or someone else needs immediate help</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                  2
                </div>
                <h4 className="font-semibold text-calm-900 mb-1">Access Resources</h4>
                <p className="text-sm text-calm-600">Find global crisis hotlines and emergency contacts</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                  3
                </div>
                <h4 className="font-semibold text-calm-900 mb-1">Reach Out</h4>
                <p className="text-sm text-calm-600">Call or text crisis lines for immediate support</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                  4
                </div>
                <h4 className="font-semibold text-calm-900 mb-1">Stay Safe</h4>
                <p className="text-sm text-calm-600">Follow safety planning and professional guidance</p>
              </div>
            </div>

            <Link
              href="/crisis"
              className="mt-6 w-full md:w-auto md:px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto md:block md:mx-auto"
            >
              <Phone className="h-4 w-4" />
              Access Crisis Resources
            </Link>
          </div>

          {/* Features Comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-calm-100 p-8">
            <h2 className="text-2xl font-bold text-calm-900 text-center mb-8">Compare Features</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-calm-100">
                    <th className="text-left py-4 px-4 font-semibold text-calm-900">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-calm-900">Training Mode</th>
                    <th className="text-center py-4 px-4 font-semibold text-calm-900">Support Mode</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">AI Role-play Practice</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><span className="text-calm-300">—</span></td>
                  </tr>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">Empathy Scoring</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><span className="text-calm-300">—</span></td>
                  </tr>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">XP & Badges System</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><span className="text-calm-300">—</span></td>
                  </tr>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">Emotional Support</td>
                    <td className="text-center py-4 px-4"><span className="text-calm-300">—</span></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">24/7 Availability</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-calm-50">
                    <td className="py-4 px-4 text-calm-700">Suggested Responses</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-calm-700">Progress Tracking</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-5 w-5 text-primary-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><span className="text-calm-300">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-calm-900 mb-4">Ready to Get Started?</h2>
            <p className="text-calm-600 mb-6 max-w-2xl mx-auto">
              Whether you want to practice helping others or need someone to talk to, MindHack is here to support your mental health journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/training"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Brain className="h-5 w-5" />
                Start Training
              </Link>
              <Link
                href="/support"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Get Support
              </Link>
              <Link
                href="/resources"
                className="px-6 py-3 bg-calm-100 text-calm-700 rounded-xl font-semibold hover:bg-calm-200 transition-colors flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
