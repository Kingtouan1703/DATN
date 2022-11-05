import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ControllLEDDTo } from './dto/controll-led.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { IotService } from './room.service';
@Controller('room')
export class IotController {
  constructor(private readonly iotService: IotService) {}
  //room
  @Get('test')
  async get(@Query() query) {
    return this.iotService.testPublish(query);
  }

  @Get('controll-led')
  async turnLed(@Query() query: ControllLEDDTo) {
    return this.iotService.ControllLED(query);
  }

  @Post('create')
  async createRoom(@Body() creatRoom: CreateRoomDto) {
    return this.iotService.createRoom(creatRoom);
  }
}
