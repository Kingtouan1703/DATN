import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUser() {
    let users;
    try {
      users = await this.userModel.find();
    } catch (error) {
      console.log(error);
    }
    return users;
  }

  async getOneUser(username) {
    try {
      return await this.userModel.find({ username: username });
    } catch (error) {
      console.log(error);
    }
  }
}
