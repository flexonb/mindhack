import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'MindHack - Mental Health Training & Support',
  description: 'AI-powered mental health training and 24/7 human support',
  keywords: ['mental health', 'therapy', 'support', 'AI training', 'wellness'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
