import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../DTOs/login.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: LoginDTO['email'],
    password: LoginDTO['password'],
  ): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    console.log(user);
    console.log(email);
    console.log(password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
