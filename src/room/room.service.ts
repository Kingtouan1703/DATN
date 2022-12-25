import { Injectable, Inject, Query } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe, Payload, Topic } from 'nest-mqtt';
import { MqttService } from 'nest-mqtt';
import { SocketGateway } from 'src/socket/socket.gateway';
import { ControllFan, ControllLEDDTo, StateEnum } from './dto/controll-led.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomDocument } from './entities/room.schema';
import { RoomSensorPayload, RoomTopic } from './topic/room.topic';

@Injectable()
export class IotService {
  constructor(
    private socketGateWay: SocketGateway,
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
    console.log(
      this.socketGateWay.server.emit('test_message', 'import success'),
    );
    console.log(payload, 'testtopic/1');
    return {
      data: payload,
    };
  }

  async createLedTemp() {
    try {
      const data = await this.roomModel.findOneAndUpdate(
        { name: 'room_1' },
        {
          leds: [
            { led_number: 1, state: 'ON' },
            { led_number: 2, state: 'ON' },
            { led_number: 3, state: 'ON' },
            { led_number: 4, state: 'ON' },
          ],
        },
      );
      return {
        msg: 'create led success',
      };
    } catch (error) {
      throw error;
    }
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
    console.log('controlled');
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
      await this.roomModel.updateOne({ name: 'room_1' }, { leds: updateLed });
      this.socketGateWay.server.emit('led_change', updateLed);
    } catch (error) {
      console.log(error);
      return error;
    }
    console.log('update led info');
  }

  async controllFan(@Query() query: ControllFan) {
    try {
      await this.mqttService.publish('home/room/fan', `fan/${query.state}`);
      const room = await this.roomModel.findOneAndUpdate(
        { name: 'room_1' },
        { fan_state: query.state },
      );
      this.socketGateWay.server.emit('fan_change', { fan_state: query.state });
      return {
        data: room,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async controllAircondition(@Query() query: ControllFan) {
    try {
      await this.mqttService.publish('home/room/air', `air/${query.state}`);
      const room = await this.roomModel.findOneAndUpdate(
        { name: 'room_1' },
        { air_condition_state: query.state },
      );
      this.socketGateWay.server.emit('air_change', { air_state: query.state });
      return {
        msg: 'change fan',
      };
    } catch (error) {
      return error;
    }
  }

  async getRoomInfo() {
    try {
      const data = await this.roomModel.find({ name: 'room_1' });
      return {
        msg: 'get room data success',
        status: 200,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  // room humi  and temp
  @Subscribe('home/room/sensor')
  async getRoomHumilit(@Payload() payload: RoomSensorPayload) {
    // console.log(payload);
    try {
      const update = {
        humidity: +payload.hum,
        temperature: +payload.temp,
      };
      await this.roomModel.findOneAndUpdate({ name: 'room_1' }, update);
      this.socketGateWay.server.emit('room_sensor', payload);
    } catch (error) {
      console.log(error);
    }
    // console.log('update room info');
  }
}
