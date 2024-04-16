import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationEntity } from 'src/models/notification/notification.entity';
import { UserDocument } from 'src/models/user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private NotificationModel: Model<NotificationEntity>,
  ) {}
  async createNotification(title: string, message: string, user: UserDocument) {
    const notificationEntity = new this.NotificationModel({
      user,
      title,
      message,
    });
    const notification = await notificationEntity.save();
    return notification;
  }
}
