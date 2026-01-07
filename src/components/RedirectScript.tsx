'use client';

import { useEffect } from 'react';

interface RedirectScriptProps {
  url: string;
  delay?: number;
}

export default function RedirectScript({ url, delay = 3000 }: RedirectScriptProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url;
    }, delay);

    return () => clearTimeout(timer);
  }, [url, delay]);

  return null;
}
