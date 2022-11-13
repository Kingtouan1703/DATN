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
    return {
      data : users , 
      msg : 'get all user success',
      code : 200
    };
  }
  // can change this funcion , this function use for validate
  async getOneUser(username) {
    try {
      return await this.userModel.find({ username: username });
    } catch (error) {
      throw error;
    }
  }
  async getUserInfo(user_id) {
    try {
      const user = await this.userModel.findById({ _id: user_id.id });
      return {
        msg: 'get user info success',
        code: 200,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
