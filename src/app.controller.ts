import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { MqttService } from 'nest-mqtt';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MqttService) private readonly mqttService: MqttService,
  ) {
    // client.connect();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testPublish() {
    const res = await this.mqttService.publish('testtopic/1', {
      foo: 'tuan',
    });

    return {
      data : res
    }
  }
}
