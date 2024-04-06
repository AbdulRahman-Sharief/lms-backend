import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDTO } from './DTOs/register.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  // @Public()
  @Post('/register')
  async register(@Body(ValidationPipe) credentials: RegisterDTO) {
    // console.log(credentials);
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
    // return {
    //   verificationToken,
    //   activationCode,
    // };
    return this.AuthService.verifyToken(verificationToken, activationCode);
  }
}
