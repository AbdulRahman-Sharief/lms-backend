import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsString } from 'class-validator';

@Schema()
export class VerificationToken {
  @Prop()
  @IsEmail()
  email: string;
  @Prop()
  @IsString()
  token: string;
  @Prop()
  expires: Date;
}

const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
VerificationTokenSchema.loadClass(VerificationToken);
