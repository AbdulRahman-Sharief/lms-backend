import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule, RedisCacheModule],
  controllers: [CourseController],
  providers: [CourseService, UserService],
})
export class CourseModule {}
