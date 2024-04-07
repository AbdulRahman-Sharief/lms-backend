import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/app-options.constants';
import { RedisCacheService } from './redis-cache.service';
@Global()
@Module({
  imports: [CacheModule.registerAsync(RedisOptions)],
  exports: [RedisCacheService],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
