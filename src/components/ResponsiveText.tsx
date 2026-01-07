interface ResponsiveTextProps {
  variant?: 'body' | 'small' | 'large';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * 响应式文本组件 - 针对移动端优化
 */
export default function ResponsiveText({ 
  variant = 'body', 
  children, 
  className = '',
  as: Tag = 'p'
}: ResponsiveTextProps) {
  const sizeClasses = {
    large: 'text-base sm:text-lg md:text-xl',     // 大文本: 移动16px, 平板18px, 桌面20px
    body: 'text-sm sm:text-base md:text-lg',      // 正文: 移动14px, 平板16px, 桌面18px
    small: 'text-xs sm:text-sm md:text-base',     // 小文本: 移动12px, 平板14px, 桌面16px
  };

  const classes = `${sizeClasses[variant]} ${className}`;

  return <Tag className={classes}>{children}</Tag>;
}
