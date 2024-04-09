import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { NextFunction } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from 'src/models/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }
  changePasswordAfter(user: UserDocument, JWTTimestamp: number) {
    const passwordChangedAt = new Date(user.passwordChangedAt);
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
      console.log(JWTTimestamp, ' : ', changedTimestamp);
      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }
  async validate(payload: { sub: string; iat: number; exp: number }) {
    console.log('payload: ', payload);

    const user = await this.UserService.getCachedUserById(payload.sub);
    console.log(new Date(user.passwordChangedAt));
    if (this.changePasswordAfter(user, payload.iat)) {
      throw new HttpException(
        'This Token belongs to a user that has already changed his password.',
        401,
      );
    }
    return { userId: payload.sub, user };
  }
}
