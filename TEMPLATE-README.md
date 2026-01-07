# 漫画网站模板 v2.0

这是最新版本的漫画网站模板，包含了所有最新功能和优化。

## 🚀 新功能特色

- ✅ **漫画风格 Logo** - 带有黑白兼容的边框效果
- ✅ **模板变量系统** - 完全自动化的内容生成
- ✅ **HTML 锚文本支持** - SEO 友好的内部链接
- ✅ **响应式设计** - 完美适配所有设备
- ✅ **黑白主题切换** - 用户友好的主题系统
- ✅ **SEO 优化** - 完整的搜索引擎优化

## 📝 使用说明

### 1. 基本配置

只需修改 `src/data/siteinfo.json` 中的 `globalVariables` 部分：

```json
{
  "globalVariables": {
    "mangaTitle": "你的漫画标题",
    "mangaTitleLower": "你的漫画标题小写",
    "author": "作者名",
    "baseUrl": "https://你的域名.com",
    "siteName": "你的网站名",
    "contactEmail": "contact@你的域名.com",
    "googleAnalyticsId": "G-你的GA代码"
  }
}
```

### 2. 章节文件

在 `src/data/chapters/` 目录下添加章节文件：
- 文件名格式：`001.md`, `002.md`, `003.md` 等
- 使用 `template.md` 作为新章节的模板

### 3. 图片资源

将漫画图片放在 `public/images/` 目录下，建议结构：
```
public/images/
├── chapter-001/
│   ├── page-001.webp
│   ├── page-002.webp
│   └── ...
├── chapter-002/
│   └── ...
└── cover.webp
```

## 🎨 设计特色

### Logo 设计
- 双层边框效果
- 微妙的旋转动画
- 黑白主题完美兼容
- 悬停交互效果

### 模板变量
所有内容都支持模板变量，包括：
- `{mangaTitle}` - 漫画标题
- `{author}` - 作者名
- `{baseUrl}` - 网站地址
- `{headerLogo}` - 处理后的 Logo 文字
- `{chapterId}` - 章节编号

### SEO 优化
- 自动生成 meta 标签
- 内部链接优化
- 关键词密度控制
- 结构化数据支持

## 🛠️ 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Gray-matter** - Markdown 处理
- **Marked** - Markdown 渲染

## 📦 部署步骤

1. 安装依赖：`npm install`
2. 配置 siteinfo.json
3. 添加章节文件和图片
4. 构建：`npm run build`
5. 部署：`npm start` 或静态部署

## 🔧 自定义选项

### 主题颜色
在 `tailwind.config.ts` 中修改颜色配置

### 布局调整
在 `src/components/` 中修改组件

### 功能开关
在 `siteinfo.json` 的 `features` 部分控制功能启用

## 📞 支持

如有问题，请查看：
1. 模板文档
2. Next.js 官方文档
3. 提交 Issue

---

**版本**: v2.0  
**更新日期**: 2025-10-09  
**兼容性**: Next.js 15+, Node.js 18+