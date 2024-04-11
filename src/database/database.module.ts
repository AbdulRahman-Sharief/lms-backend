import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationTokenSchema } from 'src/models/auth/token.entity';
import { CommentSchema } from 'src/models/comment/comment.entity';
import { CourseSchema } from 'src/models/course/course.entity';
import { CourseDataSchema } from 'src/models/course/courseData.entity';
import { QuestionSchema } from 'src/models/question/question.entity';
import { ReviewSchema } from 'src/models/review/review.entity';
import { UserSchema } from 'src/models/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'lms',
      // autoCreate: true,
      // autoIndex: true,
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'VerificationToken', schema: VerificationTokenSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([
      { name: 'CourseData', schema: CourseDataSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
