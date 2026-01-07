// 色彩设计令牌系统
// 基于语义化命名，便于维护和主题切换

export const colorTokens = {
  // 品牌色彩 - Blue Lock主题
  brand: {
    primary: { // Blue Lock蓝色系
      50: '#eff6ff',   // 最浅蓝
      100: '#dbeafe',  // 浅蓝
      200: '#bfdbfe',  // 较浅蓝
      300: '#93c5fd',  // 中浅蓝
      400: '#60a5fa',  // 中蓝
      500: '#3b82f6',  // 主蓝色 (Blue Lock主色)
      600: '#2563eb',  // 深蓝 (hover蓝色)
      700: '#1d4ed8',  // 更深蓝
      800: '#1e40af',  // 深蓝
      900: '#1e3a8a',  // 最深蓝
    },
    secondary: { // Blue Lock青绿色系
      50: '#f0fdfa',   // 最浅青绿
      100: '#ccfbf1',  // 浅青绿
      200: '#99f6e4',  // 较浅青绿
      300: '#5eead4',  // 中浅青绿
      400: '#2dd4bf',  // 中青绿
      500: '#14b8a6',  // 主青绿色
      600: '#0d9488',  // 深青绿 (hover颜色)
      700: '#0f766e',  // 更深青绿
      800: '#115e59',  // 深青绿
      900: '#134e4a',  // 最深青绿
    }
  },

  // 语义化颜色
  semantic: {
    // 成功色
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    // 警告色
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    // 错误色
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
    // 信息色
    info: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
    }
  },

  // 表面颜色（背景和卡片）
  surface: {
    light: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      elevated: '#ffffff',
    },
    dark: {
      primary: '#111827', // bg-gray-900
      secondary: '#1f2937', // bg-gray-800  
      tertiary: '#374151', // bg-gray-700
      elevated: '#1f2937',
    }
  },

  // 文本颜色
  text: {
    light: {
      primary: '#111827',
      secondary: '#374151', 
      tertiary: '#6b7280',
      inverse: '#ffffff',
      muted: '#9ca3af',
    },
    dark: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af', 
      inverse: '#111827',
      muted: '#6b7280',
    }
  },

  // 边框颜色
  border: {
    light: {
      default: '#e5e7eb',
      subtle: '#f3f4f6',
      strong: '#d1d5db',
    },
    dark: {
      default: '#374151',
      subtle: '#1f2937',
      strong: '#4b5563',
    }
  }
} as const;

// 颜色主题类型
export type ColorTheme = 'light' | 'dark';

// 获取颜色值的辅助函数
export const getColorValue = (
  category: keyof typeof colorTokens,
  variant: string,
  shade?: string | number
) => {
  const colorGroup = colorTokens[category] as any;
  if (!shade) {
    return colorGroup[variant];
  }
  return colorGroup[variant][shade];
};

// CSS变量映射 - Blue Lock主题
export const cssVariables = {
  // 品牌色 - 完整色阶
  '--color-primary-50': colorTokens.brand.primary[50],
  '--color-primary-100': colorTokens.brand.primary[100],
  '--color-primary-200': colorTokens.brand.primary[200],
  '--color-primary-300': colorTokens.brand.primary[300],
  '--color-primary-400': colorTokens.brand.primary[400],
  '--color-primary-500': colorTokens.brand.primary[500],
  '--color-primary-600': colorTokens.brand.primary[600],
  '--color-primary-700': colorTokens.brand.primary[700],
  '--color-primary-800': colorTokens.brand.primary[800],
  '--color-primary-900': colorTokens.brand.primary[900],
  '--color-primary': colorTokens.brand.primary[500],        // 默认主色
  '--color-primary-hover': colorTokens.brand.primary[600],  // hover状态

  // 次要色 - 青绿色系
  '--color-secondary-50': colorTokens.brand.secondary[50],
  '--color-secondary-100': colorTokens.brand.secondary[100],
  '--color-secondary-200': colorTokens.brand.secondary[200],
  '--color-secondary-300': colorTokens.brand.secondary[300],
  '--color-secondary-400': colorTokens.brand.secondary[400],
  '--color-secondary-500': colorTokens.brand.secondary[500],
  '--color-secondary-600': colorTokens.brand.secondary[600],
  '--color-secondary-700': colorTokens.brand.secondary[700],
  '--color-secondary-800': colorTokens.brand.secondary[800],
  '--color-secondary-900': colorTokens.brand.secondary[900],
  '--color-secondary': colorTokens.brand.secondary[500],        // 默认次色
  '--color-secondary-hover': colorTokens.brand.secondary[600],  // hover状态
  
  // 语义化颜色
  '--color-success': colorTokens.semantic.success[500],
  '--color-success-hover': colorTokens.semantic.success[600],
  '--color-warning': colorTokens.semantic.warning[500],
  '--color-warning-hover': colorTokens.semantic.warning[600],
  '--color-error': colorTokens.semantic.error[500],
  '--color-error-hover': colorTokens.semantic.error[600],
  
  // 表面色（动态主题）
  '--color-surface': 'light-dark(#ffffff, #111827)',
  '--color-surface-secondary': 'light-dark(#f8fafc, #1f2937)',
  '--color-surface-tertiary': 'light-dark(#f1f5f9, #374151)',
  '--color-surface-elevated': 'light-dark(#ffffff, #1f2937)',
  
  // 文本色（动态主题）
  '--color-text-primary': 'light-dark(#111827, #f9fafb)',
  '--color-text-secondary': 'light-dark(#374151, #d1d5db)',
  '--color-text-tertiary': 'light-dark(#6b7280, #9ca3af)',
  '--color-text-inverse': 'light-dark(#ffffff, #111827)',
  '--color-text-muted': 'light-dark(#9ca3af, #6b7280)',
  
  // 边框色（动态主题）
  '--color-border-default': 'light-dark(#e5e7eb, #374151)',
  '--color-border-subtle': 'light-dark(#f3f4f6, #1f2937)',
  '--color-border-strong': 'light-dark(#d1d5db, #4b5563)',
} as const;