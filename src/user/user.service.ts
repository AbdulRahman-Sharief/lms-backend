import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDTO } from 'src/auth/DTOs/register.dto';
import { UserDocument, UserEntity } from 'src/models/user/user.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserEntity>,
    private readonly redisCacheService: RedisCacheService,
  ) {}
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
  async findUserByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.UserModel.findOne({ email }).exec();
      return user;
    } catch (err) {
      if (err.name === 'CastError') {
        const message = `Resource Not found. Invalid ${err.path}`;
        err = new HttpException(message, 400);
        throw err;
      }
    }
  }
  async findUserById(id: string): Promise<UserDocument> {
    try {
      const user = await this.UserModel.findById(id).exec();
      return user;
    } catch (err) {
      if (err.name === 'CastError') {
        const message = `Resource Not found. Invalid ${err.path}`;
        err = new HttpException(message, 400);
        throw err;
      }
    }
  }
  async getCachedUserById(id: string): Promise<UserDocument> {
    const user = await this.redisCacheService.getValue(id);
    console.log(user);
    console.log(id);
    return JSON.parse(user);
  }
}
