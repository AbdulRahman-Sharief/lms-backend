import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
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

  async getAllNotifications() {
    const notifications = await this.NotificationModel.find().sort({
      createdAt: -1,
    });
    return notifications;
  }

  async readNotification(notificationId: string) {
    try {
      const notification =
        await this.NotificationModel.findById(notificationId);
      notification.status
        ? (notification.status = 'read')
        : notification.status;
      await notification.save();
      const notifications = await this.getAllNotifications();
      return notifications;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'delete notfications everyday at midnight.',
  })
  async deleteNotificationsThirtyDaysAgo() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deletedNotifications = await this.NotificationModel.deleteMany({
      status: 'read',
      createdAt: { $lt: thirtyDaysAgo },
    }).exec();
    console.log(
      'Deleted Notifications read from 30 days ago: ',
      deletedNotifications,
    );
  }
}
