'use client';

import Layout from '@/components/Layout';
import { FileText, CheckCircle, AlertTriangle, Users, Scale } from 'lucide-react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <Layout activePage="home">
      <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-calm-900 mb-2">Terms of Service</h1>
            <p className="text-calm-600">Rules and guidelines for using MindHack</p>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-calm-500 mb-8">
            Last updated: December 2025
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-calm-100 p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Acceptance of Terms</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400">
                <p>By accessing and using MindHack, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Use of Services</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400 space-y-2">
                <p><strong>You agree to:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Use MindHack only for lawful purposes</li>
                  <li>Respect the educational nature of our training simulations</li>
                  <li>Not impersonate others or provide false information</li>
                  <li>Not attempt to manipulate or exploit the AI systems</li>
                  <li>Keep your account credentials (if any) confidential</li>
                </ul>
                <p className="mt-3"><strong>You agree NOT to:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Use the service for any illegal or harmful purposes</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Share explicit content or violence</li>
                  <li>Attempt to reverse engineer or hack the platform</li>
                  <li>Use automated systems to access the service without permission</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Disclaimer & Limitations</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400 space-y-2">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Educational purpose only:</strong> MindHack is a training and support tool, not a medical service</li>
                  <li><strong>No professional advice:</strong> We do not provide medical, psychiatric, or psychological advice</li>
                  <li><strong>No emergencies:</strong> Do not use MindHack for emergency medical situations - call 911 or go to nearest ER</li>
                  <li><strong>AI limitations:</strong> AI responses are generated and may not always be accurate or appropriate</li>
                  <li><strong>Service availability:</strong> We do not guarantee 24/7 availability</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Limitation of Liability</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400">
                <p>MindHack and its team shall not be liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, consequential, or punitive damages. Use the service at your own risk.</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4">Changes to These Terms</h2>
              <div className="text-calm-600 dark:text-calm-400">
                <p>We reserve the right to modify these Terms of Service at any time. Continued use of the service after any changes constitutes acceptance of the new terms.</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-calm-900 dark:text-white mb-4">Questions?</h2>
              <div className="text-calm-600 dark:text-calm-400">
                <p>If you have questions about these terms, please contact us at:</p>
                <p className="mt-2">
                  <strong>Email:</strong> terms@mindhack.example.com
                </p>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-4">
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
