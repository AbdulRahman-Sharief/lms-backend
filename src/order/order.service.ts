import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDocument } from 'src/models/course/course.entity';
import { OrderEntity } from 'src/models/order/order.entity';
import { UserDocument } from 'src/models/user/user.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private OrderModel: Model<OrderEntity>) {}

  async createOrder(
    user: UserDocument,
    course: CourseDocument,
    payment_info: object,
  ) {
    const courseExistInUser = user.courses.some(
      (c: any) => c._id.toString() === course._id.toString(),
    );
    if (courseExistInUser)
      throw new HttpException(
        'User has already purchased the course before.',
        500,
      );
    const orderEntity = new this.OrderModel({
      course,
      user,
      payment_info,
    });

    const order = await orderEntity.save();
    user.courses.push(course);
    await user.save();
    console.log(user);
    return order;
  }
}
