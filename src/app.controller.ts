import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  getHello(): any {
    return {
      success: true,
      msg: 'API is working',
    };
  }

  @Get()
  @HttpCode(HttpStatus.BAD_REQUEST)
  wrongGet(): any {
    throw new UnauthorizedException();
  }
}
