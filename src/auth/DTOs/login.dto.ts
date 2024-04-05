import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
