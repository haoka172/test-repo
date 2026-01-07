'use client';

import React from 'react';
import { useSeoConfig } from './provider';
import { generateSchemaData } from './schema';
import type { SchemaType } from './types';

interface SchemaOrgProps {
  type: SchemaType;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  chapterNumber?: string | number;
}

export default function SchemaOrg({
  type,
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  chapterNumber,
}: SchemaOrgProps) {
  const config = useSeoConfig();

  const schema = generateSchemaData(config, type, {
    title,
    description,
    url,
    imageUrl,
    datePublished,
    dateModified,
    chapterNumber,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}