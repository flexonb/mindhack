'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, X, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: 'home' | 'training' | 'support' | 'resources' | 'demo' | 'crisis';
  showFooter?: boolean;
}

export default function Layout({ children, activePage = 'home', showFooter = true }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/training', label: 'Training', page: 'training' },
    { href: '/support', label: 'Support', page: 'support' },
    { href: '/resources', label: 'Resources', page: 'resources' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-calm-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-calm-900">MindHack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${activePage === link.page ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-calm-600 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-calm-100 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    activePage === link.page
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-calm-600 hover:bg-calm-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-calm-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-6 w-6 text-primary-400" />
                  <span className="text-lg font-bold">MindHack</span>
                </div>
                <p className="text-calm-400 text-sm">
                  AI-powered mental health training and 24/7 human support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-calm-400 text-sm">
                  <li><Link href="/training" className="hover:text-white transition-colors">Training</Link></li>
                  <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                  <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Crisis Support</h4>
                <ul className="space-y-2 text-calm-400 text-sm">
                  <li>988 Suicide & Crisis Lifeline</li>
                  <li>Text HOME to 741741</li>
                  <li><Link href="/crisis" className="text-primary-400 hover:text-primary-300">Crisis Resources</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-calm-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-calm-800 mt-8 pt-8 text-center text-calm-400 text-sm">
              <p>© 2024 MindHack. For educational purposes only.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
