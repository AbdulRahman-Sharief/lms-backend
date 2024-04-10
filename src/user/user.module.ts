import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule, RedisCacheModule, CloudinaryModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
