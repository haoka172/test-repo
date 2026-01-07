import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import {
  parseChapterForSort,
  makeFileNameFromId,
  normalizeFileNameToId
} from './chapterUtils';
import { replaceTemplateVariables } from '../lib/templateProcessor';

// Helper to resolve chapters directory for a given slug. Slug is required.
function resolveChaptersDir(slug: string | null = null) {
  // 新的简化结构：直接从 src/data/chapters 读取
  return path.join(process.cwd(), 'src', 'data', 'chapters');
}

// Load site configuration for template variables
async function loadSiteConfig() {
  try {
    const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
    const siteInfoContent = await fs.readFile(siteInfoPath, 'utf8');
    const siteInfo = JSON.parse(siteInfoContent);
    
    // Get global variables first
    const globalVars = siteInfo.globalVariables || {};
    
    // Process headerLogo with template variables
    let headerLogo = siteInfo.headerLogo || '{mangaTitle} manga';
    if (typeof headerLogo === 'string') {
      headerLogo = replaceTemplateVariables(headerLogo, globalVars);
    }
    
    // Process genre array to string for template usage
    let genreString = '';
    if (siteInfo.genre && Array.isArray(siteInfo.genre)) {
      genreString = siteInfo.genre.join(', ');
    }
    
    // Include both globalVariables and processed headerLogo
    return {
      ...globalVars,
      headerLogo: headerLogo,
      genre: genreString
    };
  } catch (error) {
    console.warn('Could not load siteinfo.json for template variables:', error);
    return {};
  }
}

export interface ChapterData {
  id: string;
  title: string;
  keywords: string[];
  imagePaths: string[];
  description: string;
}

export interface ChapterMetadata {
  id: string;
  title: string;
  keywords: string[];
}

export async function getChapterData(chapterId: string, slug: string | null = null): Promise<ChapterData | null> {
  const CHAPTERS_DIR = resolveChaptersDir();
  const chapterFileName = makeFileNameFromId(chapterId);
  const filePath = path.join(CHAPTERS_DIR, chapterFileName);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Load site configuration for template variables
    const siteConfig = await loadSiteConfig();
    const templateVars = {
      ...siteConfig,
      chapterId: chapterId
    };

    // Process template variables in frontmatter and content
    const processedTitle = typeof data.title === 'string' ? replaceTemplateVariables(data.title, templateVars) : `Chapter ${chapterId}`;
    const processedKeywords = Array.isArray(data.keywords) ? 
      data.keywords.map((keyword: string) => replaceTemplateVariables(keyword, templateVars)) : [];
    const processedContent = replaceTemplateVariables(content.trim(), templateVars);

    // 处理description：移除第一行标题（如果存在）
    let descriptionContent = processedContent;
    const lines = processedContent.split('\n');
    if (lines.length > 0 && lines[0].trim().startsWith('**') && lines[0].includes('Chapter')) {
      // 跳过第一行标题和可能的空行
      let startIndex = 1;
      while (startIndex < lines.length && lines[startIndex].trim() === '') {
        startIndex++;
      }
      descriptionContent = lines.slice(startIndex).join('\n');
    }

    // 返回 id 为字符串形式（归一化过）
    const normalizedId = String(chapterId).replace(/\./g, '-');
    return {
      id: normalizedId,
      title: processedTitle,
      keywords: processedKeywords,
      imagePaths: data.imagePaths || [],
      // Parse markdown content to HTML, excluding the chapter title
      description: marked.parse(descriptionContent)
    };
  } catch (error: any) {
    console.error(`Error reading or parsing chapter ${chapterId} from ${CHAPTERS_DIR}:`, error.message);
    return null;
  }
}

// Get metadata for all chapters for a given slug (optional)
export async function getAllChaptersMetadata(slug: string | null = null): Promise<ChapterMetadata[]> {
  const CHAPTERS_DIR = resolveChaptersDir();
  let files: string[];
  try {
    files = await fs.readdir(CHAPTERS_DIR);
  } catch (e: any) {
    if (e && e.code === 'ENOENT') {
      console.warn(`⚠️ 章节目录不存在: ${CHAPTERS_DIR}. 返回空章节列表.`);
      return [];
    }
    throw e;
  }
  
  // Load site configuration for template variables
  const siteConfig = await loadSiteConfig();
  const chapterMetadata: ChapterMetadata[] = [];

  for (const file of files) {
    if (file.endsWith('.md') && file !== 'template.md') {
      const fileBase = file.replace('.md', '');
      const chapterId = normalizeFileNameToId(fileBase); // 字符串形式
      try {
        const filePath = path.join(CHAPTERS_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        const templateVars = {
          ...siteConfig,
          chapterId: chapterId
        };
        
        // Process template variables in metadata
        const processedTitle = typeof data.title === 'string' ? 
          replaceTemplateVariables(data.title, templateVars) : `Chapter ${chapterId}`;
        const processedKeywords = Array.isArray(data.keywords) ? 
          data.keywords.map((keyword: string) => replaceTemplateVariables(keyword, templateVars)) : [];
        
        chapterMetadata.push({
          id: chapterId,
          title: processedTitle,
          keywords: processedKeywords
        });
      } catch (e: any) {
        console.warn(`Error reading chapter file ${file}:`, e.message);
        // 忽略读取错误，继续
      }
    }
  }

  // Custom sorting logic now imported from chapterUtils

  // 去重（以 id 为键），保留第一次出现的条目
  const unique = new Map<string, ChapterMetadata>();
  for (const item of chapterMetadata) {
    if (!unique.has(item.id)) unique.set(item.id, item);
  }
  const uniqueArray = Array.from(unique.values());
  return uniqueArray.sort((a, b) => parseChapterForSort(a.id) - parseChapterForSort(b.id));
}
