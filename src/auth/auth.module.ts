import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { Model } from 'mongoose';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import * as cacheManager from 'cache-manager';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/app-options.constants';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET || 'defaultSecret',
        signOptions: {
          expiresIn: '3h',
        },
        global: true,
      }),
    }),
    EmailModule,
    RedisCacheModule,
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
