'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Brain, ChevronRight, Shield, AlertCircle, MessageCircle, Frown, Wind, AlertTriangle } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  condition: string;
  difficulty: string;
  description: string;
  traits: string[];
}

const defaultPersonas: Persona[] = [
  {
    id: 'depression',
    name: 'Alex',
    condition: 'Depression',
    difficulty: 'Moderate',
    description: 'Feeling overwhelmed and hopeless',
    traits: ['Withdrawn', 'Fatigued', 'Hopeless'],
  },
  {
    id: 'anxiety',
    name: 'Sam',
    condition: 'Anxiety',
    difficulty: 'Mild',
    description: 'Experiencing worry and restlessness',
    traits: ['Restless', 'Worried', 'Nervous'],
  },
  {
    id: 'ptsd',
    name: 'Jordan',
    condition: 'PTSD',
    difficulty: 'Severe',
    description: 'Dealing with flashbacks and hypervigilance',
    traits: ['Flashbacks', 'Hypervigilant', 'Avoidant'],
  },
  {
    id: 'crisis',
    name: 'Crisis',
    condition: 'Crisis',
    difficulty: 'Critical',
    description: 'Immediate intervention needed',
    traits: ['Suicidal ideation', 'Desperate', 'Isolated'],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  depression: Frown,
  anxiety: Wind,
  ptsd: AlertTriangle,
  crisis: AlertTriangle,
};

const colorMap: Record<string, string> = {
  depression: 'bg-blue-100 text-blue-700',
  anxiety: 'bg-yellow-100 text-yellow-700',
  ptsd: 'bg-purple-100 text-purple-700',
  crisis: 'bg-red-100 text-red-700',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function TrainingPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/personas`);
        if (!response.ok) throw new Error('Failed to fetch personas');

        const data = await response.json();
        if (data.success && data.data.personas.length > 0) {
          setPersonas(data.data.personas);
        } else {
          setPersonas(defaultPersonas);
        }
      } catch (err) {
        console.error('Error fetching personas:', err);
        setPersonas(defaultPersonas);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  return (
    <Layout activePage="training">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-calm-900 mb-4">
              AI Training Personas
            </h1>
            <p className="text-xl text-calm-600 mb-8">
              Practice conversations with realistic AI personas simulating various mental health conditions.
              Learn to recognize warning signs, respond with empathy, and provide appropriate support.
            </p>
            <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <p className="text-yellow-800">
                <strong>Training Purpose Only:</strong> These personas simulate mental health scenarios for educational purposes.
                In real emergencies, always contact professional help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personas Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personas.map((persona) => {
                const Icon = iconMap[persona.id] || Brain;
                const colorClass = colorMap[persona.id] || 'bg-calm-100 text-calm-700';

                return (
                  <Link
                    href={`/demo?persona=${persona.id}`}
                    key={persona.id}
                    className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        persona.difficulty === 'Critical' ? 'bg-red-100 text-red-700' :
                        persona.difficulty === 'Severe' ? 'bg-orange-100 text-orange-700' :
                        persona.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {persona.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-calm-900 mb-1">{persona.name}</h3>
                    <p className="text-sm text-calm-500 mb-3">{persona.condition}</p>
                    <p className="text-calm-600 text-sm mb-4">{persona.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {persona.traits.map((trait) => (
                        <span key={trait} className="px-2 py-1 bg-calm-100 text-calm-600 rounded text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      Start Practice
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-calm-900 text-center mb-12">
            How Training Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-calm-900 mb-2">1. Choose a Persona</h3>
              <p className="text-calm-600">
                Select from different mental health personas with varying difficulty levels
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-wellness-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-wellness-green" />
              </div>
              <h3 className="text-xl font-semibold text-calm-900 mb-2">2. Practice Conversation</h3>
              <p className="text-calm-600">
                Chat with the AI persona and practice your response skills
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-wellness-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-wellness-purple" />
              </div>
              <h3 className="text-xl font-semibold text-calm-900 mb-2">3. Get Feedback</h3>
              <p className="text-calm-600">
                Receive scores on crisis recognition, empathy, and appropriateness
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
