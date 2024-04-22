import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/app-options.constants';
import { RedisCacheService } from './redis-cache.service';
import { redisStore } from 'cache-manager-redis-store';
@Global()
@Module({
  imports: [
    CacheModule.registerAsync(RedisOptions),
    // CacheModule.register({
    //   store: redisStore as any,
    //   url: process.env.UPSTASH_REDIS_REST_URL,
    //   token: process.env.UPSTASH_REDIS_REST_TOKEN,

    //   ttl: 10,
    // }),
  ],
  exports: [RedisCacheService],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
