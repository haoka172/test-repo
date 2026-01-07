'use client';

import { useState } from 'react';

interface ChapterNavButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  title?: string;
}

export default function ChapterNavButton({ 
  href, 
  children, 
  variant = 'primary',
  className = '',
  title 
}: ChapterNavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    if (variant === 'primary') {
      return isHovered ? 'var(--color-primary-hover)' : 'var(--color-primary)';
    } else if (variant === 'secondary') {
      return isHovered ? 'var(--color-secondary-hover)' : 'var(--color-secondary)';
    }
    return undefined;
  };

  const baseClasses = variant === 'tertiary' 
    ? 'bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30'
    : 'text-white';

  return (
    <a
      href={href}
      className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${baseClasses} ${className}`}
      style={variant !== 'tertiary' ? { backgroundColor: getBackgroundColor() } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {children}
    </a>
  );
}
