import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/models/user/user.entity';

export class UserDTO {
  @Expose()
  _id: string;
  @IsString()
  @Expose()
  name: string;
  @IsEmail()
  @Expose()
  email: string;

  @IsBoolean({ message: 'emailVerified field must be of type boolean.' })
  @Expose()
  emailVerified: boolean;
  @Expose()
  emailVerifiedAt: Date;

  @Exclude()
  @IsString({ message: 'password field must be of type string.' })
  password: string;

  @Exclude()
  passwordChangedAt: Date;
  @Expose()
  avatar: {
    public_id: string;
    url: string;
  };

  @IsEnum(UserRole, {
    message: 'role field must be of either user or admin.',
  })
  @Expose()
  role: string;
  @Expose()
  courses: { courseId: string }[];
  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
