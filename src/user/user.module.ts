import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [DatabaseModule, RedisCacheModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
