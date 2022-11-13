import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  //check user exist or not
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getOneUser(username);
    const { password_hash } = user[0];
    const isPassword = await bcrypt.compare(pass, password_hash);
    if (user && isPassword) {
      const { password_hash, ...result } = user[0];
      console.log(result);
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      username: user._doc.username,
      sub: user._doc._id,
      roles: user._doc.roles,
    };
    return {
      msg: 'login success',
      data: {
        username: user._doc.username,
        name: user._doc.name,
        _id: user._doc._id,
      },

      access_token: this.jwtService.sign(payload),
    };
  }
  async register(body) {
    try {
      const user = await this.userService.getOneUser(body.username);
      if (user[0]) {
        return {
          msg: 'username exist',
          status: 400,
        };
      }
      console.log(body);
      const salt_round = process.env.SALT_ROUND;
      const user_salt = await bcrypt.genSalt(+salt_round);
      const password_hash = await bcrypt.hash(body.password, user_salt);
      const result = await this.userModel.create({
        name: body.name,
        password_hash: password_hash,
        user_salt: user_salt,
        username: body.username,
      });
      if (result) {
        return {
          msg: 'register success',
          status: 200,
          username: body.username,
        };
      }
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
