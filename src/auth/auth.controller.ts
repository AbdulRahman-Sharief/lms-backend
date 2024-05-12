import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDTO } from './DTOs/register.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDTO } from './DTOs/login.dto';
import { Public } from 'src/decorators/Public.decorator';
import { RolesGuard } from './guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import JwtRefreshGuard from './guards/refresh-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Public()
  @Post('/register')
  async register(@Body() credentials: RegisterDTO) {
    if (credentials.password !== credentials.passwordConfirm)
      throw new HttpException('password must match with passwordConfirm.', 500);
    const res = await this.AuthService.register(credentials);
    if (res.error)
      throw new HttpException(res.error.message, res.error.statusCode);
    return res;
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
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    // @Body() body: LoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.AuthService.login(req, res);
  }

  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('/logout')
  @Roles(['user', 'admin'])
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.AuthService.logout(req, res);
  }
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log(req.cookies);
    return this.AuthService.refreshToken(req, res);
  }
}
