import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UserDocument } from 'src/models/user/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
@Controller('user')
@Serialize(UserDTO)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/info')
  async getUserInfo(@Req() req: any) {
    console.log(req.user);
    // return req.user.userId;
    return this.userService.findUserById(req.user.userId);
  }
  @Patch('update-name')
  async updateUserName(@Req() req: any, @Body() body: { name: string }) {
    const user = req.user.user;
    const userId = req.user.userId;
    const name = body.name;
    console.log('name: ', name);
    console.log('userId: ', userId);
    console.log('user: ', user);
    return await this.userService.updateUserName({ userId, name });
  }

  @Patch('update-password')
  async updateUserPassword(
    @Req() req: any,
    @Body()
    body: { password: string; passwordConfirm: string; oldPassword: string },
  ) {
    const user = req.user.user;
    const userId = req.user.userId;
    if (body.password !== body.passwordConfirm) {
      return {
        status: 'fail',
        message: 'password and passwordConfirm does not match.',
      };
    }
    const password = body.password;
    const oldPassword = body.oldPassword;
    console.log('userId: ', userId);
    console.log('user: ', user);
    return this.userService.updateUserPassword({
      userId,
      password,
      oldPassword,
    });
  }
}
