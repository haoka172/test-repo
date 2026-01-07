import { colorTokens, type ColorTheme } from '@/styles/theme';

/**
 * 颜色工具函数集合
 * 提供程序化访问设计令牌的方法
 */

// CSS变量名映射
export const cssVars = {
  // 品牌色
  primary: {
    50: '--color-primary-50',
    100: '--color-primary-100',
    200: '--color-primary-200',
    300: '--color-primary-300',
    400: '--color-primary-400',
    500: '--color-primary-500',
    600: '--color-primary-600',
    700: '--color-primary-700',
    800: '--color-primary-800',
    900: '--color-primary-900',
    DEFAULT: '--color-primary',
    hover: '--color-primary-hover',
  },
  
  // 表面色
  surface: {
    primary: '--color-surface-primary',
    secondary: '--color-surface-secondary',
    tertiary: '--color-surface-tertiary',
    elevated: '--color-surface-elevated',
  },
  
  // 文本色
  text: {
    primary: '--color-text-primary',
    secondary: '--color-text-secondary',
    tertiary: '--color-text-tertiary',
    inverse: '--color-text-inverse',
    muted: '--color-text-muted',
  },
  
  // 边框色
  border: {
    default: '--color-border-default',
    subtle: '--color-border-subtle',
    strong: '--color-border-strong',
  }
} as const;

/**
 * 获取CSS变量值
 */
export const getCSSVar = (varName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

/**
 * 设置CSS变量值
 */
export const setCSSVar = (varName: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(varName, value);
};

/**
 * 生成动态类名
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 颜色主题工具类
 */
export class ColorThemeUtils {
  /**
   * 获取当前主题
   */
  static getCurrentTheme(): ColorTheme {
    if (typeof window === 'undefined') return 'light';
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  }
  
  /**
   * 获取主题相关的颜色值
   */
  static getThemeColor(
    category: keyof typeof colorTokens.surface | keyof typeof colorTokens.text | keyof typeof colorTokens.border,
    variant: string,
    theme?: ColorTheme
  ): string {
    const currentTheme = theme || this.getCurrentTheme();
    const colorGroup = colorTokens[category] as any;
    return colorGroup[currentTheme]?.[variant] || colorGroup.light[variant];
  }
  
  /**
   * 切换主题
   */
  static toggleTheme(): void {
    if (typeof window === 'undefined') return;
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  }
}

/**
 * 生成语义化的Tailwind类名
 */
export const semanticClasses = {
  // 表面类
  surface: {
    primary: 'bg-surface',
    secondary: 'bg-surface-secondary', 
    tertiary: 'bg-surface-tertiary',
    elevated: 'bg-surface-elevated',
  },
  
  // 文本类
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
    inverse: 'text-text-inverse',
    muted: 'text-text-muted',
  },
  
  // 边框类
  border: {
    default: 'border-border-default',
    subtle: 'border-border-subtle',
    strong: 'border-border-strong',
  },
  
  // 按钮类
  button: {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-surface-secondary hover:bg-surface-tertiary text-text-primary border border-border-default',
    success: 'bg-success hover:bg-success-hover text-white',
    warning: 'bg-warning hover:bg-warning-hover text-white',
    error: 'bg-error hover:bg-error-hover text-white',
  }
} as const;

/**
 * 验证颜色值格式
 */
export const isValidColor = (color: string): boolean => {
  // 创建一个临时元素来测试颜色值
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  return tempElement.style.color !== '';
};

/**
 * 转换hex到RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * 转换RGB到hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};