'use client';

import Layout from '@/components/Layout';
import { AlertTriangle, Heart, Phone, Brain, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <Layout activePage="home">
      <div className="bg-gradient-to-br from-red-50 via-white to-amber-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-calm-900 mb-2">Important Disclaimer</h1>
            <p className="text-calm-600">Please read this before using MindHack</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 space-y-8">
            {/* Critical Notice */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Not a Substitute for Professional Care</h3>
                  <p className="text-red-700 dark:text-red-300">
                    MindHack is an <strong>educational and support tool</strong>, NOT a replacement for professional mental health care.
                    If you're experiencing a mental health crisis, please seek immediate help from qualified professionals.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Section */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500" />
                In Case of Emergency
              </h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                  If you or someone else is in immediate danger, do NOT use MindHack:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-amber-700 dark:text-amber-300">
                  <li>Call your local emergency number (911 in the US)</li>
                  <li>Go to your nearest hospital emergency room</li>
                  <li>Contact a crisis hotline (988 in the US)</li>
                  <li>Reach out to a trusted family member or friend</li>
                </ul>
              </div>
            </section>

            {/* What MindHack Is */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary-500" />
                What MindHack Is
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-calm-50 dark:bg-calm-800 rounded-xl p-4">
                  <h4 className="font-semibold text-calm-900 dark:text-white mb-2">Training</h4>
                  <p className="text-calm-600 dark:text-calm-400 text-sm">
                    Practice empathy and helping skills through AI-powered role-play scenarios
                  </p>
                </div>
                <div className="bg-calm-50 dark:bg-calm-800 rounded-xl p-4">
                  <h4 className="font-semibold text-calm-900 dark:text-white mb-2">Support</h4>
                  <p className="text-calm-600 dark:text-calm-400 text-sm">
                    Emotional support and a non-judgmental space to express yourself
                  </p>
                </div>
                <div className="bg-calm-50 dark:bg-calm-800 rounded-xl p-4">
                  <h4 className="font-semibold text-calm-900 dark:text-white mb-2">Education</h4>
                  <p className="text-calm-600 dark:text-calm-400 text-sm">
                    Learn about mental health topics through curated resources
                  </p>
                </div>
                <div className="bg-calm-50 dark:bg-calm-800 rounded-xl p-4">
                  <h4 className="font-semibold text-calm-900 dark:text-white mb-2">Information</h4>
                  <p className="text-calm-600 dark:text-calm-400 text-sm">
                    Access crisis hotlines and professional resources worldwide
                  </p>
                </div>
              </div>
            </section>

            {/* What MindHack Is NOT */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                What MindHack Is NOT
              </h2>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-4">
                <ul className="list-disc list-inside ml-2 space-y-2 text-calm-700 dark:text-calm-300">
                  <li><strong>Medical diagnosis:</strong> We cannot diagnose mental health conditions</li>
                  <li><strong>Professional therapy:</strong> Not a replacement for licensed therapists</li>
                  <li><strong>Medication management:</strong> We cannot prescribe or manage medications</li>
                  <li><strong>Emergency service:</strong> Not equipped to handle acute crises</li>
                  <li><strong>Legal advice:</strong> Cannot provide guidance on legal matters</li>
                </ul>
              </div>
            </section>

            {/* AI Limitations */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                AI Limitations
              </h2>
              <div className="text-calm-600 dark:text-calm-400 space-y-2">
                <p>MindHack uses AI technology which has inherent limitations:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>AI responses are generated and may not always be accurate</li>
                  <li>Cannot recognize all crisis situations or warning signs</li>
                  <li>May not understand complex personal circumstances</li>
                  <li>Cannot provide the nuance of human empathy and care</li>
                  <li>May occasionally provide inappropriate or harmful responses</li>
                </ul>
              </div>
            </section>

            {/* Seek Professional Help */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4">When to Seek Professional Help</h2>
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                <p className="text-primary-800 dark:text-primary-200 font-medium mb-2">
                  Consider reaching out to a professional if you experience:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-primary-700 dark:text-primary-300">
                  <li>Thoughts of self-harm or suicide</li>
                  <li>Symptoms that interfere with daily life for more than 2 weeks</li>
                  <li>Use of substances to cope with emotions</li>
                  <li>Panic attacks or severe anxiety</li>
                  <li>Trauma symptoms (flashbacks, nightmares)</li>
                  <li>Any concern about your mental health</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/crisis" className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Crisis Resources
            </Link>
            <Link href="/" className="px-6 py-3 bg-calm-100 dark:bg-calm-800 text-calm-700 dark:text-calm-300 rounded-xl font-medium hover:bg-calm-200 dark:hover:bg-calm-700 transition-colors flex items-center gap-2">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
