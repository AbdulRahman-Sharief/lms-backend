import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationTokenSchema } from 'src/models/auth/token.entity';
import { UserSchema } from 'src/models/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'lms',
      // autoCreate: true,
      // autoIndex: true,
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'VerificationToken', schema: VerificationTokenSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
