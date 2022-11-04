import { Injectable, Inject } from '@nestjs/common';
import { Subscribe, Payload, Topic } from 'nest-mqtt';
import { MqttService } from 'nest-mqtt';

@Injectable()
export class IotService {
  constructor(@Inject(MqttService) private readonly mqttService: MqttService) {}

  async testPublish(query) {
    const { msg } = query;
    console.log(msg);
    const res = await this.mqttService.publish('testtopic/1', {
      foo: msg,
    });
    console.log(res);
    return {
      data: 'pub success',
    };
  }
  @Subscribe('testtopic/1')
  getSubTest(@Payload() payload) {
    console.log(payload);
    return {
        data: payload
    }
  }
}
