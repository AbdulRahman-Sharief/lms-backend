import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './DTOs/register.dto';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationToken } from 'src/models/auth/token.entity';
import { Model } from 'mongoose';
import { UserDocument } from 'src/models/user/user.entity';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Request } from 'express-serve-static-core';
import { LoginDTO } from './DTOs/login.dto';
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none';
  secure?: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    private UserService: UserService,
    private EmailService: EmailService,
    @InjectModel('VerificationToken')
    private VerificationTokenModel: Model<VerificationToken>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async register(credentials: RegisterDTO) {
    try {
      const user = await this.UserService.createUser(credentials);
      console.log(user);

      return {
        status: 'success',
        message: `successfully registered your account,please go and activate it throw your email inbox.`,
      };
    } catch (error) {
      console.log('Error: ', error);
      return { error: 'error' };
    }
  }
  async getVerificationToken(email: string) {
    function generateActivationCode(length: number): string {
      // Generate a random string of specified length
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
    }
    const user = await this.UserService.findUserByEmail(email);
    console.log('User: ', user);
    const activationCode = generateActivationCode(4);
    const payload = {
      sub: user._id,
      username: user.name,
      email: user.email,
      activationCode: activationCode,
    };
    console.log(payload);
    const VerificationToken = await this.JwtService.signAsync(payload, {
      expiresIn: '600s', // 10 minutes
    });
    const token = new this.VerificationTokenModel({
      user: user._id,
      email: user.email,
      token: VerificationToken,
    });
    const savedToken = await token.save();
    console.log('savedtoken: ', savedToken);
    const tempUser = {
      name: user.name,
      email: user.email,
    };

    await this.EmailService.verficationToken(tempUser, activationCode);
    return {
      status: 'success',
      message: `Activation code has been sent to your email inbox at : ${email} , go and check it.`,
      verificationToken: savedToken.token,
    };
  }
  async verifyToken(VerificationToken: string, activationCode: string) {
    console.log(VerificationToken);
    const token = await this.JwtService.verifyAsync(VerificationToken);
    console.log('jwtToken: ', token);
    const dbToken = await this.VerificationTokenModel.findOne({
      user: token.sub,
      email: token.email,
      token: VerificationToken,
      expiresAt: { $gt: new Date(token.exp * 1000) },
    });
    console.log('dbToken: ', dbToken);
    if (!dbToken) {
      throw new UnauthorizedException(
        'The provided token is invalid or has been expired!',
      );
    }
    if (token.activationCode !== activationCode) {
      throw new HttpException('Invalid activation code.', 400);
    }
    const user = await this.UserService.findUserByEmail(token.email);
    console.log('User: ', user);
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    const activatedUser = await user.save();
    console.log('activatedUser: ', activatedUser);
    dbToken.token = null;
    dbToken.expiresAt = null;
    await dbToken.save();
    return {
      status: 'success',
      message: 'Your account has been successfully activated. go and login.',
    };
  }

  async sendToken(user: UserDocument, statusCode: number, res: Response) {
    const access_token = await this.JwtService.signAsync({ sub: user._id });
    const refresh_token = await this.JwtService.signAsync({ sub: user._id });
    user.access_token = access_token;
    user.refresh_token = refresh_token;

    //upload session to redis.
    const createdVal = await this.redisCacheService.setValue(
      user._id.toString(),
      JSON.stringify(user) as any,
    );
    console.log('createdVal: ', createdVal);
    const val = await this.redisCacheService.getValue(user._id.toString());
    console.log('val: ', val);
    //parse env variables to integrate with fallback values.
    const accessTokenExpire = parseInt(
      process.env.ACCESS_TOKEN_EXPIRE || '300',
      10,
    );
    const refreshTokenExpire = parseInt(
      process.env.ACCESS_TOKEN_EXPIRE || '1200',
      10,
    );

    //options for cookies.
    const accessTokenOptions: ITokenOptions = {
      expires: new Date(Date.now() + accessTokenExpire * 1000),
      maxAge: accessTokenExpire * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };
    const refreshTokenOptions: ITokenOptions = {
      expires: new Date(Date.now() + refreshTokenExpire * 1000),
      maxAge: refreshTokenExpire * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };
    //only set secure to true in production.
    if (process.env.NODE_ENV === 'production') accessTokenOptions.secure = true;
    res.cookie('access_token', access_token, accessTokenOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenOptions);
    res.status(statusCode).json({
      status: 'success',
      user,
      access_token,
    });
  }
  async login(body: LoginDTO, res: Response) {
    try {
      const { email, password } = body;
      const user = await this.UserService.findUserByEmail(email);
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) return new HttpException('Invalid password', 400);
      if (!user.emailVerified)
        return new HttpException(
          'We have not verified your email yet!. please check your inbox and activate your account.',
          400,
        );
      return this.sendToken(user, 200, res);
    } catch (error) {
      return new HttpException(error.message, 400);
    }
  }

  async logout(res: Response) {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      return res.status(200).json({
        status: 'success',
        message: 'Logged out Successfully.',
      });
    } catch (error) {
      return new HttpException(error.message, 400);
    }
  }
}
