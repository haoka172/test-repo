// 简单的图片缓存管理器
class ImageCacheManager {
  private cache = new Map<string, HTMLImageElement>();
  private preloadQueue: string[] = [];
  private maxCacheSize = 50; // 最大缓存50张图片
  private isPreloading = false;

  // 预加载图片
  async preloadImage(src: string): Promise<HTMLImageElement> {
    // 如果已经缓存，直接返回
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // 如果缓存已满，删除最老的图片
        if (this.cache.size >= this.maxCacheSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        
        this.cache.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${src}`));
      };

      img.src = src;
    });
  }

  // 批量预加载
  async preloadBatch(sources: string[], maxConcurrent = 3): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    
    try {
      // 分批处理，避免一次性发起太多请求
      for (let i = 0; i < sources.length; i += maxConcurrent) {
        const batch = sources.slice(i, i + maxConcurrent);
        const promises = batch.map(src => 
          this.preloadImage(src).catch(() => {}) // 忽略单个图片的错误
        );
        await Promise.allSettled(promises);
      }
    } finally {
      this.isPreloading = false;
    }
  }

  // 检查图片是否已缓存
  isCached(src: string): boolean {
    return this.cache.has(src);
  }

  // 获取缓存的图片
  getCachedImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  // 清理缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      isPreloading: this.isPreloading
    };
  }

  // 添加到预加载队列
  addToPreloadQueue(sources: string[]): void {
    this.preloadQueue.push(...sources.filter(src => !this.isCached(src)));
    this.processPreloadQueue();
  }

  // 处理预加载队列
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) return;

    const batch = this.preloadQueue.splice(0, 3); // 每次处理3张图片
    await this.preloadBatch(batch);

    // 如果还有待处理的图片，继续处理
    if (this.preloadQueue.length > 0) {
      setTimeout(() => this.processPreloadQueue(), 100);
    }
  }
}

// 全局图片缓存实例
export const imageCache = new ImageCacheManager();

// 用于 React 组件的 hook
export function useImageCache() {
  return {
    preloadImage: (src: string) => imageCache.preloadImage(src),
    preloadBatch: (sources: string[]) => imageCache.preloadBatch(sources),
    isCached: (src: string) => imageCache.isCached(src),
    addToQueue: (sources: string[]) => imageCache.addToPreloadQueue(sources),
    getStats: () => imageCache.getCacheStats(),
    clearCache: () => imageCache.clearCache()
  };
}
