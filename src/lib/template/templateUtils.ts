/**
 * 模板工具函数 - 支持变量替换和内容生成
 * 用于自动生成章节的title、keywords、description等内容
 */

export interface TemplateVariables {
  [key: string]: string | number;
}

export interface ChapterTemplateConfig {
  titleTemplate: string;
  descriptionTemplate: string;
  keywordsTemplate: string[];
  contentTemplate: string;
  variables: TemplateVariables;
}

export interface ChapterTemplateParams {
  chapterId: string | number;
  chapterTitle?: string;
  mangaTitle?: string;
  mangaTitleLower?: string;
  author?: string;
  illustrator?: string;
  genre?: string;
  seriesDescription?: string;
  heroDescription?: string;
  customVariables?: TemplateVariables;
}

/**
 * 替换模板中的变量
 * @param template 模板字符串
 * @param variables 变量对象
 * @returns 替换后的字符串
 */
export function replaceTemplateVariables(
  template: string,
  variables: TemplateVariables
): string {
  let result = template;
  
  // 替换所有 {variableName} 格式的变量
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
}

/**
 * 生成章节标题
 * @param config 模板配置
 * @param params 章节参数
 * @returns 生成的标题
 */
export function generateChapterTitle(
  config: ChapterTemplateConfig,
  params: ChapterTemplateParams
): string {
  const variables = {
    ...config.variables,
    ...params.customVariables,
    chapterId: params.chapterId,
    chapterTitle: params.chapterTitle || `Chapter ${params.chapterId}`,
    mangaTitle: params.mangaTitle || config.variables.mangaTitle,
    mangaTitleLower: params.mangaTitleLower || config.variables.mangaTitleLower,
    author: params.author || config.variables.author,
    illustrator: params.illustrator || config.variables.illustrator,
    genre: params.genre || config.variables.genre,
    seriesDescription: params.seriesDescription || config.variables.seriesDescription
  };
  
  return replaceTemplateVariables(config.titleTemplate, variables);
}

/**
 * 生成章节描述
 * @param config 模板配置
 * @param params 章节参数
 * @returns 生成的描述
 */
export function generateChapterDescription(
  config: ChapterTemplateConfig,
  params: ChapterTemplateParams
): string {
  const variables = {
    ...config.variables,
    ...params.customVariables,
    chapterId: params.chapterId,
    chapterTitle: params.chapterTitle || `Chapter ${params.chapterId}`,
    mangaTitle: params.mangaTitle || config.variables.mangaTitle,
    mangaTitleLower: params.mangaTitleLower || config.variables.mangaTitleLower,
    author: params.author || config.variables.author,
    illustrator: params.illustrator || config.variables.illustrator,
    genre: params.genre || config.variables.genre,
    seriesDescription: params.seriesDescription || config.variables.seriesDescription,
    heroDescription: params.heroDescription || config.variables.heroDescription
  };
  
  return replaceTemplateVariables(config.descriptionTemplate, variables);
}

/**
 * 生成章节关键词
 * @param config 模板配置
 * @param params 章节参数
 * @returns 生成的关键词数组
 */
export function generateChapterKeywords(
  config: ChapterTemplateConfig,
  params: ChapterTemplateParams
): string[] {
  const variables = {
    ...config.variables,
    ...params.customVariables,
    chapterId: params.chapterId,
    chapterTitle: params.chapterTitle || `Chapter ${params.chapterId}`,
    mangaTitle: params.mangaTitle || config.variables.mangaTitle,
    mangaTitleLower: params.mangaTitleLower || config.variables.mangaTitleLower,
    author: params.author || config.variables.author,
    illustrator: params.illustrator || config.variables.illustrator,
    genre: params.genre || config.variables.genre,
    seriesDescription: params.seriesDescription || config.variables.seriesDescription
  };
  
  return config.keywordsTemplate.map(keywordTemplate => 
    replaceTemplateVariables(keywordTemplate, variables)
  );
}

/**
 * 生成章节内容
 * @param config 模板配置
 * @param params 章节参数
 * @returns 生成的内容
 */
export function generateChapterContent(
  config: ChapterTemplateConfig,
  params: ChapterTemplateParams
): string {
  const variables = {
    ...config.variables,
    ...params.customVariables,
    chapterId: params.chapterId,
    chapterTitle: params.chapterTitle || `Chapter ${params.chapterId}`,
    mangaTitle: params.mangaTitle || config.variables.mangaTitle,
    mangaTitleLower: params.mangaTitleLower || config.variables.mangaTitleLower,
    author: params.author || config.variables.author,
    illustrator: params.illustrator || config.variables.illustrator,
    genre: params.genre || config.variables.genre,
    seriesDescription: params.seriesDescription || config.variables.seriesDescription,
    heroDescription: params.heroDescription || config.variables.heroDescription
  };
  
  return replaceTemplateVariables(config.contentTemplate, variables);
}

/**
 * 生成完整的章节元数据
 * @param config 模板配置
 * @param params 章节参数
 * @returns 生成的章节元数据
 */
export function generateChapterMetadata(
  config: ChapterTemplateConfig,
  params: ChapterTemplateParams
) {
  return {
    title: generateChapterTitle(config, params),
    description: generateChapterDescription(config, params),
    keywords: generateChapterKeywords(config, params),
    content: generateChapterContent(config, params)
  };
}

/**
 * 从siteinfo.json配置中提取模板配置
 * @param siteConfig 站点配置
 * @returns 章节模板配置
 */
export function extractChapterTemplateConfig(siteConfig: any): ChapterTemplateConfig | null {
  if (!siteConfig.chapterTemplates) {
    return null;
  }
  
  // 使用 globalVariables 作为变量源，如果不存在则使用空对象
  const variables = siteConfig.globalVariables || siteConfig.chapterTemplates.variables || {};
  
  return {
    titleTemplate: siteConfig.chapterTemplates.titleTemplate,
    descriptionTemplate: siteConfig.chapterTemplates.descriptionTemplate,
    keywordsTemplate: siteConfig.chapterTemplates.keywordsTemplate,
    contentTemplate: siteConfig.chapterTemplates.contentTemplate,
    variables: variables
  };
}

/**
 * 智能生成章节标题（基于章节内容或现有标题）
 * @param chapterId 章节ID
 * @param existingTitle 现有标题（可选）
 * @param mangaTitle 漫画标题
 * @returns 智能生成的标题
 */
export function generateSmartChapterTitle(
  chapterId: string | number,
  existingTitle?: string,
  mangaTitle: string = 'Manga'
): string {
  if (existingTitle && existingTitle.trim()) {
    return existingTitle;
  }
  
  // 基于章节ID生成智能标题
  const chapterNum = Number(chapterId);
  const titleVariations = [
    `Chapter ${chapterId} - The Beginning`,
    `Chapter ${chapterId} - New Challenges`,
    `Chapter ${chapterId} - Rising Action`,
    `Chapter ${chapterId} - Climax`,
    `Chapter ${chapterId} - Resolution`,
    `Chapter ${chapterId} - Character Development`,
    `Chapter ${chapterId} - World Building`,
    `Chapter ${chapterId} - Plot Advancement`
  ];
  
  // 根据章节号选择不同的标题风格
  const variationIndex = chapterNum % titleVariations.length;
  return titleVariations[variationIndex];
}

/**
 * 验证模板配置
 * @param config 模板配置
 * @returns 验证结果
 */
export function validateTemplateConfig(config: ChapterTemplateConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!config.titleTemplate) {
    errors.push('titleTemplate is required');
  }
  
  if (!config.descriptionTemplate) {
    errors.push('descriptionTemplate is required');
  }
  
  if (!config.keywordsTemplate || !Array.isArray(config.keywordsTemplate)) {
    errors.push('keywordsTemplate must be an array');
  }
  
  if (!config.contentTemplate) {
    errors.push('contentTemplate is required');
  }
  
  if (!config.variables || typeof config.variables !== 'object') {
    errors.push('variables must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
