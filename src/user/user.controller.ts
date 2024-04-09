import {
  ClassSerializerInterceptor,
  Controller,
  Get,
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
}
