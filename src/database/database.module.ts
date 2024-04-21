import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationTokenSchema } from 'src/models/auth/token.entity';
import { CommentSchema } from 'src/models/comment/comment.entity';
import { CourseSchema } from 'src/models/course/course.entity';
import { CourseDataSchema } from 'src/models/course/courseData.entity';
import { BannerSchema } from 'src/models/layout/banner.entity';
import { CategorySchema } from 'src/models/layout/category.entity';
import { FAQSchema } from 'src/models/layout/faq.entity';
import { LayoutSchema } from 'src/models/layout/layout.entity';
import { NotificationSchema } from 'src/models/notification/notification.entity';
import { OrderSchema } from 'src/models/order/order.entity';
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
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'FAQ', schema: FAQSchema }]),
    MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Layout', schema: LayoutSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
