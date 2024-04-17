import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  UserDocument,
  UserEntity,
  UserSchema,
} from 'src/models/user/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';
@Controller('users')
// @Serialize(UserEntity)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/user/info')
  async getUserInfo(@Req() req: any) {
    console.log(req.user);
    // return req.user.userId;
    return this.userService.findUserById(req.user.userId);
  }
  @Patch('/user/update-name')
  async updateUserName(@Req() req: any, @Body() body: { name: string }) {
    const user = req.user.user;
    const userId = req.user.userId;
    const name = body.name;
    console.log('name: ', name);
    console.log('userId: ', userId);
    console.log('user: ', user);
    return await this.userService.updateUserName({ userId, name });
  }

  @Patch('/user/update-password')
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

  @Patch('/user/update-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.userService.updateUserAvatar(file, userId);
    // console.log(file);
    // return file;
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Get('/all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
