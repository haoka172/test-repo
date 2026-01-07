import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  author: string;
  coverImage?: string;
  published: boolean;
  content: string;
}

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  author: string;
  coverImage?: string;
  published: boolean;
}

// 从文件名提取slug
function getSlugFromFilename(filename: string): string {
  // 移除.mdx扩展名，提取日期后的部分作为slug
  const nameWithoutExt = filename.replace(/\.mdx?$/, '');
  // 格式：YYYY-MM-DD-slug-name -> slug-name
  const parts = nameWithoutExt.split('-');
  if (parts.length >= 4) {
    return parts.slice(3).join('-');
  }
  return nameWithoutExt;
}

// 获取所有博客文章元数据
export async function getAllBlogMetadata(): Promise<BlogMetadata[]> {
  try {
    const blogDir = path.join(process.cwd(), 'src/data/blog/posts');
    const files = await fs.readdir(blogDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

    const posts = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filepath = path.join(blogDir, filename);
        const fileContent = await fs.readFile(filepath, 'utf8');
        const { data, content } = matter(fileContent);

        const slug = getSlugFromFilename(filename);
        
        // 处理author字段，可能是字符串或对象
        const authorName = typeof data.author === 'string' 
          ? data.author 
          : data.author?.name || 'Manga Team';
        
        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          excerpt: data.excerpt || '',
          keywords: data.keywords || [],
          tags: data.tags || [],
          author: authorName,
          coverImage: data.coverImage,
          published: data.published !== false // 默认为true
        };
      })
    );

    // 按日期排序，最新的在前
    return posts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading blog metadata:', error);
    return [];
  }
}

// 获取单篇博客文章
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const blogDir = path.join(process.cwd(), 'src/data/blog/posts');
    const files = await fs.readdir(blogDir);
    
    // 查找匹配slug的文件
    const targetFile = files.find(file => {
      const fileSlug = getSlugFromFilename(file);
      return fileSlug === slug && (file.endsWith('.mdx') || file.endsWith('.md'));
    });

    if (!targetFile) {
      return null;
    }

    const filepath = path.join(blogDir, targetFile);
    const fileContent = await fs.readFile(filepath, 'utf8');
    const { data, content } = matter(fileContent);

    // 处理author字段，可能是字符串或对象
    const authorName = typeof data.author === 'string' 
      ? data.author 
      : data.author?.name || 'Manga Team';

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      keywords: data.keywords || [],
      tags: data.tags || [],
      author: authorName,
      coverImage: data.coverImage,
      published: data.published !== false,
      content
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

// 获取相关文章
export async function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): Promise<BlogMetadata[]> {
  const allPosts = await getAllBlogMetadata();
  
  // 过滤掉当前文章
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  
  // 计算相关度分数（基于共同标签）
  const scoredPosts = otherPosts.map(post => {
    const commonTags = post.tags.filter(tag => tags.includes(tag));
    return {
      ...post,
      score: commonTags.length
    };
  });
  
  // 按相关度排序，然后按日期排序
  return scoredPosts
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

// 获取博客配置
export async function getBlogConfig() {
  try {
    // 从 siteinfo.json 中读取博客配置
    const siteInfoPath = path.join(process.cwd(), 'src/data/siteinfo.json');
    const siteInfoContent = await fs.readFile(siteInfoPath, 'utf8');
    const siteInfo = JSON.parse(siteInfoContent);
    
    // 处理全局变量替换
    const processConfigWithGlobalVariables = (config: any): any => {
      const globalVars = config.globalVariables || {};
      
      const replaceVariables = (obj: any): any => {
        if (typeof obj === 'string') {
          let result = obj;
          Object.entries(globalVars).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value as string);
          });
          return result;
        } else if (Array.isArray(obj)) {
          return obj.map(replaceVariables);
        } else if (obj && typeof obj === 'object') {
          const newObj: any = {};
          Object.entries(obj).forEach(([key, value]) => {
            newObj[key] = replaceVariables(value);
          });
          return newObj;
        }
        return obj;
      };
      
      return replaceVariables(config);
    };
    
    const processedConfig = processConfigWithGlobalVariables(siteInfo);
    
    // 返回博客配置部分
    if (processedConfig.features?.blog) {
      return processedConfig.features.blog;
    }
    
    throw new Error('Blog configuration not found in siteinfo.json');
  } catch (error) {
    console.error('Error reading blog config from siteinfo.json:', error);
    // 返回默认配置
    return {
      title: 'Manga Blog',
      description: '漫画分析、行业资讯和深度评论',
      baseUrl: 'https://manga-site.com/blog',
      postsPerPage: 10,
      author: {
        name: 'Manga Team',
        email: 'contact@manga-site.com'
      },
      seo: {
        keywords: ['manga', 'anime', 'review'],
        ogImage: '/images/blog-og-image.jpg'
      }
    };
  }
}
