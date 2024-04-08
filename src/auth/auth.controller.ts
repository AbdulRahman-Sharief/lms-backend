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
import { Public } from 'src/decorators/Public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Public()
  @Post('/register')
  async register(@Body(ValidationPipe) credentials: RegisterDTO) {
    if (credentials.password !== credentials.passwordConfirm)
      throw new HttpException('password must match with passwordConfirm.', 500);

    return this.AuthService.register(credentials);
  }
  @Public()
  @Post('/get-verification-token')
  async getVerificationToken(@Body() body: { email: string }) {
    console.log(body);
    return this.AuthService.getVerificationToken(body.email);
  }
  @Public()
  @Get('/activate-user/:verificationToken/:activationCode')
  async activateUser(
    @Param('verificationToken') verificationToken: string,
    @Param('activationCode') activationCode: string,
  ) {
    return this.AuthService.verifyToken(verificationToken, activationCode);
  }

  @Public()
  @Post('/login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    return this.AuthService.login(body, res);
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.AuthService.logout(req, res);
  }
}
