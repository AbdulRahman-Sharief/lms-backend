import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async setValue(key: string, value: string, seconds?: number): Promise<void> {
    // Set a value in Redis cache
    console.log('ttl', seconds);
    await this.cacheService.set(key, value, { ttl: seconds } as any);
  }

  async getValue(key: string): Promise<string | undefined> {
    // Get a value from Redis cache
    return await this.cacheService.get(key);
  }
  async delValue(key: string): Promise<void> {
    return await this.cacheService.del(key);
  }
}
