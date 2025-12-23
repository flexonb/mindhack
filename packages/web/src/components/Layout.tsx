'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Brain, X, Menu, ChevronRight, Heart, BookOpen, Phone, HelpCircle, Calculator, Shield, Sun, Moon, EyeOff } from 'lucide-react';
import PanicMode from './PanicMode';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: 'home' | 'training' | 'anti-addiction' | 'support' | 'resources' | 'crisis';
  showFooter?: boolean;
}

export default function Layout({ children, activePage = 'home', showFooter = true }: LayoutProps) {
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  // Load panic mode state from localStorage
  useEffect(() => {
    const savedPanic = localStorage.getItem('mindhack_panic_mode');
    if (savedPanic === 'true') {
      setPanicMode(true);
    }
  }, []);

  // Save panic mode state to localStorage
  const savePanicMode = useCallback((active: boolean) => {
    localStorage.setItem('mindhack_panic_mode', active.toString());
    setPanicMode(active);
  }, []);

  // Handle ESC key to exit panic mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panicMode) {
        savePanicMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicMode, savePanicMode]);

  const handlePanicToggle = () => {
    if (panicMode) {
      savePanicMode(false);
    } else {
      setShowPanicConfirm(true);
    }
  };

  const activatePanicMode = () => {
    savePanicMode(true);
    setShowPanicConfirm(false);
  };

  const navLinks = [
    { href: '/training', label: 'Training', page: 'training', icon: Brain },
    { href: '/anti-addiction', label: 'Anti-Addiction', page: 'anti-addiction', icon: Shield },
    { href: '/support', label: 'Support', page: 'support', icon: Heart },
    { href: '/resources', label: 'Resources', page: 'resources', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-calm-950 text-calm-900 dark:text-calm-50 transition-colors duration-300">
      {/* Panic Mode Overlay */}
      <PanicMode isActive={panicMode} onToggle={savePanicMode} />

      {/* Panic Mode Confirmation Dialog */}
      {showPanicConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-calm-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-calm-900 dark:text-white text-center mb-2">Quick Hide</h3>
            <p className="text-calm-600 dark:text-calm-300 text-center mb-6">
              This will instantly transform the app into a simple calculator. Press ESC or tap the calculator icon to return.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="flex-1 px-4 py-3 bg-calm-100 dark:bg-calm-700 text-calm-700 dark:text-calm-300 rounded-xl font-medium hover:bg-calm-200 dark:hover:bg-calm-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={activatePanicMode}
                className="flex-1 px-4 py-3 bg-red-600 dark:bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-calm-950/80 backdrop-blur-lg border-b border-calm-100 dark:border-calm-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold text-calm-900 dark:text-white">MindHack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePage === link.page
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-calm-600 dark:text-calm-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-calm-50 dark:hover:bg-calm-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle variant="dropdown" />

              {/* Panic Button */}
              <button
                onClick={handlePanicToggle}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  panicMode
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                    : 'text-calm-600 dark:text-calm-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                }`}
                title="Quick hide - transforms to calculator"
              >
                <Calculator className="h-4 w-4" />
                {panicMode ? 'Exit' : 'Quick Hide'}
              </button>

              {/* Get Support Button */}
              <Link
                href="/support"
                className="px-5 py-2.5 bg-primary-600 dark:bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Support
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-calm-600 dark:text-calm-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-calm-50 dark:hover:bg-calm-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-calm-100 dark:border-calm-800 bg-white dark:bg-calm-950">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    activePage === link.page
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-calm-600 dark:text-calm-400 hover:bg-calm-50 dark:hover:bg-calm-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-calm-50 dark:bg-calm-800">
                <span className="flex items-center gap-3 text-calm-600 dark:text-calm-400">
                  {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Theme
                </span>
                <ThemeToggle variant="segmented" />
              </div>

              {/* Mobile Panic Button */}
              <button
                onClick={() => {
                  handlePanicToggle();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  panicMode
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'text-calm-600 dark:text-calm-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Calculator className="h-5 w-5" />
                  {panicMode ? 'Exit Quick Hide' : 'Quick Hide'}
                </span>
                {panicMode && <EyeOff className="h-5 w-5" />}
              </button>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/support"
                  className="px-4 py-3 text-center text-white font-semibold bg-primary-600 dark:bg-primary-500 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Help Panel */}
          <div
            className={`absolute bottom-16 right-0 w-72 bg-white dark:bg-calm-800 rounded-xl shadow-xl border border-calm-100 dark:border-calm-700 overflow-hidden transition-all duration-300 origin-bottom-right ${
              aiHelperOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="bg-primary-600 dark:bg-primary-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Quick Access</h4>
                  <p className="text-primary-100 dark:text-primary-200 text-xs">Navigate to key features</p>
                </div>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <Link
                href="/support"
                onClick={() => setAiHelperOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-calm-50 dark:hover:bg-calm-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-calm-900 dark:text-white font-medium text-sm">Get Support</p>
                  <p className="text-calm-500 dark:text-calm-400 text-xs">Chat with a companion</p>
                </div>
                <ChevronRight className="h-4 w-4 text-calm-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </Link>
              <Link
                href="/training"
                onClick={() => setAiHelperOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-calm-50 dark:hover:bg-calm-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-calm-900 dark:text-white font-medium text-sm">Practice Training</p>
                  <p className="text-calm-500 dark:text-calm-400 text-xs">Learn helping skills</p>
                </div>
                <ChevronRight className="h-4 w-4 text-calm-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </Link>
              <Link
                href="/resources"
                onClick={() => setAiHelperOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-calm-50 dark:hover:bg-calm-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-calm-900 dark:text-white font-medium text-sm">Resources</p>
                  <p className="text-calm-500 dark:text-calm-400 text-xs">Mental health guides</p>
                </div>
                <ChevronRight className="h-4 w-4 text-calm-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </Link>
              <Link
                href="/crisis"
                onClick={() => setAiHelperOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-800 dark:text-red-300 font-medium text-sm">Crisis Help</p>
                  <p className="text-red-600 dark:text-red-400 text-xs">Immediate support</p>
                </div>
                <ChevronRight className="h-4 w-4 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Floating Button */}
          <button
            onClick={() => setAiHelperOpen(!aiHelperOpen)}
            className={`w-12 h-12 rounded-full bg-primary-600 dark:bg-primary-500 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 dark:hover:shadow-primary-500/30 hover:scale-105 ${
              aiHelperOpen ? 'rotate-90' : ''
            }`}
            aria-label="Open quick access menu"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-calm-900 dark:bg-calm-950 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-6 w-6 text-primary-400 dark:text-primary-300" />
                  <span className="text-lg font-bold">MindHack</span>
                </div>
                <p className="text-calm-400 dark:text-calm-500 text-sm leading-relaxed">
                  Mental health training and support tools to help you thrive.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white dark:text-calm-200">Quick Links</h4>
                <ul className="space-y-2 text-calm-400 dark:text-calm-500 text-sm">
                  <li><Link href="/training" className="hover:text-white dark:hover:text-calm-300 transition-colors">Training</Link></li>
                  <li><Link href="/support" className="hover:text-white dark:hover:text-calm-300 transition-colors">Support</Link></li>
                  <li><Link href="/resources" className="hover:text-white dark:hover:text-calm-300 transition-colors">Resources</Link></li>
                  <li><Link href="/crisis" className="hover:text-white dark:hover:text-calm-300 transition-colors">Crisis Help</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-white dark:hover:text-calm-300 transition-colors">How It Works</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white dark:text-calm-200">Crisis Support</h4>
                <ul className="space-y-2 text-calm-400 dark:text-calm-500 text-sm">
                  <li><Link href="/crisis" className="hover:text-white dark:hover:text-calm-300 transition-colors">Global Hotlines</Link></li>
                  <li><Link href="/resources" className="hover:text-white dark:hover:text-calm-300 transition-colors">Verified Resources</Link></li>
                  <li><Link href="/crisis" className="text-primary-400 dark:text-primary-300 hover:text-primary-300 dark:hover:text-primary-200">Emergency Numbers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white dark:text-calm-200">Legal</h4>
                <ul className="space-y-2 text-calm-400 dark:text-calm-500 text-sm">
                  <li><Link href="/privacy-policy" className="hover:text-white dark:hover:text-calm-300 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="hover:text-white dark:hover:text-calm-300 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-white dark:hover:text-calm-300 transition-colors">Disclaimer</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-calm-800 dark:border-calm-800 mt-8 pt-6 text-center text-calm-500 dark:text-calm-600 text-sm">
              <p>2025 MindHack. For educational purposes only. Not a replacement for professional medical advice.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
