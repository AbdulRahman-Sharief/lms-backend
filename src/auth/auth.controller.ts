import {
  Body,
  Controller,
  HttpException,
  Post,
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
}
