import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { BookOpen, Phone, ArrowRight, Clock, Shield, Heart, Brain, FileText, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources - MindHack',
  description: 'Mental health resources, articles, and guides',
};

const quickLinks = [
  { href: '/crisis', title: 'Crisis Help', description: 'Global hotlines', icon: Phone, color: 'bg-red-100 text-red-600', gradient: 'from-red-400 to-rose-500' },
  { href: '#articles', title: 'Articles', description: 'Mental health guides', icon: BookOpen, color: 'bg-primary-100 text-primary-600', gradient: 'from-primary-400 to-primary-600' },
  { href: '/training', title: 'Training', description: 'Practice skills', icon: Brain, color: 'bg-emerald-100 text-emerald-600', gradient: 'from-emerald-400 to-emerald-600' },
  { href: '/support', title: 'AI Companions', description: '24/7 support', icon: Heart, color: 'bg-purple-100 text-purple-600', gradient: 'from-purple-400 to-violet-500' },
];

const articles = [
  {
    slug: 'building-emotional-resilience',
    title: 'Building Emotional Resilience',
    excerpt: 'Learn practical strategies to bounce back from setbacks and build inner strength through evidence-based techniques.',
    category: 'Resilience',
    readTime: '8 min read',
    content: `
# Building Emotional Resilience

Emotional resilience is the ability to adapt and bounce back when facing adversity, stress, or challenging experiences. It's not about avoiding difficulties, but rather developing the inner strength to navigate them effectively.

## What is Resilience?

Resilience is not a fixed trait – it can be developed and strengthened over time. Think of it as emotional muscle that grows stronger with practice.

## Key Strategies to Build Resilience

### 1. Cultivate Self-Awareness
- Practice mindfulness to recognize your emotional states
- Keep a journal to track patterns in your moods and reactions
- Identify your triggers and early warning signs

### 2. Develop Healthy Coping Mechanisms
- Exercise regularly – physical activity releases endorphins
- Practice deep breathing exercises (try 4-7-8 technique)
- Engage in creative activities that bring you joy

### 3. Build Strong Support Networks
- Nurture relationships with friends and family
- Don't hesitate to seek professional help when needed
- Join supportive communities around shared interests

### 4. Practice Positive Self-Talk
- Challenge negative thought patterns
- Replace "I can't" with "I'll try"
- Celebrate small victories along the way

### 5. Embrace Change and Flexibility
- Accept that change is a natural part of life
- View challenges as opportunities for growth
- Practice letting go of what you cannot control

## Remember

Building resilience is a journey, not a destination. Be patient with yourself and celebrate your progress, no matter how small it may seem.
    `
  },
  {
    slug: 'power-of-mindfulness',
    title: 'The Power of Mindfulness',
    excerpt: 'Discover how mindfulness practices can reduce stress and improve your mental well-being through simple daily exercises.',
    category: 'Mindfulness',
    readTime: '6 min read',
    content: `
# The Power of Mindfulness

Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It's a skill that can transform how you experience life.

## Benefits of Mindfulness

- Reduced stress and anxiety
- Improved focus and concentration
- Better emotional regulation
- Enhanced self-awareness
- Improved sleep quality

## Simple Mindfulness Exercises

### 1. Breath Awareness
1. Find a quiet place to sit comfortably
2. Close your eyes and take a deep breath
3. Focus your attention on the sensation of breathing
4. When your mind wanders, gently bring it back
5. Practice for 5-10 minutes daily

### 2. Body Scan
1. Lie down in a comfortable position
2. Slowly move your attention through your body
3. Notice any sensations without trying to change them
4. Release tension as you go

### 3. Mindful Walking
1. Walk slowly and deliberately
2. Notice the sensation of your feet touching the ground
3. Observe the world around you without judgment
4. Engage all your senses

## Getting Started

Start with just 5 minutes a day and gradually increase. Consistency is more important than duration.
    `
  },
  {
    slug: 'supporting-someone-you-love',
    title: 'Supporting Someone You Love',
    excerpt: 'A guide to being there for friends and family members who are struggling with mental health challenges.',
    category: 'Support',
    readTime: '10 min read',
    content: `
# Supporting Someone You Love

When someone we care about is struggling, we often feel helpless. Learning how to provide meaningful support can make a significant difference.

## How to Offer Support

### Listen Without Judgment
- Give them your full attention
- Avoid interrupting or offering unsolicited advice
- Validate their feelings, even if you don't fully understand

### Use Supportive Language
- "I'm here for you"
- "That sounds really difficult"
- "How can I best support you?"

### Respect Their Process
- Everyone heals at their own pace
- Don't push them to talk before they're ready
- Respect their boundaries

### Take Care of Yourself
- Set healthy boundaries
- Seek support for yourself
- Recognize the limits of what you can do

## What to Avoid

- Don't minimize their feelings ("It could be worse")
- Don't try to "fix" everything
- Don't force them to seek help before they're ready
- Don't share their story without permission

## When to Encourage Professional Help

Suggest professional support when:
- They're showing signs of self-harm
- Their daily functioning is significantly impaired
- They've expressed thoughts of suicide
- You feel overwhelmed and unable to help

Remember: Your presence and support matter, even when you don't have all the answers.
    `
  },
  {
    slug: 'sleep-and-mental-health',
    title: 'Sleep and Mental Health',
    excerpt: 'Understanding the crucial connection between sleep quality and emotional well-being for better mental health.',
    category: 'Wellness',
    readTime: '7 min read',
    content: `
# Sleep and Mental Health

Sleep and mental health are deeply interconnected. Poor sleep can contribute to mental health problems, and mental health problems can disrupt sleep.

## The Sleep-Mood Connection

### How Sleep Affects Your Mood
- Sleep deprivation increases emotional reactivity
- Lack of sleep impairs your ability to regulate emotions
- Chronic sleep problems are linked to depression and anxiety

### How Mood Affects Your Sleep
- Stress and anxiety can make it hard to fall asleep
- Depression may cause sleeping too much or too little
- Racing thoughts can interrupt sleep patterns

## Tips for Better Sleep

### Create a Sleep-Friendly Environment
- Keep your bedroom cool and dark
- Remove electronic devices
- Use comfortable bedding

### Establish a Bedtime Routine
- Go to bed and wake up at the same time daily
- Avoid caffeine after 2 PM
- Create a relaxing pre-sleep routine

### Manage Sleep Disruptors
- Limit screen time before bed
- Avoid heavy meals late in the day
- Exercise regularly, but not too close to bedtime

## When to Seek Help

Consult a healthcare provider if:
- You consistently struggle to fall or stay asleep
- Sleep problems persist for more than a month
- You experience persistent fatigue affecting daily life

Quality sleep is not a luxury – it's a foundation for good mental health.
    `
  },
  {
    slug: 'understanding-anxiety',
    title: 'Understanding and Managing Anxiety',
    excerpt: 'Learn to recognize anxiety symptoms and discover effective strategies to manage anxiety in daily life.',
    category: 'Anxiety',
    readTime: '9 min read',
    content: `
# Understanding and Managing Anxiety

Anxiety is a natural human response to stress, but when it becomes overwhelming, it can significantly impact your quality of life.

## What is Anxiety?

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While occasional anxiety is normal, chronic anxiety may require attention.

## Recognizing Anxiety Symptoms

### Physical Symptoms
- Rapid heartbeat
- Shallow breathing
- Muscle tension
- Fatigue
- Sleep disturbances

### Emotional Symptoms
- Persistent worry
- Feeling overwhelmed
- Irritability
- Difficulty concentrating
- Sense of dread

## Strategies for Managing Anxiety

### 1. Practice Deep Breathing
- Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8
- Practice daily, especially during stressful moments

### 2. Challenge Catastrophic Thinking
- Identify unhelpful thought patterns
- Ask yourself: "What's the evidence?"
- Focus on what you can control

### 3. Ground Yourself
- Use the 5-4-3-2-1 technique: identify 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste
- Focus on the present moment

### 4. Maintain Healthy Habits
- Regular exercise
- Balanced diet
- Adequate sleep
- Limited caffeine and alcohol

### 5. Build a Support Network
- Talk to trusted friends or family
- Consider therapy or counseling
- Join support groups

## When to Seek Professional Help

Consider reaching out to a mental health professional if:
- Anxiety interferes with daily activities
- You use substances to cope
- You experience panic attacks
- Feelings persist despite self-help efforts

Remember: Anxiety is treatable, and seeking help is a sign of strength.
    `
  },
  {
    slug: 'coping-with-grief',
    title: 'Coping with Grief and Loss',
    excerpt: 'Navigate the journey of grief with compassion and discover healthy ways to process loss and honor memories.',
    category: 'Grief',
    readTime: '8 min read',
    content: `
# Coping with Grief and Loss

Grief is a natural response to loss. Whether you've lost a loved one, a relationship, a job, or something else important, the pain of grief is real and valid.

## Understanding Grief

Grief doesn't follow a linear path. You may experience:
- Shock and denial
- Profound sadness
- Anger or guilt
- Physical symptoms
- Moments of peace

## Healthy Ways to Cope

### Allow Yourself to Feel
- Cry when you need to
- Express your emotions through writing or art
- Don't suppress your feelings

### Take Care of Your Body
- Eat when you can, even if not hungry
- Try to maintain some routine
- Gentle exercise can help process emotions

### Seek Connection
- Talk to trusted friends
- Consider grief support groups
- Don't isolate yourself

### Honor Your Loss
- Create a memory box or album
- Write letters to the person you lost
- Participate in rituals that feel meaningful

### Be Patient with Yourself
- Grief takes time – there's no deadline
- Expect good days and bad days
- Be gentle with yourself

## When to Seek Help

Consider professional support if:
- Grief feels overwhelming for an extended period
- You're unable to function in daily life
- You have thoughts of self-harm
- You feel stuck in your grief

## Remember

There is no "right" way to grieve. Your grief is unique to you. With time, support, and self-compassion, you can find a way forward while honoring the significance of your loss.
    `
  },
];

const realTools = [
  { title: '10 Training Challenges', description: 'Practice with realistic scenarios', icon: Brain, category: 'Training', href: '/training' },
  { title: 'AI Companions', description: '24/7 emotional support', icon: Heart, category: 'Support', href: '/support' },
  { title: 'Crisis Resources', description: 'Global hotline database', icon: Shield, category: 'Help', href: '/crisis' },
  { title: 'Safety Planning', description: 'Create your crisis plan', icon: FileText, category: 'Guide', href: '/crisis#safety' },
];

export default function ResourcesPage() {
  return (
    <Layout activePage="resources">
      {/* Hero Section */}
      <section className="bg-calm-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
              <BookOpen className="h-4 w-4" />
              Mental Health Library
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-calm-900 mb-4">
              Resources to Support Your Wellness Journey
            </h1>
            <p className="text-lg text-calm-600 leading-relaxed">
              Explore evidence-based articles, mental health tools, and resources designed to help you understand and improve your well-being.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <link.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-calm-900 mb-1">{link.title}</h3>
                <p className="text-sm text-calm-500">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">In Crisis? Help is Available</h2>
                  <p className="text-red-100">
                    If you're thinking about hurting yourself or someone else, please reach out for help immediately.
                    Support is available worldwide, 24 hours a day.
                  </p>
                </div>
              </div>
              <Link
                href="/crisis"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300"
              >
                Find Global Crisis Resources
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section id="articles" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-calm-900 mb-4">Mental Health Articles</h2>
            <p className="text-calm-600">Evidence-based guides written by mental health professionals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group bg-gradient-to-br from-calm-50 to-white rounded-2xl p-6 border border-calm-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-calm-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-calm-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-calm-600 mb-4 text-sm">{article.excerpt}</p>
                <Link
                  href={`/resources/${article.slug}`}
                  className="inline-flex items-center text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Real Tools Section */}
      <section id="tools" className="py-16 bg-gradient-to-b from-white to-calm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-calm-900 mb-4">App Features</h2>
            <p className="text-calm-600">Interactive tools and resources available in MindHack</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="group bg-white rounded-xl p-4 border border-calm-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                  <tool.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-calm-900 mb-1">{tool.title}</h4>
                <span className="flex items-center gap-1 text-xs text-calm-500">
                  <span className="px-2 py-0.5 bg-calm-100 rounded-full">{tool.category}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-calm-900 mb-4">Trusted External Resources</h2>
            <p className="text-calm-600">Additional mental health resources from reputable organizations</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'National Institute of Mental Health', url: 'https://www.nimh.nih.gov', desc: 'Research-based mental health information' },
              { name: 'Mental Health America', url: 'https://www.mhanational.org', desc: 'Mental health screening and resources' },
              { name: 'Psychology Today', url: 'https://www.psychologytoday.com', desc: 'Find therapists and mental health articles' },
              { name: 'World Health Organization', url: 'https://www.who.int', desc: 'Global mental health resources' },
              { name: 'SAMHSA', url: 'https://www.samhsa.gov', desc: 'Substance Abuse and Mental Health Services' },
              { name: 'Anxiety & Depression Association', url: 'https://adaa.org', desc: 'Resources for anxiety and depression' },
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-calm-50 rounded-xl p-4 border border-calm-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-calm-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {resource.name}
                    </h4>
                    <p className="text-sm text-calm-500">{resource.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-calm-400 group-hover:text-primary-600" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-calm-50 border-t border-calm-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-calm-500">
            <strong>Disclaimer:</strong> The resources provided on this website are for informational purposes only
            and are not intended as a substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health provider with any questions you
            may have regarding a medical condition.
          </p>
        </div>
      </section>
    </Layout>
  );
}
