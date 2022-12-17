import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MqttService, Payload, Subscribe } from 'nest-mqtt';
import { Room, RoomDocument } from 'src/room/entities/room.schema';
import { SocketGateway } from 'src/socket/socket.gateway';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { RollCall, RollCallDocument } from './entities/roll-call.schema';
import {
  AttendancePayload,
  LeavePayload,
  RollcallMqttPayload,
  RollCallTopic,
} from './topic/topic';

@Injectable()
export class RollCallServices {
  constructor(
    private readonly socketGateway : SocketGateway,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @Inject(MqttService) private readonly mqttService: MqttService,
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

  async registerOnline(registerDTO) {
    const { user_id } = registerDTO;
    try {
      const record = await this.checkFingerprint(user_id);
      console.log(record);
      if (record.finger_register) {
        
        return {
          msg: 'Already Registered online!',
          status: 403,
        };
      }
      // neu thanh cong dang ki voi module as608
      await this.userModel.findOneAndUpdate(
        { _id: user_id },
        { finger_register: true },
      );
      await this.mqttService.publish(RollCallTopic.REGISTER, {
        user_id: user_id,
      });
    } catch (error) {
      console.log(error);
    }
    return {
      code: 200,
      msg: 'Register Fingerprint on line succces ,go register offline to complete',
    };
  }

  async rollCallTest(rollcallDTO) {
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
      data: time,
      code: 200,
      msg: 'success',
    };
  }
  @Subscribe(RollCallTopic.REGISTER_SUCCESS)
  async registerFingerHardware(@Payload() payload: RollcallMqttPayload) {
    try {
      const update = {
        can_use_finger: true,
      };
      await this.userModel.findOneAndUpdate({ _id: payload.user_id }, update);
    } catch (error) {
      console.log(error);
      throw error;
    }
    console.log('user register success');
  }
  @Subscribe(RollCallTopic.ATTENDACE)
  async rollCall(@Payload() payload: AttendancePayload) {
    const { user_id, timestamp } = payload;
    const date = new Date(+timestamp);
    date.setHours(0, 0, 0, 0);
    const checkLogin = await this.rollcallModel.find({
      user_id: user_id,
      date: date,
    });
    await this.roomModel.findOneAndUpdate(
      { name: 'room_1' },
      { $inc: { amount_gymers: 1 } },
    );
    this.socketGateway.server.emit('user_amount')
    if (checkLogin[0]) {
      console.log('attendace today');
      return;
    }
    const rs = await this.rollcallModel.create({
      user_id: user_id,
      date: date,
    });

    console.log('user attendace success');
  }
  @Subscribe(RollCallTopic.LEAVE)
  async getUsernumber(@Payload() payload: LeavePayload) {
    try {
      await this.roomModel.findOneAndUpdate(
        { name: 'room_1' },
        { $inc: { amount_gymers: -1 } },
      );
      this.socketGateway.server.emit('user_amount')
    } catch (error) {
      console.log(error);
      throw error;
    }
    
    console.log(' one user  leave');
  }
}
