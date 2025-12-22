'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Heart, Shield, Phone, Users, Clock, Star } from 'lucide-react';

interface Helper {
  id: string;
  role: string;
  bio: string;
  rating: number;
  totalSessions: number;
  isAvailable: boolean;
  specialties: string[];
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

const roleLabels: Record<string, string> = {
  listener: 'Listener',
  peer_support: 'Peer Support',
  counselor: 'Counselor',
  crisis_responder: 'Crisis Responder',
  specialist: 'Specialist',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SupportPage() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const url = selectedRole
          ? `${API_URL}/api/users/helpers?role=${selectedRole}&available=true`
          : `${API_URL}/api/users/helpers?available=true`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch helpers');

        const data = await response.json();
        if (data.success) {
          setHelpers(data.data.helpers);
        }
      } catch (err) {
        console.error('Error fetching helpers:', err);
        setError('Unable to load helpers. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, [selectedRole]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-calm-50">
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
              <Link href="/support" className="nav-link nav-link-active">Support</Link>
              <Link href="/resources" className="nav-link">Resources</Link>
              <Link href="/demo" className="btn-primary">Try Demo</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Crisis Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <Phone className="h-5 w-5" />
            <span className="font-medium">In Crisis? Call 988 (US) or your local crisis line immediately</span>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-calm-900 mb-4">
              Get Human Support
            </h1>
            <p className="text-xl text-calm-600 mb-8">
              Connect with trained listeners, peer supporters, and licensed mental health professionals.
              Available 24/7 for chat, voice, or video sessions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#helpers" className="btn-primary">
                Find a Helper
              </Link>
              <Link href="/crisis" className="btn-secondary border-red-200 text-red-600 hover:bg-red-50">
                Crisis Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Helper Types */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1">Listeners</h3>
              <p className="text-sm text-calm-600">Trained volunteers for active listening</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-wellness-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-wellness-green" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1">Peer Support</h3>
              <p className="text-sm text-calm-600">People with lived experience</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-wellness-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-wellness-purple" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1">Counselors</h3>
              <p className="text-sm text-calm-600">Licensed professionals</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1">Crisis Responders</h3>
              <p className="text-sm text-calm-600">24/7 emergency support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Helpers Grid */}
      <section id="helpers" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-calm-900">Available Helpers</h2>
            <div className="flex gap-4">
              <select
                className="input-field py-2 px-4 w-40"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="listener">Listeners</option>
                <option value="peer_support">Peer Support</option>
                <option value="counselor">Counselors</option>
                <option value="crisis_responder">Crisis Responders</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-calm-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Retry
              </button>
            </div>
          ) : helpers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-calm-500">No helpers available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpers.map((helper) => (
                <div key={helper.id} className="card">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-lg">
                      {helper.user.avatarUrl ? (
                        <img src={helper.user.avatarUrl} alt={helper.user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(helper.user.name)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-calm-900">{helper.user.name}</h3>
                        {helper.isAvailable && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" title="Available"></span>
                        )}
                      </div>
                      <p className="text-sm text-calm-500">{roleLabels[helper.role] || helper.role}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{helper.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-calm-400">|</span>
                        <span className="text-sm text-calm-500">{helper.totalSessions} sessions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {helper.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 bg-calm-100 text-calm-600 rounded text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      helper.isAvailable
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-calm-100 text-calm-400 cursor-not-allowed'
                    }`}
                    disabled={!helper.isAvailable}
                  >
                    {helper.isAvailable ? 'Start Chat' : 'Currently Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-calm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-calm-900 text-center mb-12">
            Getting Support is Easy
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Choose a Helper</h3>
              <p className="text-calm-600">Browse our directory and find someone who matches your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Start Session</h3>
              <p className="text-calm-600">Begin a chat, voice, or video session instantly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Get Help</h3>
              <p className="text-calm-600">Receive compassionate support and guidance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
