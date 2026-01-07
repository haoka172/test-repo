'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { SeoConfig } from './types';

// SEO Context定义
interface SeoContextValue {
  config: SeoConfig;
}

const SeoContext = createContext<SeoContextValue | null>(null);

// SEO Provider Props
interface SeoProviderProps {
  config: SeoConfig;
  children: ReactNode;
}

// SEO Provider组件
export function SeoProvider({ config, children }: SeoProviderProps) {
  return (
    <SeoContext.Provider value={{ config }}>
      {children}
    </SeoContext.Provider>
  );
}

// 获取SEO配置的Hook
export function useSeoConfig(): SeoConfig {
  const context = useContext(SeoContext);

  if (!context) {
    throw new Error('useSeoConfig must be used within a SeoProvider');
  }

  return context.config;
}