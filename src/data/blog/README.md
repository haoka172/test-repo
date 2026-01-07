# 博客功能说明

## ⚠️ 当前状态：博客功能已禁用

博客功能目前已被禁用，相关的页面文件已被删除以避免构建错误。

## 🔧 如何恢复博客功能

如果需要重新启用博客功能，请按以下步骤操作：

### 1. 启用博客配置
在 `../siteinfo.json` 中修改博客配置：
```json
{
  "features": {
    "blog": {
      "enabled": true,
      "showInNavigation": true,
      "showInSitemap": true
    }
  }
}
```

### 2. 恢复博客页面文件
需要重新创建以下文件：
- `src/app/blog/page.tsx` - 博客列表页面
- `src/app/blog/[slug]/page.tsx` - 博客文章页面

### 3. 创建博客内容
在 `src/data/blog/posts/` 目录下创建 `.md` 或 `.mdx` 文件：
```markdown
---
title: "文章标题"
date: "2025-01-01"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
author: "作者名"
published: true
---

文章内容...
```

### 4. 页面模板参考
博客页面的基本结构应包含：
- `generateStaticParams()` 函数（用于静态导出）
- `generateMetadata()` 函数（用于SEO）
- 博客内容渲染组件

### 5. 重新构建
完成以上步骤后，运行 `npm run build` 重新构建网站。

## 📝 配置说明

### 博客配置位置
所有博客配置都在 `../siteinfo.json` 的 `features.blog` 部分：

```json
{
  "features": {
    "blog": {
      "enabled": false,
      "showInNavigation": false,
      "showInSitemap": false,
      "title": "{mangaTitle} Manga Blog",
      "description": "Explore the world of {mangaTitle} manga...",
      "baseUrl": "{baseUrl}/blog",
      "postsPerPage": 10,
      "author": {
        "name": "{mangaTitle} Manga",
        "email": "{contactEmail}"
      },
      "seo": {
        "keywords": ["{mangaTitleLower}", "{mangaTitleLower} manga", "manga review", "anime news"],
        "ogImage": "/images/{mangaTitleLower}/blog-og-image.jpg"
      }
    }
  }
}
```

### 变量支持
所有博客配置都支持全局变量替换：
- `{mangaTitle}` - 漫画标题
- `{mangaTitleLower}` - 小写漫画标题
- `{baseUrl}` - 网站基础URL
- `{contactEmail}` - 联系邮箱

## 🔄 迁移历史
- ✅ 原 `config.json` 已删除
- ✅ 配置已迁移到 `siteinfo.json`
- ✅ 支持全局变量替换
- ✅ 统一配置管理
- ⚠️ 博客页面文件已删除（避免构建错误）
