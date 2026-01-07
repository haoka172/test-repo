/**
 * 章节模板生成器 - 自动生成章节的markdown文件内容
 * 包括title、keywords、description等frontmatter和内容部分
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { 
  generateChapterMetadata, 
  extractChapterTemplateConfig,
  generateSmartChapterTitle,
  type ChapterTemplateConfig,
  type ChapterTemplateParams 
} from './templateUtils';

export interface ChapterGeneratorConfig {
  mangaDirName: string;
  chaptersDir: string;
  siteConfig: any;
}

export interface ChapterData {
  chapterId: string | number;
  chapterTitle?: string;
  imagePaths?: string[];
  customContent?: string;
  customVariables?: Record<string, any>;
}

export class ChapterTemplateGenerator {
  private config: ChapterGeneratorConfig;
  private templateConfig: ChapterTemplateConfig | null = null;

  constructor(config: ChapterGeneratorConfig) {
    this.config = config;
    this.templateConfig = extractChapterTemplateConfig(config.siteConfig);
  }

  /**
   * 生成章节的完整markdown内容
   * @param chapterData 章节数据
   * @returns 生成的markdown内容
   */
  async generateChapterMarkdown(chapterData: ChapterData): Promise<string> {
    const { chapterId, chapterTitle, imagePaths = [], customContent, customVariables = {} } = chapterData;
    
    // 如果没有模板配置，使用默认生成方式
    if (!this.templateConfig) {
      return this.generateDefaultChapterMarkdown(chapterData);
    }

    // 准备模板参数
    const mangaTitle = this.config.siteConfig.hero?.title?.split(/[—\-–]|Read/)[0]?.trim() || 'Manga';
    const mangaTitleLower = mangaTitle.toLowerCase();
    
    const templateParams: ChapterTemplateParams = {
      chapterId,
      chapterTitle: chapterTitle || generateSmartChapterTitle(chapterId, undefined, mangaTitle),
      mangaTitle,
      mangaTitleLower,
      author: this.config.siteConfig.author,
      illustrator: this.config.siteConfig.illustrator,
      genre: this.config.siteConfig.genre?.join(' ') || 'Fantasy',
      seriesDescription: this.config.siteConfig.seo?.globalPhenomenonText || 'fantasy manga series',
      heroDescription: this.config.siteConfig.hero?.description || 'Read manga online for free with high-quality images.',
      customVariables: {
        ...customVariables,
        baseUrl: this.config.siteConfig.seo?.baseUrl || this.config.siteConfig.baseUrl,
        siteName: this.config.siteConfig.seo?.siteName || this.config.siteConfig.title
      }
    };

    // 生成元数据
    const metadata = generateChapterMetadata(this.templateConfig, templateParams);
    
    // 生成frontmatter
    const frontmatter = {
      title: metadata.title,
      keywords: metadata.keywords,
      imagePaths: imagePaths,
      ...customVariables
    };

    // 生成内容
    const content = customContent || metadata.content;

    // 使用gray-matter生成markdown
    return matter.stringify(content, frontmatter, { lineWidth: -1 });
  }

  /**
   * 生成默认的章节markdown内容（当没有模板配置时）
   * @param chapterData 章节数据
   * @returns 生成的markdown内容
   */
  private generateDefaultChapterMarkdown(chapterData: ChapterData): string {
    const { chapterId, chapterTitle, imagePaths = [], customContent } = chapterData;
    const mangaTitle = this.config.siteConfig.hero?.title?.split(/[—\-–]|Read/)[0]?.trim() || 'Manga';
    
    const frontmatter = {
      title: chapterTitle || `${mangaTitle} Chapter ${chapterId}`,
      keywords: [
        mangaTitle.toLowerCase(),
        `${mangaTitle.toLowerCase()} chapter ${chapterId}`,
        `${mangaTitle.toLowerCase()} manga`,
        'fantasy manga',
        'adventure manga'
      ],
      imagePaths: imagePaths
    };

    const content = customContent || `\nThis is a placeholder description for ${mangaTitle} Chapter ${chapterId}.`;

    return matter.stringify(content, frontmatter, { lineWidth: -1 });
  }

  /**
   * 保存章节markdown文件
   * @param chapterData 章节数据
   * @param fileName 文件名（可选）
   * @returns 保存的文件路径
   */
  async saveChapterMarkdown(chapterData: ChapterData, fileName?: string): Promise<string> {
    const markdownContent = await this.generateChapterMarkdown(chapterData);
    
    // 生成文件名
    const finalFileName = fileName || this.generateFileName(chapterData.chapterId);
    const filePath = path.join(this.config.chaptersDir, finalFileName);

    // 确保目录存在
    await fs.mkdir(this.config.chaptersDir, { recursive: true });

    // 写入文件
    await fs.writeFile(filePath, markdownContent, 'utf8');
    
    console.log(`✅ Generated chapter markdown: ${finalFileName}`);
    return filePath;
  }

  /**
   * 生成文件名
   * @param chapterId 章节ID
   * @returns 文件名
   */
  private generateFileName(chapterId: string | number): string {
    // 处理特殊章节ID（如 6-5, 12-5 等）
    const idStr = String(chapterId);
    if (idStr.includes('-')) {
      return `${idStr.padStart(3, '0')}.md`;
    }
    
    // 普通章节ID
    const numId = Number(chapterId);
    return `${numId.toString().padStart(3, '0')}.md`;
  }

  /**
   * 批量生成章节文件
   * @param chaptersData 章节数据数组
   * @returns 生成的文件路径数组
   */
  async generateBatchChapters(chaptersData: ChapterData[]): Promise<string[]> {
    const filePaths: string[] = [];
    
    console.log(`🚀 Starting batch generation of ${chaptersData.length} chapters`);
    
    for (const chapterData of chaptersData) {
      try {
        const filePath = await this.saveChapterMarkdown(chapterData);
        filePaths.push(filePath);
        
        // 添加延迟避免文件系统压力
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to generate chapter ${chapterData.chapterId}:`, error);
      }
    }
    
    console.log(`✅ Batch generation completed: ${filePaths.length}/${chaptersData.length} chapters generated`);
    return filePaths;
  }

  /**
   * 更新现有章节文件
   * @param chapterData 章节数据
   * @param fileName 文件名（可选）
   * @returns 更新的文件路径
   */
  async updateChapterMarkdown(chapterData: ChapterData, fileName?: string): Promise<string> {
    const finalFileName = fileName || this.generateFileName(chapterData.chapterId);
    const filePath = path.join(this.config.chaptersDir, finalFileName);

    // 检查文件是否存在
    try {
      await fs.access(filePath);
      console.log(`📝 Updating existing chapter: ${finalFileName}`);
    } catch {
      console.log(`✨ Creating new chapter: ${finalFileName}`);
    }

    return this.saveChapterMarkdown(chapterData, finalFileName);
  }

  /**
   * 从现有文件读取并更新
   * @param chapterData 章节数据
   * @param fileName 文件名（可选）
   * @returns 更新的文件路径
   */
  async updateExistingChapter(chapterData: ChapterData, fileName?: string): Promise<string> {
    const finalFileName = fileName || this.generateFileName(chapterData.chapterId);
    const filePath = path.join(this.config.chaptersDir, finalFileName);

    let existingContent = '';
    let existingData = {};

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const parsed = matter(fileContent);
      existingContent = parsed.content;
      existingData = parsed.data;
    } catch (error) {
      console.log(`📄 Creating new chapter file: ${finalFileName}`);
    }

    // 合并现有数据和新数据
    const mergedData = {
      ...existingData,
      ...chapterData.customVariables
    };

    // 生成新的markdown内容
    const markdownContent = await this.generateChapterMarkdown({
      ...chapterData,
      customVariables: mergedData,
      customContent: existingContent || chapterData.customContent
    });

    // 写入文件
    await fs.writeFile(filePath, markdownContent, 'utf8');
    
    console.log(`✅ Updated chapter markdown: ${finalFileName}`);
    return filePath;
  }

  /**
   * 验证模板配置
   * @returns 验证结果
   */
  validateTemplateConfig(): { isValid: boolean; errors: string[] } {
    if (!this.templateConfig) {
      return {
        isValid: false,
        errors: ['No template configuration found in siteConfig']
      };
    }

    const errors: string[] = [];
    
    if (!this.templateConfig.titleTemplate) {
      errors.push('titleTemplate is required');
    }
    
    if (!this.templateConfig.descriptionTemplate) {
      errors.push('descriptionTemplate is required');
    }
    
    if (!this.templateConfig.keywordsTemplate || !Array.isArray(this.templateConfig.keywordsTemplate)) {
      errors.push('keywordsTemplate must be an array');
    }
    
    if (!this.templateConfig.contentTemplate) {
      errors.push('contentTemplate is required');
    }
    
    if (!this.templateConfig.variables || typeof this.templateConfig.variables !== 'object') {
      errors.push('variables must be an object');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
