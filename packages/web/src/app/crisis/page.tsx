import { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Phone, AlertTriangle, MessageCircle, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crisis Resources - MindHack',
  description: 'Immediate help for mental health emergencies',
};

export default function CrisisPage() {
  return (
    <div className="min-h-screen bg-red-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-calm-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-calm-900">MindHack</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/training" className="nav-link">Training</Link>
              <Link href="/support" className="nav-link">Support</Link>
              <Link href="/resources" className="nav-link">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Immediate Help Available</h1>
          <p className="text-red-100 text-lg">
            If you're in danger or need immediate assistance, call 911 or go to your nearest emergency room.
          </p>
        </div>
      </section>

      {/* Crisis Hotlines */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-calm-900 text-center mb-8">24/7 Crisis Hotlines</h2>

          <div className="space-y-4">
            {/* 988 */}
            <div className="card bg-primary-600 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">988 Suicide & Crisis Lifeline</h3>
                    <p className="text-primary-100">Available 24/7 in the United States</p>
                  </div>
                </div>
                <a href="tel:988" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors text-center">
                  Call 988
                </a>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-wellness-green/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-wellness-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-calm-900">Crisis Text Line</h3>
                    <p className="text-calm-500">Text HOME to 741741</p>
                  </div>
                </div>
                <a href="sms:741741&body=HOME" className="btn-primary text-center">
                  Text Now
                </a>
              </div>
            </div>

            {/* International */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-wellness-purple/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-wellness-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-calm-900">International Resources</h3>
                    <p className="text-calm-500">Find help in your country</p>
                  </div>
                </div>
                <Link href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary text-center">
                  Find Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Do in Crisis */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-calm-900 text-center mb-8">What to Do in a Crisis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="font-semibold text-calm-900 mb-2">Stay Safe</h3>
              <p className="text-calm-600 text-sm">
                Remove access to anything you might use to hurt yourself. Go to a safe place.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="font-semibold text-calm-900 mb-2">Reach Out</h3>
              <p className="text-calm-600 text-sm">
                Call 988, text 741741, or tell someone you trust how you're feeling.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="font-semibold text-calm-900 mb-2">Stay Connected</h3>
              <p className="text-calm-600 text-sm">
                Keep talking to someone until help arrives. You don't have to be alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Planning */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-calm-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Create a Safety Plan</h2>
            <p className="text-calm-300 mb-6">
              A safety plan is a written list of coping strategies and resources you can use
              when thoughts of suicide or self-harm arise. Work with a mental health professional
              to create your personalized plan.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Warning Signs</h3>
                <p className="text-sm text-calm-300">What thoughts, feelings, or situations tell you a crisis may be coming?</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Coping Strategies</h3>
                <p className="text-sm text-calm-300">What activities can you do to distract or calm yourself?</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Social Contacts</h3>
                <p className="text-sm text-calm-300">Who can you call or be with when you're in crisis?</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Professional Help</h3>
                <p className="text-sm text-calm-300">Who are your doctors or crisis services you can contact?</p>
              </div>
            </div>
            <Link href="/support" className="btn-primary inline-block">
              Get Professional Help
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 text-center">
        <p className="text-calm-500 text-sm max-w-2xl mx-auto px-4">
          These resources are available 24/7. Asking for help is a sign of strength.
          You matter, and there are people who want to support you through this.
        </p>
      </section>
    </div>
  );
}
