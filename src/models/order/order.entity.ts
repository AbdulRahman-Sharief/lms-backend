import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../user/user.entity';

export type OrderDocument = HydratedDocument<OrderEntity>;

@Schema({ timestamps: true, versionKey: false })
export class OrderEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course: CourseEntity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserEntity;

  @Prop({ type: Object })
  payment_info: object;
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
OrderSchema.loadClass(OrderEntity);
