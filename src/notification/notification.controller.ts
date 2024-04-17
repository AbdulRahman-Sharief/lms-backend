import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private NotificationService: NotificationService) {}

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Get('/all')
  async getAllNotifications() {
    const notifications = await this.NotificationService.getAllNotifications();
    return {
      status: 'success',
      notifications,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Patch('/notification/:notificationId/read')
  async readNotification(@Param('notificationId') notificationId: string) {
    const notifications =
      await this.NotificationService.readNotification(notificationId);
    return {
      status: 'success',
      notifications,
    };
  }
}
