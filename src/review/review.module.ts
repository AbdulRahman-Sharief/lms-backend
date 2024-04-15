import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { DatabaseModule } from 'src/database/database.module';
import { CourseService } from 'src/course/course.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [ReviewController],
  providers: [ReviewService, CourseService, CommentService],
})
export class ReviewModule {}
