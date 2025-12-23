'use client';

import { useState, useEffect, useCallback } from 'react';

interface AnimatedTaglineProps {
  words?: string[];
  className?: string;
}

const defaultWords = [
  'Build Mental Resilience',
  'Learn Helping Skills',
  'Find Inner Peace',
  'Grow Every Day',
  'Support Others',
  'Create Positive Change',
];

export default function AnimatedTagline({
  words = defaultWords,
  className = ''
}: AnimatedTaglineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayWord, setDisplayWord] = useState(words[0]);

  const animateWord = useCallback((newIndex: number) => {
    setIsAnimating(true);
    setDisplayWord('');

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setDisplayWord(words[newIndex]);
      setIsAnimating(false);
    }, 300);
  }, [words]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % words.length;
      animateWord(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, words, animateWord]);

  return (
    <span className={`inline-block ${className}`}>
      <span
        className={`inline-block transition-all duration-300 ${
          isAnimating
            ? 'opacity-0 -translate-y-2'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {displayWord}
      </span>
      <span className={`animate-pulse ml-1 ${className}`}>|</span>
    </span>
  );
}

// Rotating words with fade effect
export function RotatingWords({
  words,
  className = ''
}: {
  words: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setIsVisible(true);
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className={`inline-block min-w-[200px] ${className}`}>
      <span
        className={`inline-block transition-all duration-500 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}

// Typewriter effect component
export function Typewriter({
  text,
  speed = 50,
  className = ''
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      setStarted(true);
      let currentText = '';
      let charIndex = 0;

      const type = () => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          setDisplayedText(currentText);
          charIndex++;
          setTimeout(type, speed);
        }
      };

      type();
    }
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayedText}
      <span className={`animate-pulse ml-1 ${className}`}>|</span>
    </span>
  );
}
