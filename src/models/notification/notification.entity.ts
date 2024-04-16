import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from '../user/user.entity';

export type NotificationDocument = HydratedDocument<NotificationEntity>;

@Schema({ timestamps: true, versionKey: false })
export class NotificationEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserEntity;
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  message: string;
  @Prop({ type: String, default: 'unread', required: true })
  status: string | 'unread';
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
NotificationSchema.loadClass(NotificationEntity);
