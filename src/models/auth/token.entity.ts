import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsString } from 'class-validator';
import { NextFunction } from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from '../user/user.entity';

export type VerificationTokenDocument = HydratedDocument<VerificationToken>;
@Schema({ timestamps: true, versionKey: false })
export class VerificationToken {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserEntity;
  @Prop({ required: true })
  @IsEmail()
  email: string;
  @Prop()
  @IsString()
  token: string;
  @Prop()
  expiresAt: Date;
}

export const VerificationTokenSchema =
  SchemaFactory.createForClass(VerificationToken);
VerificationTokenSchema.index({ user: 1, token: 1 }, { unique: true }); // Compound index

// This function lets you pull in methods, statics, and virtuals from an ES6 class.
VerificationTokenSchema.loadClass(VerificationToken);
VerificationTokenSchema.pre<VerificationTokenDocument>(
  'save',
  async function expiresAt(next: NextFunction) {
    if (!this.isNew) return next();
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('VerificationToken will expire at: ', this.expiresAt);
    return next();
  },
);
