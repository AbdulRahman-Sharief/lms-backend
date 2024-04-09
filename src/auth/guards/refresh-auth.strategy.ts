import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/models/user/user.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: { sub: string; iat: number; exp: number; user: UserDocument },
  ) {
    const refreshToken = request.cookies?.refresh_token;
    console.log(request.cookies);
    console.log('refresh_token', refreshToken);
    const user = await this.userService.getCachedUserById(payload.sub);
    return { userId: payload.sub, user };
  }
}
