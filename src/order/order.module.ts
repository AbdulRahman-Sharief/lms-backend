import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailService } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  providers: [
    OrderService,
    UserService,
    CourseService,
    EmailService,
    NotificationService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
