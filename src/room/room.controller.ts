import { Controller, Get, Query, Post, Body , SetMetadata , UseGuards } from '@nestjs/common';
import { ControllLEDDTo } from './dto/controll-led.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { IotService } from './room.service';
import {RolesGuard} from '../auth/guards/roles.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, ROLES_KEY } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
@UseGuards(JwtAuthGuard)
@Controller('room')
export class IotController {
  constructor(private readonly iotService: IotService) {}
  //room
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('test')
  async get(@Query() query) {
    return this.iotService.testPublish(query);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('controll-led')
  async turnLed(@Query() query: ControllLEDDTo) {
    return this.iotService.ControllLED(query);
  }

  @Post('create')
  async createRoom(@Body() creatRoom: CreateRoomDto) {
    return this.iotService.createRoom(creatRoom);
  }
  @Get('room-info')
  async getRoomInfo() {
    return this.iotService.getRoomInfo();
  }
}
