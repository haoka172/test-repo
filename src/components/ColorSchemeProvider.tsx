'use client';

import { useEffect } from 'react';
import { clientSiteConfig } from '@/lib/staticConfig';

/**
 * 颜色方案提供器
 * 从 siteinfo.json 读取配色并动态应用到 CSS 变量
 */
export default function ColorSchemeProvider() {
  useEffect(() => {
    const colorScheme = clientSiteConfig.colorScheme;
    
    if (!colorScheme) return;

    // 生成主色色阶
    const generateColorScale = (baseColor: string) => {
      // 简单的色阶生成算法
      const hex = baseColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      const lighten = (amount: number) => {
        const nr = Math.min(255, r + amount);
        const ng = Math.min(255, g + amount);
        const nb = Math.min(255, b + amount);
        return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
      };

      const darken = (amount: number) => {
        const nr = Math.max(0, r - amount);
        const ng = Math.max(0, g - amount);
        const nb = Math.max(0, b - amount);
        return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
      };

      return {
        50: lighten(100),
        100: lighten(80),
        200: lighten(60),
        300: lighten(40),
        400: lighten(20),
        500: baseColor,
        600: darken(20),
        700: darken(40),
        800: darken(60),
        900: darken(80),
      };
    };

    // 应用主色
    if (colorScheme.primary) {
      const primaryScale = generateColorScale(colorScheme.primary);
      Object.entries(primaryScale).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-primary-${key}`, value);
      });
      document.documentElement.style.setProperty('--color-primary', colorScheme.primary);
      document.documentElement.style.setProperty('--color-primary-hover', primaryScale[600]);
    }

    // 应用次要色
    if (colorScheme.secondary) {
      const secondaryScale = generateColorScale(colorScheme.secondary);
      Object.entries(secondaryScale).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-secondary-${key}`, value);
      });
      document.documentElement.style.setProperty('--color-secondary', colorScheme.secondary);
      document.documentElement.style.setProperty('--color-secondary-hover', secondaryScale[600]);
    }

    // 应用背景色
    if (colorScheme.background) {
      if (colorScheme.background.light) {
        document.documentElement.style.setProperty('--color-surface-primary-light', colorScheme.background.light);
      }
      if (colorScheme.background.lightSecondary) {
        document.documentElement.style.setProperty('--color-surface-secondary-light', colorScheme.background.lightSecondary);
      }
      if (colorScheme.background.dark) {
        document.documentElement.style.setProperty('--color-surface-primary-dark', colorScheme.background.dark);
      }
      if (colorScheme.background.darkSecondary) {
        document.documentElement.style.setProperty('--color-surface-secondary-dark', colorScheme.background.darkSecondary);
      }
    }

    // 应用文本颜色
    if (colorScheme.text) {
      if (colorScheme.text.light) {
        document.documentElement.style.setProperty('--color-text-primary-light', colorScheme.text.light);
      }
      if (colorScheme.text.lightSecondary) {
        document.documentElement.style.setProperty('--color-text-secondary-light', colorScheme.text.lightSecondary);
      }
      if (colorScheme.text.dark) {
        document.documentElement.style.setProperty('--color-text-primary-dark', colorScheme.text.dark);
      }
      if (colorScheme.text.darkSecondary) {
        document.documentElement.style.setProperty('--color-text-secondary-dark', colorScheme.text.darkSecondary);
      }
    }

    console.log('✅ 配色方案已应用:', colorScheme);
  }, []);

  return null; // 这是一个无渲染组件
}
