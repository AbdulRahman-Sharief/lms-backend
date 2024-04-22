import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: configService.get<string>('UPSTASH_REDIS_REST_URL'),
      password: configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
      // socket: {
      //   host: configService.get<string>('REDIS_HOST'),
      //   port: parseInt(configService.get<string>('REDIS_PORT')!),
      // },
    });
    return {
      store,
    };
  },
  inject: [ConfigService],
};
