/**
 * Unified chapter number parsing and sorting utilities
 * Consolidates duplicate logic across the application
 */

/**
 * Parse chapter number string into a sortable numeric value
 * Supports formats like: '1', '205', '205-5', '205.5'
 * Ensures proper ordering: 205 < 205-5 < 205-6 < 206
 */
export function parseChapterForSort(chapterNumStr: string | number): number {
  if (!chapterNumStr) return 0;

  const s = String(chapterNumStr).replace(/\./g, '-');
  const parts = s.split('-');
  const main = parseInt(parts[0], 10) || 0;
  let sub = 0;

  if (parts.length > 1) {
    // Treat sub-parts as fractional increments
    // Example: '205-5' becomes 205.005, '205-6' becomes 205.006
    sub = parseInt(parts.slice(1).join(''), 10) / Math.pow(10, parts.slice(1).join('').length + 1);
  }

  return main + sub;
}

/**
 * Generate filename from chapter ID
 * Supports both integer and sub-chapter formats
 */
export function makeFileNameFromId(chapterId: string | number): string {
  let s = String(chapterId);
  s = s.replace(/\./g, '-');
  const parts = s.split('-');
  const main = String(parseInt(parts[0], 10)).padStart(3, '0');

  if (parts.length > 1) {
    return `${main}-${parts.slice(1).join('-')}.md`;
  }
  return `${main}.md`;
}

/**
 * Normalize filename to chapter ID
 * Converts '025.md' -> '25', '025-5.md' -> '25-5'
 */
export function normalizeFileNameToId(fileName: string): string {
  const s = fileName.replace(/\.md$/, '').replace(/\./g, '-');
  const parts = s.split('-');
  parts[0] = String(parseInt(parts[0], 10));
  return parts.length > 1 ? parts.join('-') : parts[0];
}

/**
 * Sort chapters array by chapter number
 */
export function sortChaptersByNumber<T extends { id: string | number }>(
  chapters: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return chapters.sort((a, b) => {
    const numA = parseChapterForSort(a.id);
    const numB = parseChapterForSort(b.id);
    return order === 'asc' ? numA - numB : numB - numA;
  });
}

/**
 * Build chapter URL from template and parameters
 */
export function buildChapterUrl(
  template: string,
  slug: string,
  chapterId: string | number
): string {
  return template
    .replace('{slug}', slug)
    .replace('{id}', String(chapterId));
}

/**
 * Get latest chapter from a list
 */
export function getLatestChapter<T extends { id: string | number }>(chapters: T[]): T | null {
  if (chapters.length === 0) return null;
  const sorted = sortChaptersByNumber(chapters, 'desc');
  return sorted[0];
}

/**
 * Get first chapter from a list
 */
export function getFirstChapter<T extends { id: string | number }>(chapters: T[]): T | null {
  if (chapters.length === 0) return null;
  const sorted = sortChaptersByNumber(chapters, 'asc');
  return sorted[0];
}