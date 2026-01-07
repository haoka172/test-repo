import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色彩 - Blue Lock主题
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        
        // 次要色彩 - 青绿色系
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        
        // 语义化颜色
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          DEFAULT: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          hover: 'var(--color-warning-hover)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          hover: 'var(--color-error-hover)',
        },
        
        // 表面颜色
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
          elevated: 'var(--color-surface-elevated)',
        },
        
        // 文本颜色
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
          muted: 'var(--color-text-muted)',
        },
        
        // 边框颜色
        border: {
          DEFAULT: 'var(--color-border-default)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
        },

        // 保持向后兼容的映射
        background: 'var(--color-surface)',
        foreground: 'var(--color-text-primary)',
      },
      
      // 语义化背景类
      backgroundColor: {
        'surface-primary': 'var(--color-surface-primary)',
        'surface-secondary': 'var(--color-surface-secondary)', 
        'surface-tertiary': 'var(--color-surface-tertiary)',
      },
      
      // 语义化文本类
      textColor: {
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  
  // 禁用未使用的核心插件以减少CSS包大小
  corePlugins: {
    container: false,
    accessibility: false,
    blur: false,
    brightness: false,
    contrast: false,
    dropShadow: false,
    filter: false,
    grayscale: false,
    hueRotate: false,
    invert: false,
    saturate: false,
    sepia: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropFilter: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    float: false,
    clear: false,
    isolation: false,
    mixBlendMode: false,
    backgroundBlendMode: false,
    tableLayout: false,
    captionSide: false,
    borderCollapse: false,
    borderSpacing: false,
    listStyleImage: false,
    listStylePosition: false,
    listStyleType: false,
    appearance: false,
    columns: false,
    breakAfter: false,
    breakBefore: false,
    breakInside: false,
    boxDecorationBreak: false,
    boxSizing: false,
    objectFit: false,
    objectPosition: false,
    overscrollBehavior: false,
    resize: false,
    scrollBehavior: false,
    scrollMargin: false,
    scrollPadding: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    scrollSnapType: false,
    touchAction: false,
    userSelect: false,
    willChange: false,
    fill: false,
    stroke: false,
    strokeWidth: false,
    backgroundAttachment: false,
    gradientColorStops: false,
  },
}

export default config