import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { RollCall, RollCallDocument } from './entities/roll-call.schema';

@Injectable()
export class RollCallServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RollCall.name) private rollcallModel: Model<RollCallDocument>,
  ) {}
  async checkFingerprint(user_id) {
    try {
      const user = await this.userModel.find({ _id: user_id });
      return user[0];
    } catch (error) {
      console.log(error);
    }
  }

  async register(registerDTO) {
    const { user_id } = registerDTO;
    try {
      const record = await this.checkFingerprint(user_id);
      console.log(record);
      if (record.finger_register) {
        return {
          msg: 'user had registered',
          code: 400,
        };
      }
      // neu thanh cong dang ki voi module as608
      await this.userModel.findOneAndUpdate(
        { _id: user_id },
        { finger_register: true },
      );
    } catch (error) {
      console.log(error);
    }
    return {
      code: 200,
      msg: 'Register Fingerprint for roll-call succces',
    };
  }

  async rollCall(rollcallDTO) {
    const { user_id, timestamps } = rollcallDTO;
    const date = new Date(timestamps);
    date.setHours(0, 0, 0, 0);
    const checkLogin = await this.rollcallModel.find({
      user_id: user_id,
      date: date,
    });
    if (checkLogin[0]) {
      return {
        msg: 'You already roll-call today',
        code: 400,
      };
    }
    const rs = await this.rollcallModel.create({
      user_id: user_id,
      date: date,
    });
    return {
      data: rs,
      code: 200,
      msg: 'Register Fingerprint for roll-call succces',
    };
  }

  async rollCallTime(query) {
    const time = await this.rollcallModel.find({ user_id: query.user_id });
    return {
      data: time.length,
      code: 200,
      msg: 'success',
    };
  }
}
