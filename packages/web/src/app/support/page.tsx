'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Brain, Heart, Shield, Phone, Clock, Sparkles, ArrowRight, MessageCircle, ChevronRight } from 'lucide-react';

interface Companion {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  personality: string;
  greeting: string;
}

const defaultCompanions: Companion[] = [
  {
    id: 'empathetic-listener',
    name: 'Emma',
    title: 'Empathetic Listener',
    description: 'Specializes in active listening and emotional validation for depression and loneliness.',
    specialties: ['Depression', 'Loneliness', 'Emotional Support'],
    personality: 'warm, patient, validating',
    greeting: "Hi there. I'm Emma. I'm here to listen without any judgment.",
  },
  {
    id: 'anxiety-specialist',
    name: 'Marcus',
    title: 'Anxiety Specialist',
    description: 'Helps calm worry, anxiety, and overwhelming thoughts with practical techniques.',
    specialties: ['Anxiety', 'Worry', 'Overthinking', 'Panic'],
    personality: 'calm, grounding, reassuring',
    greeting: "Hey, I'm Marcus. Let's take this one step at a time.",
  },
  {
    id: 'burnout-coach',
    name: 'Jordan',
    title: 'Burnout Coach',
    description: 'Helps recover from exhaustion, stress, and find work-life balance.',
    specialties: ['Burnout', 'Stress', 'Exhaustion', 'Work-Life Balance'],
    personality: 'understanding, practical, encouraging',
    greeting: "I'm Jordan. You deserve support. Tell me what's been going on.",
  },
  {
    id: 'grief-companion',
    name: 'Sofia',
    title: 'Grief Companion',
    description: 'Provides gentle, patient support through loss and the grieving process.',
    specialties: ['Grief', 'Loss', 'Bereavement', 'Change'],
    personality: 'gentle, patient, present',
    greeting: "I'm Sofia. I'm so sorry you're going through this. I'm here to be with you.",
  },
  {
    id: 'relationship-guide',
    name: 'Alex',
    title: 'Relationship Guide',
    description: 'Helps navigate relationship challenges and improve communication patterns.',
    specialties: ['Relationships', 'Communication', 'Family Issues', 'Friendships'],
    personality: 'insightful, balanced, diplomatic',
    greeting: "I'm Alex. Relationships can be complicated. What's been happening?",
  },
  {
    id: 'self-esteem-coach',
    name: 'Casey',
    title: 'Self-Esteem Coach',
    description: 'Helps build self-worth, challenge negative self-talk, and find confidence.',
    specialties: ['Self-Esteem', 'Self-Worth', 'Confidence', 'Self-Criticism'],
    personality: 'encouraging, empowering, gentle',
    greeting: "Hey, I'm Casey. You deserve kindness, especially from yourself.",
  },
];

const companionColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  'empathetic-listener': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'bg-rose-500' },
  'anxiety-specialist': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', accent: 'bg-sky-500' },
  'burnout-coach': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500' },
  'grief-companion': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500' },
  'relationship-guide': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', accent: 'bg-teal-500' },
  'self-esteem-coach': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500' },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SupportPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/support/companions`);
        if (!response.ok) throw new Error('Failed to fetch companions');

        const data = await response.json();
        if (data.success && data.data.companions.length > 0) {
          setCompanions(data.data.companions);
        } else {
          setCompanions(defaultCompanions);
        }
      } catch (err) {
        console.error('Error fetching companions:', err);
        setCompanions(defaultCompanions);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  const handleStartChat = (companionId: string) => {
    router.push(`/support/chat?companion=${companionId}`);
  };

  const allSpecialties = [...new Set(companions.flatMap(c => c.specialties))];

  const filteredCompanions = selectedSpecialty
    ? companions.filter(c => c.specialties.includes(selectedSpecialty))
    : companions;

  return (
    <Layout activePage="support">
      {/* Crisis Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-500 text-white py-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M54.627%200l.83.828-1.415%201.415L51.8%200h2.827zM5.373%200l-.83.828L5.96%202.243%208.2%200H5.374zM48.97%200l3.657%203.657-1.414%201.414L46.143%200h2.828zM11.03%200L7.372%203.657%208.787%205.07%2013.857%200H11.03zm32.284%200L49.8%206.485%2048.384%207.9l-7.9-7.9h2.83zM16.686%200L10.2%206.485%2011.616%207.9l7.9-7.9h-2.83zM22.344%200L13.858%208.485%2015.272%209.9l9.9-9.9h-2.83zM32%200l-3.314%203.314-1.414-1.414L32%200h-4.686zm5.657%200l7.9%207.9-1.415%201.415-9.9-9.9h3.414zM42.344%200l3.314%203.314-1.414%201.414L42.343%200h-2.828zm5.657%200l3.314%203.315-1.414%201.414L48%200h2.83zM5.373%205.828L2.686%203.142%204.1%201.727l2.686%202.686h-1.414zM54.627%205.828l2.686-2.686-1.414-1.414-2.686%202.686h1.414zM48.97%205.828l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM11.03%205.828l-3.657-3.657-1.414%201.414%203.657%203.657h1.414zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%205.828l-3.657-3.657-1.414%201.414%203.657%203.657h1.414zm5.657%200l-3.657-3.657-1.414%201.414%203.657%203.657h1.414zm5.657%200l-3.657-3.657-1.414%201.414%203.657%203.657h1.414zM32%205.828l-3.314-3.314-1.414%201.414L32%205.828h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2011.657l5.657-5.657-1.414-1.414L0%208.828v2.83zm60%200l-5.657-5.657-1.414%201.414L60%208.828v2.83zM5.373%2011.657l.83-.828-1.415-1.415L2.545%2011.657h2.828zM54.627%2011.657l-.83-.828%201.415-1.415L57.455%2011.657h-2.828zM48.97%2011.657l3.657-3.657-1.414-1.414L46.143%2011.657h2.828zM11.03%2011.657l-3.657-3.657-1.414%201.414L13.857%2011.657H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2011.657l-3.657-3.657-1.414%201.414L19.029%2011.657h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2011.657h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2011.657h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2011.657h-2.83zM32%2011.657l-3.314-3.314-1.414%201.414L32%2011.657h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM5.373%2017.485l.83-.828-1.415-1.415L2.545%2017.485h2.828zM54.627%2017.485l-.83-.828%201.415-1.415L57.455%2017.485h-2.828zM48.97%2017.485l3.657-3.657-1.414-1.414L46.143%2017.485h2.828zM11.03%2017.485l-3.657-3.657-1.414%201.414L13.857%2017.485H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2017.485l-3.657-3.657-1.414%201.414L19.029%2017.485h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2017.485h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2017.485h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2017.485h-2.83zM32%2017.485l-3.314-3.314-1.414%201.414L32%2017.485h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2023.314l5.657-5.657-1.414-1.414L0%2020.485v2.83zm60%200l-5.657-5.657-1.414%201.414L60%2020.485v2.83zM5.373%2023.314l.83-.828-1.415-1.415L2.545%2023.314h2.828zM54.627%2023.314l-.83-.828%201.415-1.415L57.455%2023.314h-2.828zM48.97%2023.314l3.657-3.657-1.414-1.414L46.143%2023.314h2.828zM11.03%2023.314l-3.657-3.657-1.414%201.414L13.857%2023.314H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2023.314l-3.657-3.657-1.414%201.414L19.029%2023.314h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2023.314h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2023.314h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2023.314h-2.83zM32%2023.314l-3.314-3.314-1.414%201.414L32%2023.314h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM5.373%2029.143l.83-.828-1.415-1.415L2.545%2029.143h2.828zM54.627%2029.143l-.83-.828%201.415-1.415L57.455%2029.143h-2.828zM48.97%2029.143l3.657-3.657-1.414-1.414L46.143%2029.143h2.828zM11.03%2029.143l-3.657-3.657-1.414%201.414L13.857%2029.143H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2029.143l-3.657-3.657-1.414%201.414L19.029%2029.143h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2029.143h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2029.143h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2029.143h-2.83zM32%2029.143l-3.314-3.314-1.414%201.414L32%2029.143h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2034.97l5.657-5.657-1.414-1.414L0%2032.143v2.828zm60%200l-5.657-5.657-1.414%201.414L60%2032.143v2.828zM5.373%2034.97l.83-.828-1.415-1.415L2.545%2034.97h2.828zM54.627%2034.97l-.83-.828%201.415-1.415L57.455%2034.97h-2.828zM48.97%2034.97l3.657-3.657-1.414-1.414L46.143%2034.97h2.828zM11.03%2034.97l-3.657-3.657-1.414%201.414L13.857%2034.97H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2034.97l-3.657-3.657-1.414%201.414L19.029%2034.97h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2034.97h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2034.97h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2034.97h-2.83zM32%2034.97l-3.314-3.314-1.414%201.414L32%2034.97h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM5.373%2040.8l.83-.828-1.415-1.415L2.545%2040.8h2.828zM54.627%2040.8l-.83-.828%201.415-1.415L57.455%2040.8h-2.828zM48.97%2040.8l3.657-3.657-1.414-1.414L46.143%2040.8h2.828zM11.03%2040.8l-3.657-3.657-1.414%201.414L13.857%2040.8H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2040.8l-3.657-3.657-1.414%201.414L19.029%2040.8h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2040.8h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2040.8h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2040.8h-2.83zM32%2040.8l-3.314-3.314-1.414%201.414L32%2040.8h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2046.628l5.657-5.657-1.414-1.414L0%2043.8v2.828zm60%200l-5.657-5.657-1.414%201.414L60%2043.8v2.828zM5.373%2046.628l.83-.828-1.415-1.415L2.545%2046.628h2.828zM54.627%2046.628l-.83-.828%201.415-1.415L57.455%2046.628h-2.828zM48.97%2046.628l3.657-3.657-1.414-1.414L46.143%2046.628h2.828zM11.03%2046.628l-3.657-3.657-1.414%201.414L13.857%2046.628H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2046.628l-3.657-3.657-1.414%201.414L19.029%2046.628h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2046.628h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2046.628h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2046.628h-2.83zM32%2046.628l-3.314-3.314-1.414%201.414L32%2046.628h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2052.457l5.657-5.657-1.414-1.414L0%2049.628v2.83zm60%200l-5.657-5.657-1.414%201.414L60%2049.628v2.83zM5.373%2052.457l.83-.828-1.415-1.415L2.545%2052.457h2.828zM54.627%2052.457l-.83-.828%201.415-1.415L57.455%2052.457h-2.828zM48.97%2052.457l3.657-3.657-1.414-1.414L46.143%2052.457h2.828zM11.03%2052.457l-3.657-3.657-1.414%201.414L13.857%2052.457H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2052.457l-3.657-3.657-1.414%201.414L19.029%2052.457h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2052.457h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2052.457h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2052.457h-2.83zM32%2052.457l-3.314-3.314-1.414%201.414L32%2052.457h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zM0%2058.286l5.657-5.657-1.414-1.414L0%2055.457v2.83zm60%200l-5.657-5.657-1.414%201.414L60%2055.457v2.83zM5.373%2058.286l.83-.828-1.415-1.415L2.545%2058.286h2.828zM54.627%2058.286l-.83-.828%201.415-1.415L57.455%2058.286h-2.828zM48.97%2058.286l3.657-3.657-1.414-1.414L46.143%2058.286h2.828zM11.03%2058.286l-3.657-3.657-1.414%201.414L13.857%2058.286H11.03zm32.284%200l3.657-3.657-1.414-1.414-3.657%203.657h1.414zM16.686%2058.286l-3.657-3.657-1.414%201.414L19.029%2058.286h-2.83zm11.315%200l-3.657-3.657-1.414%201.414L30.343%2058.286h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L36%2058.286h-2.83zm5.657%200l-3.657-3.657-1.414%201.414L41.657%2058.286h-2.83zM32%2058.286l-3.314-3.314-1.414%201.414L32%2058.286h-4.686zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414zm5.657%200l3.314-3.314-1.414-1.414-3.314%203.314h1.414z'/%3E%3C/svg%3E')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <Phone className="h-5 w-5 animate-pulse" />
            <span className="font-medium">In Crisis? Call 988 (US) or your local crisis line immediately</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-calm-50 via-white to-primary-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.06),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-calm-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400"> Support Companion</span>
            </h1>
            <p className="text-xl text-calm-600 mb-8 leading-relaxed">
              Connect with empathetic AI companions available 24/7 to listen, understand,
              and support you through lifes challenges.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#companions" className="group px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-600/25 flex items-center gap-2">
                Find Your Companion
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/crisis" className="px-8 py-4 bg-white text-calm-700 rounded-xl font-semibold hover:bg-calm-50 transition-all duration-300 border border-calm-200 flex items-center gap-2">
                Crisis Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-calm-50 to-calm-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1 text-center">24/7 Available</h3>
              <p className="text-sm text-calm-600 text-center">Chat anytime, day or night</p>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/25">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1 text-center">Non-Judgmental</h3>
              <p className="text-sm text-calm-600 text-center">Safe space to express yourself</p>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1 text-center">Confidential</h3>
              <p className="text-sm text-calm-600 text-center">Your privacy is protected</p>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-calm-900 mb-1 text-center">Smart Support</h3>
              <p className="text-sm text-calm-600 text-center">AI that understands and helps</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Companions Grid */}
      <section id="companions" className="py-16 bg-gradient-to-b from-calm-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-calm-900 mb-2">Meet Our Companions</h2>
              <p className="text-calm-600">Choose a companion that resonates with your needs</p>
            </div>
            <select
              className="px-4 py-3 rounded-xl border border-calm-200 bg-white text-calm-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanions.map((companion) => {
                const colors = companionColors[companion.id] || companionColors['empathetic-listener'];
                return (
                  <div
                    key={companion.id}
                    className={`group relative ${colors.bg} ${colors.border} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
                    onMouseEnter={() => setHoveredCard(companion.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleStartChat(companion.id)}
                  >
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className={`h-5 w-5 ${colors.text}`} />
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-white ${colors.border} border-2 flex items-center justify-center shadow-md`}>
                        <span className={`text-2xl font-bold ${colors.text}`}>{companion.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-calm-900 mb-0.5">{companion.name}</h3>
                        <p className={`text-sm ${colors.text} font-medium`}>{companion.title}</p>
                      </div>
                    </div>

                    <p className="text-calm-600 text-sm mb-4 leading-relaxed">{companion.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {companion.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="px-3 py-1 bg-white/70 text-calm-700 rounded-full text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className={`flex items-center gap-2 text-sm ${colors.text} font-medium`}>
                      <MessageCircle className="h-4 w-4" />
                      <span>Start Chat</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-calm-900 mb-4">Getting Support is Easy</h2>
            <p className="text-calm-600 max-w-2xl mx-auto">Three simple steps to connect with your support companion</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="relative inline-flex mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Choose a Companion</h3>
              <p className="text-calm-600 text-sm">Browse our AI companions and find one that resonates with your needs</p>
            </div>
            <div className="text-center group">
              <div className="relative inline-flex mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Start Chatting</h3>
              <p className="text-calm-600 text-sm">Begin a conversation and share what's on your mind</p>
            </div>
            <div className="text-center group">
              <div className="relative inline-flex mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-calm-900 mb-2">Get Support</h3>
              <p className="text-calm-600 text-sm">Receive empathetic responses and helpful guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-calm-50 border-t border-calm-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-calm-500">
            <strong>Important:</strong> Our AI companions provide supportive conversations but are not a replacement
            for professional mental health care. If you're experiencing a crisis, please call 988 or seek immediate help.
          </p>
        </div>
      </section>
    </Layout>
  );
}
