import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { BookOpen, Headphones, Video, FileText, Phone, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources - MindHack',
  description: 'Mental health resources, articles, and guides',
};

const resources = [
  {
    category: 'Getting Started',
    items: [
      { title: 'What is Mental Health?', type: 'Article' },
      { title: 'Understanding Depression', type: 'Article' },
      { title: 'Anxiety 101', type: 'Article' },
      { title: 'Recognizing Crisis Signs', type: 'Guide' },
    ],
  },
  {
    category: 'Self-Help Tools',
    items: [
      { title: 'Guided Meditation', type: 'Audio' },
      { title: 'Breathing Exercises', type: 'Video' },
      { title: 'Journaling Prompts', type: 'Worksheet' },
      { title: 'Mood Tracker', type: 'Tool' },
    ],
  },
  {
    category: 'Crisis Resources',
    items: [
      { title: '988 Suicide & Crisis Lifeline', type: 'Hotline' },
      { title: 'Crisis Text Line', type: 'Hotline' },
      { title: 'Emergency Numbers', type: 'Directory' },
      { title: 'Safety Planning Guide', type: 'Guide' },
    ],
  },
];

const articles = [
  {
    title: 'Building Emotional Resilience',
    excerpt: 'Learn practical strategies to bounce back from setbacks and build inner strength.',
    category: 'Resilience',
    readTime: '8 min read',
  },
  {
    title: 'The Power of Mindfulness',
    excerpt: 'Discover how mindfulness practices can reduce stress and improve mental well-being.',
    category: 'Mindfulness',
    readTime: '6 min read',
  },
  {
    title: 'Supporting Someone You Love',
    excerpt: 'A guide to being there for friends and family members who are struggling.',
    category: 'Support',
    readTime: '10 min read',
  },
  {
    title: 'Sleep and Mental Health',
    excerpt: 'Understanding the crucial connection between sleep quality and emotional well-being.',
    category: 'Wellness',
    readTime: '7 min read',
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Article: FileText,
  Guide: BookOpen,
  Audio: Headphones,
  Video: Video,
  Hotline: Phone,
  Worksheet: FileText,
  Tool: FileText,
  Directory: FileText,
};

export default function ResourcesPage() {
  return (
    <Layout activePage="resources">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-calm-900 mb-4">
              Mental Health Resources
            </h1>
            <p className="text-xl text-calm-600">
              Explore our library of articles, guides, and tools to support your mental health journey.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="#crisis" className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-red-200">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-calm-900">Crisis Help</h3>
              <p className="text-sm text-calm-500">24/7 hotlines</p>
            </Link>
            <Link href="#articles" className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-primary-200">
              <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-calm-900">Articles</h3>
              <p className="text-sm text-calm-500">Mental health guides</p>
            </Link>
            <div className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-wellness-green/20">
              <Headphones className="h-8 w-8 text-wellness-green mx-auto mb-2" />
              <h3 className="font-semibold text-calm-900">Audio</h3>
              <p className="text-sm text-calm-500">Meditation & calm</p>
            </div>
            <div className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-wellness-purple/20">
              <Video className="h-8 w-8 text-wellness-purple mx-auto mb-2" />
              <h3 className="font-semibold text-calm-900">Videos</h3>
              <p className="text-sm text-calm-500">Guided exercises</p>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Section */}
      <section id="crisis" className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-600 rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">In Crisis?</h2>
                <p className="text-red-100 mb-6">
                  If you're thinking about hurting yourself or someone else, please reach out for help immediately.
                  You don't have to face this alone.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">988 Suicide & Crisis Lifeline</h3>
                    <p className="text-red-100 text-sm mb-2">Available 24/7 in the US</p>
                    <p className="text-xl font-bold">Call or Text 988</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Crisis Text Line</h3>
                    <p className="text-red-100 text-sm mb-2">Text HOME to 741741</p>
                    <p className="text-xl font-bold">Available 24/7</p>
                  </div>
                  <Link href="/crisis" className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors">
                    <h3 className="font-semibold mb-2">Emergency Services</h3>
                    <p className="text-red-100 text-sm mb-2">Immediate danger</p>
                    <p className="text-xl font-bold">Call 911</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section id="articles" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-calm-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <article key={index} className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-calm-400">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-calm-900 mb-2">{article.title}</h3>
                <p className="text-calm-600 text-sm">{article.excerpt}</p>
                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                  <FileText className="h-4 w-4 mr-1" />
                  Read Article
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resources by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-calm-900 mb-8">Browse Resources</h2>
          <div className="space-y-8">
            {resources.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-calm-900 mb-4">{category.category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.items.map((item, itemIndex) => {
                    const Icon = iconMap[item.type] || FileText;
                    return (
                      <div key={itemIndex} className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-3">
                        <div className="w-10 h-10 bg-calm-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-calm-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-calm-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-calm-500">{item.type}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
