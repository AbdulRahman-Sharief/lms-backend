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
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from './guards/jwt-auth.guard';
import { JwtGuardStrategy } from './guards/jwt-auth.strategy';
import { GoogleStrategy } from './guards/google-oauth.strategy';
import { GithubStrategy } from './guards/github-oauth.strategy';
import { LocalStrategy } from './guards/local-auth.strategy';
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtGuardStrategy,
    GoogleStrategy,
    GithubStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
