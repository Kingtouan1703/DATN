import { Injectable, Inject, Query } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe, Payload, Topic } from 'nest-mqtt';
import { MqttService } from 'nest-mqtt';
import { ControllLEDDTo } from './dto/controll-led.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomDocument } from './entities/room.schema';
import { RoomSensorPayload, RoomTopic } from './topic/room.topic';

@Injectable()
export class IotService {
  constructor(
    @Inject(MqttService) private readonly mqttService: MqttService,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async testPublish(query) {
    const { msg } = query;
    await this.mqttService.publish('testtopic/1', {
      foo: msg,
    });
    return {
      data: 'pub success',
    };
  }
  @Subscribe('testtopic/1')
  getSubTest(@Payload() payload) {
    console.log(payload);
    return {
      data: payload,
    };
  }

  async createRoom(createRoom: CreateRoomDto) {
    try {
      this.roomModel.create({ ...createRoom });
    } catch (error) {
      console.log(error);
    }
    return {
      msg: 'create room success',
      data: 200,
    };
  }

  // just one room had name room_1
  // controll led
  async ControllLED(@Query() query: ControllLEDDTo) {
    try {
      await this.mqttService.publish(
        'home/room/led',
        `${query.state}${query.led_number}`,
      );
      const room = await this.roomModel.findOne({ name: 'room_1' });
      const updateLed = room.leds.map((led) => {
        if (led.led_number === +query.led_number) {
          return { ...led, state: query.state };
        }
        return led;
      });
      console.log(updateLed);
      await this.roomModel.updateOne({ name: 'room_1' }, { leds: updateLed });
    } catch (error) {
      console.log(error);
      return error;
    }
    console.log('update led info');
  }
  // room humi  and temp
  @Subscribe(RoomTopic.SUB_SENSOR)
  async getRoomHumilit(@Payload() payload: RoomSensorPayload) {
    try {
      const update = {
        humidity: +payload.hum,
        temperature: +payload.temp,
      };
      await this.roomModel.findOneAndUpdate({ name: 'room_1' }, update);
    } catch (error) {
      console.log(error);
    }
    console.log('update room info');
  }
}
