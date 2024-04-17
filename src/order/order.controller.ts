import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { EmailService } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(
    private OrderService: OrderService,
    private UserService: UserService,
    private CourseService: CourseService,
    private EmailService: EmailService,
    private NotificationService: NotificationService,
  ) {}

  @Post('/order/create')
  async createOrder(
    @Req() req: any,
    @Body() body: { courseId: string; payment_info: object },
  ) {
    const userId = req.user.userId;
    const user = await this.UserService.findUserById(userId);
    const course = await this.CourseService.getCourseFromDB(body.courseId);
    if (!course) throw new HttpException('No course with such id.', 500);
    //create order.
    const order = await this.OrderService.createOrder(
      user,
      course,
      body.payment_info,
    );

    if (course.purchased) {
      course.purchased += 1;
      await course.save();
    } else if (!course.purchased) {
      course.purchased = 1;
      await course.save();
    }
    //send mail.
    const email = await this.EmailService.OrderConfirmation(
      { email: user.email, name: user.name },
      {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    );

    //send notification to the admin.

    await this.NotificationService.createNotification(
      'New Order',
      `You have new Order from ${course.name}`,
      user,
    );

    return {
      status: 'success',
      order: course,
    };
  }
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Get('/all')
  async getAllOrders() {
    return await this.OrderService.getAllOrders();
  }
}
