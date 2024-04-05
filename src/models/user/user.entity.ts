import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { NextFunction } from 'express';

export type UserDocument = HydratedDocument<UserEntity>;
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ required: [true, 'please Enter your name.'] })
  @IsString()
  name: string;

  @Prop({
    required: [true, 'Please Enter Your email.'],
    unique: [true, 'This email already exists.'],
  })
  @IsEmail()
  email: string;

  @Prop({ default: false })
  @IsBoolean({ message: 'emailVerified field must be of type boolean.' })
  emailVerified: boolean;

  @Prop({ default: null })
  emailVerifiedAt: Date;

  @Prop({
    required: [true, 'Please enter your password.'],
    minlength: [6, 'Password must be at least 6 characters.'],
  })
  @Exclude()
  @IsString({ message: 'password field must be of type string.' })
  password: string;
  @Prop({ default: new Date() })
  passwordChangedAt: Date;

  @Prop({
    type: {
      public_id: { type: String, required: true, default: null },
      url: { type: String, required: true, default: null },
    },
  })
  avatar: {
    public_id: string;
    url: string;
  };
  @Prop({ default: 'user' })
  @IsEnum(UserRole, {
    message: 'role field must be of either user or admin.',
  })
  role: string;
  @Prop([
    {
      courseId: { type: String, default: null },
    },
  ])
  courses: { courseId: string }[];

  // hash the password
  async hashPassword() {
    if (this.password !== null) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(attemptedPassword: string) {
    return await bcrypt.compare(attemptedPassword, this.password);
  }

  // toJSON() {
  //   return instanceToPlain(this);
  // }

  changePasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        this.passwordChangedAt.getTime() / 1000,
      );
      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
UserSchema.loadClass(UserEntity);

UserSchema.pre<UserDocument>('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  try {
    await this.hashPassword();
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre<UserDocument>('save', async function (next: NextFunction) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});