import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './DTOs/register.dto';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationToken } from 'src/models/auth/token.entity';
import { Model } from 'mongoose';
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
    function generateActivationCode(length: number): string {
      // Generate a random string of specified length
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
    }
    try {
      const user = await this.UserService.createUser(credentials);
      console.log(user);
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
        message: `Please check your email : ${user.email}, to activate your account.`,
      };
    } catch (error) {
      console.log('Error: ', error);
      return { error: 'error' };
    }
  }
}
