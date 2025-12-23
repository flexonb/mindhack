'use client';

import Layout from '@/components/Layout';
import { Shield, Eye, Lock, Database, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <Layout activePage="home">
      <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-calm-900 mb-2">Privacy Policy</h1>
            <p className="text-calm-600">How we protect your information</p>
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
                  <Eye className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Information We Collect</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400 space-y-2">
                <p>We collect minimal information to provide our services:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Chat messages:</strong> Your conversations with AI companions (processed in real-time)</li>
                  <li><strong>Training progress:</strong> Score data stored locally on your device</li>
                  <li><strong>Usage data:</strong> Anonymous analytics to improve our services</li>
                  <li><strong>Device information:</strong> Basic browser and device data</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">How We Protect Your Data</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400 space-y-2">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>End-to-end encryption for all chat communications</li>
                  <li>No storage of personal conversations on our servers</li>
                  <li>Training data is stored locally on your device only</li>
                  <li>We never sell or share your personal data</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Data Storage & Retention</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400 space-y-2">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Chat history is stored locally in your browser</li>
                  <li>You can delete your data at any time through settings</li>
                  <li>We retain anonymous usage statistics for service improvement</li>
                  <li>No clinical or diagnostic data is collected</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-calm-900 dark:text-white">Contact Us</h2>
              </div>
              <div className="ml-13 text-calm-600 dark:text-calm-400">
                <p>If you have questions about this privacy policy or your data:</p>
                <p className="mt-2">
                  <strong>Email:</strong> privacy@mindhack.example.com<br />
                  <strong>Response time:</strong> Within 48 hours
                </p>
              </div>
            </section>

            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Note:</strong> MindHack is an educational tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek professional help for mental health concerns.
              </p>
            </div>
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
