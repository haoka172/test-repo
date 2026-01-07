import React from 'react';

interface ResponsiveHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

/**
 * 响应式标题组件 - 针对移动端优化
 * 移动端使用较小的字体，桌面端使用较大的字体
 */
export default function ResponsiveHeading({ level, children, className = '' }: ResponsiveHeadingProps) {
  const baseClasses = 'font-bold text-text-primary';
  
  // 移动优先的响应式字体大小
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl md:text-4xl', // H1: 移动24px, 平板30px, 桌面36px
    2: 'text-xl sm:text-2xl md:text-3xl',  // H2: 移动20px, 平板24px, 桌面30px
    3: 'text-lg sm:text-xl md:text-2xl',   // H3: 移动18px, 平板20px, 桌面24px
    4: 'text-base sm:text-lg md:text-xl',  // H4: 移动16px, 平板18px, 桌面20px
    5: 'text-sm sm:text-base md:text-lg',  // H5: 移动14px, 平板16px, 桌面18px
    6: 'text-sm sm:text-base',             // H6: 移动14px, 平板16px
  };

  const classes = `${baseClasses} ${sizeClasses[level]} ${className}`;

  return React.createElement(`h${level}`, { className: classes }, children);
}
