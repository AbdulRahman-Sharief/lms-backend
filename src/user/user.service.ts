import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDTO } from 'src/auth/DTOs/register.dto';
import { UserDocument, UserEntity } from 'src/models/user/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<UserEntity>) {}
  async createUser(credentials: RegisterDTO): Promise<UserDocument> {
    try {
      const user = new this.UserModel(credentials);
      return await user.save();
    } catch (error) {
      console.log('ERR: ', error);
      if (error.code === 11000)
        throw new ConflictException('Email has already been taken');
      throw new InternalServerErrorException();
    }
  }
}
