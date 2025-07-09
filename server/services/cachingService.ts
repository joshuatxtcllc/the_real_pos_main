
// Simple in-memory cache with Redis-like interface for Replit
class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>();
  private readonly defaultTTL = 300000; // 5 minutes

  async get(key: string): Promise<any> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Cleanup expired entries periodically
  private cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  constructor() {
    // Cleanup every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }
}

export const cache = new MemoryCache();

export async function getCachedPricing(
  frameId: string,
  matColorId: string,
  glassOptionId: string,
  dimensions: { width: number; height: number; matWidth: number }
): Promise<any> {
  const cacheKey = `pricing:${frameId}:${matColorId}:${glassOptionId}:${dimensions.width}x${dimensions.height}x${dimensions.matWidth}`;
  return await cache.get(cacheKey);
}

export async function setCachedPricing(
  frameId: string,
  matColorId: string,
  glassOptionId: string,
  dimensions: { width: number; height: number; matWidth: number },
  pricing: any
): Promise<void> {
  const cacheKey = `pricing:${frameId}:${matColorId}:${glassOptionId}:${dimensions.width}x${dimensions.height}x${dimensions.matWidth}`;
  await cache.set(cacheKey, pricing, 600000); // 10 minutes for pricing
}
