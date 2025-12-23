import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { ArrowLeft, Clock, BookOpen, Share2 } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string;
}

const articles: Article[] = [
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

Remember: Your presence and support matters, even when you don't have all the answers.
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

function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

function parseMarkdown(content: string) {
  // Simple markdown parser for article content
  const lines = content.trim().split('\n');
  const parsed: { type: string; content: string; level?: number }[] = [];

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      parsed.push({ type: 'h1', content: line.slice(2), level: 1 });
    } else if (line.startsWith('## ')) {
      parsed.push({ type: 'h2', content: line.slice(3), level: 2 });
    } else if (line.startsWith('### ')) {
      parsed.push({ type: 'h3', content: line.slice(4), level: 3 });
    } else if (line.startsWith('- ')) {
      parsed.push({ type: 'li', content: line.slice(2) });
    } else if (line.match(/^\d+\.\s/)) {
      parsed.push({ type: 'li', content: line.replace(/^\d+\.\s/, '') });
    } else if (line.trim() === '') {
      // Skip empty lines
    } else {
      parsed.push({ type: 'p', content: line });
    }
  });

  return parsed;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticle(resolvedParams.slug);
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: `${article.title} - MindHack Resources`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = getArticle(resolvedParams.slug);

  if (!article) {
    return (
      <Layout activePage="resources" showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-calm-900 mb-4">Article Not Found</h1>
            <Link href="/resources" className="text-primary-600 hover:text-primary-700">
              Return to Resources
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const parsedContent = parseMarkdown(article.content);

  return (
    <Layout activePage="resources">
      <article className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-calm-50 via-white to-primary-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/resources" className="inline-flex items-center text-calm-500 hover:text-calm-700 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-calm-500 text-sm">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-calm-900 mb-6">
              {article.title}
            </h1>

            <p className="text-xl text-calm-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-calm max-w-none">
              {parsedContent.map((line, index) => {
                switch (line.type) {
                  case 'h1':
                    return <h1 key={index} className="text-3xl font-bold text-calm-900 mt-12 mb-6">{line.content}</h1>;
                  case 'h2':
                    return <h2 key={index} className="text-2xl font-bold text-calm-900 mt-10 mb-4">{line.content}</h2>;
                  case 'h3':
                    return <h3 key={index} className="text-xl font-semibold text-calm-900 mt-8 mb-3">{line.content}</h3>;
                  case 'li':
                    return (
                      <li key={index} className="text-calm-700 mb-2 ml-4 list-disc">
                        {line.content}
                      </li>
                    );
                  case 'p':
                    return <p key={index} className="text-calm-700 mb-4 leading-relaxed">{line.content}</p>;
                  default:
                    return null;
                }
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-calm-100">
              <div className="flex items-center justify-between">
                <span className="text-calm-500">Share this article</span>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 bg-calm-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-calm-900 mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {articles.filter(a => a.slug !== article.slug).slice(0, 2).map((related) => (
                <Link
                  key={related.slug}
                  href={`/resources/${related.slug}`}
                  className="group bg-white rounded-xl p-6 border border-calm-100 hover:shadow-lg hover:border-primary-200 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {related.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-calm-900 group-hover:text-primary-600 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-calm-500 mt-1">{related.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
