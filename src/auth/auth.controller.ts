import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDTO } from './DTOs/register.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDTO } from './DTOs/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  // @Public()
  @Post('/register')
  async register(@Body(ValidationPipe) credentials: RegisterDTO) {
    if (credentials.password !== credentials.passwordConfirm)
      throw new HttpException('password must match with passwordConfirm.', 500);

    return this.AuthService.register(credentials);
  }

  @Post('/get-verification-token')
  async getVerificationToken(@Body() body: { email: string }) {
    console.log(body);
    return this.AuthService.getVerificationToken(body.email);
  }

  @Get('/activate-user/:verificationToken/:activationCode')
  async activateUser(
    @Param('verificationToken') verificationToken: string,
    @Param('activationCode') activationCode: string,
  ) {
    return this.AuthService.verifyToken(verificationToken, activationCode);
  }
  @Post('/login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    return this.AuthService.login(body, res);
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    return this.AuthService.logout(res);
  }
}
