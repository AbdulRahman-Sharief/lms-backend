import {
  HttpException,
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
@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    private UserService: UserService,
    private EmailService: EmailService,
    @InjectModel('VerificationToken')
    private VerificationTokenModel: Model<VerificationToken>,
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
}
