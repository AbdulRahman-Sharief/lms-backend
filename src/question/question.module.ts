import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { DatabaseModule } from 'src/database/database.module';
import { CourseService } from 'src/course/course.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommentService } from 'src/comment/comment.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [QuestionController],
  providers: [QuestionService, CourseService, CommentService, EmailService],
})
export class QuestionModule {}
