import { Controller, Get  , Query} from '@nestjs/common';
import { Subscribe, Payload, Topic } from 'nest-mqtt';
import { IotService } from './iot.service';
@Controller('iot')
export class IotController {
    constructor(private readonly iotService: IotService){

    }
  //room
  @Get('room/test')
  async get(@Query() query) {
    return this.iotService.testPublish(query)
  }
//   @Get('room/sub/test') 
//   async getSubTest() {
//     return this.iotService.getSubTest()
//   }
}
